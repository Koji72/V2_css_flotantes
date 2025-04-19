import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';

const AUTOSAVE_KEY = 'markdown-editor-content';
const AUTOSAVE_DELAY = 1500; // Milisegundos (1.5 segundos)

const App: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [content, setContent] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false); // Bandera para carga inicial

  useEffect(() => {
    console.log('[Initial Load] useEffect triggered.');
    if (!hasLoadedRef.current) {
      const savedContent = localStorage.getItem(AUTOSAVE_KEY);
      console.log(`[Initial Load] localStorage.getItem returned: ${savedContent ? `"${savedContent.substring(0, 50)}..."` : '(null or empty)'}`);
      if (savedContent) {
        console.log('[Initial Load] Found saved content. Calling setContent...');
        setContent(savedContent);
        console.log('[Initial Load] setContent called.');
      } else {
        console.log('[Initial Load] No saved content found in localStorage.');
      }
      hasLoadedRef.current = true;
      console.log('[Initial Load] hasLoadedRef set to true.');
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    autosaveTimeoutRef.current = setTimeout(() => {
      console.log('[Autosave] Saving content to localStorage...');
      localStorage.setItem(AUTOSAVE_KEY, content);
    }, AUTOSAVE_DELAY);

    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, [content]);

  const applyFormat = useCallback((format: string, type: 'wrap' | 'line' | 'insert') => {
    console.log(`[applyFormat] Called with: format=${format}, type=${type}`);
    const textarea = textareaRef.current;
    if (!textarea) {
      console.error('[applyFormat] Textarea ref is not available!');
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = textarea.value;
    const selectedText = currentContent.substring(start, end);
    console.log(`[applyFormat] Selection: start=${start}, end=${end}, selectedText="${selectedText}"`);
    
    let newText = '';
    let newCursorPos = start;

    if (type === 'wrap') {
      if (start === end) {
        console.log('[applyFormat] Wrap type, no selection.');
        newText = currentContent.substring(0, start) + format + format + currentContent.substring(end);
        newCursorPos = start + format.length;
      } else {
        console.log('[applyFormat] Wrap type, with selection.');
        newText = currentContent.substring(0, start) + format + selectedText + format + currentContent.substring(end);
        newCursorPos = end + (format.length * 2);
      }
    } else if (type === 'line') {
      console.log('[applyFormat] Line type.');
      const lineStart = currentContent.lastIndexOf('\n', start - 1) + 1;
      console.log(`[applyFormat] Line start calculated: ${lineStart}`);
      
      const needsNewline = lineStart > 0 && currentContent[lineStart - 1] !== '\n';
      const prefix = needsNewline ? '\n' : '';
      console.log(`[applyFormat] Needs preceding newline: ${needsNewline}`);

      newText = currentContent.substring(0, lineStart) + prefix + format + currentContent.substring(lineStart);
      
      newCursorPos = start + prefix.length + format.length;
      console.log(`[applyFormat] Line format applied. Original start: ${start}, newCursorPos: ${newCursorPos}`);
    } else if (type === 'insert') {
      console.log('[applyFormat] Insert type.');
      newText = currentContent.substring(0, start) + format + currentContent.substring(end);
      if (format.includes('[](url)')) {
        newCursorPos = start + format.indexOf('(') + 1;
      } else {
        newCursorPos = start + format.length;
      }
    }

    console.log(`[applyFormat] Calculated: newText="${newText.substring(0, 100)}...", newCursorPos=${newCursorPos}`);
    console.log(`[applyFormat] *** BEFORE setContent: Current content length=${currentContent.length}, New text length=${newText.length}`);
    console.log(`[applyFormat] newText char codes: ${[...newText].map(c => c.charCodeAt(0)).join(' ')}`);
    setContent(newText);

    setTimeout(() => {
      console.log(`[applyFormat] setTimeout: Restoring focus and selection to ${newCursorPos}`);
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        console.log('[applyFormat] setTimeout: Focus and selection restored.');
      } else {
        console.error('[applyFormat] setTimeout: Textarea ref became null!');
      }
    }, 0);
  }, [content, setContent]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      let handled = true;
      switch (e.key.toLowerCase()) {
        case 'b':
          applyFormat('**', 'wrap');
          break;
        case 'i':
          applyFormat('*', 'wrap');
          break;
        case '1':
          applyFormat('# ', 'line');
          break;
        case '2':
          applyFormat('## ', 'line');
          break;
        case 'l':
          applyFormat('- ', 'line');
          break;
        case 'q':
          applyFormat('> ', 'line');
          break;
        case '`':
          applyFormat('`', 'wrap');
          break;
        case 'k':
          applyFormat('[](url)', 'insert');
          break;
        default:
          handled = false;
      }

      if (handled) {
        e.preventDefault();
        console.log(`[handleKeyDown] Handled shortcut: Ctrl/Cmd+${e.key}`);
      }
    }
  }, [applyFormat]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  };

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(`[handleEditorChange] New content length: ${e.target.value.length}`);
    setContent(e.target.value);
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  return (
    <div className="app">
      <div className="toolbar">
        <div className="flex gap-2">
          <button className="toolbar-button" onClick={() => applyFormat('**', 'wrap')} title="Negrita (Ctrl+B)">B</button>
          <button className="toolbar-button" onClick={() => applyFormat('*', 'wrap')} title="Cursiva (Ctrl+I)">I</button>
          <button className="toolbar-button" onClick={() => applyFormat('# ', 'line')} title="Título 1 (Ctrl+1)">H1</button>
          <button className="toolbar-button" onClick={() => applyFormat('## ', 'line')} title="Título 2 (Ctrl+2)">H2</button>
          <button className="toolbar-button" onClick={() => applyFormat('- ', 'line')} title="Lista (Ctrl+L)">•</button>
          <button className="toolbar-button" onClick={() => applyFormat('> ', 'line')} title="Cita (Ctrl+Q)">❝</button>
          <button className="toolbar-button" onClick={() => applyFormat('`', 'wrap')} title="Código (Ctrl+`)">`</button>
          <button className="toolbar-button" onClick={() => applyFormat('[](url)', 'insert')} title="Enlace (Ctrl+K)">🔗</button>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDarkMode ? '🌞' : '🌙'}
        </button>
      </div>
      <div className="flex flex-1 h-full">
        <div className="editor-container" style={{ width: `${leftWidth}%` }}>
          <textarea
            ref={textareaRef}
            className="editor"
            value={content}
            onChange={handleEditorChange}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí tu markdown..."
          />
        </div>

        <div
          className="divider"
          onMouseDown={startResizing}
        />

        <div
          className="preview"
          style={{ width: `${100 - leftWidth - 1}%` }}
        >
          <ReactMarkdown key={content} remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default App;