import React from 'react';
import { Save, FolderOpen, FileUp, Printer } from 'lucide-react'; // Importar icono de guardar, FolderOpen y FileUp

interface ToolbarProps {
  // Función para aplicar sintaxis Markdown alrededor de la selección
  onApplyStyle: (syntaxStart: string, syntaxEnd?: string) => void;
  onInsertBlock: (blockText: string) => void; // Nuevo prop para insertar bloques
  onSave: () => void; // Nuevo prop para guardar
  onLoad: () => void; // Nuevo prop para disparar la carga
  onExportPDF?: () => void; // Opcional para compatibilidad con versiones anteriores
}

// Plantillas para bloques comunes y personalizados
const quoteTemplate = `> `;
const codeBlockTemplate = "```\n\n```";
// Envolver Metamatrix en su propio panel
const metamatrixTemplate = `::: datamatrix Data Matrix Title

| Meta              | Value      |
| ----------------- | ---------- |
| Key1              | Value1     |
| Key2              | Value2     |

:::`;
// Simplificar headers en plantillas de paneles
const statusPanelTemplate = `::: panel-unit-status
<div class="panel-header">
<span class="header-icon"></span> Unit Status
</div>
<div class="panel-content">

Status details...
</div>
:::`;
const logPanelTemplate = `::: panel-event-log
<div class="panel-header">
<span class="header-icon"></span> Event Log
</div>
<div class="panel-content">

- Log entry 1
- Log entry 2
</div>
:::`;
const objectivesPanelTemplate = `::: panel-objectives
<div class="panel-header">
<span class="header-icon"></span> Objectives
</div>
<div class="panel-content">

- [ ] Objective 1
- [x] Objective 2
</div>
:::`;
const infoPanelTemplate = `::: panel-info-box
<div class="panel-header">
<span class="header-icon"></span> Information
</div>
<div class="panel-content">

Relevant info...
</div>
:::`;

const Toolbar: React.FC<ToolbarProps> = ({ onApplyStyle, onInsertBlock, onSave, onLoad, onExportPDF }) => {
  const buttonClass = "px-2 py-1 rounded bg-gray-600 hover:bg-gray-500 text-white text-xs sm:text-sm flex items-center gap-1"; // Añadido flex y gap

  return (
    <div className="flex items-center flex-wrap gap-2 p-2 bg-gray-700 border-b border-gray-600">
      {/* Estilos de línea */}
      <button title="Bold" onClick={() => onApplyStyle('**', '**')} className={`${buttonClass} font-bold`}>B</button>
      <button title="Italic" onClick={() => onApplyStyle('*', '*')} className={`${buttonClass} italic`}>I</button>
      
      {/* Bloques */}
      <button title="Blockquote" onClick={() => onInsertBlock(quoteTemplate)} className={buttonClass}>Quote</button>
      <button title="Code Block" onClick={() => onInsertBlock(codeBlockTemplate)} className={buttonClass}>Code Block</button>
      <button title="Metamatrix" onClick={() => onInsertBlock(metamatrixTemplate)} className={buttonClass}>Metamatrix</button>

      {/* Paneles Personalizados */}
      <button title="Status Panel" onClick={() => onInsertBlock(statusPanelTemplate)} className={buttonClass}>Status P.</button>
      <button title="Log Panel" onClick={() => onInsertBlock(logPanelTemplate)} className={buttonClass}>Log P.</button>
      <button title="Objectives Panel" onClick={() => onInsertBlock(objectivesPanelTemplate)} className={buttonClass}>Objectives P.</button>
      <button title="Info Panel" onClick={() => onInsertBlock(infoPanelTemplate)} className={buttonClass}>Info P.</button>

      {/* Botón Cargar MD */}
      <button title="Load Markdown File" onClick={onLoad} className={buttonClass}>
        <FileUp size={16} />
        Load MD
      </button>

      {/* Separador visual opcional */}
      <div className="border-l border-gray-500 h-5 mx-1"></div> 

      {/* Botón Guardar */}
      <button title="Save File" onClick={onSave} className={buttonClass}>
        <Save size={16} /> {/* Icono */}
        Save
      </button>

      {/* Botón Exportar PDF */}
      {onExportPDF && (
        <button 
          title="Export as PDF" 
          onClick={onExportPDF} 
          className={buttonClass}
        >
          <Printer size={16} />
          Export PDF
        </button>
      )}
    </div>
  );
};

export default Toolbar; 