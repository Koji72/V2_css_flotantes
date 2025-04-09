import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownLanguage } from '@codemirror/lang-markdown';
import { create } from 'zustand';
import { FileUp } from 'lucide-react';
import { EditorView, keymap } from '@codemirror/view';
import Toolbar from './components/Toolbar';
import markdownProcessor from './utils/markdownProcessor';
import Alert from './components/Alert';

interface AppState {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  css: string;
  setCSS: (css: string) => void;
}

const useStore = create<AppState>((set) => ({
  markdown: '',
  setMarkdown: (markdown) => set({ markdown }),
  css: '',
  setCSS: (css) => set({ css }),
}));

function App() {
  const { markdown, setMarkdown, css, setCSS } = useStore();
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
  
  // Initialize iframe when component mounts
  useEffect(() => {
    // Define the base HTML for the iframe
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
            .data-matrix {
              width: 100%;
              border-collapse: collapse;
            }
            .data-matrix th {
              text-align: left;
              padding: 8px;
              border-bottom: 2px solid #1e90ff;
              color: #1e90ff;
            }
            .data-matrix td {
              text-align: left;
              padding: 8px;
              border-bottom: 1px solid #ddd;
            }
            .panel-header {
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 2px solid #1e90ff;
            }
          </style>
          <style id="custom-css"></style>
        </head>
        <body>
          <div id="content"></div>
          <script>
            // Notificar que estamos listos
            window.addEventListener('load', function() {
              console.log('iframe fully loaded');
              
              // Asegurarse de que los estilos se apliquen forzando un redibujado
              setTimeout(function() {
                document.body.style.opacity = '0.99';
                setTimeout(function() {
                  document.body.style.opacity = '1';
                }, 10);
              }, 10);
            });
          </script>
        </body>
      </html>
    `;
    
    // Set the iframe source document
    if (iframeRef.current) {
      iframeRef.current.srcdoc = baseHtml;
      
      // Setup onload handler
      iframeRef.current.onload = () => {
        console.log("Iframe loaded successfully");
        
        // Apply initial CSS if any
        if (css) {
          applyCSS(css);
        }
        
        // Update content if there's markdown
        if (markdown) {
          updateIframeContent(markdown);
        }
      };
    }
    
    // Cleanup function
    return () => {
      if (iframeRef.current) {
        iframeRef.current.onload = null;
      }
    };
  }, []);
  
  // Apply CSS to the iframe
  const applyCSS = (cssText: string): boolean => {
    if (!iframeRef.current || !iframeRef.current.contentWindow || !iframeRef.current.contentWindow.document) {
      console.warn("Cannot apply CSS: iframe not available");
      return false;
    }
    
    try {
      const doc = iframeRef.current.contentWindow.document;
      let styleEl = doc.getElementById('custom-css') as HTMLStyleElement;
      
      if (!styleEl) {
        styleEl = doc.createElement('style');
        styleEl.id = 'custom-css';
        doc.head.appendChild(styleEl);
        console.log("CSS style element created");
      }
      
      // Aplicar CSS directamente al elemento style
      styleEl.textContent = cssText;
      
      // Asegurarse de que el CSS se aplique correctamente
      setTimeout(() => {
        doc.body.classList.add('css-applied');
        doc.body.classList.remove('css-applied');
      }, 10);
      
      console.log("CSS applied successfully", cssText.substring(0, 50) + "...");
      return true;
    } catch (error) {
      console.error("Error applying CSS:", error);
      return false;
    }
  };
  
  // Update content in the iframe
  const updateIframeContent = (markdownText: string): boolean => {
    if (!iframeRef.current || !iframeRef.current.contentWindow || !iframeRef.current.contentWindow.document) {
      console.warn("Cannot update content: iframe not available");
      return false;
    }
    
    try {
      // Process markdown to HTML
      const html = markdownProcessor.process(markdownText);
      
      // Update content
      const doc = iframeRef.current.contentWindow.document;
      const contentElement = doc.getElementById('content');
      
      if (contentElement) {
        contentElement.innerHTML = html;
        console.log("Iframe content updated");
        return true;
      } else {
        console.warn("Content element not found in iframe");
        return false;
      }
    } catch (error) {
      console.error("Error updating iframe content:", error);
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
          showAlert(`CSS loaded successfully: ${file.name}`, "success");
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
  
  return (
    <div className="h-screen flex flex-col">
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
      <header className="bg-inf-tertiary p-4">
        <h1 className="text-2xl font-title text-inf-primary">Infinity Game Visual Aesthetic</h1>
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