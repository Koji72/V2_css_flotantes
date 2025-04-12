import React, { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownExtension } from '@codemirror/lang-markdown';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useStore } from './store';
import TemplateSelector from './components/TemplateSelector';
import EnhancedToolbar from './components/EnhancedToolbar';
import { processMarkdown } from './utils/markdownProcessor';

const App: React.FC = () => {
  const { markdown, setMarkdown, darkMode, templateId, setDarkMode, setTemplateId } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [css, setCSS] = useState('');
  const editorRef = useRef<any>(null);

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
  const updateIframeContent = async () => {
    if (!iframeRef.current) return;
    
    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) return;
    
    try {
      // Procesar el markdown
      const htmlContent = await processMarkdown(markdown);
      
      // Crear una marca de tiempo para forzar la recarga de CSS (evitar caché)
      const timestamp = new Date().getTime();
      
      // Reiniciar completamente el documento
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html lang="es" ${darkMode ? 'class="dark-mode"' : ''}>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Preview</title>
            <style id="template-styles" data-template="${templateId}" data-timestamp="${timestamp}">
              ${css}
            </style>
            <style id="fallback-styles">
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
              .float-left, .layout--float-left {
                float: left;
                margin-right: 20px;
                margin-bottom: 20px;
                width: 45%;
                clear: left;
                background-color: rgba(40, 40, 50, 0.7) !important;
                border: 1px solid #444 !important;
              }
              
              .float-right, .layout--float-right {
                float: right;
                margin-left: 20px;
                margin-bottom: 20px;
                width: 45%;
                clear: right;
                background-color: rgba(40, 40, 50, 0.7) !important;
                border: 1px solid #444 !important;
              }

              /* Estilos para los nuevos tipos de panel */
              .panel-style--cut-corners {
                clip-path: polygon(
                  15px 0%, 
                  calc(100% - 15px) 0%, 
                  100% 15px, 
                  100% calc(100% - 15px), 
                  calc(100% - 15px) 100%, 
                  15px 100%, 
                  0% calc(100% - 15px), 
                  0% 15px
                );
              }

              .panel-style--corner-brackets {
                position: relative;
                border: none !important;
                padding: 1rem;
                background-color: rgba(30, 30, 40, 0.85) !important;
                border: 1px solid #666 !important;
              }

              .panel-style--corner-brackets::before,
              .panel-style--corner-brackets::after {
                content: '';
                position: absolute;
                width: 20px;
                height: 20px;
                border-style: solid;
                border-color: #888;
              }

              .panel-style--corner-brackets::before {
                top: 5px;
                left: 5px;
                border-width: 2px 0 0 2px;
              }

              .panel-style--corner-brackets::after {
                top: 5px;
                right: 5px;
                border-width: 2px 2px 0 0;
              }

              .panel-style--glass-panel {
                background-color: rgba(20, 20, 30, 0.6) !important;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(100, 100, 150, 0.4) !important;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2) !important;
              }

              .layout--center {
                margin-left: auto;
                margin-right: auto;
                width: 75%;
                clear: both;
                display: block;
              }

              .layout--narrow {
                width: 33%;
                margin-left: auto;
                margin-right: auto;
                clear: both;
                display: block;
              }

              .layout--full-width {
                width: 100%;
                clear: both;
                margin-bottom: 1.5rem;
              }

              /* Responsive design para los layouts */
              @media (max-width: 768px) {
                .float-left, .float-right,
                .layout--float-left, .layout--float-right,
                .layout--center, .layout--narrow {
                  float: none;
                  width: 100%;
                  margin-left: 0;
                  margin-right: 0;
                }
              }
            </style>
          </head>
          <body class="template-${templateId}">
            <div class="markdown-content">
              ${htmlContent}
            </div>
            <script>
              console.log('Iframe cargado con template: ${templateId}');
              document.addEventListener('DOMContentLoaded', function() {
                // Verificar que los estilos se han aplicado
                const styles = document.getElementById('template-styles');
                if (styles) {
                  console.log('Template CSS aplicado:', styles.innerHTML.length, 'caracteres');
                } else {
                  console.error('No se encontró el elemento template-styles');
                }
              });
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
    } catch (error: any) {
      console.error("Error al procesar el markdown:", error);
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Error</title>
            </head>
            <body>
              <div style="color: red;">Error al procesar el markdown: ${error.message || 'Error desconocido'}</div>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  };

  // Cargar CSS del template
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        const origin = window.location.origin;
        const templateUrl = `${origin}/templates/${templateId}.css`;
        console.log(`Intentando cargar template desde: ${templateUrl}`);
        
        // Intentar cargar el template
        const response = await fetch(templateUrl);
        
        if (!response.ok) {
          console.error(`Error cargando template ${templateId}:`, 
            `Status: ${response.status}`, 
            `StatusText: ${response.statusText}`);
          throw new Error(`Template not found: ${templateId}`);
        }
        
        const cssContent = await response.text();
        console.log(`Template ${templateId} cargado con éxito:`, 
          `Longitud: ${cssContent.length} caracteres`,
          `Primeros 100 caracteres: ${cssContent.substring(0, 100)}...`);
        
        // Verificar si el contenido es válido
        if (!cssContent || cssContent.trim().length === 0) {
          console.error(`El template ${templateId} está vacío!`);
          throw new Error(`Template is empty: ${templateId}`);
        }
        
        setCSS(cssContent);
      } catch (error) {
        console.error('Error loading template:', error);
        // Cargar template por defecto en caso de error
        try {
          const origin = window.location.origin;
          const defaultUrl = `${origin}/templates/default.css`;
          console.log(`Intentando cargar template default desde: ${defaultUrl}`);
          
          const response = await fetch(defaultUrl);
          if (!response.ok) {
            throw new Error(`Default template not found: ${response.statusText}`);
          }
          
          const cssContent = await response.text();
          
          if (!cssContent || cssContent.trim().length === 0) {
            console.error(`El template default está vacío!`);
            throw new Error(`Default template is empty`);
          }
          
          setCSS(cssContent);
          console.log('Template default cargado como fallback');
        } catch (fallbackError) {
          console.error('Error loading default template:', fallbackError);
          // Si todo falla, aplicar un CSS básico
          console.log('Aplicando CSS básico como último recurso');
          setCSS(`
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6;
              color: #e0e0e0;
              background-color: #1a1a1a;
              padding: 20px;
            }
            h1, h2, h3 { color: #ffffff; }
            p { margin-bottom: 1rem; }
            pre { background-color: #333; padding: 1rem; border-radius: 4px; }
            code { font-family: monospace; }
            .mixed-panel { 
              border: 1px solid #444;
              margin: 1rem 0;
              padding: 1rem;
              background-color: rgba(40, 40, 50, 0.7);
            }
            .panel-header {
              font-weight: bold;
              margin-bottom: 0.5rem;
              border-bottom: 1px solid #666;
              padding-bottom: 0.5rem;
            }
          `);
        }
      }
    };
    
    loadTemplate();
  }, [templateId]);

  // Actualizar iframe cuando cambia el markdown o el CSS
  useEffect(() => {
    console.log("Actualizando iframe debido a cambios en markdown, css, darkMode o templateId");
    console.log(`- CSS length: ${css.length} caracteres`);
    console.log(`- Template actual: ${templateId}`);
    console.log(`- Modo oscuro: ${darkMode ? 'activado' : 'desactivado'}`);
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

  // Función para cargar el demo
  const handleLoadDemo = async (demoFile: string = 'panel-styles-demo.md') => {
    try {
      setIsLoading(true);
      console.log(`Cargando demo: ${demoFile}`);
      
      const response = await fetch(`/demos/${demoFile}`);
      if (!response.ok) {
        throw new Error(`Error al cargar el demo. Status: ${response.status}`);
      }
      
      const demoContent = await response.text();
      setMarkdown(demoContent);
      
      // Si es el demo de RPG Fantasy, cargamos ese template
      if (demoFile === 'rpg_fantasy_demo.md') {
        console.log('Cargando template RPG Fantasy...');
        setTemplateId('rpg_fantasy');
      }
      
      console.log('Demo cargado exitosamente');
    } catch (error) {
      console.error('Error al cargar el demo:', error);
      // Intentar cargar un demo alternativo si el solicitado no se encuentra
      if (demoFile !== 'floating_blocks_demo.md' && demoFile !== 'panel-styles-demo.md') {
        console.log('Intentando cargar demo alternativo...');
        handleLoadDemo('panel-styles-demo.md');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para aplicar estilos al texto seleccionado
  const handleApplyStyle = (style: string) => {
    const editor = editorRef.current?.view;
    if (!editor) return;

    const selection = editor.state.selection.main;
    const selectedText = editor.state.sliceDoc(selection.from, selection.to);
    
    let newText = '';
    if (selectedText) {
      // Si hay texto seleccionado
      if (style === '**' || style === '*' || style === '`') {
        // Para negrita, cursiva y código inline
        newText = `${style}${selectedText}${style}`;
      } else {
        // Para listas, citas y encabezados
        newText = `${style}${selectedText}`;
      }
    } else {
      // Si no hay texto seleccionado
      if (style === '**' || style === '*' || style === '`') {
        newText = `${style}texto${style}`;
        // Posicionar el cursor dentro de los marcadores
        setTimeout(() => {
          const pos = editor.state.selection.main.from + style.length;
          editor.dispatch({
            selection: { anchor: pos, head: pos + 4 }
          });
        }, 0);
      } else {
        newText = style;
      }
    }

    editor.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: newText
      }
    });
  };

  // Función para insertar bloques
  const handleInsertBlock = (block: string) => {
    const editor = editorRef.current?.view;
    if (!editor) return;

    const pos = editor.state.selection.main.from;
    const lineStart = editor.state.doc.lineAt(pos).from;
    
    // Asegurarse de que hay una línea en blanco antes del bloque
    const textBefore = editor.state.sliceDoc(Math.max(0, lineStart - 1), lineStart);
    const prefix = textBefore.trim() === '' ? '' : '\n';
    
    editor.dispatch({
      changes: {
        from: pos,
        insert: `${prefix}${block}\n`
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Editor de Crónicas</h1>
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

      <EnhancedToolbar
        onApplyStyle={handleApplyStyle}
        onInsertBlock={handleInsertBlock}
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

      <div className="flex-1 flex">
        <div className="w-1/2 border-r border-gray-700">
          <CodeMirror
            ref={editorRef}
            value={markdown}
            height="100%"
            theme={vscodeDark}
            extensions={[markdownExtension()]}
            onChange={(value) => setMarkdown(value)}
            className="h-full"
          />
        </div>
        <div className="w-1/2 bg-gray-800">
          <iframe
            ref={iframeRef}
            className="w-full h-full"
            title="preview"
          />
        </div>
      </div>
    </div>
  );
};

export default App;