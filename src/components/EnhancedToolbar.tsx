import React, { useState } from 'react';
import { Bold, Italic, List, ListOrdered, Quote, Code, Table, Image, FileText, AlignJustify, Heading1, Heading2, User, Map, Compass, Book, CornerDownRight, Moon, Sun, Sparkles } from 'lucide-react';

interface ToolbarProps {
  onApplyStyle?: (style: string) => void;
  onInsertBlock?: (block: string) => void;
  onLoadDemo: (demoFile?: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onFileLoad: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

const EnhancedToolbar: React.FC<ToolbarProps> = ({
  onApplyStyle = () => {},
  onInsertBlock = () => {},
  onLoadDemo,
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
  const imageTemplate = '![Texto alternativo](url-de-la-imagen)';
  const horizontalRuleTemplate = '---';

  // Templates para bloques temáticos
  const characterStatBlock = `:::panel{title="Estadísticas de Personaje" style="corner-brackets"}\n### Jade Steelheart\n\n| Atributo | Valor | Bono |\n|----------|-------|------|\n| Fuerza   | 16    | +3   |\n| Destreza | 14    | +2   |\n| Intelecto| 18    | +4   |\n\n**Habilidades:**\n- Sigilo: +5\n- Percepción: +6\n- Arcanos: +8\n:::`;

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
  const panelStylesTemplates: any[] = [];

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