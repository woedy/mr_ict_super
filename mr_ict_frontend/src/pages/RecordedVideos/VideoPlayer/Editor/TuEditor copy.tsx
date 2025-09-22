// TuEditor.jsx - Fixed Component
import Editor from '@monaco-editor/react';
import { useCallback, useEffect, useRef } from 'react';
import _ from 'lodash';

const TuEditor = ({
  value,
  onEditorInteraction,
  onChange,
  cursorPosition,
  scrollPosition,
  forceScrollSync,
  onScrollSyncComplete,
  onScrollChange,
}) => {
  const editorRef = useRef(null);
  const lastAppliedScrollRef = useRef(null);
  const lastAppliedCursorRef = useRef(null);
  const scrollAnimationRef = useRef(null);
  const isUserScrollingRef = useRef(false);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    // Set initial position
    if (cursorPosition) {
      lastAppliedCursorRef.current = { ...cursorPosition };
      editor.setPosition(cursorPosition);
      editor.focus();
    }

    if (scrollPosition) {
      lastAppliedScrollRef.current = { ...scrollPosition };
      editor.setScrollTop(scrollPosition.scrollTop || 0);
      editor.setScrollLeft(scrollPosition.scrollLeft || 0);
    }

    editor.onDidChangeCursorPosition(() => {
      if (onEditorInteraction) onEditorInteraction();
    });

    editor.onDidScrollChange(() => {
      if (!forceScrollSync) {
        isUserScrollingRef.current = true;
        setTimeout(() => {
          isUserScrollingRef.current = false;
        }, 500);
      }

      if (onEditorInteraction) onEditorInteraction();

      const newScroll = {
        scrollTop: editor.getScrollTop(),
        scrollLeft: editor.getScrollLeft(),
      };

      const last = lastAppliedScrollRef.current || {};
      if (
        newScroll.scrollTop !== last.scrollTop ||
        newScroll.scrollLeft !== last.scrollLeft
      ) {
        throttledScrollChange(newScroll);
      }
    });
  };

  const throttledScrollChange = useCallback(
    _.throttle((scroll) => {
      if (onScrollChange) {
        onScrollChange(scroll);
      }
    }, 100),
    [onScrollChange]
  );

  const smoothScrollTo = (targetTop, targetLeft, duration = 300) => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    const startTop = editor.getScrollTop();
    const startLeft = editor.getScrollLeft();
    const startTime = performance.now();

    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
    }

    const animateScroll = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const newTop = startTop + (targetTop - startTop) * easeProgress;
      const newLeft = startLeft + (targetLeft - startLeft) * easeProgress;

      editor.setScrollTop(newTop);
      editor.setScrollLeft(newLeft);

      if (progress < 1) {
        scrollAnimationRef.current = requestAnimationFrame(animateScroll);
      } else {
        lastAppliedScrollRef.current = {
          scrollTop: targetTop,
          scrollLeft: targetLeft,
        };

        if (onScrollSyncComplete) {
          onScrollSyncComplete();
        }
      }
    };

    scrollAnimationRef.current = requestAnimationFrame(animateScroll);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Handle cursor position
    if (
      cursorPosition &&
      (!lastAppliedCursorRef.current ||
        cursorPosition.lineNumber !== lastAppliedCursorRef.current.lineNumber ||
        cursorPosition.column !== lastAppliedCursorRef.current.column)
    ) {
      lastAppliedCursorRef.current = { ...cursorPosition };
      editor.setPosition(cursorPosition);
      editor.revealPositionInCenter(cursorPosition);
    }

    // Handle scroll position
    if (
      scrollPosition &&
      (forceScrollSync ||
        !lastAppliedScrollRef.current ||
        Math.abs(scrollPosition.scrollTop - (lastAppliedScrollRef.current.scrollTop || 0)) > 10 ||
        Math.abs(scrollPosition.scrollLeft - (lastAppliedScrollRef.current.scrollLeft || 0)) > 10)
    ) {
      if (forceScrollSync || !isUserScrollingRef.current) {
        if (forceScrollSync) {
          // Immediate scroll (no animation)
          editor.setScrollTop(scrollPosition.scrollTop || 0);
          editor.setScrollLeft(scrollPosition.scrollLeft || 0);
          lastAppliedScrollRef.current = {
            scrollTop: scrollPosition.scrollTop || 0,
            scrollLeft: scrollPosition.scrollLeft || 0,
          };
          if (onScrollSyncComplete) {
            onScrollSyncComplete();
          }
        } else {
          // Smooth scroll for passive sync
          smoothScrollTo(
            scrollPosition.scrollTop || 0,
            scrollPosition.scrollLeft || 0,
            300
          );
        }
      }
    }
  }, [cursorPosition, scrollPosition, forceScrollSync, onScrollSyncComplete]);

  useEffect(() => {
    return () => {
      if (scrollAnimationRef.current) {
        cancelAnimationFrame(scrollAnimationRef.current);
      }
    };
  }, []);

  const handleEditorChange = (value) => {
    if (onEditorInteraction) onEditorInteraction();
    if (onChange) onChange(value);
  };

  return (
    <main className="flex-1 bg-gray-900 text-black">
      <Editor
        value={value}
        language="html"
        height="100%"
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 16,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          automaticLayout: true,
          readOnly: false,
          smoothScrolling: true,
        }}
      />
    </main>
  );
};

export default TuEditor;
