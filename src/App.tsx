import React, { useEffect, useRef, useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownExtension } from '@codemirror/lang-markdown';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useStore } from './store';
import TemplateSelector from './components/TemplateSelector';
import EnhancedToolbar from './components/EnhancedToolbar';
import { processContent } from './core/processing/pipeline';
import './App.css'; // Importar estilos CSS
import './styles/floating-blocks.css';
import '../public/templates/aegis-tactical-interface-v2.5.css';

const App: React.FC = () => {
  const { markdown, setMarkdown, darkMode, templateId, setDarkMode, setTemplateId } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [css, setCSS] = useState('');
  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewManager = useRef<any>(null);

  useEffect(() => {
    // Cargar markdown de ejemplo si no hay ninguno
    if (!markdown) {
      // Cargar directamente el demo Aegis
      handleLoadDemo('aegis-marquesinas-demo.md');
    }
  }, [markdown]);

  // Aplicar cambios al iframe
  const updateIframeContent = async () => {
    if (!iframeRef.current) return;
    console.log('\n[App] 📝 UPDATE IFRAME CONTENT');
    console.log('[App] Raw markdown content:', {
      length: markdown?.length || 0,
      isEmpty: !markdown,
      isString: typeof markdown === 'string',
      preview: markdown?.substring(0, 100),
      fullContent: markdown // Temporal para debug
    });

    const iframeDoc = iframeRef.current.contentDocument;
    if (!iframeDoc) {
        console.error('[App] ❌ Iframe document not found!');
        return;
    }

    try {
      console.log('[App] 🚀 Calling processContent pipeline...');
      // Procesar el markdown usando el NUEVO PIPELINE
      const result = await processContent(markdown);
      console.log('[App] processContent pipeline finished. HTML length:', result?.html?.length);
      console.log('[App] First 100 chars of processed HTML:', result?.html?.substring(0, 100));

      // Registrar errores del pipeline si los hubo
      if (result.errors && result.errors.length > 0) {
          console.warn('[App] Pipeline reported errors:', result.errors);
      }

      const htmlContent = result.html;
      const timestamp = new Date().getTime();

      // Escribir en el iframe (sin cambios aquí)
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
                /* Colores base condicionales (Light/Dark Mode) */
                color: ${darkMode ? '#e0e0e0' : '#333333'}; 
                background-color: ${darkMode ? '#1a1a1a' : '#ffffff'};
                min-height: 100vh;
                margin: 0;
              }

              /* Forzar colores para evitar texto invisible */
              h1, h2, h3, h4, h5, h6 {
                /* Usar un color ligeramente más brillante/oscuro que el texto base */
                color: ${darkMode ? '#ffffff' : '#111111'};
              }
              
              p, li, td, th {
                 /* Heredará el color del body por defecto, no necesita forzarse usualmente */
                 /* color: ${darkMode ? '#e0e0e0' : '#333333'}; */
              }
              
              /* Estilos adicionales para los bloques flotantes */
              .float-left, .layout--float-left {
                float: left;
                margin-right: 20px;
                margin-bottom: 20px;
                width: 45%;
                clear: left;
                background-color: rgba(40, 40, 50, 0.7);
                border: 1px solid #444;
              }
              
              .float-right, .layout--float-right {
                float: right;
                margin-left: 20px;
                margin-bottom: 20px;
                width: 45%;
                clear: right;
                background-color: rgba(40, 40, 50, 0.7);
                border: 1px solid #444;
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
                border: none;
                padding: 1rem;
                background-color: rgba(30, 30, 40, 0.85);
                border: 1px solid #666;
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
                background-color: rgba(20, 20, 30, 0.6);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(100, 100, 150, 0.4);
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
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
              console.log('[IFrame] Iframe loaded with template: ${templateId}');
              document.addEventListener('DOMContentLoaded', function() {
                const styles = document.getElementById('template-styles');
                if (styles) {
                  console.log('[IFrame] Template CSS applied:', styles.innerHTML.length, 'chars');
                } else {
                  console.error('[IFrame] Template styles element not found!');
                }
              });
            </script>
          </body>
        </html>
      `);
      iframeDoc.close();
      console.log('[App] Iframe content updated successfully.');

    } catch (error: any) {
      console.error("[App] CRITICAL Error during updateIframeContent (after pipeline call?):", error);
      // Manejo de errores crítico
      if (iframeDoc) {
        try {
            iframeDoc.open();
            iframeDoc.write(`<h2>Error updating preview</h2><pre>${error.message}</pre>`);
            iframeDoc.close();
        } catch (displayError) {
            console.error("[App] Failed to display error in iframe:", displayError);
        }
      }
    }
  };

  // Carga inicial del CSS
  useEffect(() => {
    const loadTemplate = async () => {
      try {
        // Intentar cargar el template directamente
        const templateUrl = `/templates/${templateId}.css`;
        console.log(`[App] Cargando template desde: ${templateUrl}`);
        
        const response = await fetch(templateUrl);
        if (!response.ok) {
          throw new Error(`Error al cargar CSS: ${response.statusText}`);
        }
        
        const cssText = await response.text();
        setCSS(cssText);
        
        // Cargar también los estilos mejorados para paneles v2.6
        try {
          const enhancementResponse = await fetch('/styles/panel-enhancement-v2.6.css');
          if (enhancementResponse.ok) {
            const enhancementCssText = await enhancementResponse.text();
            // Agregar los estilos de mejora al CSS principal
            setCSS(prevCss => prevCss + '\n\n/* Panel Enhancements v2.6 */\n' + enhancementCssText);
            console.log("[App] Estilos mejorados de paneles v2.6 cargados correctamente");
          }
        } catch (enhancementError) {
          console.warn("[App] No se pudieron cargar las mejoras de panel v2.6:", enhancementError);
        }
        
      } catch (error) {
        console.error(`[App] Error al cargar template: ${error}`);
        setCSS(''); // Resetear CSS en caso de error
      }
    };
    
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  // Actualizar iframe cuando cambia el markdown o el CSS
  useEffect(() => {
    console.log("[App] useEffect triggered for markdown/css change. Updating iframe...");
    console.log(`- CSS length: ${css.length} caracteres`);
    console.log(`- Template actual: ${templateId}`);
    console.log(`- Modo oscuro: ${darkMode ? 'activado' : 'desactivado'}`);
    updateIframeContent();
  }, [markdown, css, darkMode]);

  // Manejar carga de archivos
  const handleFileLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setMarkdown(text);
          setIsLoading(false);
        };
        reader.onerror = (e) => {
          console.error("Error leyendo archivo:", e);
          setMarkdown("# Error al cargar el archivo");
          setIsLoading(false);
        };
        reader.readAsText(file);
      } catch (error) {
        console.error("Error procesando archivo:", error);
        setMarkdown("# Error crítico al procesar el archivo");
        setIsLoading(false);
      }
    }
  };

  // Función para cargar el demo
  const handleLoadDemo = async (demoFile: string = 'panel-styles-demo.md') => {
    setIsLoading(true);
    console.log(`Cargando demo: ${demoFile}`);
    try {
      const response = await fetch(`./demos/${demoFile}`);
      if (!response.ok) {
        throw new Error(`Demo file not found: ${demoFile}`);
      }
      const demoMarkdown = await response.text();
      setMarkdown(demoMarkdown);
      console.log(`Demo ${demoFile} cargado exitosamente`);
    } catch (error: any) {
      console.error("Error cargando demo:", error);
      setMarkdown(`# Error cargando demo\n\n${error.message}`); 
    } finally {
      setIsLoading(false);
    }
  };

  // Inicializar iframe
  useEffect(() => {
    if (previewRef.current) {
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      
      const baseHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <base target="_blank">
            <style id="base-styles">
              body { 
                margin: 0; 
                padding: 10px; 
                font-family: Arial, sans-serif;
                color: #333;
                background-color: #fff;
              }
              #content {
                min-height: 100%;
              }
            </style>
            <style id="custom-theme-style"></style>
          </head>
          <body>
            <div id="content"></div>
          </body>
        </html>
      `;
      
      iframe.srcdoc = baseHtml;
      previewRef.current.appendChild(iframe);
    }
  }, []);

  // Insertar markdown cuando se hace clic en un botón
  const insertMarkdown = (template: string) => {
    console.log("insertMarkdown llamado con:", template);
    
    if (!editorRef.current) {
      console.error("editorRef.current es null o undefined");
      return;
    }
    
    // Obtener la vista del editor de CodeMirror
    const editor = editorRef.current.view;
    if (!editor) {
      console.error("editor.view es null o undefined");
      return;
    }
    
    try {
      // Crear una transacción para insertar el texto
      editor.dispatch({
        changes: {
          from: editor.state.selection.main.from,
          to: editor.state.selection.main.to,
          insert: template
        }
      });
      
      // Enfocar el editor
      editor.focus();
      
      // Forzar actualización de la vista previa después de la inserción
      setTimeout(() => {
        setMarkdown(editor.state.doc.toString()); // Actualiza con el valor actual
      }, 50);
      
      console.log("Markdown insertado con éxito");
    } catch (error) {
      console.error("Error insertando markdown:", error);
    }
  };

  return (
    <div className="App">
      <div className="editor-container">
        <div className="toolbar-wrapper">
          <EnhancedToolbar 
            onDarkModeToggle={() => setDarkMode(!darkMode)} 
            darkMode={darkMode}
            onLoadDemo={handleLoadDemo}
            onFileLoad={handleFileLoad}
            isLoading={isLoading}
            onApplyStyle={insertMarkdown}
            onInsertBlock={insertMarkdown}
            onLoadMarkdown={() => {}}
          />
          <TemplateSelector 
            value={templateId} 
            onChange={(id: string) => setTemplateId(id)} 
          />
          {/* Botón de prueba para panel */}
          <button 
            className="test-btn bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
            onClick={() => insertMarkdown(`:::panel{title="Panel de Prueba"}\nEste es un panel de prueba\n:::`)}
          >
            TEST PANEL
          </button>
        </div>
        <div className="editor-wrapper">
          <CodeMirror
            ref={editorRef}
            value={markdown}
            height="100%"
            extensions={[markdownExtension()]}
            onChange={(value) => setMarkdown(value)}
            theme={vscodeDark}
          />
        </div>
      </div>
      <div className="preview-container">
        <iframe 
          ref={iframeRef} 
          title="Markdown Preview" 
          className="preview-iframe"
        />
      </div>
    </div>
  );
};

export default App;