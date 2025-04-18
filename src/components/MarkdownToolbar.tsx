import React from 'react';
import { useStore } from '../store';

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ textareaRef }) => {
  const { content, setContent } = useStore();

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

  const handleHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertMarkdown(prefix);
  };

  return (
    <div className="markdown-toolbar flex flex-wrap gap-1 p-2 bg-gray-800 border-b border-gray-700">
      <button
        onClick={() => insertMarkdown('**', '**')}
        title="Negrita (Ctrl+B)"
        className="markdown-button"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => insertMarkdown('*', '*')}
        title="Cursiva (Ctrl+I)"
        className="markdown-button"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => insertMarkdown('~~', '~~')}
        title="Tachado"
        className="markdown-button"
      >
        <span style={{ textDecoration: 'line-through' }}>S</span>
      </button>
      <div className="toolbar-divider"></div>
      
      <button
        onClick={() => handleHeading(1)}
        title="Encabezado 1 (Ctrl+1)"
        className="markdown-button"
      >
        H1
      </button>
      <button
        onClick={() => handleHeading(2)}
        title="Encabezado 2 (Ctrl+2)"
        className="markdown-button"
      >
        H2
      </button>
      <button
        onClick={() => handleHeading(3)}
        title="Encabezado 3 (Ctrl+3)"
        className="markdown-button"
      >
        H3
      </button>
      <div className="toolbar-divider"></div>
      
      <button
        onClick={() => insertMarkdown('- ')}
        title="Lista de viñetas (Ctrl+L)"
        className="markdown-button"
      >
        • Lista
      </button>
      <button
        onClick={() => insertMarkdown('1. ')}
        title="Lista numerada"
        className="markdown-button"
      >
        1. Numerada
      </button>
      <button
        onClick={() => insertMarkdown('- [ ] ')}
        title="Lista de tareas"
        className="markdown-button"
      >
        ☐ Tareas
      </button>
      <button
        onClick={() => insertMarkdown('> ')}
        title="Cita (Ctrl+Q)"
        className="markdown-button"
      >
        " Cita
      </button>
      <div className="toolbar-divider"></div>
      
      <button
        onClick={() => insertMarkdown('[', '](url)')}
        title="Enlace (Ctrl+K)"
        className="markdown-button"
      >
        🔗 Enlace
      </button>
      <button
        onClick={() => insertMarkdown('![Alt text](', ')')}
        title="Imagen"
        className="markdown-button"
      >
        🖼️ Imagen
      </button>
      <button
        onClick={() => insertMarkdown('`', '`')}
        title="Código en línea (Ctrl+`)"
        className="markdown-button"
      >
        ` Código
      </button>
      <button
        onClick={() => insertMarkdown('```\n', '\n```')}
        title="Bloque de código"
        className="markdown-button"
      >
        ```
      </button>
      <button
        onClick={() => insertMarkdown('<sup>', '</sup>')}
        title="Superíndice"
        className="markdown-button"
      >
        X<sup>2</sup>
      </button>
      <button
        onClick={() => insertMarkdown('---\n')}
        title="Separador horizontal"
        className="markdown-button"
      >
        —
      </button>
      <button
        onClick={() => insertMarkdown('| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n')}
        title="Tabla"
        className="markdown-button"
      >
        Tabla
      </button>
    </div>
  );
};

export default MarkdownToolbar; 