import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownLanguage } from '@codemirror/lang-markdown';
import { create } from 'zustand';
import { FileUp, Moon, Sun } from 'lucide-react';
import { EditorView, keymap } from '@codemirror/view';
import Toolbar from './components/Toolbar';
import markdownProcessor from './utils/markdownProcessor';
import Alert from './components/Alert';
import TemplateSelector from './components/TemplateSelector';
import { TemplateManager } from './utils/templateManager';

interface AppState {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  css: string;
  setCSS: (css: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentTemplate: string;
  setCurrentTemplate: (template: string) => void;
}

const useStore = create<AppState>((set) => ({
  markdown: '',
  setMarkdown: (markdown) => set({ markdown }),
  css: '',
  setCSS: (css) => set({ css }),
  darkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () => set((state) => {
    const newValue = !state.darkMode;
    localStorage.setItem('darkMode', String(newValue));
    return { darkMode: newValue };
  }),
  currentTemplate: localStorage.getItem('currentTemplate') || 'default',
  setCurrentTemplate: (template) => {
    localStorage.setItem('currentTemplate', template);
    set({ currentTemplate: template });
  }
}));

function App() {
  const { 
    markdown, 
    setMarkdown, 
    css, 
    setCSS, 
    darkMode, 
    toggleDarkMode,
    currentTemplate,
    setCurrentTemplate 
  } = useStore();
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const markdownInputRef = useRef<HTMLInputElement>(null);
  const cssInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  
  // Función para mostrar alertas
  const showAlert = (message: string, type: 'success' | 'error' | 'info'): void => {
    setAlertInfo({ message, type });
    // Auto-dismiss after 5 seconds
    setTimeout(() => setAlertInfo(null), 5000);
  };
  
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
        const currentTemplateId = localStorage.getItem('currentTemplate') || 'aegis_overdrive';
        setCurrentTemplate(currentTemplateId);
        loadTemplate(currentTemplateId);
        
        // Esperar un momento para que se apliquen los estilos
        setTimeout(() => {
          updateIframeContent(markdown);
        }, 300);
      };
    }
  }, []);
  
  // Apply CSS to the iframe
  const applyCSS = (cssText: string): boolean => {
    console.log(`[ApplyCSS] Applying CSS to iframe (length: ${cssText.length})`);
    if (!iframeRef.current || !iframeRef.current.contentWindow || !iframeRef.current.contentWindow.document) {
      console.warn("[ApplyCSS] Cannot apply CSS: iframe not available");
      return false;
    }
    
    try {
      // Get document and head
      const doc = iframeRef.current.contentWindow.document;
      const head = doc.head;
      
      // Verificar si hay reglas para .data-matrix en el CSS
      const hasDataMatrixStyles = cssText.includes('.data-matrix') || cssText.includes('.datamatrix');
      
      if (hasDataMatrixStyles) {
        console.log('[ApplyCSS] CSS contiene reglas para .data-matrix o .datamatrix');
        
        // Extraer las reglas específicas para data-matrix
        const cssRules = cssText.match(/\.data-matrix\s*{[^}]*}/g);
        if (cssRules && cssRules.length > 0) {
          console.log('[ApplyCSS] Reglas específicas para .data-matrix encontradas:');
          cssRules.forEach(rule => console.log(rule));
        }
      } else {
        console.warn('[ApplyCSS] ¡ALERTA! CSS no contiene reglas para .data-matrix');
      }
      
      console.log("[ApplyCSS] Applying CSS content:");
      console.log(cssText.slice(0, 200) + "..."); // Log the first 200 chars of CSS
      
      // Obtener información sobre el tema actual
      const themeMatch = cssText.match(/\/\*\s*Theme:\s*([^*]*?)\s*\*\//);
      const themeName = themeMatch?.[1]?.trim() || 'default-theme';
      console.log(`[ApplyCSS] Detected theme: ${themeName}`);
      
      // Limpiar fuentes antiguas para evitar conflictos
      const existingFontLinks = head.querySelectorAll('link[href*="fonts.googleapis.com"]');
      existingFontLinks.forEach(link => {
        console.log(`[ApplyCSS] Removing old font link: ${link.getAttribute('href')}`);
        link.remove();
      });
      
      // Buscar o crear elemento style
      let styleElement = doc.getElementById('custom-theme-style') as HTMLStyleElement | null;
      if (!styleElement) {
        styleElement = doc.createElement('style');
        styleElement.id = 'custom-theme-style';
        head.appendChild(styleElement);
        console.log("[ApplyCSS] Created new style element with id 'custom-theme-style'");
      } else {
        console.log("[ApplyCSS] Found existing style element");
        // Limpiar estilos anteriores
        styleElement.textContent = '';
      }
      
      // Actualizar contenido CSS con el tema y marca temporal para forzar repintado
      const timestamp = new Date().getTime();
      styleElement.textContent = `/* CSS Theme: ${themeName} - Applied at ${timestamp} */\n${cssText}`;
      console.log("[ApplyCSS] Updated style element content with new theme");
      
      // Marcar el tema en el documento
      doc.documentElement.setAttribute('data-theme', themeName.toLowerCase().replace(/\s+/g, '-'));
      
      // Cargar fuentes si es necesario
      const fontImports = cssText.match(/@import\s+url\(['"](.+?)['"]\)/g);
      if (fontImports && fontImports.length > 0) {
        console.log(`[ApplyCSS] Found ${fontImports.length} font imports in CSS`);
        
        // Extraer URLs de fuentes
        fontImports.forEach(importRule => {
          const urlMatch = importRule.match(/url\(['"](.+?)['"]\)/);
          if (urlMatch && urlMatch[1]) {
            const fontUrl = urlMatch[1];
            if (fontUrl.includes('fonts.googleapis.com')) {
              const link = doc.createElement('link');
              link.rel = 'stylesheet';
              link.href = fontUrl;
              head.appendChild(link);
              console.log(`[ApplyCSS] Added font: ${fontUrl}`);
            }
          }
        });
      }
      
      // Forzar repintado completo para asegurar que los estilos se apliquen
      doc.body.style.display = 'none';
      setTimeout(() => {
        doc.body.style.display = '';
        
        // Verificar si hay tablas en el DOM
        const tables = doc.querySelectorAll('table.data-matrix, table[data-matrix-table="true"]');
        console.log(`[ApplyCSS] Found ${tables.length} tables with class 'data-matrix' or data-attribute`);
        
        if (tables.length > 0) {
          setTimeout(() => {
            const table = tables[0];
            console.log('[ApplyCSS] Contenido HTML de la primera tabla:', table.outerHTML.slice(0, 500) + '...');
            
            const computedStyle = doc.defaultView?.getComputedStyle(table);
            console.log('[ApplyCSS] Estilos computados de la tabla:', {
              width: computedStyle?.width,
              borderCollapse: computedStyle?.borderCollapse,
              backgroundColor: computedStyle?.backgroundColor,
              color: computedStyle?.color,
              border: computedStyle?.border
            });
            
            // Verificar clases aplicadas
            console.log(`[ApplyCSS] Clases en la tabla: "${table.className}"`);
            console.log(`[ApplyCSS] Atributos de la tabla:`, {
              'data-matrix-table': table.getAttribute('data-matrix-table'),
              id: table.id
            });
            
            // Verificar celdas th
            const thCells = table.querySelectorAll('th');
            if (thCells.length > 0) {
              const thStyle = doc.defaultView?.getComputedStyle(thCells[0]);
              console.log('[ApplyCSS] Estilos de celda TH:', {
                backgroundColor: thStyle?.backgroundColor,
                color: thStyle?.color,
                borderBottom: thStyle?.borderBottom
              });
            }
            
            // Inspeccionar reglas CSS aplicadas
            console.log(`[ApplyCSS] Comprobando si el CSS se aplicó correctamente para .data-matrix:`);
            if (styleElement) {
              if (styleElement.sheet) {
                let dataMatrixRuleFound = false;
                for (let i = 0; i < styleElement.sheet.cssRules.length; i++) {
                  const rule = styleElement.sheet.cssRules[i];
                  if (rule.cssText.includes('.data-matrix') || rule.cssText.includes('data-matrix-table')) {
                    console.log(`[ApplyCSS] Regla CSS encontrada: ${rule.cssText.slice(0, 100)}...`);
                    dataMatrixRuleFound = true;
                  }
                }
                if (!dataMatrixRuleFound) {
                  console.warn('[ApplyCSS] ¡ADVERTENCIA! No se encontraron reglas para .data-matrix en el CSS aplicado');
                }
              } else {
                console.warn('[ApplyCSS] No se pudo acceder a styleElement.sheet');
              }
            }
          }, 300);
        } else {
          console.warn('[ApplyCSS] No se encontraron tablas con clase data-matrix después de aplicar el CSS');
        }
      }, 50);
      
      // Verificar clases aplicadas después de aplicar el CSS
      setTimeout(() => {
        // Verificar si es un tema específico que requiere tratamiento especial
        const isAetheriumTheme = themeName.toLowerCase().includes('aetherium') || 
                                themeName.toLowerCase().includes('aegis');
        
        if (isAetheriumTheme) {
          console.log('[ApplyCSS] Detectado tema Aetherium/Aegis, aplicando clases adicionales');
          
          // Aplicar estilos específicos para títulos de data-matrix en Aetherium
          const matrixTitles = doc.querySelectorAll('.data-matrix-title');
          matrixTitles.forEach(title => {
            title.classList.add('aetherium-data-title');
            console.log('[ApplyCSS] Añadida clase aetherium-data-title a título de data-matrix');
            
            // Añadir un elemento antes para el efecto especial de Aetherium
            const titleElement = title as HTMLElement;
            if (!titleElement.querySelector('.title-crystal')) {
              const crystal = doc.createElement('span');
              crystal.className = 'title-crystal';
              titleElement.prepend(crystal);
              console.log('[ApplyCSS] Añadido decorador crystal al título');
            }
          });
          
          // Añadir clases especiales a las tablas data-matrix para Aetherium
          const matrixTables = doc.querySelectorAll('table.data-matrix, table[data-matrix-table="true"]');
          matrixTables.forEach(table => {
            table.classList.add('aetherium-matrix');
            console.log('[ApplyCSS] Añadida clase aetherium-matrix a tabla');
          });
          
          // Añadir estilos específicos inline si es necesario
          const styleElement = doc.getElementById('custom-theme-style') as HTMLStyleElement;
          if (styleElement && !styleElement.textContent?.includes('.aetherium-data-title')) {
            const aetheriumAdditions = `
              /* Aetherium theme additions */
              .aetherium-data-title {
                font-family: var(--font-title, 'Electrolize', sans-serif);
                color: var(--aether-secondary, #00f0ff);
                letter-spacing: 2px;
                margin-bottom: 0.5em;
                text-shadow: 0 0 5px rgba(0, 240, 255, 0.5);
              }
              .title-crystal {
                display: inline-block;
                width: 8px;
                height: 12px;
                background-color: var(--aether-secondary, #00f0ff);
                margin-right: 8px;
                transform: rotate(45deg);
                box-shadow: 0 0 8px var(--aether-secondary-glow, rgba(0, 240, 255, 0.5));
              }
            `;
            styleElement.textContent += aetheriumAdditions;
            console.log('[ApplyCSS] Añadidos estilos específicos para Aetherium');
          }
        }
      }, 300);
      
      showAlert(`Tema "${themeName}" aplicado`, 'success');
      return true;
    } catch (error) {
      console.error("[ApplyCSS] Error applying CSS:", error);
      showAlert(`Error al aplicar CSS: ${error instanceof Error ? error.message : 'Desconocido'}`, 'error');
      return false;
    }
  };
  
  // Update content in the iframe
  const updateIframeContent = (markdownText: string): boolean => {
    console.log(`[UpdateContent] Updating iframe content with markdown (${markdownText.length} chars)`);
    
    if (!iframeRef.current || !iframeRef.current.contentWindow || !iframeRef.current.contentWindow.document) {
      console.warn("[UpdateContent] Cannot update content: iframe not available");
      return false;
    }
    
    try {
      // Process markdown to HTML
      console.log(`[UpdateContent] Processing markdown through markdownProcessor...`);
      const html = markdownProcessor.process(markdownText);
      console.log(`[UpdateContent] Received HTML from markdownProcessor (${html.length} chars):`);
      console.log(html.slice(0, 300) + '...');
      
      // Update content
      const doc = iframeRef.current.contentWindow.document;
      const contentElement = doc.getElementById('content');
      
      if (contentElement) {
        console.log(`[UpdateContent] Content element found, updating innerHTML`);
        
        // Verificar si hay datamatrix en el HTML
        const hasDataMatrix = html.includes('data-matrix') || 
                             html.includes('datamatrix-raw-output') || 
                             html.includes('datamatrix-container');
        
        if (hasDataMatrix) {
          console.log(`[UpdateContent] ¡DATAMATRIX detectado en el HTML! Esto debería aparecer en el iframe.`);
        }
        
        contentElement.innerHTML = html;
        
        // Verificar si hay tablas en el DOM después de actualizar
        const tables = doc.querySelectorAll('table.data-matrix');
        console.log(`[UpdateContent] After update, found ${tables.length} tables with class 'data-matrix'`);
        
        if (tables.length > 0) {
          console.log(`[UpdateContent] First table HTML:`, tables[0].outerHTML.slice(0, 200) + '...');
          
          // Volver a aplicar el CSS después de actualizar el contenido
          console.log(`[UpdateContent] Detectadas tablas data-matrix, replicando CSS para asegurar aplicación...`);
          // Reaplica el CSS después de una breve pausa para asegurar que el DOM esté actualizado
          setTimeout(() => {
            if (css) {
              console.log(`[UpdateContent] Reaplicando CSS para asegurar que se aplique a elementos data-matrix...`);
              applyCSS(css);
            }
          }, 50);
          
          // Verificar estilos computados
          setTimeout(() => {
            const computedStyle = doc.defaultView?.getComputedStyle(tables[0]);
            console.log(`[UpdateContent] Table computed style after CSS reapplication:`, {
              width: computedStyle?.width,
              borderCollapse: computedStyle?.borderCollapse,
              backgroundColor: computedStyle?.backgroundColor
            });
            
            // Verificar si los estilos están siendo aplicados
            if (computedStyle?.borderCollapse !== 'collapse') {
              console.warn(`[UpdateContent] ¡ALERTA! Los estilos CSS no parecen estar aplicándose a la tabla`);
            }
          }, 300);
        }
        
        console.log("[UpdateContent] Iframe content updated successfully");
        return true;
      } else {
        console.warn("[UpdateContent] Content element not found in iframe");
        return false;
      }
    } catch (error) {
      console.error("[UpdateContent] Error updating iframe content:", error);
      return false;
    }
  };
  
  // Update content when markdown changes (with debounce)
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      updateIframeContent(markdown);
    }, 250);
    
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [markdown]);
  
  // Apply CSS when it changes (with slight delay to ensure iframe is ready)
  useEffect(() => {
    if (!css) return;
    
    console.log("Attempting to apply CSS, length:", css.length);
    
    const cssTimer = setTimeout(() => {
      const success = applyCSS(css);
      if (success) {
        console.log("CSS applied automatically");
      } else {
        console.warn("Failed to apply CSS automatically");
        showAlert("Could not apply CSS automatically. Use the 'Apply CSS' button if needed.", "info");
      }
    }, 500);
    
    return () => clearTimeout(cssTimer);
  }, [css]);
  
  // Handle CSS file selection
  const handleLoadCssFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("CSS File input changed");
    const file = e.target.files?.[0];
    if (file) {
      console.log("CSS File selected:", file.name);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          console.log("CSS content loaded, length:", content?.length);
          setCSS(content);
          
          // Aplicar CSS inmediatamente
          setTimeout(() => {
            const success = applyCSS(content);
            if (success) {
              showAlert(`CSS loaded and applied: ${file.name}`, "success");
            } else {
              showAlert(`CSS loaded but failed to apply: ${file.name}. Try using Apply CSS button.`, "info");
            }
          }, 100);
          
          if (e.target) {
            (e.target as unknown as HTMLInputElement).value = '';
          }
        } catch (error) {
          console.error("Error processing CSS:", error);
          showAlert("Error loading CSS", "error");
        }
      };
      
      reader.onerror = (error) => {
        console.error("Error reading css file:", error);
        showAlert("Error reading CSS file", "error");
      };
      
      reader.readAsText(file);
    } else {
      console.log("No CSS file selected or input cleared");
    }
  };
  
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
  
  // Apply markdown style (bold, italic, etc.)
  const applyMarkdownStyle = (syntaxStart: string, syntaxEnd?: string) => {
    console.log(`applyMarkdownStyle called with: ${syntaxStart}`);
    if (!editorView) {
      console.log('Editor view not found');
      return;
    }
    
    const end = syntaxEnd ?? syntaxStart;
    
    const changes = editorView.state.changeByRange((range) => {
      if (range.from === range.to) {
        return { range };
      }
      
      const textBefore = editorView.state.doc.sliceString(
        Math.max(0, range.from - syntaxStart.length), 
        range.from
      );
      
      const textAfter = editorView.state.doc.sliceString(
        range.to, 
        Math.min(editorView.state.doc.length, range.to + end.length)
      );
      
      const isAlreadyWrapped = textBefore === syntaxStart && textAfter === end;
      
      if (isAlreadyWrapped) {
        return {
          changes: [
            { from: range.from - syntaxStart.length, to: range.from },
            { from: range.to, to: range.to + end.length },
          ],
          range: range
        };
      } else {
        return {
          changes: [
            { from: range.from, insert: syntaxStart },
            { from: range.to, insert: end },
          ],
          range: range
        };
      }
    });
    
    editorView.dispatch(changes);
    editorView.focus();
    
    setMarkdown(editorView.state.doc.toString());
  };
  
  // Insert a block of text
  const insertBlock = (blockText: string) => {
    if (!editorView) return;
    
    const { from, to } = editorView.state.selection.main;
    editorView.dispatch({
      changes: { from, to, insert: blockText },
      selection: { anchor: from + blockText.length }
    });
    
    editorView.focus();
    setMarkdown(editorView.state.doc.toString());
  };
  
  // Save markdown file
  const handleSave = async () => {
    const currentMarkdown = useStore.getState().markdown;
    if (!currentMarkdown && currentMarkdown !== '') {
      showAlert("Nothing to save!", "info");
      return;
    }
    
    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const defaultFilename = 'saved_content.md';
    
    if (window.showSaveFilePicker) {
      try {
        const handle = await window.showSaveFilePicker({
          suggestedName: defaultFilename,
          types: [{
            description: 'Markdown Files',
            accept: { 'text/markdown': ['.md'] },
          }],
        });
        
        const writable = await handle.createWritable();
        await writable.write(blob);
        await writable.close();
        
        console.log('File saved successfully using File System Access API');
        showAlert('File saved successfully!', 'success');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          console.log('Save dialog was cancelled by the user.');
          showAlert('Save dialog was cancelled.', 'info');
        } else {
          console.error('Error saving file:', err);
          showAlert('Could not save the file.', 'error');
          
          // Fallback for browsers that don't support File System Access API
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = defaultFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
      }
    } else {
      // Fallback for browsers that don't support File System Access API
      console.warn('File System Access API not supported, using fallback download.');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = defaultFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showAlert('File downloaded (File System API not supported in your browser).', 'info');
    }
  };
  
  // Trigger markdown file input
  const handleLoadMarkdownTrigger = () => {
    markdownInputRef.current?.click();
  };
  
  // Handle markdown file selection
  const handleMarkdownFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdown(content);
        showAlert(`Markdown file loaded: ${file.name}`, "success");
        
        // Reset input value
        if (e.target) {
          e.target.value = '';
        }
      };
      
      reader.onerror = (error) => {
        console.error("Error reading markdown file:", error);
        showAlert("Error reading the markdown file", "error");
      };
      
      reader.readAsText(file);
    }
  };
  
  // Define keyboard shortcuts
  const markdownKeymap = keymap.of([
    {
      key: "Mod-b",
      run: () => {
        applyMarkdownStyle('**', '**');
        return true;
      },
    },
    {
      key: "Mod-i",
      run: () => {
        applyMarkdownStyle('*', '*');
        return true;
      },
    },
    {
      key: "Mod-`",
      run: () => {
        applyMarkdownStyle('`', '`');
        return true;
      },
    },
  ]);
  
  // Export as PDF
  const exportAsPDF = async () => {
    if (!markdown) {
      showAlert("No content to export!", "info");
      return;
    }
    
    try {
      // Preparar el HTML para imprimir
      const doc = document.createElement('div');
      doc.innerHTML = markdownProcessor.process(markdown);
      
      // Aplicar estilos
      const style = document.createElement('style');
      style.textContent = css || ''; // Usar el CSS cargado o vacío
      doc.prepend(style);
      
      // Crear un iframe temporal para imprimir
      const printFrame = document.createElement('iframe');
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = '0';
      
      document.body.appendChild(printFrame);
      
      printFrame.onload = () => {
        if (!printFrame.contentWindow) {
          showAlert("Error preparing PDF export", "error");
          return;
        }
        
        // Añadir contenido al iframe
        const frameDoc = printFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Export - V2 CSS Flotantes</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              @media print {
                body { margin: 0; padding: 10px; }
                @page { size: A4; margin: 10mm; }
              }
              ${css || ''}
            </style>
          </head>
          <body>
            ${markdownProcessor.process(markdown)}
          </body>
          </html>
        `);
        frameDoc.close();
        
        // Retraso para asegurar que los estilos se apliquen
        setTimeout(() => {
          try {
            printFrame.contentWindow?.print();
            showAlert("PDF export initiated", "success");
          } catch (e) {
            console.error("Error printing:", e);
            showAlert("Error during PDF export", "error");
          }
          
          // Limpiar después de un tiempo
          setTimeout(() => {
            document.body.removeChild(printFrame);
          }, 5000);
        }, 500);
      };
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      showAlert("Error preparing PDF export", "error");
    }
  };
  
  // Aplicar el modo oscuro al documento
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Cargar plantilla CSS
  const loadTemplate = async (templateId: string) => {
    try {
      console.log(`Loading template: ${templateId}`);
      const templateManager = TemplateManager.getInstance();
      const cssText = await templateManager.loadTemplate(templateId);
      
      console.log(`Template ${templateId} loaded, length: ${cssText.length} chars`);
      
      // Guardar la plantilla actual
      templateManager.setCurrentTemplateId(templateId);
      
      // Actualizar el estado de CSS
      setCSS(cssText);
      
      // Aplicar inmediatamente el CSS (no esperar al efecto)
      setTimeout(() => {
        const success = applyCSS(cssText);
        if (success) {
          console.log(`Template CSS for '${templateId}' applied successfully`);
          showAlert(`Template '${templateId}' loaded successfully`, 'success');
          
          // Actualizar el contenido para que refleje los nuevos estilos
          updateIframeContent(markdown);
        } else {
          console.error(`Failed to apply template CSS for '${templateId}'`);
          showAlert(`Template '${templateId}' loaded but styles not applied. Try "Apply CSS" button.`, 'info');
        }
      }, 100);
    } catch (error) {
      console.error('Error loading template:', error);
      showAlert(`Error loading template '${templateId}'`, 'error');
    }
  };
  
  // Cargar la plantilla cuando cambia
  useEffect(() => {
    if (currentTemplate) {
      loadTemplate(currentTemplate);
    }
  }, [currentTemplate]);
  
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
                  
                  const success = applyCSS(css);
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