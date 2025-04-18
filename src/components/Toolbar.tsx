import React, { useState } from 'react';
import { useStore } from '../store';

interface ToolbarProps {
  onPanelDirectionToggle: () => void;
  onSidebarToggle: () => void;
  panelDirection: 'horizontal' | 'vertical';
  sidebarOpen: boolean;
  onTogglePreview?: () => void; // Controla si la vista previa se muestra u oculta completamente
  showPreview?: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onPanelDirectionToggle,
  onSidebarToggle,
  panelDirection,
  sidebarOpen,
  onTogglePreview,
  showPreview = true
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  const toggleExportMenu = () => {
    setExportMenuOpen(!exportMenuOpen);
    setSettingsMenuOpen(false); // Cerrar otros menús
  };

  const toggleSettingsMenu = () => {
    setSettingsMenuOpen(!settingsMenuOpen);
    setExportMenuOpen(false); // Cerrar otros menús
  };

  const handleExport = (format: 'pdf' | 'html' | 'markdown') => {
    console.log(`Exporting as ${format}`);
    setExportMenuOpen(false);
    // Implementación futura: lógica de exportación real
    
    // Notificación temporal
    alert(`Exportación a ${format.toUpperCase()} simulada. Esta funcionalidad será implementada pronto.`);
  };

  // Cierra los menús cuando se hace clic fuera de ellos
  const handleClickOutside = () => {
    setExportMenuOpen(false);
    setSettingsMenuOpen(false);
  };

  return (
    <div className="toolbar bg-gray-900 border-b border-gray-700 p-2">
      <div className="container mx-auto flex justify-between items-center">
        {/* Sección izquierda */}
        <div className="flex items-center gap-2">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded hover:bg-gray-700 text-white"
            title={sidebarOpen ? "Cerrar plantillas" : "Ver plantillas"}
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>
          
          <span className="text-white font-semibold mx-2">Universal Scribe</span>
          
          <div className="border-l border-gray-700 h-6 mx-2"></div>
          
          {/* Botón de guardar */}
          <button
            className="p-2 rounded hover:bg-gray-700 text-white flex items-center"
            title="Guardar (Ctrl+S)"
            onClick={() => {
              const event = new KeyboardEvent('keydown', {
                key: 's',
                code: 'KeyS',
                ctrlKey: true,
                bubbles: true
              });
              document.dispatchEvent(event);
            }}
          >
            <span className="mr-1">💾</span>
            <span className="text-sm">Guardar</span>
          </button>
          
          {/* Menú de exportación */}
          <div className="relative">
            <button
              className="p-2 rounded hover:bg-gray-700 text-white flex items-center"
              title="Exportar documento"
              onClick={toggleExportMenu}
            >
              <span className="mr-1">📤</span>
              <span className="text-sm">Exportar</span>
              <span className="ml-1">{exportMenuOpen ? '▲' : '▼'}</span>
            </button>
            
            {exportMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={handleClickOutside}></div>
                <div className="absolute left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
                  <button
                    className="w-full text-left p-2 hover:bg-gray-700 text-white text-sm"
                    onClick={() => handleExport('pdf')}
                  >
                    Exportar como PDF
                  </button>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-700 text-white text-sm"
                    onClick={() => handleExport('html')}
                  >
                    Exportar como HTML
                  </button>
                  <button
                    className="w-full text-left p-2 hover:bg-gray-700 text-white text-sm"
                    onClick={() => handleExport('markdown')}
                  >
                    Exportar como Markdown
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Sección derecha */}
        <div className="flex items-center gap-2">
          {/* Menú de configuración */}
          <div className="relative">
            <button
              className="p-2 rounded hover:bg-gray-700 text-white flex items-center"
              title="Configuración"
              onClick={toggleSettingsMenu}
            >
              <span className="mr-1">⚙️</span>
              <span className="text-sm">Configuración</span>
              <span className="ml-1">{settingsMenuOpen ? '▲' : '▼'}</span>
            </button>
            
            {settingsMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={handleClickOutside}></div>
                <div className="absolute right-0 mt-1 w-64 bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
                  <div className="p-2 border-b border-gray-700">
                    <h3 className="text-white text-sm font-semibold">Configuración</h3>
                  </div>
                  
                  <div className="p-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">Tema Oscuro</span>
                      <button
                        onClick={toggleDarkMode}
                        className="p-1 rounded-full"
                      >
                        {darkMode ? "☀️" : "🌙"}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm">Dirección de Paneles</span>
                      <button
                        onClick={onPanelDirectionToggle}
                        className="p-1 rounded-full"
                        title={panelDirection === 'horizontal' ? "Cambiar a layout vertical" : "Cambiar a layout horizontal"}
                      >
                        {panelDirection === 'horizontal' ? '⬌' : '⬍'}
                      </button>
                    </div>

                    {onTogglePreview && (
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-sm">Vista Previa</span>
                        <button
                          onClick={onTogglePreview}
                          className="p-1 rounded-full"
                          title={showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
                        >
                          {showPreview ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Botones de acceso rápido */}
          <button 
            onClick={onPanelDirectionToggle}
            className="p-2 rounded hover:bg-gray-700 text-white"
            title={panelDirection === 'horizontal' ? "Cambiar a layout vertical" : "Cambiar a layout horizontal"}
          >
            {panelDirection === 'horizontal' ? '⬌' : '⬍'}
          </button>
          
          {onTogglePreview && (
            <button 
              onClick={onTogglePreview}
              className={`p-2 rounded hover:bg-gray-700 text-white toggle-preview-button ${!showPreview ? 'bg-gray-700' : ''}`}
              title={showPreview ? "Ocultar vista previa" : "Mostrar vista previa"}
            >
              {showPreview ? '👁️' : '👁️‍🗨️'}
            </button>
          )}
          
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded hover:bg-gray-700 text-white"
            title={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar; 