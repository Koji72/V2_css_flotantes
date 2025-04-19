import React, { useEffect, useRef } from 'react';
import { useStore } from '../store';
import MarkdownToolbar from './MarkdownToolbar';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';

interface EditorProps {
  onChange?: (value: string) => void;
  showPreview?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  onChange,
  showPreview = true
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { content, setContent, showNotification } = useStore();

  // Auto-focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange?.(newValue);
  };

  // Helper function to insert markdown syntax at cursor or surround selected text
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    
    setContent(newText);
    
    // Set cursor position after update
    setTimeout(() => {
      textarea.focus();
      if (selectedText.length > 0) {
        textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
      } else {
        const cursorPos = start + before.length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      }
    }, 0);
  };

  // Handle keyboard shortcuts and tab key
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key
    if (event.key === 'Tab') {
      event.preventDefault();
      insertMarkdown('  ');
      return;
    }

    // Handle keyboard shortcuts (Ctrl/Cmd + key)
    if (event.ctrlKey || event.metaKey) {
      switch (event.key.toLowerCase()) {
        case 'b': // Bold: Ctrl+B
          event.preventDefault();
          insertMarkdown('**', '**');
          break;
        case 'i': // Italic: Ctrl+I
          event.preventDefault();
          insertMarkdown('*', '*');
          break;
        case 'k': // Link: Ctrl+K
          event.preventDefault();
          insertMarkdown('[', '](url)');
          break;
        case 'h': // Heading 1: Ctrl+H
          event.preventDefault();
          insertMarkdown('# ');
          break;
        case 'l': // List: Ctrl+L
          event.preventDefault();
          insertMarkdown('- ');
          break;
        case 'q': // Blockquote: Ctrl+Q
          event.preventDefault();
          insertMarkdown('> ');
          break;
        case '`': // Code: Ctrl+`
          event.preventDefault();
          insertMarkdown('`', '`');
          break;
        case '1': // H1: Ctrl+1
          event.preventDefault();
          insertMarkdown('# ');
          break;
        case '2': // H2: Ctrl+2
          event.preventDefault();
          insertMarkdown('## ');
          break;
        case '3': // H3: Ctrl+3
          event.preventDefault();
          insertMarkdown('### ');
          break;
        case 's': // Save: Ctrl+S
          event.preventDefault();
          showNotification({
            message: 'Contenido guardado automáticamente',
            type: 'success'
          });
          break;
        // No default needed
      }
    }
  };

  return (
    <div className="editor-section">
      <div className="editor-header flex-shrink-0">
        <div className="flex justify-between items-center p-2 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Editor</h2>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-400">
              {content.length} caracteres | {content.split(/\s+/).filter(Boolean).length} palabras
            </div>
            <button
              onClick={() => showNotification({
                message: 'Contenido guardado automáticamente',
                type: 'success'
              })}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded flex items-center"
              title="Guardar (Ctrl+S)"
            >
              <span className="mr-1">💾</span>
              <span className="text-sm">Guardar</span>
            </button>
            <KeyboardShortcutsHelp />
          </div>
        </div>
        <MarkdownToolbar textareaRef={textareaRef} />
      </div>
      
      <div className="editor-content flex-1 min-h-0">
        <textarea
          ref={textareaRef}
          className="editor-textarea w-full h-full"
          placeholder="Escribe tu Markdown aquí..."
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default Editor; 