import React from 'react';
import { Save, FolderOpen, FileUp, Printer, Book, Wand2, Command } from 'lucide-react'; // Importar icono de guardar, FolderOpen y FileUp, y añadido iconos Book, Wand2 y Command

interface ToolbarProps {
  // Función para aplicar sintaxis Markdown alrededor de la selección
  onApplyStyle: (syntaxStart: string, syntaxEnd?: string) => void;
  onInsertBlock: (blockText: string) => void; // Nuevo prop para insertar bloques
  onSave: () => void; // Nuevo prop para guardar
  onLoad: () => void; // Nuevo prop para disparar la carga
  onExportPDF?: () => void; // Opcional para compatibilidad con versiones anteriores
  onLoadMasterDemo?: () => void; // Nuevo prop para cargar directamente Master v2.5.md
  onLoadCodexDemo?: () => void; // Nuevo prop para cargar directamente aetherium_codex_demo.md
  onLoadInfinityDemo?: () => void; // Nuevo prop para cargar el demo con Infinity Command
}

// Plantillas para bloques comunes y personalizados
const quoteTemplate = `> `;
const codeBlockTemplate = "```\n\n```";
// Plantilla de datamatrix simplificada y compatible con todos los temas
const metamatrixTemplate = `::: datamatrix Matriz de Datos

| Campo             | Valor      |
| ----------------- | ---------- |
| Estado            | Activo     |
| Prioridad         | Alta       |
| Completado        | 75%        |

:::`;
// Plantillas de paneles genéricas y compatibles con todos los temas
const statusPanelTemplate = `::: panel-unit-status Estado de Unidad

* Estado: **Operativo** (OK)
* Energía: 75/100
* Comunicaciones: **Activas** (OK)
* Munición: **Baja** (WARN)
* Combustible: 45/100

:::`;
const logPanelTemplate = `::: panel-event-log Registro de Eventos

- 08:45 - Contacto inicial establecido
- 09:30 - Perímetro asegurado
- 10:15 - **¡Alerta!** Detección de intrusos (ERROR)
- 10:45 - Situación contenida

:::`;
const objectivesPanelTemplate = `::: panel-objectives Objetivos de Misión

- [x] Establecer perímetro seguro
- [x] Contactar con equipo de avanzada
- [ ] Asegurar los recursos críticos
- [ ] Extraer información del terminal principal

:::`;
const infoPanelTemplate = `::: panel-info-box Información Importante

Esta es información crítica para la misión. Todos los agentes deben estar al tanto de:

1. Protocolos de comunicación encriptados
2. Puntos de extracción designados
3. Procedimientos de descontaminación

**Nota:** Esta información debe tratarse con nivel de seguridad ALPHA.

:::`;

const Toolbar: React.FC<ToolbarProps> = ({ 
  onApplyStyle, 
  onInsertBlock, 
  onSave, 
  onLoad, 
  onExportPDF, 
  onLoadMasterDemo, 
  onLoadCodexDemo,
  onLoadInfinityDemo
}) => {
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

      {/* Botones Demo */}
      {onLoadMasterDemo && (
        <button title="Load Master Demo" onClick={onLoadMasterDemo} className={`${buttonClass} bg-purple-700 hover:bg-purple-600`}>
          <Book size={16} />
          Master Demo
        </button>
      )}
      
      {onLoadCodexDemo && (
        <button title="Load Aetherium Codex Demo" onClick={onLoadCodexDemo} className={`${buttonClass} bg-blue-700 hover:bg-blue-600`}>
          <Wand2 size={16} />
          Codex Demo
        </button>
      )}

      {onLoadInfinityDemo && (
        <button title="Load Infinity Command Demo" onClick={onLoadInfinityDemo} className={`${buttonClass} bg-green-700 hover:bg-green-600`}>
          <Command size={16} />
          Command Demo
        </button>
      )}

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