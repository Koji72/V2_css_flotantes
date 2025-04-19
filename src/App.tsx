import React, { useState, useEffect } from 'react';
import './styles/variables.css';
import './styles/tailwind.css';
import './styles/index.css';
import Editor from './components/Editor';
import Preview from './components/Preview';
import TemplateSelector from './components/TemplateSelector';
import ResizablePanels from './components/ResizablePanels';
import Toolbar from './components/Toolbar';
import { useStore } from './store';
import { templates } from './types/templates';
import NotificationCenter from './components/NotificationCenter';

const App: React.FC = () => {
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const setSelectedTemplate = useStore((state) => state.setSelectedTemplate);
  const setTemplateId = useStore((state) => state.setTemplateId);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panelDirection, setPanelDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [showPreview, setShowPreview] = useState(false);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Actualiza el atributo data-theme en el body para que CSS pueda usar esa variable
    document.body.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const togglePanelDirection = () => {
    setPanelDirection(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Establecer el tema inicial y la plantilla por defecto
  useEffect(() => {
    // Establecer tema oscuro/claro
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    
    // Establecer plantilla por defecto (elegir la primera de la lista)
    if (templates && templates.length > 0) {
      const defaultTemplate = templates.find(t => t.id === 'default') || templates[0];
      setSelectedTemplate(defaultTemplate);
      setTemplateId(defaultTemplate.id);
      console.log('Plantilla por defecto establecida:', defaultTemplate.name);
    }
  }, []);

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <Toolbar 
        onPanelDirectionToggle={togglePanelDirection}
        onSidebarToggle={toggleSidebar}
        panelDirection={panelDirection}
        sidebarOpen={sidebarOpen}
        onTogglePreview={togglePreview}
        showPreview={showPreview}
      />
      
      <main className="main-content">
        {sidebarOpen && (
          <div className="sidebar-left">
            <div className="p-2 border-b border-gray-700">
              <h2 className="text-white font-semibold">Plantillas</h2>
            </div>
            <div className="overflow-auto" style={{ maxHeight: 'calc(100% - 50px)' }}>
              <TemplateSelector />
            </div>
          </div>
        )}
        
        <div className={`editor-container ${sidebarOpen ? 'with-sidebar' : ''}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
          {showPreview ? (
            <ResizablePanels
              leftPanel={<Editor />}
              rightPanel={<Preview />}
              initialLeftWidth={70}
              minLeftWidth={20}
              maxLeftWidth={80}
              direction={panelDirection}
              showRightPanel={true}
            />
          ) : (
            <div className="editor-fullscreen">
              <Editor />
            </div>
          )}
        </div>
      </main>
      
      <footer className="app-footer">
        <p>Universal Scribe V2.6 - Markdown Editor</p>
      </footer>
      <NotificationCenter />
    </div>
  );
};

export default App;