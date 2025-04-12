import React from 'react';
import { 
  Bold, Italic, List, ListOrdered, 
  Quote, Code, Table, Image, 
  Save, Loader2, FileText, Layout,
  AlignJustify, Heading1, Heading2
} from 'lucide-react';

interface ToolbarProps {
  onApplyStyle: (style: string) => void;
  onInsertBlock: (block: string) => void;
  onLoadMarkdown: () => void;
  onLoadDemo: () => void;
  isLoading: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onApplyStyle,
  onInsertBlock,
  onLoadMarkdown,
  onLoadDemo,
  isLoading
}) => {
  // Templates para bloques comunes
  const quoteTemplate = '> Cita de texto';
  const codeBlockTemplate = '```\n// Código aquí\n```';
  const tableTemplate = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
  const imageTemplate = '![Texto alternativo](url-de-la-imagen)';
  const horizontalRuleTemplate = '---';

  // Templates para bloques personalizados
  const datamatrixTemplate = ':::datamatrix Título de la Matriz\n| Header 1 | Header 2 | Header 3 |\n|----------|----------|----------|\n| Dato 1   | OK       | Alto     |\n| Dato 2   | Warning   | Medio    |\n| Dato 3   | Error     | Bajo     |\n:::';
  
  const panelTemplate = ':::panel Título del Panel\nContenido del panel.\n:::';
  
  const statusPanelTemplate = ':::panel-status Título del Panel\nEstado: OK\nNivel: Alto\nPrioridad: Máxima\n:::';
  
  const infoBoxTemplate = ':::panel-info-box Información Importante\nEste es un bloque de información destacado.\n:::';
  
  const logPanelTemplate = ':::panel-log Registro de Eventos\n[08:45] Iniciando sistema\n[08:46] Conexión establecida\n[08:50] Error detectado en módulo #42\n[09:15] Sistema recuperado\n:::';
  
  const objectivesTemplate = ':::panel-objectives Objetivos de Misión\n* Localizar el artefacto perdido\n* Establecer contacto con el agente infiltrado\n* Extraer la información y regresar a la base\n:::';
  
  const warningTemplate = ':::panel-warning ¡Advertencia!\nEste sistema está bajo monitoreo constante.\n:::';
  
  const errorTemplate = ':::panel-error Error Crítico\nSe ha detectado una brecha de seguridad en el sector 7.\n:::';

  const noteTemplate = ':::note Nota\nEste es un bloque de nota simple.\n:::';

  const insertFloatingBlocks = () => {
    const exampleMarkdown = `# Ejemplo de Bloques Flotantes

Este es un ejemplo de cómo usar los bloques flotantes en el editor.

:::panel float-left Ejemplo Flotante Izquierda
Este panel flota a la izquierda del texto.

- Punto 1
- Punto 2
- Punto 3
:::

El texto principal puede continuar aquí y fluirá alrededor del bloque flotante a la izquierda.

:::panel float-right Ejemplo Flotante Derecha
Este panel flota a la derecha del texto.

1. Primer elemento
2. Segundo elemento
3. Tercer elemento
:::

Este texto continuará fluyendo alrededor del bloque flotante a la derecha.

:::datamatrix GUARDIÁN DEL CÓDICE
| Nombre          | Estado       | Nivel |
|-----------------|--------------|-------|
| Alpha Squad     | OK           | 1     |
| Bravo Team      | Warning      | 2     |
| Charlie Platoon | Critical     | 3     |
:::

## Conclusión

Los bloques flotantes te permiten crear diseños más interesantes y dinámicos en tus documentos Markdown.`;

    onInsertBlock(exampleMarkdown);
  };

  return (
    <div className="p-2 bg-gray-800 border-b border-gray-700 flex items-center space-x-2 overflow-x-auto">
      {/* Grupo de Formatos Básicos */}
      <div className="flex space-x-1">
        <button
          onClick={() => onApplyStyle('**Texto en negrita**')}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Negrita"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => onApplyStyle('*Texto en cursiva*')}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Cursiva"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => onApplyStyle('`código`')}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Código Inline"
        >
          <Code size={18} />
        </button>
      </div>

      <div className="h-full w-px bg-gray-700"></div>

      {/* Grupo de Encabezados */}
      <div className="flex space-x-1">
        <button
          onClick={() => onInsertBlock('# Título')}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Título H1"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => onInsertBlock('## Subtítulo')}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Subtítulo H2"
        >
          <Heading2 size={18} />
        </button>
      </div>

      <div className="h-full w-px bg-gray-700"></div>

      {/* Grupo de Listas */}
      <div className="flex space-x-1">
        <button
          onClick={() => onInsertBlock('- Elemento 1\n- Elemento 2\n- Elemento 3')}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Lista con viñetas"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => onInsertBlock('1. Primer elemento\n2. Segundo elemento\n3. Tercer elemento')}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Lista numerada"
        >
          <ListOrdered size={18} />
        </button>
        <button
          onClick={() => onInsertBlock(quoteTemplate)}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Cita"
        >
          <Quote size={18} />
        </button>
        <button
          onClick={() => onInsertBlock(horizontalRuleTemplate)}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Línea horizontal"
        >
          <AlignJustify size={18} />
        </button>
      </div>

      <div className="h-full w-px bg-gray-700"></div>

      {/* Grupo de Elementos Complejos */}
      <div className="flex space-x-1">
        <button
          onClick={() => onInsertBlock(codeBlockTemplate)}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Bloque de código"
        >
          <Code size={18} />
        </button>
        <button
          onClick={() => onInsertBlock(tableTemplate)}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Tabla"
        >
          <Table size={18} />
        </button>
        <button
          onClick={() => onInsertBlock(imageTemplate)}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Imagen"
        >
          <Image size={18} />
        </button>
      </div>

      <div className="h-full w-px bg-gray-700"></div>

      {/* Grupo de Bloques Personalizados */}
      <div className="flex space-x-1">
        <button
          onClick={() => onInsertBlock(panelTemplate)}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Panel Básico"
        >
          <Layout size={18} />
        </button>
        <button
          onClick={() => onInsertBlock(datamatrixTemplate)}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Matriz de Datos"
        >
          <Table size={18} />
        </button>
        <div className="relative group">
          <button
            className="p-2 rounded hover:bg-gray-700 text-white"
            title="Más bloques personalizados"
          >
            +
          </button>
          <div className="absolute z-10 left-0 mt-1 w-48 bg-gray-800 rounded shadow-lg hidden group-hover:block">
            <button
              onClick={() => onInsertBlock(statusPanelTemplate)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
            >
              Panel de Estado
            </button>
            <button
              onClick={() => onInsertBlock(infoBoxTemplate)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
            >
              Caja de Información
            </button>
            <button
              onClick={() => onInsertBlock(logPanelTemplate)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
            >
              Panel de Registro
            </button>
            <button
              onClick={() => onInsertBlock(objectivesTemplate)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
            >
              Objetivos
            </button>
            <button
              onClick={() => onInsertBlock(warningTemplate)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
            >
              Advertencia
            </button>
            <button
              onClick={() => onInsertBlock(errorTemplate)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
            >
              Error
            </button>
            <button
              onClick={() => onInsertBlock(noteTemplate)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-white text-sm"
            >
              Nota
            </button>
          </div>
        </div>
      </div>

      {/* Espaciador Flexible */}
      <div className="flex-grow"></div>

      {/* Grupo de Acciones */}
      <div className="flex space-x-1">
        <button
          onClick={onLoadMarkdown}
          className="p-2 rounded hover:bg-gray-700 text-white"
          title="Cargar archivo Markdown"
        >
          <FileText size={18} />
        </button>
        <button
          onClick={onLoadDemo}
          className={`p-2 rounded ${isLoading ? 'bg-gray-600 cursor-not-allowed' : 'hover:bg-gray-700'} text-white`}
          disabled={isLoading}
          title="Cargar demo"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
        </button>
      </div>
    </div>
  );
};

export default Toolbar; 