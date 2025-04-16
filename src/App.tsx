import React, { useEffect, useRef, useState } from 'react';
import { useStore } from './store';
import TemplateSelector from './components/TemplateSelector';
import EnhancedToolbar from './components/EnhancedToolbar';
import CodeEditor from './components/CodeEditor';
import PreviewPanel from './components/PreviewPanel';
import './App.css';
import './styles/floating-blocks.css';
import previewManager from './utils/previewManager';
import { Template } from './types/templates';

// La importación de CSS desde public está causando errores - se carga dinámicamente

// Hook personalizado para manejar la lógica del preview
const usePreviewManager = (iframeRef: React.RefObject<HTMLIFrameElement>, markdown: string) => {
  useEffect(() => {
    if (iframeRef.current) {
      previewManager.initialize(iframeRef.current);
    }
    
    return () => {
      previewManager.destroy();
    };
  }, [iframeRef]);

  useEffect(() => {
    if (markdown) {
      previewManager.updateContent(markdown)
        .catch((error: Error) => {
          console.error("Error updating content:", error);
        });
    }
  }, [markdown]);
};

const App: React.FC = () => {
  const { markdown, setMarkdown, darkMode, templateId, setDarkMode, setTemplateId } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [css, setCSS] = useState('');
  const [selection, setSelection] = useState<{ start: number; end: number } | null>(null);
  const [templateSelectorCollapsed, setTemplateSelectorCollapsed] = useState(false);

  // Usar el hook personalizado
  usePreviewManager(iframeRef, markdown);

  useEffect(() => {
    if (!markdown) {
      handleLoadDemo('panel-showcase-v2.6.md');
    }
  }, [markdown]);

  // Cargar plantilla por defecto al iniciar
  useEffect(() => {
    if (!templateId) {
      handleLoadCSS('/templates/default.css');
    }
  }, [templateId]);

  const handleTemplateSelect = (template: Template) => {
    setTemplateId(template.id);
    handleLoadCSS(`/templates/${template.id}.css`);
    // Colapsar el selector después de seleccionar en dispositivos móviles
    if (window.innerWidth <= 768) {
      setTemplateSelectorCollapsed(true);
    }
  };

  const handleLoadCSS = async (templatePath: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(templatePath);
      if (!response.ok) {
        throw new Error(`Failed to load CSS: ${response.status}`);
      }
      const cssText = await response.text();
      setCSS(cssText);
      
      // Aplicar CSS al iframe
      if (iframeRef.current?.contentDocument?.head) {
        const styleElement = iframeRef.current.contentDocument.head.querySelector('#template-style');
        if (styleElement) {
          styleElement.textContent = cssText;
        } else {
          const newStyle = iframeRef.current.contentDocument.createElement('style');
          newStyle.id = 'template-style';
          newStyle.textContent = cssText;
          iframeRef.current.contentDocument.head.appendChild(newStyle);
        }
      }
    } catch (error) {
      console.error('Error loading CSS:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        const text = await file.text();
        setMarkdown(text);
      } catch (error) {
        console.error('Error loading file:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLoadDemo = async (demoFile: string = 'panel-styles-demo.md') => {
    setIsLoading(true);
    try {
      const response = await fetch(demoFile);
      if (!response.ok) {
        throw new Error(`Failed to load demo: ${response.status}`);
      }
      const text = await response.text();
      setMarkdown(text);
    } catch (error) {
      console.error('Error loading demo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyStyle = (style: string) => {
    const currentSelection = selection;
    if (!currentSelection || currentSelection.start === currentSelection.end) {
      const cursorPos = currentSelection?.start ?? 0;
      const before = markdown.substring(0, cursorPos);
      const after = markdown.substring(cursorPos);
      setMarkdown(before + style.replace('texto', '') + after);
    } else {
      const before = markdown.substring(0, currentSelection.start);
      const selected = markdown.substring(currentSelection.start, currentSelection.end);
      const after = markdown.substring(currentSelection.end);
      setMarkdown(before + style.replace('texto', selected) + after);
    }
  };

  const handleInsertBlock = (block: string) => {
    const cursorPos = selection?.start ?? 0;
    const before = markdown.substring(0, cursorPos);
    const after = markdown.substring(cursorPos);
    setMarkdown(before + '\n' + block + '\n' + after);
  };

  const toggleTemplateSelector = () => {
    setTemplateSelectorCollapsed(!templateSelectorCollapsed);
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark-mode' : ''}`}>
      <EnhancedToolbar
        onFileLoad={handleFileLoad}
        onLoadDemo={handleLoadDemo}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        darkMode={darkMode}
        isLoading={isLoading}
        onApplyStyle={handleApplyStyle}
        onInsertBlock={handleInsertBlock}
      />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col w-1/2 border-r overflow-hidden" style={{borderColor: "var(--border-color)"}}>
          <div className={`template-selector-wrapper transition-all duration-300 ease-in-out overflow-y-auto ${templateSelectorCollapsed ? 'h-10' : 'h-auto max-h-[40vh]'}`}>
            <div className="flex justify-between items-center px-3 py-2 border-b cursor-pointer bg-opacity-90" 
                 style={{borderColor: "var(--border-color)", backgroundColor: "var(--bg-tertiary)"}}
                 onClick={toggleTemplateSelector}>
              <h2 className="font-medium text-sm" style={{color: "var(--text-primary)"}}>
                {templateSelectorCollapsed ? 'Mostrar Plantillas' : 'Plantillas Disponibles'}
              </h2>
              <button className="p-1 rounded hover:bg-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${templateSelectorCollapsed ? '' : 'transform rotate-180'}`} 
                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            <div className={`${templateSelectorCollapsed ? 'hidden' : 'block'}`}>
              <TemplateSelector onSelect={handleTemplateSelect} />
            </div>
          </div>
          <div className="flex-1 overflow-auto min-h-0">
            <CodeEditor
              value={markdown}
              onChange={(value) => setMarkdown(value)}
              darkMode={darkMode}
              onSelectionChange={setSelection}
            />
          </div>
        </div>
        <div className="w-1/2 overflow-hidden">
          <PreviewPanel iframeRef={iframeRef} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};

export default App;