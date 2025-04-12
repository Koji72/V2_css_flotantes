import React, { useState } from 'react';
import { 
  Bold, Italic, List, ListOrdered, 
  Quote, Code, Table, Image, 
  Save, Loader2, FileText, Layout,
  AlignJustify, Heading1, Heading2,
  User, Map, Compass, Sword,
  Heart, Scroll, Dice1, 
  Layers, Square, PanelTopClose, PanelLeft,
  ChevronDown, ChevronUp, Book,
  CornerDownRight
} from 'lucide-react';

interface ToolbarProps {
  onApplyStyle: (style: string) => void;
  onInsertBlock: (block: string) => void;
  onLoadMarkdown: () => void;
  onLoadDemo: (demoFile?: string) => void;
  isLoading: boolean;
}

const EnhancedToolbar: React.FC<ToolbarProps> = ({
  onApplyStyle,
  onInsertBlock,
  onLoadMarkdown,
  onLoadDemo,
  isLoading
}) => {
  // Estado para controlar el menú desplegable
  const [panelMenuOpen, setPanelMenuOpen] = useState(false);

  // Templates para bloques comunes
  const quoteTemplate = '> Cita de texto';
  const codeBlockTemplate = '```\n// Código aquí\n```';
  const tableTemplate = '| Header 1 | Header 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |';
  const imageTemplate = '![Texto alternativo](url-de-la-imagen)';
  const horizontalRuleTemplate = '---';

  // Templates para bloques temáticos
  const characterStatBlock = `:::panel Estadísticas de Personaje | style=corner-brackets
### Jade Steelheart

| Atributo | Valor | Bono |
|----------|-------|------|
| Fuerza   | 16    | +3   |
| Destreza | 14    | +2   |
| Intelecto| 18    | +4   |

**Habilidades:**
- Sigilo: +5
- Percepción: +6
- Arcanos: +8
:::`;

  const mapPanel = `:::panel Mapa de la Zona | style=glass-panel
### Región de Blackwater

- **Punto de interés:** Las Ruinas Sumergidas
- **Peligro:** Alto (Nivel 5-8)
- **Recompensa:** Artefacto del Culto Profundo
- **Gobernante:** Ninguno (tierra salvaje)

*El acceso más seguro es a través del desfiladero este, pero se requiere equipo de escalada.*
:::`;

  const explorationMatrix = `:::datamatrix Matriz de Exploración | style=cut-corners
| Ubicación | Estado | Recursos | Peligro |
|-----------|--------|----------|---------|
| Bosque Norte | Inexplorado | Madera, hierbas | Medio |
| Montañas Este | Parcial | Minerales, cristales | Alto |
| Costas Sur | Explorado | Pesca, comercio | Bajo |
| Desierto Oeste | Mapeado | Gemas, ruinas | Extremo |
:::`;

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
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle('**Texto en negrita**')}>
        <Bold size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle('*Texto en cursiva*')}>
        <Italic size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle('# Encabezado')}>
        <Heading1 size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle('## Subencabezado')}>
        <Heading2 size={16} />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Controles de listas */}
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle('- Elemento de lista\n- Otro elemento')}>
        <List size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle('1. Primer elemento\n2. Segundo elemento')}>
        <ListOrdered size={16} />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Controles de bloques */}
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle(quoteTemplate)}>
        <Quote size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle(codeBlockTemplate)}>
        <Code size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle(tableTemplate)}>
        <Table size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle(imageTemplate)}>
        <Image size={16} />
      </button>
      <button className="p-2 hover:bg-gray-700 rounded" onClick={() => onApplyStyle(horizontalRuleTemplate)}>
        <div className="w-4 h-px bg-white"></div>
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Bloques personalizados - Estilo de paneles */}
      <div className="relative">
        <button 
          className={`p-2 rounded flex items-center gap-1 ${panelMenuOpen ? 'bg-gray-700' : 'hover:bg-gray-700'} border border-gray-600`}
          onClick={() => setPanelMenuOpen(!panelMenuOpen)}
        >
          <Layers size={16} />
          <span className="text-sm">Paneles</span>
          {panelMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {panelMenuOpen && (
          <div className="absolute left-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg z-10 w-64">
            {panelStylesTemplates.map((template, index) => (
              <button 
                key={index}
                className="block w-full text-left p-2 hover:bg-gray-700 flex items-center gap-2"
                onClick={() => {
                  onInsertBlock(template.template);
                  setPanelMenuOpen(false);
                }}
              >
                {template.icon}
                <span className="text-sm">{template.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* Insertar bloques temáticos */}
      <button 
        className="p-2 hover:bg-gray-700 rounded flex items-center gap-1 border border-gray-600" 
        onClick={() => onInsertBlock(characterStatBlock)}
        title="Insertar bloque de estadísticas de personaje"
      >
        <Sword size={16} />
        <span className="text-sm">Ficha de Personaje</span>
      </button>

      <button 
        className="p-2 hover:bg-gray-700 rounded flex items-center gap-1 border border-gray-600" 
        onClick={() => onInsertBlock(mapPanel)}
        title="Insertar panel de mapa"
      >
        <Map size={16} />
        <span className="text-sm">Panel de Mapa</span>
      </button>

      <button 
        className="p-2 hover:bg-gray-700 rounded flex items-center gap-1 border border-gray-600" 
        onClick={() => onInsertBlock(explorationMatrix)}
        title="Insertar matriz de datos de exploración"
      >
        <CornerDownRight size={16} />
        <span className="text-sm">Matriz de Exploración</span>
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
        onClick={() => onLoadDemo()}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Layout size={16} />}
        <span className="text-sm">Cargar Demo</span>
      </button>

      <button 
        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center gap-2" 
        onClick={() => onLoadDemo('rpg_fantasy_demo.md')}
        disabled={isLoading}
        title="Cargar demo del estilo RPG Fantasy"
      >
        <Book size={16} />
        <span className="text-sm">Demo RPG</span>
      </button>
    </div>
  );
};

export default EnhancedToolbar; 