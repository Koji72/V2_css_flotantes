import React, { useEffect, useRef, useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownExtension } from '@codemirror/lang-markdown';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useStore } from './store';
import TemplateSelector from './components/TemplateSelector';
import EnhancedToolbar from './components/EnhancedToolbar';
import { processContent } from './core/processing/pipeline';
import './App.css';
import './styles/floating-blocks.css';
import previewManager from './utils/previewManager';
// La importación de CSS desde public está causando errores - se carga dinámicamente

const App: React.FC = () => {
  const { markdown, setMarkdown, darkMode, templateId, setDarkMode, setTemplateId } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [css, setCSS] = useState('');
  const editorRef = useRef<any>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const previewManagerRef = useRef<any>(null);

  useEffect(() => {
    // Cargar markdown de ejemplo si no hay ninguno
    if (!markdown) {
      // Cargar directamente el demo de paneles v2.6 para mostrar las características
      handleLoadDemo('panel-showcase-v2.6.md');
    }
  }, [markdown]);

  // Inicializar previewManager cuando el iframe esté listo
  useEffect(() => {
    if (iframeRef.current) {
      previewManager.initialize(iframeRef.current);
    }
    
    return () => {
      // Limpiar previewManager al desmontar
      previewManager.destroy();
    };
  }, []);

  // Actualizar el contenido cuando cambia el markdown
  useEffect(() => {
    if (markdown) {
      previewManager.updateContent(markdown)
        .catch(e => console.error("Error updating content:", e));
    }
  }, [markdown]);

  // En lugar de updateIframeContent, usamos previewManager directamente
  const handleLoadCSS = async (templatePath: string) => {
    try {
      console.log('[App] Cargando CSS desde:', templatePath);
      // Cargar el CSS del template principal
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load CSS: ${response.status} ${response.statusText}`);
      }
      const cssText = await response.text();
      
      // Cargar los estilos mejorados para paneles v2.6
      let combinedCss = cssText;
      try {
        const enhancementResponse = await fetch('/styles/panel-enhancement-v2.6.css');
        if (enhancementResponse.ok) {
          const enhancementCssText = await enhancementResponse.text();
          // Combinar el CSS principal con los estilos mejorados de paneles
          // Asegurarse de que el CSS de template tenga prioridad en las fuentes 
          combinedCss = `${cssText}\n\n/* Panel Enhancements v2.6 */\n${enhancementCssText}`;
          console.log("[App] Estilos de paneles v2.6 combinados con el template principal");
        }
      } catch (enhancementError) {
        console.warn("[App] No se pudieron cargar las mejoras de panel v2.6:", enhancementError);
      }
      
      // Cargar los estilos para paneles flotantes
      try {
        const floatingResponse = await fetch('/styles/floating-panels.css');
        if (floatingResponse.ok) {
          const floatingCssText = await floatingResponse.text();
          // Añadir los estilos de paneles flotantes al CSS combinado
          combinedCss = `${combinedCss}\n\n/* Floating Panels Styles */\n${floatingCssText}`;
          console.log("[App] Estilos de paneles flotantes combinados con el template principal");
        }
      } catch (floatingError) {
        console.warn("[App] No se pudieron cargar los estilos de paneles flotantes:", floatingError);
      }
      
      // Añadir reglas específicas para la herencia de fuentes en los paneles
      const fontInheritanceRules = `
      /* Custom rules to ensure proper font inheritance */
      .mixed-panel {
        font-family: inherit;
      }
      .mixed-panel .panel-header {
        font-family: var(--display-font, inherit);
      }
      `;
      
      // Establecer el estado local de CSS (para referencia)
      const finalCss = `${combinedCss}\n\n/* Font inheritance fixes */\n${fontInheritanceRules}`;
      setCSS(finalCss);
      
      // Aplicar el CSS combinado al previewManager
      previewManager.applyCustomCSS(finalCss);
      console.log("[App] CSS aplicado con éxito. Longitud:", finalCss.length);
    } catch (error) {
      console.error(`Error loading CSS from ${templatePath}:`, error);
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
        
        // Cargar también los estilos para paneles flotantes
        try {
          const floatingResponse = await fetch('/styles/floating-panels.css');
          if (floatingResponse.ok) {
            const floatingCssText = await floatingResponse.text();
            // Agregar los estilos de paneles flotantes al CSS principal
            setCSS(prevCss => prevCss + '\n\n/* Floating Panels Styles */\n' + floatingCssText);
            console.log("[App] Estilos de paneles flotantes cargados correctamente");
          }
        } catch (floatingError) {
          console.warn("[App] No se pudieron cargar los estilos de paneles flotantes:", floatingError);
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
    handleLoadCSS(`/templates/${templateId}.css`);
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
    console.log(`[handleLoadDemo] Iniciando carga para: ${demoFile}`);
    try {
      // Intenta cargar desde varias rutas posibles
      const possiblePaths = [
        `./${demoFile}`,
        `./demos/${demoFile}`,
        `./public/${demoFile}`,
        `/${demoFile}`
      ];
      
      let demoMarkdown = '';
      let loaded = false;
      
      for (const path of possiblePaths) {
        try {
          console.log(`[handleLoadDemo] Intentando cargar desde: ${path}`);
          const response = await fetch(path);
          if (response.ok) {
            demoMarkdown = await response.text();
            console.log(`[handleLoadDemo] Demo cargado exitosamente desde: ${path}`);
            loaded = true;
            break;
          } else {
            console.warn(`[handleLoadDemo] Fallo al cargar desde ${path}: ${response.status} ${response.statusText}`);
          }
        } catch (pathError) {
          console.warn(`[handleLoadDemo] Excepción al cargar desde ${path}:`, pathError);
        }
      }
      
      if (!loaded) {
        throw new Error(`Demo file not found: ${demoFile} en ninguna ubicación conocida`);
      }
      
      setMarkdown(demoMarkdown);
      console.log("[handleLoadDemo] Markdown actualizado con el contenido del demo.");

      // Forzar la recarga del CSS asociado al template actual DESPUÉS de cargar el demo
      console.log("[handleLoadDemo] Forzando recarga de CSS...");
      await handleLoadCSS(`/templates/${templateId}.css`); 
      
    } catch (error: any) {
      console.error("[handleLoadDemo] Error cargando demo:", error);
      setMarkdown(`# Error cargando demo\n\n${error.message}`); 
    } finally {
      setIsLoading(false);
      console.log("[handleLoadDemo] Finalizado el proceso de carga.");
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
          {/* Botón para cargar el showcase de paneles */}
          <button 
            className="test-btn bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs ml-2"
            onClick={() => handleLoadDemo('panel-showcase-v2.6.md')}
          >
            SHOWCASE V2.6
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