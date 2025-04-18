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
  CornerDownRight, Moon, Sun, Sparkles,
  LayoutGrid, Columns, SplitSquareVertical
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
      name: 'Panel Dos Columnas RPG',
      icon: <Layout size={16} />,
      template: `:::panel{title="Grimorio Arcano" layout="two-columns" style="glass-panel"}
## Conjuros Elementales

Este antiguo compendio detalla los principios fundamentales de la magia elemental, desarrollados por el Archimago Thaelon durante la Era de las Estrellas.

### Combustión Ígnea

El conjuro más básico del fuego requiere un conocimiento profundo de la naturaleza combustible de la materia. Para iniciar la llama, el lanzador debe visualizar el calor primordial del núcleo del mundo, canalizando esa energía a través de sus manos para manifestar una llama controlada.

> "El fuego es el más temperamental de los elementos, siempre hambriento, siempre buscando crecer. La disciplina del mago es lo único que se interpone entre una llama controlada y un infierno desatado."
> — Extracto del "Codex Flamae"

Los componentes materiales incluyen azufre pulverizado, una astilla de madera de roble y una gota de aceite de lámpara. La duración del efecto depende directamente de la potencia arcana del lanzador y las condiciones ambientales.

### Corrientes Acuáticas

La manipulación del agua requiere una mentalidad flexible y adaptable. El conjuro básico de control acuático permite al lanzador dirigir pequeñas cantidades de agua, desde una simple gota hasta aproximadamente un galón.

Para los hechiceros más avanzados, la capacidad puede extenderse hasta controlar cuerpos enteros de agua, aunque tal hazaña requiere años de estudio y práctica.

* **Nivel de Maestría 1:** Control de gotas y pequeños flujos
* **Nivel de Maestría 3:** Purificación y alteración de estados (hielo/vapor)
* **Nivel de Maestría 5:** Control de corrientes y mareas menores
* **Nivel de Maestría 7:** Dominio completo sobre lagos y ríos pequeños

Las escuelas de Aguamancia de la Costa Azul son reconocidas como las más prestigiosas para el estudio de este elemento.
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
      template: `:::panel{title="Título del Panel" layout="floating-left"}
Este panel flota a la izquierda del texto.

- Permite que el texto fluya a su alrededor
- Ideal para notas o información complementaria
:::`
    },
    {
      name: 'Panel Flotante Derecha',
      icon: <PanelLeft size={16} style={{ transform: 'scaleX(-1)' }} />,
      template: `:::panel{title="Título del Panel" layout="floating-right"}
Este panel flota a la derecha del texto.

- Permite que el texto fluya a su alrededor
- Ideal para notas o información complementaria
:::`
    },
    {
      name: 'Panel Centrado',
      icon: <AlignJustify size={16} />,
      template: `:::panel{title="Título del Panel" layout="centered"}
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
      template: `:::panel{title="Título del Panel" style="glass-panel,corner-brackets" layout="floating-right"}
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

**Sistema de escudos operando a capacidad nominal.**
Estado general: *VERDE*
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
    <div className="toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '8px', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
      <div className="markdown-buttons" style={{ display: 'flex', gap: '4px' }}>
        <button onClick={() => onApplyStyle('**texto**')} title="Negrita" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Bold size={16} />
        </button>
        <button onClick={() => onApplyStyle('*texto*')} title="Cursiva" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Italic size={16} />
        </button>
        <button onClick={() => onInsertBlock(quoteTemplate)} title="Cita" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Quote size={16} />
        </button>
        <button onClick={() => onInsertBlock(codeBlockTemplate)} title="Bloque de código" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Code size={16} />
        </button>
        <button onClick={() => onInsertBlock(tableTemplate)} title="Tabla" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Table size={16} />
        </button>
        <button onClick={() => onInsertBlock(imageTemplate)} title="Imagen" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Image size={16} />
        </button>
        <button onClick={() => onInsertBlock(horizontalRuleTemplate)} title="Línea horizontal" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <AlignJustify size={16} />
        </button>
        <button onClick={() => onApplyStyle('# ')} title="Título 1" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Heading1 size={16} />
        </button>
        <button onClick={() => onApplyStyle('## ')} title="Título 2" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Heading2 size={16} />
        </button>
        <button onClick={() => onApplyStyle('- ')} title="Lista desordenada" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <List size={16} />
        </button>
        <button onClick={() => onApplyStyle('1. ')} title="Lista ordenada" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <ListOrdered size={16} />
        </button>
      </div>

      <div className="relative" style={{ position: 'relative' }}>
        <button
          onClick={() => setPanelMenuOpen(!panelMenuOpen)}
          title="Insertar Panel/Estilo"
          style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
        >
          <LayoutGrid size={16} />
          <span className="text-sm" style={{ fontSize: '0.875rem' }}>Paneles</span>
          {panelMenuOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        {panelMenuOpen && (
          <div
            className="absolute mt-1 w-64 rounded-md shadow-lg bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              zIndex: 50,
              maxHeight: '300px',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-dropdown, var(--bg-secondary))',
              border: '1px solid var(--border-color)',
              borderRadius: '4px',
              marginTop: '4px',
              padding: '4px 0'
            }}
          >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {panelStylesTemplates.map((panel, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onInsertBlock(panel.template);
                    setPanelMenuOpen(false); // Close menu after selection
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-600 hover:text-white"
                  role="menuitem"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    padding: '8px 12px',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  {panel.icon}
                  <span>{panel.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="separator" style={{ width: '1px', backgroundColor: 'var(--border-color)', alignSelf: 'stretch', margin: '0 4px' }}></div>

      <div className="rpg-templates" style={{ display: 'flex', gap: '4px' }}>
         <button onClick={() => onInsertBlock(characterStatBlock)} title="Insertar Bloque Estadísticas Personaje" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
           <User size={16} />
         </button>
         <button onClick={() => onInsertBlock(mapPanel)} title="Insertar Panel Mapa" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
           <Map size={16} />
         </button>
          <button onClick={() => onInsertBlock(explorationMatrix)} title="Insertar Matriz Exploración" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
           <Compass size={16} />
         </button>
      </div>

      <div className="file-buttons" style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
        <input
          type="file"
          id="file-upload"
          accept=".md,.markdown"
          onChange={onFileLoad}
          style={{ display: 'none' }}
        />
        <button onClick={() => document.getElementById('file-upload')?.click()} title="Cargar archivo" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <FileText size={16} />
        </button>
        <button onClick={() => onLoadDemo()} title="Cargar demo" style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
          <Book size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        <button onClick={() => onLoadDemo()} title="Cargar Demo de Paneles" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
          <FileText size={16} />
          <span className="text-sm" style={{ fontSize: '0.875rem' }}>Demo Paneles</span>
        </button>
        <button onClick={() => onLoadDemo('test-esquinas-2.md')} title="Cargar Test Esquinas" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
          <CornerDownRight size={16} />
          <span className="text-sm" style={{ fontSize: '0.875rem' }}>Test Esquinas</span>
        </button>
        <button onClick={() => onLoadDemo('boton-ejemplo.md')} title="Cargar Ejemplo Botones" style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}>
          <Sparkles size={16} />
          <span className="text-sm" style={{ fontSize: '0.875rem' }}>Demo Botones</span>
        </button>
        <button
          type="button"
          onClick={onDarkModeToggle}
          title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          style={{ padding: '4px', borderRadius: '4px', backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', cursor: 'pointer' }}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
};

export default EnhancedToolbar; 