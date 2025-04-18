import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store'; // Import useStore
import MarkdownToolbar from './MarkdownToolbar';
import KeyboardShortcutsHelp from './KeyboardShortcutsHelp';

interface EditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  showPreview?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  initialValue = '',
  onChange,
  showPreview = true
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { content, setContent } = useStore();
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  // Auto-save content to localStorage every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content) {
        localStorage.setItem('markdown-content', content);
        console.log('Auto-saved content');
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [content]);

  // Load saved content on initial load
  useEffect(() => {
    const savedContent = localStorage.getItem('markdown-content');
    if (savedContent && !content) {
      setContent(savedContent);
      showNotification('Contenido cargado desde la última sesión', 'info');
    }
  }, []);

  // Auto-focus the textarea when the component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  // Show notification message with auto-dismiss
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Save content manually
  const saveContent = () => {
    try {
      localStorage.setItem('markdown-content', content);
      showNotification('Contenido guardado correctamente');
    } catch (error) {
      console.error('Error saving content:', error);
      showNotification('Error al guardar el contenido', 'error');
    }
  };

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
          saveContent();
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
              onClick={saveContent}
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

      {notification && (
        <div className={`fixed bottom-4 right-4 px-4 py-2 rounded shadow-lg z-50 transition-all duration-300 ease-in-out
          ${notification.type === 'success' ? 'bg-green-600' : ''}
          ${notification.type === 'error' ? 'bg-red-600' : ''}
          ${notification.type === 'info' ? 'bg-blue-600' : ''}
        `}>
          <div className="flex items-center text-white">
            <span className="mr-2">
              {notification.type === 'success' && '✅'}
              {notification.type === 'error' && '❌'}
              {notification.type === 'info' && 'ℹ️'}
            </span>
            <span>{notification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor; 