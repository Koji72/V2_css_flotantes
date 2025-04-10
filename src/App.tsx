import { useState, useEffect, useRef, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownLanguage } from '@codemirror/lang-markdown';
import { create } from 'zustand';
import { FileUp, Moon, Sun, Save, FolderOpen, Palette, Bug } from 'lucide-react';
import { EditorView, keymap } from '@codemirror/view';
import Toolbar from './components/Toolbar';
import previewManager from './utils/previewManager';
import { readCSSFile } from './utils/cssLoader';
import Alert from './components/Alert';
import TemplateSelector from './components/TemplateSelector';
import { useAppStore } from './utils/markdownProcessor';
import { EditorState, EditorSelection } from '@codemirror/state';
import markdownProcessor from './utils/markdownProcessor';

function App() {
  const { 
    markdown, 
    setMarkdown, 
    css, 
    setCSS, 
    darkMode, 
    toggleDarkMode,
    currentTemplate,
    setCurrentTemplate,
    isDebugMode,
    toggleDebugMode,
  } = useAppStore();
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const markdownInputRef = useRef<HTMLInputElement>(null);
  const cssInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  
  const [themeName, setThemeName] = useState('Default Theme');
  
  // Función para mostrar alertas
  const showAlert = (message: string, type: 'success' | 'error' | 'info'): void => {
    setAlertInfo({ message, type });
    // Auto-dismiss after 5 seconds
    setTimeout(() => setAlertInfo(null), 5000);
  };
  
  // Función para aplicar CSS al iframe
  const applyCSS = useCallback((cssText: string, templateId: string) => {
    console.log(`[applyCSS] Attempting to apply CSS (length: ${cssText.length})`);
    const iframe = iframeRef.current;
    if (!iframe || !iframe.contentDocument) {
      console.error('[applyCSS] Iframe or contentDocument not ready.');
      return false;
    }
    const doc = iframe.contentDocument;
    const head = doc.head;

    // Limpiar estilos anteriores
    const existingStyles = head.querySelectorAll('style[data-theme], link[data-theme]');
    existingStyles.forEach(el => el.remove());
    console.log(`[applyCSS] Removed ${existingStyles.length} previous theme styles/links.`);
    
    // Limpiar cualquier clase de tema anterior del body
    const bodyEl = doc.body;
    if (bodyEl) {
      // Remover todas las clases de temas anteriores
      Array.from(bodyEl.classList).forEach(cls => {
        if (cls.startsWith('theme-') || cls.includes('bg-')) {
          bodyEl.classList.remove(cls);
        }
      });
      
      // Añadir la clase de tema actual
      const themeClass = templateId.replace(/_/g, '-').toLowerCase();
      bodyEl.classList.add(`theme-${themeClass}`);
      
      // Agregar un atributo data-theme para CSS que quiera usarlo como selector
      bodyEl.setAttribute('data-theme', templateId);
      
      console.log(`[applyCSS] Set theme classes on body: theme-${themeClass}`);
    }

    // Aplicar los estilos de floating-blocks.css
    fetch('/styles/floating-blocks.css')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error loading floating-blocks.css: ${response.status}`);
        }
        return response.text();
      })
      .then(floatingBlocksCSS => {
        const floatingBlocksStyle = doc.createElement('style');
        floatingBlocksStyle.setAttribute('data-theme', 'floating-blocks');
        floatingBlocksStyle.textContent = floatingBlocksCSS;
        head.appendChild(floatingBlocksStyle);
        console.log('[applyCSS] Added floating-blocks.css styles to iframe');
      })
      .catch(error => {
        console.error('[applyCSS] Error loading floating-blocks.css:', error);
      });

    // Extraer nombre del tema del comentario
    console.log(`[applyCSS] CSS Text Start: \"${cssText.substring(0, 50)}...\"`);
    let currentThemeName = 'Unknown Theme';
    
    // Buscar tema en comentario /* Theme: Nombre del Tema */
    const themeCommentMatch = cssText.match(/\/\*\s*Theme:\s*([\s\S]*?)\s*\*\//i);
    if (themeCommentMatch && themeCommentMatch[1]) {
      currentThemeName = themeCommentMatch[1].trim();
    } 
    // Segunda forma alternativa: /* Theme Name: Nombre del Tema */
    else {
      const themeNameMatch = cssText.match(/\/\*\s*Theme\s*Name\s*:\s*([\s\S]*?)\s*\*\//i);
      if (themeNameMatch && themeNameMatch[1]) {
        currentThemeName = themeNameMatch[1].trim();
      }
      // Tercera forma: Extraer el nombre del archivo
      else if (templateId) {
        // Convertir template_id a un nombre más legible (ej. purple_neon_grid -> Purple Neon Grid)
        currentThemeName = templateId
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    setThemeName(currentThemeName);
    console.log(`[applyCSS] Applying theme: ${currentThemeName}`);

    // Crear y añadir nuevo estilo con prioridad !important para propiedades clave
    const style = doc.createElement('style');
    style.setAttribute('data-theme', currentThemeName.replace(/\s+/g, '-').toLowerCase());
    
    // Modificar el CSS para añadir !important a las propiedades de fondo y color
    let enhancedCSS = cssText;
    
    // 1. Mejorar selectores para body, :root y .universal-scribe-output
    enhancedCSS = enhancedCSS.replace(
      /(body|:root|\.universal-scribe-output)\s*{([^}]*)}/g, 
      (match, selector, properties) => {
        // Reemplazar propiedades específicas añadiendo !important
        let newProps = properties.replace(
          /(background-color|background-image|color|background)\s*:\s*([^;]+);/g,
          '$1: $2 !important;'
        );
        return `${selector} {${newProps}}`;
      }
    );
    
    // 2. Mejorar selectores para tablas y elementos relacionados
    enhancedCSS = enhancedCSS.replace(
      /(table|th|td|thead|tbody|tr)(\.[a-zA-Z0-9_-]*)*\s*{([^}]*)}/g,
      (match, selector, classes, properties) => {
        // Añadir !important a propiedades de fondo, color y bordes para tablas
        let newProps = properties.replace(
          /(background-color|background-image|background|color|border|border-color|border-style|border-width)\s*:\s*([^;]+);/g,
          '$1: $2 !important;'
        );
        // Añadir attr selector para aumentar especificidad
        const selectorWithAttr = classes 
          ? `${selector}${classes}[data-table-type="datamatrix"]`
          : `${selector}[data-table-type="datamatrix"]`;
        
        // Devolver versión original y versión mejorada para mayor compatibilidad
        return `${match}\n${selectorWithAttr} {${newProps}}`;
      }
    );
    
    // 3. Mejorar selectores específicos para datamatrix
    enhancedCSS += `
    /* Estilos adicionales para asegurar que se apliquen a las tablas */
    [data-matrix-table="true"] .data-matrix {
      background-color: inherit !important;
      color: inherit !important;
    }
    
    .theme-${templateId.replace(/_/g, '-').toLowerCase()} .data-matrix,
    .theme-${templateId.replace(/_/g, '-').toLowerCase()} .data-matrix th,
    .theme-${templateId.replace(/_/g, '-').toLowerCase()} .data-matrix td {
      border-color: inherit !important;
      color: inherit !important;
    }
    
    /* Asegurar que el fondo del bloque datamatrix se aplique */
    .floating-block.datamatrix {
      position: relative !important;
      z-index: 1 !important;
    }
    
    /* Estos selectores deberían tener mayor especificidad */
    body[data-theme="${templateId}"] .datamatrix table,
    body[data-theme="${templateId}"] .datamatrix th,
    body[data-theme="${templateId}"] .datamatrix td {
      background-color: inherit !important;
      color: inherit !important;
      border-color: rgba(255,255,255,0.2) !important;
    }
    `;
    
    // Añadir timestamp para forzar recarga
    style.textContent = enhancedCSS + `\n/* Timestamp: ${Date.now()} */`;
    head.appendChild(style);
    console.log(`[applyCSS] Appended new <style> tag for theme: ${currentThemeName}`);

    // Extraer y cargar fuentes @import
    const fontImports = cssText.match(/@import\s+url\(([^)]+)\);/g) || [];
    fontImports.forEach(imp => {
      const urlMatch = imp.match(/url\(([^)]+)\)/);
      if (urlMatch && urlMatch[1]) {
        const fontUrl = urlMatch[1].replace(/['"]/g, '');
        let link = doc.createElement('link');
        link.href = fontUrl;
        link.rel = 'stylesheet';
        link.setAttribute('data-theme-font', 'true');
        head.appendChild(link);
        console.log(`[applyCSS] Added font link: ${fontUrl}`);
      }
    });

    // Forzar repintado completo
    bodyEl.style.display = 'none';
    bodyEl.offsetHeight; // trigger reflow
    bodyEl.style.display = '';
    console.log('[applyCSS] Forced repaint attempt.');
    
    // Verificar si el estilo se aplicó (ej. color de fondo)
    setTimeout(() => {
      if (doc.body) {
        const bgColor = window.getComputedStyle(doc.body).backgroundColor;
        console.log(`[applyCSS] Verification: Body background color after apply: ${bgColor}`);
        
        // Verificar si hay tablas y sus estilos
        const tables = doc.querySelectorAll('table');
        console.log(`[applyCSS] Found ${tables.length} tables in document`);
        
        // Verificar bloques flotantes
        const floatingBlocks = doc.querySelectorAll('.floating-block');
        console.log(`[applyCSS] Found ${floatingBlocks.length} floating blocks in document`);
        
        // Inyectar CSS adicional directo al body como fallback
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent' || bgColor === 'rgb(255, 255, 255)') {
          console.log('[applyCSS] Background color not applied properly, using fallback method');
          try {
            // Intentar extraer fondo del CSS
            const bgMatch = cssText.match(/body\s*{[^}]*background-color\s*:\s*([^;]+);/);
            const bgImage = cssText.match(/body\s*{[^}]*background-image\s*:\s*([^;]+);/);
            
            if (bgMatch && bgMatch[1]) {
              doc.body.style.backgroundColor = bgMatch[1] + ' !important';
              console.log(`[applyCSS] Applied fallback background-color: ${bgMatch[1]}`);
            } else if (templateId === 'purple_neon_grid') {
              // Valores fijos para purple_neon_grid como fallback
              doc.body.style.backgroundColor = '#100020 !important';
              console.log('[applyCSS] Applied hardcoded purple_neon_grid background-color');
            }
            
            if (bgImage && bgImage[1]) {
              doc.body.style.backgroundImage = bgImage[1] + ' !important';
              console.log(`[applyCSS] Applied fallback background-image: ${bgImage[1]}`);
            }
          } catch (e) {
            console.error('[applyCSS] Error applying fallback background:', e);
          }
        }
      }
    }, 200); // Dar más tiempo a que se apliquen los estilos

    return true;
  }, [setThemeName]);
  
  // Función para cargar template CSS
  const loadTemplate = useCallback(async (templateId: string) => {
    console.log(`[loadTemplate] Called with templateId: ${templateId}`);
    setCurrentTemplate(templateId);
    setCSS('');
    setThemeName('Loading...');
    markdownProcessor.clearCache();
    console.log('[loadTemplate] Markdown processor cache cleared.');

    try {
      const cssPath = `/templates/${templateId}.css`;
      console.log(`[loadTemplate] Fetching CSS from: ${cssPath}`);
      const response = await fetch(cssPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const newCss = await response.text();
      console.log(`[loadTemplate] Fetched CSS successfully (length: ${newCss.length}) for template: ${templateId}`);
      
      if (applyCSS(newCss, templateId)) {
        setCSS(newCss);
        console.log(`[loadTemplate] Successfully applied CSS for: ${templateId}`);
      } else {
        throw new Error('Failed to apply CSS to iframe.');
      }
    } catch (error) {
      console.error('[loadTemplate] Error loading template:', error);
      alert(`Error loading template '${templateId}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Podríamos volver al default o manejar el error de otra forma
      setThemeName('Error loading theme');
    }
  }, [applyCSS, setCSS, setCurrentTemplate]);
  
  // Efecto para cargar el CSS inicial o cuando cambie el templateId en el store
  useEffect(() => {
    const currentId = useAppStore.getState().currentTemplate;
    console.log(`[Effect Load Template] Detected template change in store: ${currentId}`);
    if (currentId) {
      loadTemplate(currentId);
    } else {
      console.warn('[Effect Load Template] No current template ID found in store on init/change.');
      // Opcional: Cargar un default si no hay ninguno
      // loadTemplate('default'); 
    }
  }, [currentTemplate, loadTemplate]); // Depende de currentTemplate del store
  
  // Inicializar iframe cuando se monta el componente
  useEffect(() => {
    if (iframeRef.current) {
      // Configuración inicial del iframe
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
                padding: 0;
                font-family: inherit;
                color: inherit;
                background-color: inherit;
                overflow-x: hidden;
              }
              #content {
                min-height: 100vh;
                padding: 20px;
                position: relative;
                z-index: 1;
              }
              /* Estilos mínimos para floating-blocks por si acaso */
              .floating-block {
                position: relative;
                margin: 1rem 0;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                background-color: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(224, 224, 224, 0.2);
              }
              .floating-block .block-header {
                display: flex;
                align-items: center;
                margin-bottom: 0.5rem;
                padding-bottom: 0.5rem;
                border-bottom: 1px solid rgba(224, 224, 224, 0.2);
              }
              .floating-block .block-header h3 {
                margin: 0;
                font-size: 1.1rem;
                color: inherit;
              }
              .floating-block .block-content {
                padding: 0.5rem 0;
              }
              
              /* Estilos específicos para tablas */
              table.data-matrix {
                width: 100%;
                border-collapse: collapse;
                margin: 1rem 0;
                background-color: inherit;
                color: inherit;
              }
              
              table.data-matrix thead th {
                background-color: rgba(0, 0, 0, 0.2);
                color: inherit;
                padding: 0.5rem;
                text-align: left;
                border: 1px solid rgba(224, 224, 224, 0.2);
              }
              
              table.data-matrix tbody td {
                padding: 0.5rem;
                text-align: left;
                border: 1px solid rgba(224, 224, 224, 0.2);
                background-color: inherit;
              }
              
              table.data-matrix tr:nth-child(odd) {
                background-color: rgba(0, 0, 0, 0.1);
              }
              
              .floating-block.datamatrix {
                overflow: visible;
                background-color: rgba(0, 0, 0, 0.2);
              }
              
              .status-ok {
                color: #80ffc0;
              }
              
              .status-warn {
                color: #ffdd80;
              }
              
              .status-error {
                color: #ff6080;
              }
            </style>
            <!-- Preload de fuentes esenciales -->
            <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@300;400;500;600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
          </head>
          <body>
            <div id="content">
              <h1>Loading preview...</h1>
            </div>
          </body>
        </html>
      `;
      
      iframeRef.current.srcdoc = baseHtml;
      
      // Aplicar el Markdown actual cuando el iframe esté listo
      iframeRef.current.onload = () => {
        console.log('Iframe loaded, updating content and applying CSS');
        
        // Cargar la plantilla actual o la predeterminada
        const currentTemplateId = localStorage.getItem('currentTemplate') || 'purple_neon_grid';
        console.log(`[Iframe onload] Loading template: ${currentTemplateId}`);
        setCurrentTemplate(currentTemplateId);
        
        // Dar prioridad a la carga de estilos antes de procesar el contenido
        loadTemplate(currentTemplateId)
          .then(() => {
            console.log('[Iframe onload] Template loaded, now updating content');
            // Esperar un momento para que se apliquen los estilos
            setTimeout(() => {
              updateIframeContent(markdown);
              console.log('[Iframe onload] Content updated');
            }, 500);
          })
          .catch(error => {
            console.error('[Iframe onload] Error loading template:', error);
            // Intentar actualizar el contenido de todas formas
            updateIframeContent(markdown);
          });
      };
    }
  }, []);
  
  // Update content in the iframe
  const updateIframeContent = useCallback((markdownText: string) => {
    console.log('[UpdateContent] Called with markdown text length:', markdownText.length);
    const iframe = iframeRef.current;
    
    if (!iframe || !iframe.contentDocument) {
      console.error('[UpdateContent] Iframe o contentDocument no disponible.');
      return false;
    }
    
    try {
      const doc = iframe.contentDocument;
      
      // Preservar estilos: guardar todas las referencias a elementos style y link antes de actualizar
      const stylesToPreserve = Array.from(doc.head.querySelectorAll('style[data-theme], link[data-theme]'));
      console.log(`[UpdateContent] Preservando ${stylesToPreserve.length} elementos de estilo.`);
      
      // Preservar clases y atributos del body
      const bodyClasses = doc.body.className;
      const bodyAttrs: Record<string, string> = {};
      Array.from(doc.body.attributes).forEach(attr => {
        bodyAttrs[attr.name] = attr.value;
      });
      
      // Obtener el HTML procesado desde markdownProcessor
      const renderedHTML = markdownProcessor.process(markdownText);
      console.log('[UpdateContent] Received HTML from markdownProcessor (' + renderedHTML.length + ' chars):', renderedHTML.substring(0, 100) + '...');
      
      // Actualizar el contenido pero preservar clases y atributos del div contenedor
      const contentDiv = doc.getElementById('content');
      if (contentDiv) {
        // Preservar clases del div content antes de actualizar su contenido
        const contentClass = contentDiv.className;
        const contentAttrs: Record<string, string> = {};
        Array.from(contentDiv.attributes).forEach(attr => {
          if (attr.name !== 'id') {
            contentAttrs[attr.name] = attr.value;
          }
        });
        
        // Actualizar contenido
        contentDiv.innerHTML = renderedHTML;
        
        // Restaurar clases y atributos
        contentDiv.className = contentClass;
        Object.entries(contentAttrs).forEach(([name, value]) => {
          contentDiv.setAttribute(name, value);
        });
        
        console.log('[UpdateContent] Iframe body innerHTML after update:', doc.body.innerHTML.substring(0, 100) + '...');
        
        // Restaurar atributos y clases del body
        doc.body.className = bodyClasses;
        Object.entries(bodyAttrs).forEach(([name, value]) => {
          doc.body.setAttribute(name, value);
        });
        
        // Restaurar todos los estilos previamente guardados
        if (stylesToPreserve.length > 0) {
          // Limpiar estilos actuales para evitar duplicados
          const existingStyles = doc.head.querySelectorAll('style[data-theme], link[data-theme]');
          existingStyles.forEach(el => el.remove());
          
          // Restaurar estilos preservados
          stylesToPreserve.forEach(style => {
            doc.head.appendChild(style);
          });
          console.log(`[UpdateContent] Restored ${stylesToPreserve.length} style elements.`);
        } else {
          // Si no hay estilos para preservar, reaplicar el CSS
          console.log('[UpdateContent] Reaplicando CSS después de actualizar el contenido...');
          if (css) { 
            applyCSS(css, currentTemplate);
          } else {
            console.warn('[UpdateContent] No current CSS found in state hook to reapply.');
          }
        }
        
        return true;
      } else {
        console.error('[UpdateContent] Content div not found in iframe.');
        return false;
      }
    } catch (error) {
      console.error('[UpdateContent] Error updating iframe content:', error);
      return false;
    }
  }, [applyCSS, css, currentTemplate]);
  
  // Update content when markdown changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      updateIframeContent(markdown);
    }, 250);
    
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [markdown, updateIframeContent]);
  
  // Apply CSS when it changes (with slight delay to ensure iframe is ready)
  useEffect(() => {
    if (!css) return;
    
    console.log("Attempting to apply CSS, length:", css.length);
    
    const cssTimer = setTimeout(() => {
      const success = applyCSS(css, currentTemplate);
      if (success) {
        console.log("CSS applied automatically");
      } else {
        console.warn("Failed to apply CSS automatically");
        showAlert("Could not apply CSS automatically. Use the 'Apply CSS' button if needed.", "info");
      }
    }, 500);
    
    return () => clearTimeout(cssTimer);
  }, [css, currentTemplate]);
  
  // Handle CSS file selection
  const handleLoadCssFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[App] CSS file selected:", file.name);
      readCSSFile(file)
        .then(content => {
          console.log("[App] CSS content loaded, length:", content?.length);
          if (content !== null) {
              setCSS(content); // Save full CSS content to store
              showAlert(`CSS loaded: ${file.name}`, "success");
              previewManager.applyCustomCSS(content); // Apply via PreviewManager
          } else {
               throw new Error("Failed to read CSS file content.");
          }
        })
        .catch(error => {
          console.error("[App] Error reading css file:", error);
          showAlert("Error reading CSS file", "error");
        });
      if (e.target) e.target.value = ''; // Reset input
    }
  }, [setCSS, showAlert]); // Include dependencies
  
  // Handle editor scrolling (for sync with preview)
  const handleEditorScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const editorElement = e.currentTarget;
    const totalHeight = editorElement.scrollHeight - editorElement.clientHeight;
    if (totalHeight <= 0) return;
    
    const scrollPercentage = (editorElement.scrollTop / totalHeight) * 100;
    
    // Sync scroll to iframe
    if (iframeRef.current?.contentWindow?.document) {
      const doc = iframeRef.current.contentWindow.document;
      const maxScroll = doc.documentElement.scrollHeight - doc.documentElement.clientHeight;
      const targetScroll = (maxScroll * scrollPercentage) / 100;
      doc.documentElement.scrollTop = targetScroll;
    }
  };
  
  // Insert a block of text
  const insertBlock = useCallback((blockText: string) => {
    if (!editorView) return;
    const { state, dispatch } = editorView;
    const { from, to } = state.selection.main;
    const insertPos = state.doc.lineAt(to).from === to ? to : to + 1;
    const textToInsert = (state.doc.lineAt(to).from === to ? "" : "\n") + blockText + "\n";

    dispatch({
      changes: { from: insertPos, insert: textToInsert },
      selection: { anchor: insertPos + textToInsert.length }
    });
    editorView.focus();
  }, [editorView]);
  
  // Save markdown file
  const handleSave = useCallback(async () => {
    console.log("[App] Saving Markdown...");
    const currentMarkdown = useAppStore.getState().markdown; // Read latest before save
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({ suggestedName: 'document.md', types: [{ description: 'Markdown Files', accept: { 'text/markdown': ['.md'] } }] });
        const writable = await handle.createWritable();
        await writable.write(currentMarkdown);
        await writable.close();
        showAlert('Markdown saved successfully!', 'success');
        console.log("[App] Markdown saved using File System Access API.");
      } else {
        const blob = new Blob([currentMarkdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'document.md';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showAlert('Markdown downloaded.', 'info');
        console.log("[App] Markdown saved using fallback download.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('[App] Save file dialog aborted by user.');
        showAlert('Save cancelled.', 'info');
        return;
      }
      console.error("[App] Error saving file:", error);
      showAlert('Error saving Markdown.', 'error');
    }
  }, [showAlert]); // markdown state is read directly
  
  // Trigger markdown file input
  const handleLoadMarkdownTrigger = () => { markdownInputRef.current?.click(); };
  
  // Handle markdown file selection
  const handleMarkdownFileSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("[App] Markdown file selected:", file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        console.log("[App] Markdown content loaded, length:", content?.length);
        setMarkdown(content); // Update store, which triggers preview update via useEffect
        showAlert(`Markdown loaded: ${file.name}`, 'success');
      };
      reader.onerror = (error) => {
        console.error("[App] Error reading markdown file:", error);
        showAlert('Error loading Markdown file.', 'error');
      };
      reader.readAsText(file);
      if(e.target) e.target.value = ''; // Reset input
    }
  }, [setMarkdown, showAlert]); // Dependencies
  
  // Define keyboard shortcuts
  const markdownKeymap = keymap.of([
    { key: "Mod-b", run: () => { applyMarkdownStyle("**", "**"); return true; } },
    { key: "Mod-i", run: () => { applyMarkdownStyle("*", "*"); return true; } },
    { key: "Mod-`", run: () => { applyMarkdownStyle("`", "`"); return true; } },
  ]);
  
  // Export as PDF
  const exportAsPDF = useCallback(async () => {
    showAlert('Exporting to PDF... please wait.', 'info');
    console.log('[App] PDF Export requested.');

    if (!previewManager.isReady || !iframeRef.current?.contentWindow?.document) {
      console.error('[App] Preview not ready for PDF export.');
      showAlert('Preview is not ready. Cannot export PDF.', 'error');
      return;
    }
    const iframeDoc = iframeRef.current.contentWindow.document;
    // Use a more robust check in case print window is blocked silently
    let printWindow: Window | null = null;
    try {
      printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error("Popup blocked or failed to open.");
      }
    } catch (error) {
      showAlert('Could not open print window. Please check pop-up blocker.', 'error');
      console.error('[App] Error opening print window:', error);
      return;
    }

    try {
      // Clone styles
      const styles = Array.from(iframeDoc.head.querySelectorAll('style, link[rel="stylesheet"]'));
      styles.forEach(style => { printWindow?.document.head.appendChild(style.cloneNode(true)); });
      // Clone body content
      printWindow.document.body.innerHTML = iframeDoc.body.innerHTML;
      // Wait for styles (optional but safer)
      await new Promise(resolve => setTimeout(resolve, 500));
      printWindow.document.title = "Universal Scribe Export";
      printWindow.print();
      console.log('[App] Print dialog opened for PDF export.');
      showAlert('Print dialog opened. Choose "Save as PDF".', 'success');
    } catch (error) {
      console.error("[App] Error during PDF preparation/print:", error);
      showAlert('Error preparing PDF content.', 'error');
      try { printWindow?.close(); } catch (e) {} // Close if possible on error
    }
  }, [showAlert]); // Dependency
  
  // Aplicar el modo oscuro al documento
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Initialize PreviewManager on mount
  useEffect(() => {
    console.log('[App] Initializing useEffect for PreviewManager.');
    if (iframeRef.current) {
      console.log('[App] Iframe ref available, initializing PreviewManager.');
      previewManager.initialize(iframeRef.current);

      // Apply initial CSS from store if available
      const initialCss = useAppStore.getState().css; // Read directly only on init
      if (initialCss) {
        console.log('[App] Applying initial CSS from store.');
        previewManager.applyCustomCSS(initialCss);
      } else {
        console.log('[App] No initial CSS found in store.');
        // Optional: Load default CSS?
        // loadTemplate('default'); // Needs definition if kept
      }

      // Load initial markdown
      const initialMarkdown = useAppStore.getState().markdown;
      previewManager.updateContent(initialMarkdown);

    } else {
      console.warn('[App] Iframe ref not available on initial mount.');
    }
    // Cleanup on unmount
    return () => {
      console.log('[App] Cleanup: Destroying PreviewManager.');
      previewManager.destroy();
    };
  }, []); // Run only on mount

  // Update preview content when markdown state changes
  useEffect(() => {
    console.log('[App] Markdown state changed, updating preview.');
    previewManager.updateContent(markdown);
  }, [markdown]);
  
  const applyMarkdownStyle = useCallback((syntaxStart: string, syntaxEnd: string = '') => {
    if (!editorView) return;
    const { state, dispatch } = editorView;
    const changes = state.changeByRange(range => {
      let text = state.sliceDoc(range.from, range.to);
      let from = range.from;
      let to = range.to;

      if (text.startsWith(syntaxStart) && text.endsWith(syntaxEnd)) {
        text = text.substring(syntaxStart.length, text.length - syntaxEnd.length);
        return {
          changes: { from: from, to: to, insert: text },
          range: EditorSelection.range(from, from + text.length)
        }
      } else {
        const newText = `${syntaxStart}${text}${syntaxEnd}`;
        return {
          changes: { from: from, to: to, insert: newText },
          range: EditorSelection.range(from + syntaxStart.length, from + text.length + syntaxStart.length)
        }
      }
    });
    dispatch(state.update(changes));
    editorView.focus();
  }, [editorView]);
  
  // Nuevas funciones para cargar los demos
  const loadMasterDemo = useCallback(async () => {
    try {
      console.log("[App] Loading Master Demo...");
      const response = await fetch('/Master v2.5.md');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      console.log("[App] Master Demo loaded, length:", content.length);
      setMarkdown(content);
      showAlert("Master Demo v2.5 cargado correctamente", "success");
    } catch (error) {
      console.error("[App] Error loading Master Demo:", error);
      showAlert(`Error al cargar el demo: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    }
  }, [setMarkdown, showAlert]);

  const loadCodexDemo = useCallback(async () => {
    try {
      console.log("[App] Loading Aetherium Codex Demo...");
      const response = await fetch('/aetherium_codex_demo.md');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      console.log("[App] Aetherium Codex Demo loaded, length:", content.length);
      setMarkdown(content);
      setCurrentTemplate('aetherium_codex'); // Cambiar también al tema correspondiente
      showAlert("Demo Aetherium Codex cargado y tema aplicado", "success");
    } catch (error) {
      console.error("[App] Error loading Aetherium Codex Demo:", error);
      showAlert(`Error al cargar el demo: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    }
  }, [setMarkdown, setCurrentTemplate, showAlert]);

  const loadInfinityDemo = useCallback(async () => {
    try {
      console.log("[App] Loading Infinity Command Demo...");
      const response = await fetch('/purple_neon_grid_demo.md'); // Usar el demo de Purple Neon Grid
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const content = await response.text();
      console.log("[App] Infinity Command Demo loaded, length:", content.length);
      setMarkdown(content);
      setCurrentTemplate('infinitycommand'); // Cambiar al tema Infinity Command
      showAlert("Demo Infinity Command cargado y tema aplicado", "success");
    } catch (error) {
      console.error("[App] Error loading Infinity Command Demo:", error);
      showAlert(`Error al cargar el demo: ${error instanceof Error ? error.message : 'Unknown error'}`, "error");
    }
  }, [setMarkdown, setCurrentTemplate, showAlert]);
  
  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark-mode' : ''}`}>
      {/* Alert component */}
      {alertInfo && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onDismiss={() => setAlertInfo(null)}
        />
      )}
      
      {/* Hidden file inputs */}
      <input 
        type="file"
        ref={markdownInputRef}
        accept=".md,text/markdown"
        style={{ display: 'none' }}
        onChange={handleMarkdownFileSelected}
      />
      
      <input
        type="file"
        ref={cssInputRef}
        accept=".css"
        style={{ display: 'none' }}
        onChange={handleLoadCssFileSelected}
      />
      
      {/* Header */}
      <header className="bg-inf-tertiary p-4 flex justify-between items-center">
        <h1 className="text-2xl font-title text-inf-primary">Infinity Game Visual Aesthetic</h1>
        <button 
          className="p-2 rounded-full hover:bg-inf-accent1 transition-colors"
          onClick={toggleDarkMode}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </header>
      
      {/* Main content */}
      <div className="flex-1 flex flex-row overflow-hidden">
        {/* Editor panel */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Toolbar 
            onApplyStyle={applyMarkdownStyle} 
            onInsertBlock={insertBlock}
            onSave={handleSave}
            onLoad={handleLoadMarkdownTrigger}
            onExportPDF={exportAsPDF}
            onLoadMasterDemo={loadMasterDemo}
            onLoadCodexDemo={loadCodexDemo}
            onLoadInfinityDemo={loadInfinityDemo}
          />
          
          <div className="flex-1 p-4 overflow-auto" onScroll={handleEditorScroll}>
            <CodeMirror
              value={markdown}
              height="100%"
              extensions={[
                markdownLanguage(), 
                EditorView.lineWrapping, 
                markdownKeymap
              ]}
              onChange={(value) => {
                setMarkdown(value);
              }}
              onCreateEditor={(view) => setEditorView(view)}
              theme="dark"
            />
          </div>
        </div>
        
        {/* Preview panel */}
        <div className="flex-1 h-full p-4 bg-inf-secondary flex flex-col overflow-auto">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-title text-inf-primary">Preview</h2>
            
            <div className="flex items-center gap-2">
              <TemplateSelector 
                onSelectTemplate={setCurrentTemplate}
                currentTemplate={currentTemplate}
              />
              
              <label
                htmlFor="css-file"
                className="flex items-center gap-2 px-4 py-2 bg-inf-accent1 text-inf-secondary rounded cursor-pointer hover:bg-inf-accent2 transition-colors"
                onClick={() => cssInputRef.current?.click()}
              >
                <FileUp size={20} />
                Load CSS
              </label>
              
              <button
                onClick={() => {
                  if (!css) {
                    showAlert("No CSS to apply", "error");
                    return;
                  }
                  
                  const success = applyCSS(css, currentTemplate);
                  if (success) {
                    showAlert("CSS applied successfully", "success");
                  } else {
                    showAlert("Failed to apply CSS", "error");
                  }
                }}
                className="px-4 py-2 bg-inf-accent1 text-inf-secondary rounded cursor-pointer hover:bg-inf-accent2 transition-colors"
              >
                Apply CSS
              </button>
            </div>
          </div>
          
          {/* Preview iframe */}
          <iframe
            ref={iframeRef}
            title="Preview"
            sandbox="allow-scripts allow-same-origin"
            className="flex-1 w-full h-full border-none bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default App;