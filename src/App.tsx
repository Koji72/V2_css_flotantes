import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
import remarkGithubBetaBlockquoteAdmonitions from 'remark-github-beta-blockquote-admonitions';
import remarkCustomPanels from './utils/remarkCustomPanels';
// import remarkCollapse from 'remark-collapse'; // Incompatible, comentado
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Importar iconos de Lucide
import {
  Bold, Italic, Heading1, Heading2, List, Quote, Code, Link2, Image as ImageIcon,
  Table, Strikethrough, ListTodo, Superscript, Subscript, Highlighter, ChevronsUpDown,
  Moon, Sun
} from 'lucide-react';
import './App.css';

const AUTOSAVE_KEY = 'markdown-editor-content';
const AUTOSAVE_DELAY = 1500; // Milisegundos (1.5 segundos)

const App: React.FC = () => {
  const [leftWidth, setLeftWidth] = useState(50);
  const [isResizing, setIsResizing] = useState(false);
  const [content, setContent] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref para el input de archivo
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false); // Bandera para carga inicial
  const previewRef = useRef<HTMLDivElement>(null); // <-- Ref para la vista previa
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref para timeout
  const scrollingPanel = useRef<'editor' | 'preview' | null>(null); // Para saber quién inició
  const animationFrameRef = useRef<number | null>(null); // Para throttling

  // Refs para funciones usadas en callbacks para evitar problemas de dependencia/orden
  const handleImageButtonClickRef = useRef<() => void>(() => {});
  const insertTableTemplateRef = useRef<() => void>(() => {});
  const applyFormatRef = useRef<typeof applyFormat>(() => {});

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

  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(`[handleEditorChange] New content length: ${e.target.value.length}`);
    setContent(e.target.value);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
  };

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 20 && newWidth < 80) {
      setLeftWidth(newWidth);
    }
  }, [setLeftWidth, isResizing]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => resize(e);
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
    };
  }, [isResizing, resize, stopResizing]);

  const insertText = useCallback((textToInsert: string, cursorPosOffset?: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = textarea.value;

    const newText = currentContent.substring(0, start) + textToInsert + currentContent.substring(end);
    const newCursorPos = cursorPosOffset !== undefined ? start + cursorPosOffset : start + textToInsert.length;

    setContent(newText);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  }, [setContent]);

  // Definir applyFormat (sin useCallback inicialmente, se asignará a ref)
  function applyFormat (format: string, type: 'wrap' | 'line' | 'insert') {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentContent = textarea.value;
    const selectedText = currentContent.substring(start, end);

    if (type === 'wrap') {
      if (start === end) insertText(format + format, format.length);
      else insertText(format + selectedText + format, start + format.length + selectedText.length + format.length);
    } else if (type === 'line') {
      const lineStart = currentContent.lastIndexOf('\n', start - 1) + 1;
      const needsNewline = lineStart > 0 && currentContent[lineStart - 1] !== '\n';
      const prefix = needsNewline ? '\n' : '';
      const lineContent = currentContent.substring(lineStart);
      const textBeforeLine = currentContent.substring(0, lineStart);
      const textToInsert = prefix + format + lineContent;
      setContent(textBeforeLine + textToInsert); // Actualización directa
      setTimeout(() => {
        if (textareaRef.current) {
          const cursor = start + prefix.length + format.length;
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(cursor, cursor);
        }
      }, 0);
    } else if (type === 'insert') {
      let cursorPosOffset = format.length;
      if (format.includes('[](url)') || format.includes('![Alt text](url)')) {
        cursorPosOffset = format.indexOf('(') + 1;
      }
      insertText(format, cursorPosOffset);
    }
  }
  // Asignar la función al ref en cada render para que handleKeyDown tenga la última versión
  applyFormatRef.current = applyFormat; 

  // Asignar handleImageButtonClick a ref
  handleImageButtonClickRef.current = () => {
    fileInputRef.current?.click();
  };
  
  // Asignar insertTableTemplate a ref
  insertTableTemplateRef.current = () => {
    const tableTemplate =
`\n| Cabecera 1 | Cabecera 2 |\n| :--------- | :--------- |\n| Celda 1    | Celda 2    |\n| Celda 3    | Celda 4    |\n\n`;
    insertText(tableTemplate, tableTemplate.length);
  };

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const MAX_SIZE_MB = 1;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Imagen > ${MAX_SIZE_MB} MB`);
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const altText = file.name.replace(/\.[^/.]+$/, "");
      const imageMarkdown = `![${altText}](${base64String})\n`;
      insertText(imageMarkdown);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }, [insertText]);

  // handleKeyDown ahora usa las funciones a través de refs
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const currentApplyFormat = applyFormatRef.current;
    const currentHandleImageButtonClick = handleImageButtonClickRef.current;
    const currentInsertTableTemplate = insertTableTemplateRef.current;

    if (e.ctrlKey || e.metaKey) {
      let handled = true;
      if (e.shiftKey) { // Combos con Shift
        switch (e.key.toLowerCase()) {
          case 'c': currentApplyFormat('- [ ] ', 'line'); break; // Checklist
          case 'p': currentApplyFormat('<sup>', 'wrap'); break; // Superscript (Power)
          case 'b': currentApplyFormat('<sub>', 'wrap'); break; // Subscript (Base/Bottom)
          case 'h': currentApplyFormat('<mark>', 'wrap'); break; // Highlight (Mark)
          case 'd': insertText('\n<details>\n  <summary>Título</summary>\n  \n  Contenido oculto...\n  \n</details>\n'); handled = true; break; // Details/Collapse
          default: handled = false;
        }
      } else { // Solo Ctrl/Cmd sin Shift
        switch (e.key.toLowerCase()) {
          case 'b': currentApplyFormat('**', 'wrap'); break;
          case 'i': currentApplyFormat('*', 'wrap'); break;
          case '1': currentApplyFormat('# ', 'line'); break;
          case '2': currentApplyFormat('## ', 'line'); break;
          case 'l': currentApplyFormat('- ', 'line'); break;
          case 'q': currentApplyFormat('> ', 'line'); break;
          case '`': currentApplyFormat('`', 'wrap'); break;
          case 'k': currentApplyFormat('[](url)', 'insert'); break;
          case 'g': currentHandleImageButtonClick(); break;
          case 't': currentInsertTableTemplate(); break;
          case 's': currentApplyFormat('~~', 'wrap'); break;
          default: handled = false;
        }
      }

      if (handled) {
        e.preventDefault();
        console.log(`[handleKeyDown] Handled shortcut: ${e.shiftKey ? 'Ctrl/Cmd+Shift+' : 'Ctrl/Cmd+'}${e.key}`);
      }
    }
  }, [insertText]); // <- Añadir insertText como dependencia

  // Función para insertar la plantilla <details>
  const insertDetailsTemplate = useCallback(() => {
    const template = '\n<details>\n  <summary>Título</summary>\n  \n  Contenido oculto...\n  \n</details>\n';
    // Colocar el cursor justo después de <summary>
    insertText(template, template.indexOf('</summary>'));
  }, [insertText]);

  // Función THROTTLED para sincronizar scroll
  const syncScroll = useCallback((source: 'editor' | 'preview') => {
    if (!textareaRef.current || !previewRef.current) return;

    const editor = textareaRef.current;
    const preview = previewRef.current;

    // Cancelar frame anterior si existe
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Programar la sincronización en el siguiente frame
    animationFrameRef.current = requestAnimationFrame(() => {
      // Solo sincronizar si el scroll NO fue iniciado por el panel destino
      if (scrollingPanel.current === source) {
        if (source === 'editor') {
          const scrollRatio = editor.scrollTop / (editor.scrollHeight - editor.clientHeight);
          // Solo aplicar si hay espacio para scroll
          if (preview.scrollHeight > preview.clientHeight) {
             preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
          }
        } else { // source === 'preview'
          const scrollRatio = preview.scrollTop / (preview.scrollHeight - preview.clientHeight);
          // Solo aplicar si hay espacio para scroll
          if (editor.scrollHeight > editor.clientHeight) {
            editor.scrollTop = scrollRatio * (editor.scrollHeight - editor.clientHeight);
          }
        }
      }
    });

    // Resetear quién inició el scroll después de un cooldown
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      scrollingPanel.current = null;
    }, 150); // Cooldown un poco más largo: 150ms

  }, []);

  // Listener para scroll del editor
  const handleEditorScroll = useCallback(() => {
    if (!scrollingPanel.current) { // Si nadie ha iniciado scroll recientemente
      scrollingPanel.current = 'editor';
    }
    syncScroll('editor');
  }, [syncScroll]);

  // Listener para scroll de la vista previa
  const handlePreviewScroll = useCallback(() => {
    if (!scrollingPanel.current) { // Si nadie ha iniciado scroll recientemente
      scrollingPanel.current = 'preview';
    }
    syncScroll('preview');
  }, [syncScroll]);

  return (
    <div className="app">
      <input 
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*" 
        style={{ display: 'none' }} 
      />
      <div className="toolbar">
        <div className="flex gap-2 flex-wrap items-center">
          <button className="toolbar-button" onClick={() => applyFormatRef.current('**', 'wrap')} title="Negrita (Ctrl+B)"><Bold size={16} /></button>
          <button className="toolbar-button" onClick={() => applyFormatRef.current('*', 'wrap')} title="Cursiva (Ctrl+I)"><Italic size={16} /></button>
          <button className="toolbar-button" onClick={() => applyFormatRef.current('~~', 'wrap')} title="Tachado (Ctrl+S)"><Strikethrough size={16} /></button>
          <button className="toolbar-button" onClick={() => applyFormatRef.current('<mark>', 'wrap')} title="Resaltado (Ctrl+Shift+H)"><Highlighter size={16} /></button>

          <div className="toolbar-separator"></div>

          <button className="toolbar-button" onClick={() => applyFormatRef.current('# ', 'line')} title="Título 1 (Ctrl+1)"><Heading1 size={16} /></button>
          <button className="toolbar-button" onClick={() => applyFormatRef.current('## ', 'line')} title="Título 2 (Ctrl+2)"><Heading2 size={16} /></button>

          <div className="toolbar-separator"></div>

          <button className="toolbar-button" onClick={() => applyFormatRef.current('- ', 'line')} title="Lista (Ctrl+L)"><List size={16} /></button>
          <button className="toolbar-button" onClick={() => applyFormatRef.current('- [ ] ', 'line')} title="Lista de Tareas (Ctrl+Shift+C)"><ListTodo size={16} /></button>

          <div className="toolbar-separator"></div>

          <button className="toolbar-button" onClick={() => applyFormatRef.current('> ', 'line')} title="Cita (Ctrl+Q)"><Quote size={16} /></button>
          <button className="toolbar-button" onClick={() => applyFormatRef.current('`', 'wrap')} title="Código (Ctrl+`)"><Code size={16} /></button>
          <button className="toolbar-button" onClick={insertDetailsTemplate} title="Sección Colapsable (Ctrl+Shift+D)"><ChevronsUpDown size={16} /></button>

          <div className="toolbar-separator"></div>

          <button className="toolbar-button" onClick={() => applyFormatRef.current('[](url)', 'insert')} title="Enlace (Ctrl+K)"><Link2 size={16} /></button>
          <button className="toolbar-button" onClick={handleImageButtonClickRef.current} title="Insertar Imagen Local (Ctrl+G)"><ImageIcon size={16} /></button>
          <button className="toolbar-button" onClick={insertTableTemplateRef.current} title="Insertar Tabla (Ctrl+T)"><Table size={16} /></button>

          <div className="toolbar-separator"></div>

          <button className="toolbar-button" onClick={() => applyFormatRef.current('<sup>', 'wrap')} title="Superíndice (Ctrl+Shift+P)"><Superscript size={16} /></button>
          <button className="toolbar-button" onClick={() => applyFormatRef.current('<sub>', 'wrap')} title="Subíndice (Ctrl+Shift+B)"><Subscript size={16} /></button>

        </div>
        <div className="toolbar-separator mx-2"></div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
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
            onScroll={handleEditorScroll} // Listener sin cambios
            placeholder="Escribe aquí tu markdown..."
          />
        </div>

        <div
          className="divider"
          onMouseDown={startResizing}
        />

        <div
          ref={previewRef}
          className="preview"
          style={{ width: `${100 - leftWidth - 1}%` }}
          onScroll={handlePreviewScroll} // Listener sin cambios
        >
          <ReactMarkdown
            key={content}
            remarkPlugins={[remarkGfm, remarkDirective, remarkCustomPanels, remarkGithubBetaBlockquoteAdmonitions]}
            rehypePlugins={[[rehypeRaw, { passThrough: ['element', 'text'] }]]}
            components={{
              code(props: any) {
                const { node, inline, className, children, ...rest } = props;
                // Log para depuración
                // console.log('[Code Renderer RAW Props]', props); // Eliminado

                const match = /language-(\w+)/.exec(className || '');
                const language = match?.[1]; // Obtener el lenguaje si existe

                // Usar SyntaxHighlighter SOLO si NO es inline Y hay un lenguaje detectado
                if (!inline && language) {
                  // Comprobar si el lenguaje es soportado (opcional, pero bueno para evitar errores)
                  // Por ahora, asumimos que si hay 'language-xxx', intentamos resaltarlo.
                  return (
                    <SyntaxHighlighter
                      style={vscDarkPlus} // Usar el tema importado
                      language={language} // Usar el lenguaje detectado
                      PreTag="div"
                      // Pasar los children como string, eliminando saltos de línea finales
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  );
                } else {
                  // Renderizar como <code> normal si es inline O si no se especificó lenguaje
                  // Quitar la clase 'language-xxx' si es inline para evitar estilos no deseados
                  const finalClassName = inline ? undefined : className;
                  // Asegurar que renderizamos algo, incluso si children es undefined
                  const contentToRender = children !== undefined && children !== null ? children : '';
                  return (
                    <code className={finalClassName} {...rest}>
                      {contentToRender}
                    </code>
                  );
                }
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default App;