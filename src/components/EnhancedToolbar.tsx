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
  CornerDownRight, Moon, Sun
} from 'lucide-react';

interface ToolbarProps {
  onApplyStyle?: (style: string) => void;
  onInsertBlock?: (block: string) => void;
  onLoadMarkdown?: () => void;
  onLoadDemo: (demoFile?: string) => void;
  isLoading: boolean;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onFileLoad: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const EnhancedToolbar: React.FC<ToolbarProps> = ({
  onApplyStyle = () => {},
  onInsertBlock = () => {},
  onLoadMarkdown = () => {},
  onLoadDemo,
  isLoading,
  darkMode,
  onDarkModeToggle,
  onFileLoad
}) => {
  // Estado para controlar el menú desplegable
  const [panelMenuOpen, setPanelMenuOpen] = useState(false);

  // Templates para bloques comunes
  const quoteTemplate = '> Cita de texto';
  const codeBlockTemplate = '```\n// Código aquí\n```';
  const tableTemplate = `| Encabezado 1 | Encabezado 2 | Encabezado 3 |
|-------------|-------------|-------------|
| Fila 1, Col 1 | Fila 1, Col 2 | Fila 1, Col 3 |
| Fila 2, Col 1 | Fila 2, Col 2 | Fila 2, Col 3 |
| Fila 3, Col 1 | Fila 3, Col 2 | Fila 3, Col 3 |`;
  const enhancedTableTemplate = `:::datamatrix{title="Tabla de Datos" style="tech-corners"}
| Encabezado 1 | Encabezado 2 | Encabezado 3 | Estado |
|-------------|-------------|-------------|--------|
| Valor 1-1 | Valor 1-2 | Valor 1-3 | OK |
| Valor 2-1 | Valor 2-2 | Valor 2-3 | WARN |
| Valor 3-1 | Valor 3-2 | Valor 3-3 | ERROR |
:::`;
  const imageTemplate = '![Texto alternativo](url-de-la-imagen)';
  const horizontalRuleTemplate = '---';

  // Templates para bloques temáticos
  const characterStatBlock = `:::panel{title="Estadísticas de Personaje" style="corner-brackets"}
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

  const mapPanel = `:::panel{title="Mapa de la Zona" style="glass-panel"}
### Región de Blackwater

- **Punto de interés:** Las Ruinas Sumergidas
- **Peligro:** Alto (Nivel 5-8)
- **Recompensa:** Artefacto del Culto Profundo
- **Gobernante:** Ninguno (tierra salvaje)

*El acceso más seguro es a través del desfiladero este, pero se requiere equipo de escalada.*
:::`;

  const explorationMatrix = `:::datamatrix{title="Matriz de Exploración" style="cut-corners"}
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
      template: `:::panel{title="Título del Panel" style="cut-corners"}
Contenido...
:::`
    },
    {
      name: 'Panel Soportes de Esquina',
      icon: <PanelTopClose size={16} />,
      template: `:::panel{title="Título del Panel" style="corner-brackets"}
Contenido...
:::`
    },
    {
      name: 'Panel Cristal',
      icon: <Layers size={16} />,
      template: `:::panel{title="Título del Panel" style="glass-panel"}
Este es un panel con efecto de cristal/vidrio.

> "Un efecto visual moderno y translúcido."
:::`
    },
    {
      name: 'Panel Técnico',
      icon: <Square size={16} />,
      template: `:::panel{title="Estado del Sistema" style="tech-corners"}
| Componente | Estado | Notas |
|------------|--------|-------|
| Escudos    | 97%    | Nominal |
| Armas      | 100%   | Online |
| Propulsión | 85%    | Sobrecalentamiento leve |
| Sensores   | 92%    | Interferencia en sector 4 |
:::`
    },
    {
      name: 'Panel Flotante Izquierda',
      icon: <PanelLeft size={16} />,
      template: `:::panel{title="Título del Panel" layout="float-left"}
Este panel flota a la izquierda del texto.

- Permite que el texto fluya a su alrededor
- Ideal para notas o información complementaria
:::`
    },
    {
      name: 'Panel Flotante Derecha',
      icon: <PanelLeft size={16} style={{ transform: 'scaleX(-1)' }} />,
      template: `:::panel{title="Título del Panel" layout="float-right"}
Este panel flota a la derecha del texto.

- Permite que el texto fluya a su alrededor
- Ideal para notas o información complementaria
:::`
    },
    {
      name: 'Panel Centrado',
      icon: <AlignJustify size={16} />,
      template: `:::panel{title="Título del Panel" layout="center"}
Este es un panel centrado de ancho reducido.

Perfecto para destacar información importante en el centro del documento.
:::`
    },
    {
      name: 'Panel Alerta',
      icon: <Square size={16} />,
      template: `:::panel{title='¡ALERTA!' style="glass-panel" class="panel-warning"}
**¡ATENCIÓN!** - Sistema en estado crítico

El sistema reporta fallos múltiples:
- Sobrecalentamiento en el núcleo principal
- Fluctuaciones de energía en el sector 7
- Pérdida de presurización en cubierta 3

Tiempo estimado para fallo catastrófico: 15:00 minutos
:::`
    },
    {
      name: 'Panel Combinado',
      icon: <Layers size={16} />,
      template: `:::panel{title="Título del Panel" style="glass-panel,corner-brackets" layout="float-right"}
Este panel combina múltiples estilos y layouts.

- Efecto de cristal/vidrio
- Soportes en las esquinas
- Flotando a la derecha
:::`
    },
    {
      name: 'Panel Estado Sistema',
      icon: <Square size={16} />,
      template: `:::panel{title="Estado Escudo" style="tech-corners"}
| SECTOR | FRECUENCIA | POTENCIA | NOTAS |
|--------|------------|----------|-------|
| Proa   | 1.21 GHz   | 98%      | Estable |
| Popa   | 1.19 GHz   | 95%      | Fluctuación leve |
| Babor  | 1.20 GHz   | 100%     | Óptimo |
| Estribor | 1.22 GHz | 97%      | Estable |
:::`
    },
    {
      name: 'Panel Esquinas SVG',
      icon: <Square size={16} />,
      template: `:::panel{title="Panel SVG Tech" style="tech-corners"}
Este panel demuestra las esquinas SVG definidas en el CSS para el estilo 'tech-corners'.

- Contenido de ejemplo 1
- Contenido de ejemplo 2
:::`
    },
    {
      name: 'Panel Esquina Personalizada',
      icon: <Image size={16} />,
      template: `:::panel{title="Esquina con Imagen" style="custom-corner"}
Este panel usa la imagen 'corner.png' para sus esquinas.

Recuerda asegurarte de que la imagen exista en '/images/corner.png'.

- Puedes ajustar el tamaño en el CSS (.panel-style--custom-corner).
:::`
    },
    {
      name: 'Panel Holográfico',
      icon: <Square size={16} />,
      template: `:::panel{title="Interfaz Holográfica" style="hologram"}
| SISTEMA | ESTADO | INTEGRIDAD |
|---------|--------|------------|
| Navegación | Operativo | 100% |
| Propulsión | Operativo | 98% |
| Escudos | Alerta | 76% |
| Armas | Offline | 0% |
:::`,
    },
    {
      name: 'Panel Neo-Frame',
      icon: <Square size={16} />,
      template: `:::panel{title="MATRIZ DE ANALÍTICA" style="neo-frame"}
## Informe de Vigilancia

Sistema detecta **anomalía dimensional** en sector 4.7.
Recomendación: Desplegar sondas de reconocimiento.

> Alerta de proximidad: Objeto no identificado en vector Z-19.
:::`,
    }
  ];

  return (
    <div className="toolbar p-2 bg-gray-800 border-b border-gray-700 flex flex-wrap items-center gap-2">
      {/* Botón para modo oscuro/claro */}
      <button 
        className="p-2 hover:bg-gray-700 rounded"
        onClick={onDarkModeToggle}
        title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

      {/* File operations */}
      <button
        className="p-2 hover:bg-gray-700 rounded flex items-center gap-1"
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.md';
          input.onchange = (e) => onFileLoad(e as any);
          input.click();
        }}
        title="Cargar archivo Markdown"
      >
        <FileText size={16} />
      </button>

      <div className="h-6 w-px bg-gray-700 mx-1"></div>

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
      <button className="p-2 hover:bg-gray-700 rounded flex items-center gap-1 border border-gray-600" onClick={() => onApplyStyle(enhancedTableTemplate)} title="Insertar tabla con estilos avanzados">
        <Table size={16} />
        <span className="text-sm">Tabla Avanzada</span>
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

      <button 
        className={`p-2 rounded flex items-center gap-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 bg-blue-800'}`}
        onClick={() => onLoadDemo('panel-showcase-v2.6.md')}
        disabled={isLoading}
        title="Ver Showcase de Paneles V2.6"
      >
        <Layout size={16} />
        <span>Showcase V2.6</span>
      </button>
    </div>
  );
};

export default EnhancedToolbar; 