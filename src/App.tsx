import { useState, useEffect, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown as markdownLanguage } from '@codemirror/lang-markdown';
import { create } from 'zustand';
// import { ResizablePanelGroup, ResizablePanel, PanelResizeHandle } from 'react-resizable-panels'; // Eliminada importación no usada
import { FileUp } from 'lucide-react';
import { marked } from 'marked';
import { EditorView, keymap } from '@codemirror/view';
import Toolbar from './components/Toolbar';

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
  const [previewHtml, setPreviewHtml] = useState('');
  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const markdownInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      // Restaurar lógica original
      try {
        console.log("Processing Markdown after debounce...");

        let processedMd = markdown.replace(/::: *([\w-]+) */g, '<div class="mixed-panel $1">');
        processedMd = processedMd.replace(/:::/g, '</div>');

        // Usar marked.parse() con opciones para asegurar que GFM (tablas) esté activo
        // y confiar en que no sanitiza por defecto (o configurar según sea necesario)
        const html = marked.parse(processedMd, { gfm: true }); 
        setPreviewHtml(html as string);

      } catch (error) {
        console.error("Error processing Markdown:", error);
        setPreviewHtml('<p style="color: red;">Error rendering preview</p>'); // Mostrar error en preview
      }
      // ---- Fin lógica original ----

      // ---- Quitar HTML fijo ----
      // setPreviewHtml(`<h1>Preview Test</h1><p>Markdown content: ${markdown}</p>`);
      // ---- Fin quitar ----

    }, 250);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [markdown]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCSS(content);
      };
      reader.readAsText(file);
    }
  };

  const iframeSrcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { margin: 0; padding: 10px; }
        ${css}
      </style>
    </head>
    <body>
      ${previewHtml}
    </body>
    </html>
  `;

  const applyMarkdownStyle = (syntaxStart: string, syntaxEnd?: string) => {
    console.log(`applyMarkdownStyle called with: ${syntaxStart}`);
    if (!editorView) {
      console.log('Editor view not found');
      return;
    }
    const end = syntaxEnd ?? syntaxStart;
    
    const changes = editorView.state.changeByRange((range) => {
      console.log('Current range:', range.from, range.to);
      
      if (range.from === range.to) {
        console.log('Selection is empty, doing nothing.');
        return { range };
      }

      // Comprobación más detallada para isAlreadyWrapped
      const textBefore = editorView.state.doc.sliceString(Math.max(0, range.from - syntaxStart.length), range.from);
      const textAfter = editorView.state.doc.sliceString(range.to, Math.min(editorView.state.doc.length, range.to + end.length));
      console.log(`Checking wrap: Looking for '${syntaxStart}' before -> Found: '${textBefore}'`);
      console.log(`Checking wrap: Looking for '${end}' after -> Found: '${textAfter}'`);
      
      const isAlreadyWrapped = textBefore === syntaxStart && textAfter === end;
      console.log('isAlreadyWrapped determined as:', isAlreadyWrapped); // Log 3

      if (isAlreadyWrapped) {
        console.log('Unwrapping...');
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

  // Función para insertar un bloque de texto
  const insertBlock = (blockText: string) => {
    if (!editorView) return;
    const { from, to } = editorView.state.selection.main;
    editorView.dispatch({
      changes: { from, to, insert: blockText },
      // Especificar la nueva posición del cursor (después del texto insertado)
      selection: { anchor: from + blockText.length }
    });
    editorView.focus();
    setMarkdown(editorView.state.doc.toString());
  };

  // Función para guardar el archivo Markdown (con Save File Picker)
  const handleSave = async () => { // Convertir a async
    const currentMarkdown = useStore.getState().markdown;
    if (!currentMarkdown && currentMarkdown !== '') { // Permitir guardar archivo vacío
      alert("Nothing to save!");
      return;
    }

    const blob = new Blob([currentMarkdown], { type: 'text/markdown;charset=utf-8' });
    const defaultFilename = 'saved_content.md';

    // Intentar usar la API moderna
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
      } catch (err) {
        // Manejar errores comunes: el usuario canceló el diálogo o hubo otro error
        if (err instanceof DOMException && err.name === 'AbortError') {
          console.log('Save dialog was cancelled by the user.');
        } else {
          console.error('Error saving file with File System Access API:', err);
          // Podríamos intentar el fallback aquí si queremos
          alert('Could not save the file using the new method.'); 
        }
      }
    } else {
      // Fallback para navegadores antiguos (descarga directa)
      console.warn('File System Access API not supported, using fallback download.');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = defaultFilename; // Usar el nombre por defecto aquí
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Función para disparar el clic en el input de carga de Markdown
  const handleLoadMarkdownTrigger = () => {
    markdownInputRef.current?.click();
  };

  // Función que maneja la selección de un archivo Markdown
  const handleMarkdownFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setMarkdown(content); // Actualizar el estado global
        // Resetear el valor del input para permitir cargar el mismo archivo de nuevo
        if (e.target) {
          e.target.value = '';
        }
      };
      reader.onerror = (error) => {
        console.error("Error reading markdown file:", error);
        alert("Error reading the markdown file.");
      };
      reader.readAsText(file);
    }
  };

  // Función para cargar CSS (cambiado nombre para claridad)
  const handleLoadCssFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("CSS File input changed"); // Log 1
    const file = e.target.files?.[0];
    if (file) {
      console.log("CSS File selected:", file.name); // Log 2
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log("CSS content loaded, length:", content?.length); // Log 3
        setCSS(content);
         if (e.target) {
          (e.target as unknown as HTMLInputElement).value = '';
        }
      };
       reader.onerror = (error) => {
        console.error("Error reading css file:", error);
        alert("Error reading the css file.");
      };
      reader.readAsText(file);
    } else {
      console.log("No CSS file selected or input cleared"); // Log 4
    }
  };

  // Definir los atajos de teclado DENTRO de App
  const markdownKeymap = keymap.of([
    {
      key: "Mod-b",
      run: (view) => {
        console.log("Keymap run: Mod-b triggered");
        applyMarkdownStyle('**', '**');
        return true;
      },
    },
    {
      key: "Mod-h",
      run: (view) => {
        console.log("Keymap run: Mod-h (Italic test) triggered");
        applyMarkdownStyle('*', '*');
        return true;
      },
    },
  ]);

  return (
    <div className="h-screen flex flex-col">
      {/* Input oculto para cargar Markdown */}
      <input 
        type="file"
        ref={markdownInputRef}
        accept=".md,text/markdown"
        style={{ display: 'none' }}
        onChange={handleMarkdownFileSelected}
      />

      <header className="bg-inf-tertiary p-4">
        <h1 className="text-2xl font-title text-inf-primary">Infinity Game Visual Aesthetic</h1>
      </header>

      <div className="flex-1 flex flex-row overflow-hidden">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Toolbar 
            onApplyStyle={applyMarkdownStyle} 
            onInsertBlock={insertBlock}
            onSave={handleSave}
            onLoad={handleLoadMarkdownTrigger}
          />
          <div className="flex-1 p-4 overflow-auto">
            <CodeMirror
              value={markdown}
              height="100%"
              extensions={[
                markdownLanguage(), 
                EditorView.lineWrapping, 
                markdownKeymap // Añadir el keymap
              ]}
              onChange={(value) => {
                setMarkdown(value);
              }}
              onCreateEditor={(view) => setEditorView(view)}
              theme="dark"
            />
          </div>
        </div>

        <div className="flex-1 h-full p-4 bg-inf-secondary flex flex-col overflow-auto">
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <h2 className="text-xl font-title text-inf-primary">Preview</h2>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="css-file"
                accept=".css"
                className="hidden"
                onChange={handleLoadCssFileSelected}
              />
              <label
                htmlFor="css-file"
                className="flex items-center gap-2 px-4 py-2 bg-inf-accent1 text-inf-secondary rounded cursor-pointer hover:bg-inf-accent2 transition-colors"
              >
                <FileUp size={20} />
                Load CSS
              </label>
            </div>
          </div>
          <iframe
            srcDoc={iframeSrcDoc}
            title="Preview"
            sandbox="allow-scripts"
            className="flex-1 w-full h-full border-none bg-white"
          />
        </div>
      </div>
    </div>
  );
}

export default App; 