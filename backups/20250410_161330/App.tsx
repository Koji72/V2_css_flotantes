import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownExtension } from '@codemirror/lang-markdown';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useStore } from './store';
import TemplateSelector from './components/TemplateSelector';
import Toolbar from './components/Toolbar';
import markdownProcessor from './utils/markdownProcessor';

const App: React.FC = () => {
  const { markdown, setMarkdown, darkMode, templateId, setDarkMode, setTemplateId } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [css, setCSS] = useState('');

  useEffect(() => {
    // Cargar markdown de ejemplo si no hay ninguno
    if (!markdown) {
      setMarkdown(`# Bienvenido al Editor Markdown

Escribe o carga contenido markdown para verlo renderizado aquí.

## Bloques especiales

Puedes usar bloques especiales como estos:

:::panel Título del Panel
Contenido del panel.
:::

O bloques flotantes:

:::panel float-left Panel Flotante Izquierda
Este panel flota a la izquierda.
:::

:::panel float-right Panel Flotante Derecha
Este panel flota a la derecha.
:::
`);
    }
  }, []);

  // Aplicar cambios al iframe
  const updateIframeContent = () => {
    if (!iframeRef.current) return;
    
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;
    
    // Procesar el markdown
    const htmlContent = markdownProcessor.processMarkdown(markdown);
    
    // Reiniciar completamente el documento
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Markdown Preview</title>
          <style>
            ${css}
          </style>
          <style>
            /* Estilos base - Se aplicarán si los estilos del template fallan */
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              padding: 20px;
              color: #e0e0e0 !important; /* Texto claro para contraste */
              background-color: #1a1a1a !important; /* Fondo oscuro */
              min-height: 100vh;
              margin: 0;
            }

            /* Forzar colores para evitar texto invisible */
            h1, h2, h3, h4, h5, h6 {
              color: #ffffff !important;
            }
            
            p, li, td, th {
              color: #e0e0e0 !important;
            }
            
            /* Estilos adicionales para los bloques flotantes */
            .float-left {
              float: left;
              margin-right: 20px;
              margin-bottom: 20px;
              width: 45%;
              clear: left;
              background-color: rgba(40, 40, 50, 0.7) !important;
              border: 1px solid #444 !important;
            }
            
            .float-right {
              float: right;
              margin-left: 20px;
              margin-bottom: 20px;
              width: 45%;
              clear: right;
              background-color: rgba(40, 40, 50, 0.7) !important;
              border: 1px solid #444 !important;
            }
            
            .universal-scribe-output {
              max-width: 100%;
              overflow-x: auto;
            }
            
            /* Asegurar que los elementos no se desborden */
            img {
              max-width: 100%;
              height: auto;
            }
            
            pre {
              white-space: pre-wrap;
              word-wrap: break-word;
              max-width: 100%;
              overflow-x: auto;
              background-color: #222 !important;
              padding: 10px !important;
              border-radius: 4px !important;
            }
            
            table {
              border-collapse: collapse;
              width: 100%;
              margin-bottom: 20px;
              border: 1px solid #444 !important;
            }
            
            th, td {
              border: 1px solid #444 !important;
              padding: 8px;
              text-align: left;
            }
            
            th {
              background-color: #333 !important;
            }
            
            .mixed-panel {
              background-color: rgba(40, 40, 50, 0.7) !important;
              border: 1px solid #444 !important;
              padding: 10px !important;
              margin: 10px 0 !important;
              border-radius: 4px !important;
            }
            
            .panel-header {
              background-color: #333 !important;
              color: #fff !important;
              padding: 8px !important;
              font-weight: bold !important;
              border-bottom: 1px solid #444 !important;
              margin-bottom: 10px !important;
            }
          </style>
        </head>
        <body class="${darkMode ? 'dark-mode' : ''} template-${templateId}">
          <div class="universal-scribe-output">${htmlContent}</div>
        </body>
      </html>
    `);
    iframeDoc.close();
    
    console.log('Iframe actualizado con éxito');
  };

  // Cargar CSS del template
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        console.log(`Cargando template: ${templateId}`);
        const response = await fetch(`/templates/${templateId}.css`);
        if (!response.ok) throw new Error(`Template not found: ${templateId}`);
        const cssContent = await response.text();
        setCSS(cssContent);
        console.log(`Template ${templateId} cargado con éxito`);
      } catch (error) {
        console.error('Error loading template:', error);
        // Cargar template por defecto en caso de error
        try {
          const response = await fetch('/templates/default.css');
          const cssContent = await response.text();
          setCSS(cssContent);
          console.log('Template default cargado como fallback');
        } catch (fallbackError) {
          console.error('Error loading default template:', fallbackError);
        }
      }
    };
    
    loadTemplate();
  }, [templateId]);

  // Actualizar iframe cuando cambia el markdown o el CSS
  useEffect(() => {
    updateIframeContent();
  }, [markdown, css, darkMode, templateId]);

  // Manejar carga de archivos
  const handleFileLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const content = await file.text();
      setMarkdown(content);
    } catch (error) {
      console.error('Error loading file:', error);
    }
  };

  // Manejar carga de demo
  const handleLoadDemo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/demos/demo.md');
      if (!response.ok) throw new Error('Demo not found');
      const content = await response.text();
      setMarkdown(content);
    } catch (error) {
      console.error('Error loading demo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Markdown Editor</h1>
        <div className="flex items-center gap-4">
          <TemplateSelector />
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <Toolbar
        onApplyStyle={(style) => {
          const newMarkdown = markdown + '\n' + style;
          setMarkdown(newMarkdown);
        }}
        onInsertBlock={(block) => {
          const newMarkdown = markdown + '\n\n' + block;
          setMarkdown(newMarkdown);
        }}
        onLoadMarkdown={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.md';
          input.onchange = (e) => handleFileLoad(e as any);
          input.click();
        }}
        onLoadDemo={handleLoadDemo}
        isLoading={isLoading}
      />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-4 border-r border-gray-700">
          <CodeMirror
            value={markdown}
            onChange={setMarkdown}
            extensions={[markdownExtension()]}
            theme={vscodeDark}
            height="100%"
          />
        </div>
        <div className="w-1/2 p-4">
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            sandbox="allow-same-origin"
          />
        </div>
      </div>
    </div>
  );
};

export default App;