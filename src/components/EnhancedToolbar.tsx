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
      name: 'Panel Dos Columnas RPG',
      icon: <Layout size={16} />,
      template: `:::panel{title="Grimorio Arcano" layout="two-columns" style="glass"}
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

      {/* Botón de división en dos columnas */}
      <button 
        className="p-2 hover:bg-indigo-600 bg-indigo-700 rounded flex items-center gap-1 border border-indigo-500 text-white" 
        onClick={() => onApplyStyle(`:::panel{layout="two-columns" title="Título Opcional"}
## Contenido en Dos Columnas

Este panel organiza automáticamente el contenido en dos columnas al estilo de los libros RPG. Es perfecto para:

- Presentar información en formato de manual
- Crear fichas de referencia
- Mejorar la legibilidad de textos largos

### Primera Sección

El contenido fluye de arriba a abajo y luego continúa en la siguiente columna, similar a un periódico o libro. Los encabezados y otros elementos estructurales se mantienen en una sola columna para mejor legibilidad.

### Segunda Sección

Puedes añadir todo tipo de contenido markdown incluyendo **negritas**, *cursivas*, [enlaces](http://ejemplo.com), imágenes, listas y mucho más.

> Las citas y bloques también se adaptan al formato de columnas.

La primera letra del primer párrafo tiene un estilo capital para darle un aspecto más profesional, similar a los libros clásicos y manuales de rol.
:::`)} 
        title="Insertar división de dos columnas (estilo libro)"
      >
        <Columns size={16} />
        <span className="text-sm">Dos Columnas</span>
      </button>
      
      {/* Botón de división en dos columnas simple */}
      <button 
        className="p-2 hover:bg-gray-600 bg-gray-700 rounded flex items-center gap-1 border border-gray-500 ml-1" 
        onClick={() => onApplyStyle(`:::panel{layout="two-columns" style="glass" title=""}
### Columna Izquierda

Aquí va el contenido de la primera columna. Este texto fluirá de arriba a abajo antes de continuar en la siguiente columna.

Puedes incluir listas:
- Elemento 1
- Elemento 2
- Elemento 3

### Columna Derecha

Y aquí va el contenido de la segunda columna. Esta disposición es ideal para crear presentaciones tipo manual o libro.

También puedes incluir tablas o cualquier otro elemento markdown válido.
:::`)} 
        title="Insertar división de dos columnas simple"
      >
        <Columns size={16} />
        <span className="text-sm">Columnas Simple</span>
      </button>

      {/* Botón de columnas separadas */}
      <button 
        className="p-2 hover:bg-green-600 bg-green-700 rounded flex items-center gap-1 border border-green-500 ml-1 text-white" 
        onClick={() => onApplyStyle(`:::panel{layout="split-columns" style="glass" title="Panel de Dos Columnas"}
<div class="column column-left">
### Columna Izquierda

Aquí va el contenido de la columna izquierda. Este contenido permanece completamente en la columna izquierda:

- No fluye hacia la columna derecha
- Es independiente de la otra columna
- Ideal para comparaciones directas

Puedes agregar cualquier tipo de contenido markdown aquí, como listas, tablas, citas e incluso código. Las columnas tienen su propio espacio y se formatean de manera independiente.
</div>

<div class="column column-right">
### Columna Derecha

Aquí va el contenido de la columna derecha. Este contenido permanece completamente en la columna derecha:

1. Es independiente de la columna izquierda
2. No es continuación del contenido de la izquierda
3. Ambas columnas son completamente independientes

Este diseño es perfecto para presentar información paralela o elementos que deben compararse directamente.
</div>
:::`)} 
        title="Insertar panel con columnas izquierda y derecha independientes"
      >
        <Layout size={16} />
        <span className="text-sm">Columnas Separadas</span>
      </button>

      {/* Botón de comparativa */}
      <button 
        className="p-2 hover:bg-purple-600 bg-purple-700 rounded flex items-center gap-1 border border-purple-500 ml-1 text-white" 
        onClick={() => onApplyStyle(`:::panel{layout="split-columns" style="tech-corners" title="Comparativa"}
<div class="column column-left">
### Opción A

**Descripción:**
Breve descripción de la primera opción o elemento que se está comparando.

**Características principales:**
- Característica 1
- Característica 2
- Característica 3
- Característica 4

**Ventajas:**
- Ventaja 1
- Ventaja 2
- Ventaja 3

**Desventajas:**
- Desventaja 1
- Desventaja 2
</div>

<div class="column column-right">
### Opción B

**Descripción:**
Breve descripción de la segunda opción o elemento que se está comparando.

**Características principales:**
- Característica 1
- Característica 2
- Característica 3
- Característica 4

**Ventajas:**
- Ventaja 1
- Ventaja 2
- Ventaja 3

**Desventajas:**
- Desventaja 1
- Desventaja 2
</div>
:::`)} 
        title="Insertar plantilla de comparativa"
      >
        <SplitSquareVertical size={16} />
        <span className="text-sm">Comparativa</span>
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

      <div className="flex-grow"></div>

      {/* Controles de carga */}
      <button 
        className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 flex items-center gap-2" 
        onClick={onLoadMarkdown}
      >
        <FileText size={16} />
        <span className="text-sm">Cargar MD</span>
      </button>

      <div className="flex items-center border-l border-gray-700 ml-2 pl-2">
        <button 
          className={`p-2 rounded flex items-center gap-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 bg-blue-800'}`}
          onClick={() => onLoadDemo('panel-showcase-v2.6.md')}
          disabled={isLoading}
          title="Ver Showcase de Paneles V2.6 (Estilos Originales)"
        >
          <Layout size={16} />
          <span className="text-sm">Showcase Original</span>
        </button>

        <button 
          className={`p-2 rounded flex items-center gap-1 ml-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-700 bg-purple-600'}`}
          onClick={() => onLoadDemo('panel-showcase-v2.6-impact.md')}
          disabled={isLoading}
          title="Ver Showcase de Paneles V2.6 (Estilos Impactantes)"
          style={{ fontWeight: 'bold' }}
        >
          <Sparkles size={16} />
          <span className="text-sm">Showcase Impacto</span>
        </button>

        <button
          className="p-2 rounded flex items-center gap-1"
          onClick={() => onLoadDemo('panel-showcase-v2.6.md')}
          disabled={isLoading}
          title="Ver demostración de paneles v2.6"
        >
          <Layers size={16} />
          <span>Showcase V2.6</span>
        </button>
        
        <button
          className="p-2 rounded flex items-center gap-1"
          onClick={() => onLoadDemo('flotantes-demo.md')}
          disabled={isLoading}
          title="Ver demostración de elementos flotantes"
        >
          <PanelLeft size={16} />
          <span>Demo Flotantes</span>
        </button>

        <button
          className="p-2 rounded flex items-center gap-1"
          onClick={() => onLoadDemo('rpg-columns-demo.md')}
          disabled={isLoading}
          title="Ver demostración de paneles estilo RPG con dos columnas"
        >
          <Columns size={16} />
          <span>Demo RPG</span>
        </button>

        <button
          className="p-2 rounded flex items-center gap-1"
          onClick={() => onLoadDemo('split-columns-demo.md')}
          disabled={isLoading}
          title="Ver demostración de paneles con columnas separadas"
        >
          <Layout size={16} />
          <span>Demo Columnas Sep.</span>
        </button>

        <button
          className="p-2 rounded flex items-center gap-1"
          onClick={() => onLoadDemo('comparativas-demo.md')}
          disabled={isLoading}
          title="Ver ejemplos de comparativas con columnas separadas"
        >
          <SplitSquareVertical size={16} />
          <span>Demo Comparativas</span>
        </button>
      </div>

      <button 
        className={`p-2 rounded ml-2 ${darkMode ? 'bg-yellow-600 hover:bg-yellow-500' : 'bg-indigo-800 hover:bg-indigo-700'}`}
        onClick={onDarkModeToggle}
        title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
      </button>
    </div>
  );
};

export default EnhancedToolbar; 