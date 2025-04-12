import React from 'react';
import { 
  Bold, Italic, List, ListOrdered, 
  Quote, Code, Table, Image, 
  Save, Loader2, FileText, Layout,
  AlignJustify, Heading1, Heading2,
  User, Map, Compass, Sword,
  Heart, Scroll, Dice1, 
  Layers, Square, PanelTopClose, PanelLeft
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
    <div className="toolbar p-2 bg-gray-800 border-b border-gray-700 flex flex-wrap items-center gap-2">
      {/* Controles de formato de texto */}
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('**')}
      >
        <Bold size={16} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('*')}
      >
        <Italic size={16} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('# ')}
      >
        <Heading1 size={16} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('## ')}
      >
        <Heading2 size={16} />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Controles de listas */}
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('- ')}
      >
        <List size={16} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('1. ')}
      >
        <ListOrdered size={16} />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Controles de bloques */}
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('> ')}
      >
        <Quote size={16} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onApplyStyle('```\n')}
      >
        <Code size={16} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onInsertBlock(tableTemplate)}
      >
        <Table size={16} />
      </button>
      <button 
        className="p-2 hover:bg-gray-700 rounded text-white" 
        onClick={() => onInsertBlock(imageTemplate)}
      >
        <Image size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle(horizontalRuleTemplate)}>
        <div className="w-4 h-px bg-white"></div>
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Bloques personalizados - Estilo de paneles */}
      <div className="relative group">
        <button className="p-2 hover:bg-gray-700 rounded text-white flex items-center gap-1">
          <Layers size={16} />
          <span className="text-sm">Paneles</span>
        </button>
        <div className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 hidden group-hover:block w-64">
          {panelStylesTemplates.map((template, index) => (
            <button 
              key={index}
              className="block w-full text-left p-2 hover:bg-gray-700 text-white flex items-center gap-2"
              onClick={() => onInsertBlock(template.template)}
            >
              {template.icon}
              <span className="text-sm">{template.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Insertar bloques temáticos */}
      <button 
        className="p-2 hover:bg-gray-700 rounded flex items-center gap-1" 
        onClick={() => onInsertBlock(`:::statblock Personaje
**Nombre:** Anya Petrova
**Clase:** Exploradora
**Nivel:** 7
**HP:** 45/60
**Estadísticas:**
- Fuerza: 14
- Destreza: 18
- Constitución: 12
- Inteligencia: 14
- Sabiduría: 16
- Carisma: 10
:::`)}>
        <User size={16} />
        <span className="text-sm">Personaje</span>
      </button>

      <button 
        className="p-2 hover:bg-gray-700 rounded flex items-center gap-1" 
        onClick={() => onInsertBlock(`:::panel Mapa | style=glass-panel
![Mapa de la región](https://via.placeholder.com/500x300)

**Lugares de interés:**
1. Ciudad principal
2. Bosque encantado
3. Montañas de hielo
:::`)}>
        <Map size={16} />
        <span className="text-sm">Mapa</span>
      </button>

      <button 
        className="p-2 hover:bg-gray-700 rounded flex items-center gap-1" 
        onClick={() => onInsertBlock(`:::datamatrix EXPLORACIÓN | style=corner-brackets
| Dirección | Terreno | Peligro |
|-----------|---------|---------|
| Norte     | Montaña | Alto    |
| Sur       | Bosque  | Medio   |
| Este      | Llanura | Bajo    |
| Oeste     | Río     | Medio   |
:::`)}>
        <Compass size={16} />
        <span className="text-sm">Exploración</span>
      </button>

      <div className="flex-grow"></div>

      {/* Controles de carga */}
      <button 
        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center gap-2" 
        onClick={onLoadMarkdown}
      >
        <FileText size={16} />
        <span className="text-sm">Cargar MD</span>
      </button>

      <button 
        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center gap-2" 
        onClick={onLoadDemo}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Layout size={16} />}
        <span className="text-sm">Cargar Demo</span>
      </button>
    </div>
  );
};

export default Toolbar; 