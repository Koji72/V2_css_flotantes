import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkDirective from 'remark-directive';
// Importar los plugins que queremos probar JUNTOS
import remarkCustomPanels from '../utils/remarkCustomPanels'; 
import remarkCornerDirectives from '../utils/remarkCornerDirectives';
import remarkEnsureDirectiveBrackets from '../utils/remarkEnsureDirectiveBrackets';
// Podríamos necesitar importar otros si son dependencias, pero empezamos simple

// Estilos básicos inline para separación
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as 'column', // Asegurar tipo para TS
    height: '100vh',
    padding: '20px',
    boxSizing: 'border-box' as 'border-box',
    backgroundColor: '#282c34', // Fondo oscuro simple para el tester
    color: '#ffffff' // Color base del texto para el contenedor del tester
  },
  editor: {
    width: '100%',
    height: '40vh',
    marginBottom: '20px',
    fontFamily: 'monospace',
    fontSize: '14px',
    backgroundColor: '#1e1e1e',
    color: '#d4d4d4',
    border: '1px solid #555'
  },
  preview: {
    flexGrow: 1,
    overflowY: 'auto' as 'auto',
    border: '1px dashed #777',
    padding: '15px',
    backgroundColor: '#111111', // Fondo más oscuro
    color: '#ffffff' // Texto blanco puro
  }
};

// Plantilla inicial de prueba (Sintaxis funcional encontrada)
const initialTestMarkdown = `# Panel con Esquinas (Tester)

:::panel{title="Panel de Prueba"}
Contenido del panel.

::corner{pos=bottom-right type=stripes}


::corner{pos=top-left type=stripes}


Más contenido.
:::
`;

const DirectiveTester: React.FC = () => {
  const [testContent, setTestContent] = useState<string>(initialTestMarkdown);

  // --- Configuración Experimental de Plugins --- 
  // Aquí combinamos los plugins como queremos que funcionen
  const experimentalRemarkPlugins = [
    remarkGfm,
    remarkEnsureDirectiveBrackets,
    remarkDirective,
    remarkCustomPanels,     // Procesar paneles PRIMERO
    remarkCornerDirectives, // Procesar esquinas DESPUÉS
    // Añadir otros si es necesario, ej. remarkGithubBetaBlockquoteAdmonitions
  ];

  const experimentalRehypePlugins = [
    rehypeRaw,
    // Si tuviera opciones, sería [rehypeRaw, {opciones...}]
    // Para rehypeRaw, las opciones suelen pasarse en el segundo elemento de la tupla si es necesario,
    // pero react-markdown a menudo maneja la configuración { passThrough: ... } internamente
    // o espera un formato específico. Vamos a probar solo con rehypeRaw por simplicidad inicial.
    // Si necesitamos passThrough, lo añadiremos como [rehypeRaw, { passThrough: ... }] 
  ];

  return (
    <div style={styles.container}>
      <h1>🧪 Directive Tester</h1>
      <p>Pega aquí el Markdown para probar la interacción de directivas:</p>
      <textarea
        style={styles.editor}
        value={testContent}
        onChange={(e) => setTestContent(e.target.value)}
        placeholder="Escribe Markdown aquí..."
      />
      <h2>Vista Previa (Configuración Experimental):</h2>
      <div style={styles.preview} className="directive-tester-preview">
        <ReactMarkdown
          remarkPlugins={experimentalRemarkPlugins}
          rehypePlugins={experimentalRehypePlugins}
          // No añadimos componentes complejos aquí por ahora
        >
          {testContent}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default DirectiveTester; 