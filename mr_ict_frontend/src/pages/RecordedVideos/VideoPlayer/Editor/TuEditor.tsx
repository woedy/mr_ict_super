// TuEditor.jsx - Revised Component
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
                }, 50);
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
        }, 10),
        [onScrollChange]
    );

    // Removed smoothScrollTo function

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

        // Handle immediate scroll position sync
        if (scrollPosition && forceScrollSync) {
          editor.setScrollTop(scrollPosition.scrollTop || 0);
          editor.setScrollLeft(scrollPosition.scrollLeft || 0);
          lastAppliedScrollRef.current = { ...scrollPosition };
          if (onScrollSyncComplete) {
            onScrollSyncComplete();
          }
          console.log(`[TuEditor] forceScrollSync: true, scrollTop: ${scrollPosition.scrollTop}, scrollLeft: ${scrollPosition.scrollLeft}`); // Add logging
        } else if (scrollPosition && !isUserScrollingRef.current) {
          editor.setScrollTop(scrollPosition.scrollTop || 0);
          editor.setScrollLeft(scrollPosition.scrollLeft || 0);
          lastAppliedScrollRef.current = { ...scrollPosition };
          console.log(`[TuEditor] forceScrollSync: false, scrollTop: ${scrollPosition.scrollTop}, scrollLeft: ${scrollPosition.scrollLeft}`); // Add logging
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
                    smoothScrolling: false, // Disable Monaco's smooth scrolling
                }}
            />
        </main>
    );
};

export default TuEditor;