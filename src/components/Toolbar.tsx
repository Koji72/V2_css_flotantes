import React, { useRef } from 'react';
import { 
  Bold, Italic, List, ListOrdered, 
  Quote, Code, Table, Image, 
  Save, Loader2, FileText, Layout,
  AlignJustify, Heading1, Heading2,
  User, Map, Compass, Sword,
  Heart, Scroll, Dice1, 
  Layers, Square, PanelTopClose, PanelLeft,
  Upload, Sun, Moon, Strikethrough
} from 'lucide-react';

interface ToolbarProps {
  onFileLoad: (file: File) => void;
  onLoadDemo: () => void;
  onDarkModeToggle: () => void;
  darkMode: boolean;
  isLoading: boolean;
  onApplyStyle: (style: string) => void;
  onInsertBlock: (block: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onFileLoad,
  onLoadDemo,
  onDarkModeToggle,
  darkMode,
  isLoading,
  onApplyStyle,
  onInsertBlock,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileLoad(file);
    }
  };

  const handleStyleClick = (style: string) => {
    onApplyStyle(style);
  };

  const handleBlockClick = (block: string) => {
    onInsertBlock(block);
  };

  // Templates para bloques comunes
  const quoteTemplate = '> Cita de texto';
  const codeBlockTemplate = '```\n// Código aquí\n```';
  const tableTemplate = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
  const imageTemplate = '![Texto alternativo](url-de-la-imagen)';
  const horizontalRuleTemplate = '---';

  // Nuevos templates para paneles con estilos
  const panelStylesTemplates = [
    {
      name: 'Panel Esquinas Cortadas',
      icon: <Square size={16} />,
      template: `:::panel Título del Panel | style=cut-corners
Este es un panel con esquinas cortadas.

- Elemento 1
- Elemento 2
- Elemento 3
:::`
    },
    {
      name: 'Panel Soportes de Esquina',
      icon: <PanelTopClose size={16} />,
      template: `:::panel Título del Panel | style=corner-brackets
Este es un panel con soportes en las esquinas.

1. Paso uno
2. Paso dos
3. Paso tres
:::`
    },
    {
      name: 'Panel Cristal',
      icon: <Layers size={16} />,
      template: `:::panel Título del Panel | style=glass-panel
Este es un panel con efecto de cristal/vidrio.

> "Un efecto visual moderno y translúcido."
:::`
    },
    {
      name: 'Panel Flotante Izquierda',
      icon: <PanelLeft size={16} />,
      template: `:::panel Título del Panel | layout=float-left
Este panel flota a la izquierda del texto.

- Permite que el texto fluya a su alrededor
- Ideal para notas o información complementaria
:::`
    },
    {
      name: 'Panel Flotante Derecha',
      icon: <PanelLeft size={16} style={{ transform: 'scaleX(-1)' }} />,
      template: `:::panel Título del Panel | layout=float-right
Este panel flota a la derecha del texto.

- Permite que el texto fluya a su alrededor
- Ideal para notas o información complementaria
:::`
    },
    {
      name: 'Panel Centrado',
      icon: <AlignJustify size={16} />,
      template: `:::panel Título del Panel | layout=center
Este es un panel centrado de ancho reducido.

Perfecto para destacar información importante en el centro del documento.
:::`
    },
    {
      name: 'Panel Combinado',
      icon: <Layers size={16} />,
      template: `:::panel Título del Panel | style=glass-panel,corner-brackets | layout=float-right | class=custom-panel
Este panel combina múltiples estilos y layouts.

- Efecto de cristal/vidrio
- Soportes en las esquinas
- Flotando a la derecha
:::`
    }
  ];

  return (
    <div className={`toolbar ${darkMode ? 'dark-mode' : ''}`}>
      <div className="toolbar-section">
        <button
          className="toolbar-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
        >
          <Upload className="icon" />
          Cargar Markdown
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".md,.markdown"
          style={{ display: 'none' }}
        />
        <button className="toolbar-button" onClick={onLoadDemo} disabled={isLoading}>
          <FileText className="icon" />
          Cargar Demo
        </button>
      </div>

      <div className="toolbar-section">
        <button className="toolbar-button" onClick={() => handleStyleClick('**texto**')}>
          <Bold className="icon" />
          Negrita
        </button>
        <button className="toolbar-button" onClick={() => handleStyleClick('*texto*')}>
          <Italic className="icon" />
          Cursiva
        </button>
        <button className="toolbar-button" onClick={() => handleStyleClick('~~texto~~')}>
          <Strikethrough className="icon" />
          Tachado
        </button>
        <button className="toolbar-button" onClick={() => handleStyleClick('`texto`')}>
          <Code className="icon" />
          Código
        </button>
      </div>

      <div className="toolbar-section">
        <button className="toolbar-button" onClick={() => handleBlockClick('# Título 1')}>
          <Heading1 className="icon" />
          Título 1
        </button>
        <button className="toolbar-button" onClick={() => handleBlockClick('## Título 2')}>
          <Heading2 className="icon" />
          Título 2
        </button>
        <button className="toolbar-button" onClick={() => handleBlockClick('> Cita')}>
          <Quote className="icon" />
          Cita
        </button>
        <button className="toolbar-button" onClick={() => handleBlockClick('- Elemento')}>
          <List className="icon" />
          Lista
        </button>
      </div>

      <div className="toolbar-section">
        <button className="toolbar-button" onClick={onDarkModeToggle}>
          {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
          {darkMode ? 'Modo Claro' : 'Modo Oscuro'}
        </button>
      </div>
    </div>
  );
};

export default Toolbar; 