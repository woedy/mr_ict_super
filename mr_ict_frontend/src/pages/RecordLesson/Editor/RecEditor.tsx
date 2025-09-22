import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import _ from 'lodash';
import api from '../../../services/apiClient';
import RecDraggableWindow from '../Components/RecDraggableWindow';

const RecEditor = ({ isRecording, title, getCurrentTimestamp }) => {

  const editorRef = useRef(null);
  const [code, setCode] = useState("<!-- Write your HTML code here -->");
  const [showPreviewWindow, setShowPreviewWindow] = useState(true);

  // Refs to track positions and timestamps without re-renders
  const codeBufferRef = useRef([]);

  const lastSnapshotRef = useRef({
    code: "<!-- Write your HTML code here -->",
    cursorPosition: { lineNumber: 1, column: 1 },
    scrollPosition: { scrollTop: 0, scrollLeft: 0 },
    timestamp: 0,
  });

  const cursorPositionRef = useRef({ lineNumber: 1, column: 1 });
  const scrollPositionRef = useRef({ 
    scrollTop: 0, 
    scrollLeft: 0,
    timestamp: 0  // Add timestamp specifically for scroll position
  });


  const lastInteractionTimeRef = useRef(0);

  // Reset when recording stops
  useEffect(() => {
    if (!isRecording) {
      codeBufferRef.current = [];
      setCode("<!-- Write your HTML code here -->");
    }
  }, [isRecording]);

  // Check for meaningful changes
  const hasSignificantChanges = useCallback(() => {
    const last = lastSnapshotRef.current;
    const cursor = cursorPositionRef.current;
    const scroll = scrollPositionRef.current;

    const codeChanged = code !== last.code;
    
    const cursorMoved =
      cursor.lineNumber !== last.cursorPosition.lineNumber ||
      Math.abs(cursor.column - last.cursorPosition.column) > 10;

    const scrolled =
      Math.abs(scroll.scrollTop - last.scrollPosition.scrollTop) > 50 ||
      Math.abs(scroll.scrollLeft - last.scrollPosition.scrollLeft) > 50;

    return codeChanged || cursorMoved || scrolled;
  }, [code]);

  // Debounced sender
  const sendBufferedSnapshots = useCallback(
    _.debounce(async () => {
      if (codeBufferRef.current.length > 0 && isRecording) {
        const snapshotsToSend = [...codeBufferRef.current];
        codeBufferRef.current = [];

        try {
          const response = await api.post('save-code-snapshots/', {
            snapshots: snapshotsToSend,
            title,
          });
          console.log('Snapshots batch saved:', response.data);
        } catch (error) {
          console.error('Error saving snapshots batch:', error);
          codeBufferRef.current = [...codeBufferRef.current, ...snapshotsToSend];
        }
      }
    }, 2000),
    [isRecording, title]
  );

  // Modified snapshot capture to handle scroll position timestamps specifically
  const captureSnapshot = useCallback(
    _.throttle(() => {
      if (!isRecording) return;
  
      const timestamp = lastInteractionTimeRef.current;
      const cursor = cursorPositionRef.current;
      const scroll = scrollPositionRef.current;
  
      if (
        hasSignificantChanges() ||
        timestamp - lastSnapshotRef.current.timestamp > 3
      ) {
        const snapshot = {
          code,
          cursorPosition: cursor,
          scrollPosition: {
            scrollTop: scroll.scrollTop,
            scrollLeft: scroll.scrollLeft,
            timestamp: scroll.timestamp || timestamp, // Use scroll-specific timestamp
          },
          timestamp: timestamp,
        };
  
        codeBufferRef.current.push(snapshot);
        lastSnapshotRef.current = {
          code: snapshot.code,
          cursorPosition: snapshot.cursorPosition,
          scrollPosition: snapshot.scrollPosition,
          timestamp: snapshot.timestamp,
        };
        sendBufferedSnapshots();
      }
    }, 50), // Reduce throttle to 100ms for faster snapshot capture
    [code, isRecording, hasSignificantChanges, sendBufferedSnapshots]
  );
  // Force snapshot (e.g. on recording start)
  const forceSnapshot = useCallback(() => {
    if (!isRecording) return;

    const currentTime = getCurrentTimestamp();
    
    const snapshot = {
      code,
      cursorPosition: cursorPositionRef.current,
      scrollPosition: {
        scrollTop: scrollPositionRef.current.scrollTop,
        scrollLeft: scrollPositionRef.current.scrollLeft
      },
      scrollTimestamp: currentTime, // Store scroll timestamp for initial snapshot
      timestamp: currentTime,
    };

    codeBufferRef.current.push(snapshot);
    lastSnapshotRef.current = { 
      code: snapshot.code,
      cursorPosition: snapshot.cursorPosition,
      scrollPosition: snapshot.scrollPosition,
      timestamp: snapshot.timestamp
    };
    scrollPositionRef.current.timestamp = currentTime;
    sendBufferedSnapshots();
  }, [code, isRecording, getCurrentTimestamp, sendBufferedSnapshots]);

  const throttledSetScrollPosition = useCallback(
    _.throttle((pos, timestamp) => {
      // scrollPositionRef.current = { // Remove this line
      //   scrollTop: pos.scrollTop,
      //   scrollLeft: pos.scrollLeft,
      //   timestamp: timestamp,
      // };
      captureSnapshot(); // Capture snapshot after updating the ref
    }, 50), // Keep throttle for snapshot capture
    []
  );




  // Normal throttled cursor position setter
  const throttledSetCursorPosition = useCallback(
    _.throttle((pos) => {
      cursorPositionRef.current = pos;
    }, 200),
    []
  );

  // Mount Monaco events
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    editor.onDidChangeModelContent(() => {
      setCode(editor.getValue());
      lastInteractionTimeRef.current = getCurrentTimestamp(); // timestamp when user typed
      captureSnapshot();
    });

    editor.onDidChangeCursorPosition((e) => {
      throttledSetCursorPosition(e.position);
      lastInteractionTimeRef.current = getCurrentTimestamp(); // timestamp when user moved cursor
      captureSnapshot();
    });

    editor.onDidScrollChange((e) => {
      const scrollTimestamp = getCurrentTimestamp();
      scrollPositionRef.current = { // Update ref immediately
        scrollTop: e.scrollTop,
        scrollLeft: e.scrollLeft,
        timestamp: scrollTimestamp,
      };
      throttledSetScrollPosition(
        { scrollTop: e.scrollTop, scrollLeft: e.scrollLeft },
        scrollTimestamp
      );
      lastInteractionTimeRef.current = scrollTimestamp;
    });
  
  };

  // Optional manual change handler
  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Flush snapshots when window/tab is closing
  useEffect(() => {
    const handleUnload = () => {
      sendBufferedSnapshots.flush();
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [sendBufferedSnapshots]);

  // Capture snapshot when recording starts
  useEffect(() => {
    if (isRecording) {
      forceSnapshot();
    }
  }, [isRecording, forceSnapshot]);

  return (
    <>
      <main className="flex-1 bg-gray-900 text-black">
        <Editor
          language="html"
          onChange={handleEditorChange}
          value={code}
          theme="vs-dark"
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 16,
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
          }}
        />
      </main>

      {showPreviewWindow && (
        <div className="absolute z-30">
          <RecDraggableWindow htmlContent={code} title="HTML Preview" />
        </div>
      )}
    </>
  );
};

export default RecEditor;
