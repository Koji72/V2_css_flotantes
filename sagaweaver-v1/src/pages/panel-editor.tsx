import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import { icons } from 'lucide-react';

// Estilos para el editor
const editorStyles = {
  tech: 'tech',
  fantasy: 'fantasy',
  neo: 'neo',
  glass: 'glass',
  hologram: 'hologram',
  metal: 'metal',
  scroll: 'scroll',
  circuit: 'circuit',
  'tech-corners': 'tech-corners',
  'cut-corners': 'cut-corners',
  'corner-brackets': 'corner-brackets',
  default: 'default'
};

// Animaciones disponibles
const animationStyles = {
  none: 'none',
  pulse: 'pulse',
  rotate: 'rotate',
  fade: 'fade',
  glow: 'glow',
  shake: 'shake'
};

// Posiciones para paneles flotantes
const positions = {
  left: 'left',
  right: 'right',
  center: 'center'
};

// Opciones para panel
interface PanelOptions {
  style: keyof typeof editorStyles;
  position: keyof typeof positions;
  animation: keyof typeof animationStyles;
  title: string;
  content: string;
  width: string;
  iconName: string;
  customClass: string;
}

export default function PanelEditor() {
  // Estado inicial para opciones del panel
  const [panelOptions, setPanelOptions] = useState<PanelOptions>({
    style: 'tech',
    position: 'left',
    animation: 'none',
    title: 'Panel de ejemplo',
    content: 'Este es un panel personalizable. Edita su contenido, estilo y animación a través del panel de control.',
    width: '40%',
    iconName: '',
    customClass: ''
  });

  // Estado para el código generado
  const [generatedCode, setGeneratedCode] = useState<{markdown: string, jsx: string}>({
    markdown: '',
    jsx: ''
  });

  // Estado para mostrar el historial
  const [showHistory, setShowHistory] = useState(false);
  
  // Historial de paneles guardados
  const [panelHistory, setPanelHistory] = useState<PanelOptions[]>([]);

  // Generar código cuando las opciones cambian
  useEffect(() => {
    // Generar código Markdown
    const markdownAttrs = [
      `style=${panelOptions.style}`,
      `width=${panelOptions.width}`,
      `title="${panelOptions.title}"`
    ];
    
    if (panelOptions.animation !== 'none') {
      markdownAttrs.push(`animation=${panelOptions.animation}`);
    }
    
    if (panelOptions.customClass) {
      markdownAttrs.push(`class="${panelOptions.customClass}"`);
    }
    
    const markdown = `:::float[${panelOptions.position}]{${markdownAttrs.join(' ')}}
${panelOptions.content}
:::`;

    // Generar código JSX
    const jsxAttrs = [
      `style="${panelOptions.style}"`,
      `position="${panelOptions.position}"`,
      `title="${panelOptions.title}"`,
      `width="${panelOptions.width}"`
    ];
    
    if (panelOptions.animation !== 'none') {
      jsxAttrs.push(`animation="${panelOptions.animation}"`);
    }
    
    if (panelOptions.customClass) {
      jsxAttrs.push(`className="${panelOptions.customClass}"`);
    }
    
    if (panelOptions.iconName) {
      jsxAttrs.push(`icon={icons.${panelOptions.iconName}}`);
    }
    
    const jsx = `<FloatingElement
  ${jsxAttrs.join('\n  ')}
>
  ${panelOptions.content}
</FloatingElement>`;

    setGeneratedCode({ markdown, jsx });
  }, [panelOptions]);

  // Función para guardar el panel actual en el historial
  const savePanel = () => {
    setPanelHistory([...panelHistory, { ...panelOptions }]);
  };

  // Función para cargar un panel del historial
  const loadPanel = (panel: PanelOptions) => {
    setPanelOptions({ ...panel });
  };

  // Función para borrar un panel del historial
  const deletePanel = (index: number) => {
    const newHistory = [...panelHistory];
    newHistory.splice(index, 1);
    setPanelHistory(newHistory);
  };

  // Lista de iconos disponibles (primeros 20 para simplicidad)
  const iconList = Object.keys(icons).slice(0, 20);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Panel Editor - SagaWeaver</title>
        <meta name="description" content="Editor interactivo para crear paneles personalizados" />
      </Head>

      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-300">
          Editor de Paneles
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Panel de Control */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-cyan-800 mb-4">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">Configuración</h2>
              
              <div className="space-y-4">
                {/* Estilo */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Estilo</label>
                  <select
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                    value={panelOptions.style}
                    onChange={(e) => setPanelOptions({
                      ...panelOptions,
                      style: e.target.value as keyof typeof editorStyles
                    })}
                  >
                    {Object.keys(editorStyles).map((style) => (
                      <option key={style} value={style}>{style}</option>
                    ))}
                  </select>
                </div>
                
                {/* Posición */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Posición</label>
                  <div className="flex space-x-2">
                    {Object.keys(positions).map((position) => (
                      <button
                        key={position}
                        className={`flex-1 py-2 rounded-md transition-colors ${
                          panelOptions.position === position
                            ? 'bg-cyan-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                        onClick={() => setPanelOptions({
                          ...panelOptions,
                          position: position as keyof typeof positions
                        })}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Animación */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Animación</label>
                  <select
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                    value={panelOptions.animation}
                    onChange={(e) => setPanelOptions({
                      ...panelOptions,
                      animation: e.target.value as keyof typeof animationStyles
                    })}
                  >
                    {Object.keys(animationStyles).map((animation) => (
                      <option key={animation} value={animation}>{animation}</option>
                    ))}
                  </select>
                </div>
                
                {/* Ancho */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Ancho</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                    value={panelOptions.width}
                    onChange={(e) => setPanelOptions({
                      ...panelOptions,
                      width: e.target.value
                    })}
                  />
                </div>
                
                {/* Título */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                    value={panelOptions.title}
                    onChange={(e) => setPanelOptions({
                      ...panelOptions,
                      title: e.target.value
                    })}
                  />
                </div>
                
                {/* Icono */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Icono (JSX)</label>
                  <select
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                    value={panelOptions.iconName}
                    onChange={(e) => setPanelOptions({
                      ...panelOptions,
                      iconName: e.target.value
                    })}
                  >
                    <option value="">Ninguno</option>
                    {iconList.map((icon) => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
                
                {/* Clase personalizada */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Clase CSS personalizada</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                    value={panelOptions.customClass}
                    onChange={(e) => setPanelOptions({
                      ...panelOptions,
                      customClass: e.target.value
                    })}
                  />
                </div>
                
                {/* Contenido */}
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Contenido</label>
                  <textarea
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 h-32"
                    value={panelOptions.content}
                    onChange={(e) => setPanelOptions({
                      ...panelOptions,
                      content: e.target.value
                    })}
                  />
                </div>
              </div>
              
              {/* Botón para guardar */}
              <button
                className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white rounded-md py-2 px-4 transition-colors"
                onClick={savePanel}
              >
                Guardar en Historial
              </button>
            </div>
            
            {/* Botón para toggle historial en móvil */}
            <button
              className="lg:hidden w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 px-4 transition-colors mb-4"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Ocultar Historial' : 'Mostrar Historial'}
            </button>
            
            {/* Historial en móvil */}
            <div className={`lg:hidden ${showHistory ? 'block' : 'hidden'}`}>
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-800">
                <h2 className="text-xl font-bold mb-4 text-purple-400">Historial</h2>
                
                {panelHistory.length === 0 ? (
                  <p className="text-gray-400">No hay paneles guardados.</p>
                ) : (
                  <div className="space-y-3">
                    {panelHistory.map((panel, index) => (
                      <div key={index} className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{panel.title}</p>
                          <p className="text-xs text-gray-400">{panel.style} / {panel.position}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1 px-2 text-sm transition-colors"
                            onClick={() => loadPanel(panel)}
                          >
                            Cargar
                          </button>
                          <button
                            className="bg-red-600 hover:bg-red-700 text-white rounded-md py-1 px-2 text-sm transition-colors"
                            onClick={() => deletePanel(index)}
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Vista previa y código */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              {/* Vista previa */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-blue-800">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Vista Previa</h2>
                
                <div className="relative bg-white text-black p-8 rounded-md min-h-40">
                  <div
                    className={`
                      floating-element 
                      float-${panelOptions.position} 
                      floating-${panelOptions.style} 
                      ${panelOptions.animation !== 'none' ? `animate-${panelOptions.animation}` : ''} 
                      ${panelOptions.customClass}
                    `}
                    style={{ width: panelOptions.width }}
                  >
                    {panelOptions.title && (
                      <div className="panel-header">
                        <h3>{panelOptions.title}</h3>
                      </div>
                    )}
                    <div className="panel-content" dangerouslySetInnerHTML={{ __html: panelOptions.content }} />
                  </div>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
                    nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
                    nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Eius, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo nostrum nulla aspernatur voluptatem 
                    vitae tenetur incidunt, autem accusantium dolores similique! lorem.
                  </p>
                  <p>
                    Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. 
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, voluptatem. Nullam auctor, nisl eget 
                    ultricies tincidunt, nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl.
                  </p>
                </div>
              </div>
              
              {/* Código generado */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-green-800">
                  <h2 className="text-xl font-bold mb-4 text-green-400">Markdown</h2>
                  <div className="relative">
                    <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
                      <code className="text-green-300">{generatedCode.markdown}</code>
                    </pre>
                    <button
                      className="absolute top-2 right-2 bg-green-700 hover:bg-green-800 text-white rounded-md py-1 px-2 text-xs"
                      onClick={() => navigator.clipboard.writeText(generatedCode.markdown)}
                    >
                      Copiar
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-800">
                  <h2 className="text-xl font-bold mb-4 text-purple-400">JSX</h2>
                  <div className="relative">
                    <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm">
                      <code className="text-purple-300">{generatedCode.jsx}</code>
                    </pre>
                    <button
                      className="absolute top-2 right-2 bg-purple-700 hover:bg-purple-800 text-white rounded-md py-1 px-2 text-xs"
                      onClick={() => navigator.clipboard.writeText(generatedCode.jsx)}
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Historial en desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-800">
              <h2 className="text-xl font-bold mb-4 text-purple-400">Historial</h2>
              
              {panelHistory.length === 0 ? (
                <p className="text-gray-400">No hay paneles guardados.</p>
              ) : (
                <div className="space-y-3">
                  {panelHistory.map((panel, index) => (
                    <div key={index} className="bg-gray-700 rounded-md p-3 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{panel.title}</p>
                        <p className="text-xs text-gray-400">{panel.style} / {panel.position}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1 px-2 text-sm transition-colors"
                          onClick={() => loadPanel(panel)}
                        >
                          Cargar
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white rounded-md py-1 px-2 text-sm transition-colors"
                          onClick={() => deletePanel(index)}
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 