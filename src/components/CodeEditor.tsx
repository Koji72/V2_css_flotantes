import React, { useRef, useEffect } from 'react';
import CodeMirror, { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { markdown as markdownExtension } from '@codemirror/lang-markdown';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  onSelectionChange?: (selection: { start: number; end: number }) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, darkMode, onSelectionChange }) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    const editor = editorRef.current?.view;
    if (editor && onSelectionChange) {
      const updateSelection = () => {
        const selection = editor.state.selection;
        if (selection.ranges.length > 0) {
          const range = selection.ranges[0];
          onSelectionChange({
            start: range.from,
            end: range.to
          });
        }
      };

      editor.dom.addEventListener('mouseup', updateSelection);
      editor.dom.addEventListener('keyup', updateSelection);
      return () => {
        editor.dom.removeEventListener('mouseup', updateSelection);
        editor.dom.removeEventListener('keyup', updateSelection);
      };
    }
  }, [onSelectionChange]);

  return (
    <div className="code-editor-container" style={{ height: '100%', width: '100%' }}>
      <CodeMirror
        ref={editorRef}
        value={value}
        height="100%"
        theme={darkMode ? vscodeDark : 'light'}
        extensions={[markdownExtension()]}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          bracketMatching: true,
        }}
        style={{
          height: '100%',
          width: '100%',
          fontSize: '14px',
          fontFamily: 'monospace',
        }}
      />
    </div>
  );
};

export default CodeEditor; 