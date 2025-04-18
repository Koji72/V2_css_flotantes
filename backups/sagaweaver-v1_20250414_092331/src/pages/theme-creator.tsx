import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import { SketchPicker } from 'react-color';

// Tipos para el sistema de temas
interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  border: string;
  shadow: string;
  highlight: string;
}

interface ThemeFonts {
  heading: string;
  body: string;
  monospace: string;
}

interface ThemeEffects {
  borderRadius: string;
  borderWidth: string;
  shadowSize: string;
  glowStrength: string;
  animationSpeed: string;
}

interface Theme {
  id?: string;
  name: string;
  description: string;
  colors: ThemeColors;
  fonts: ThemeFonts;
  effects: ThemeEffects;
  createdAt?: Date;
}

// Tema por defecto
const defaultTheme: Theme = {
  name: 'Nuevo Tema',
  description: 'Descripción del tema personalizado',
  colors: {
    primary: '#3B82F6',
    secondary: '#10B981',
    accent: '#8B5CF6',
    background: '#1F2937',
    text: '#F9FAFB',
    border: '#4B5563',
    shadow: '#111827',
    highlight: '#F59E0B'
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Inter, sans-serif',
    monospace: 'Space Mono, monospace'
  },
  effects: {
    borderRadius: '0.5rem',
    borderWidth: '2px',
    shadowSize: '15px',
    glowStrength: '0.5',
    animationSpeed: '1'
  }
};

// Opciones de fuentes disponibles
const fontOptions = [
  'Inter, sans-serif',
  'Roboto, sans-serif',
  'Poppins, sans-serif',
  'Orbitron, sans-serif',
  'Space Mono, monospace',
  'Rajdhani, sans-serif',
  'Syncopate, sans-serif',
  'Merriweather, serif',
  'Noto Serif, serif',
  'Libre Baskerville, serif'
];

export default function ThemeCreator() {
  // Estado para el tema actual
  const [currentTheme, setCurrentTheme] = useState<Theme>({ ...defaultTheme });
  
  // Estado para mostrar/ocultar el color picker
  const [activeColorPicker, setActiveColorPicker] = useState<keyof ThemeColors | null>(null);
  
  // Estado para la lista de temas guardados
  const [savedThemes, setSavedThemes] = useState<Theme[]>([]);
  
  // Estado para el panel de vista previa
  const [previewContent, setPreviewContent] = useState(
    'Este es un panel de ejemplo para visualizar el tema personalizado. El contenido puede incluir **markdown** y otros _estilos_.'
  );

  // Cargar temas guardados al iniciar
  useEffect(() => {
    const storedThemes = localStorage.getItem('sagaWeaver_themes');
    if (storedThemes) {
      try {
        const parsedThemes = JSON.parse(storedThemes);
        setSavedThemes(parsedThemes);
      } catch (e) {
        console.error('Error al cargar temas guardados:', e);
      }
    }
  }, []);

  // Guardar temas cuando cambia la lista
  useEffect(() => {
    if (savedThemes.length > 0) {
      localStorage.setItem('sagaWeaver_themes', JSON.stringify(savedThemes));
    }
  }, [savedThemes]);

  // Función para cambiar un color
  const handleColorChange = (color: any, property: keyof ThemeColors) => {
    setCurrentTheme({
      ...currentTheme,
      colors: {
        ...currentTheme.colors,
        [property]: color.hex
      }
    });
  };

  // Función para cambiar una fuente
  const handleFontChange = (font: string, property: keyof ThemeFonts) => {
    setCurrentTheme({
      ...currentTheme,
      fonts: {
        ...currentTheme.fonts,
        [property]: font
      }
    });
  };

  // Función para cambiar un efecto
  const handleEffectChange = (value: string, property: keyof ThemeEffects) => {
    setCurrentTheme({
      ...currentTheme,
      effects: {
        ...currentTheme.effects,
        [property]: value
      }
    });
  };

  // Función para guardar el tema actual
  const saveTheme = () => {
    if (!currentTheme.name.trim()) {
      alert('Por favor, proporciona un nombre para el tema.');
      return;
    }

    const newTheme: Theme = {
      ...currentTheme,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    setSavedThemes([...savedThemes, newTheme]);
    alert(`Tema "${newTheme.name}" guardado correctamente.`);
  };

  // Función para cargar un tema guardado
  const loadTheme = (theme: Theme) => {
    setCurrentTheme({ ...theme });
  };

  // Función para eliminar un tema guardado
  const deleteTheme = (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este tema?')) {
      const updatedThemes = savedThemes.filter(theme => theme.id !== id);
      setSavedThemes(updatedThemes);

      if (updatedThemes.length === 0) {
        localStorage.removeItem('sagaWeaver_themes');
      }
    }
  };

  // Función para reiniciar el tema actual a los valores por defecto
  const resetTheme = () => {
    if (confirm('¿Estás seguro de que deseas reiniciar el tema a los valores por defecto?')) {
      setCurrentTheme({ ...defaultTheme });
    }
  };

  // Función para exportar un tema como JSON
  const exportTheme = () => {
    const dataStr = JSON.stringify(currentTheme, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${currentTheme.name.replace(/\s+/g, '_').toLowerCase()}_theme.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Función para generar el CSS del tema
  const generateThemeCSS = () => {
    const { colors, fonts, effects } = currentTheme;
    
    return `
.theme-${currentTheme.name.replace(/\s+/g, '-').toLowerCase()} {
  /* Variables de colores */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-background: ${colors.background};
  --color-text: ${colors.text};
  --color-border: ${colors.border};
  --color-shadow: ${colors.shadow};
  --color-highlight: ${colors.highlight};
  
  /* Variables de fuentes */
  --font-heading: ${fonts.heading};
  --font-body: ${fonts.body};
  --font-monospace: ${fonts.monospace};
  
  /* Variables de efectos */
  --border-radius: ${effects.borderRadius};
  --border-width: ${effects.borderWidth};
  --shadow-size: ${effects.shadowSize};
  --glow-strength: ${effects.glowStrength};
  --animation-speed: ${effects.animationSpeed};
  
  /* Aplicar estilos base */
  background-color: var(--color-background);
  color: var(--color-text);
  font-family: var(--font-body);
  border-radius: var(--border-radius);
  border: var(--border-width) solid var(--color-border);
  box-shadow: 0 0 var(--shadow-size) rgba(0, 0, 0, 0.3);
}

.theme-${currentTheme.name.replace(/\s+/g, '-').toLowerCase()} .panel-header {
  font-family: var(--font-heading);
  background-color: var(--color-primary);
  border-bottom: var(--border-width) solid var(--color-border);
}

.theme-${currentTheme.name.replace(/\s+/g, '-').toLowerCase()} .panel-content {
  font-family: var(--font-body);
}

.theme-${currentTheme.name.replace(/\s+/g, '-').toLowerCase()} pre,
.theme-${currentTheme.name.replace(/\s+/g, '-').toLowerCase()} code {
  font-family: var(--font-monospace);
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: calc(var(--border-radius) * 0.5);
}

.theme-${currentTheme.name.replace(/\s+/g, '-').toLowerCase()}.animate-glow {
  animation: theme-glow calc(2s * var(--animation-speed)) infinite alternate;
}

@keyframes theme-glow {
  from {
    box-shadow: 0 0 5px rgba(var(--color-primary-rgb), 0.2), 
                0 0 10px rgba(var(--color-primary-rgb), 0.2);
  }
  to {
    box-shadow: 0 0 20px rgba(var(--color-primary-rgb), var(--glow-strength)), 
                0 0 30px rgba(var(--color-primary-rgb), var(--glow-strength));
  }
}
    `;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Creador de Temas - SagaWeaver</title>
        <meta name="description" content="Crea y personaliza temas para los paneles de SagaWeaver" />
        <style>{`
          .color-preview {
            width: 24px;
            height: 24px;
            display: inline-block;
            border-radius: 4px;
            margin-right: 8px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
          }
          
          .font-preview {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}</style>
      </Head>

      <NavigationBar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-300">
          Creador de Temas
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuración */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-cyan-800 mb-6">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">Información del Tema</h2>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                  <input
                    type="text"
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                    value={currentTheme.name}
                    onChange={(e) => setCurrentTheme({
                      ...currentTheme,
                      name: e.target.value
                    })}
                  />
                </div>
                
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                  <textarea
                    className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 h-20"
                    value={currentTheme.description}
                    onChange={(e) => setCurrentTheme({
                      ...currentTheme,
                      description: e.target.value
                    })}
                  ></textarea>
                </div>
              </div>
            </div>
            
            {/* Colores */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-red-800 mb-6">
              <h2 className="text-xl font-bold mb-4 text-red-400">Colores</h2>
              
              <div className="space-y-4">
                {Object.entries(currentTheme.colors).map(([key, value]) => (
                  <div key={key} className="form-control">
                    <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                      <span
                        className="color-preview"
                        style={{ backgroundColor: value }}
                        onClick={() => setActiveColorPicker(activeColorPicker === key as keyof ThemeColors ? null : key as keyof ThemeColors)}
                      ></span>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </label>
                    
                    {activeColorPicker === key && (
                      <div className="relative z-10 mb-3">
                        <div className="absolute">
                          <SketchPicker
                            color={value}
                            onChange={(color) => handleColorChange(color, key as keyof ThemeColors)}
                            disableAlpha={true}
                          />
                          <div 
                            className="fixed inset-0 z-0"
                            onClick={() => setActiveColorPicker(null)}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    <input
                      type="text"
                      className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                      value={value}
                      onChange={(e) => handleColorChange({ hex: e.target.value }, key as keyof ThemeColors)}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Acciones */}
            <div className="flex space-x-2 mb-6">
              <button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-md py-2 px-4 transition-colors"
                onClick={saveTheme}
              >
                Guardar Tema
              </button>
              <button
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md py-2 px-4 transition-colors"
                onClick={resetTheme}
              >
                Reiniciar
              </button>
              <button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-4 transition-colors"
                onClick={exportTheme}
              >
                Exportar
              </button>
            </div>
          </div>
          
          {/* Vista previa y más configuraciones */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-6">
              {/* Vista previa */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-blue-800">
                <h2 className="text-xl font-bold mb-4 text-blue-400">Vista Previa</h2>
                
                <div className="relative bg-white text-black p-8 rounded-md">
                  <div 
                    className={`floating-element float-left theme-${currentTheme.name.replace(/\s+/g, '-').toLowerCase()}`}
                    style={{ 
                      width: '40%',
                      backgroundColor: currentTheme.colors.background,
                      color: currentTheme.colors.text,
                      fontFamily: currentTheme.fonts.body,
                      borderRadius: currentTheme.effects.borderRadius,
                      borderWidth: currentTheme.effects.borderWidth,
                      borderColor: currentTheme.colors.border,
                      boxShadow: `0 0 ${currentTheme.effects.shadowSize} rgba(0, 0, 0, 0.3)`
                    }}
                  >
                    <div 
                      className="panel-header"
                      style={{
                        backgroundColor: currentTheme.colors.primary,
                        fontFamily: currentTheme.fonts.heading,
                        borderBottomWidth: currentTheme.effects.borderWidth,
                        borderBottomColor: currentTheme.colors.border
                      }}
                    >
                      <h3>{currentTheme.name}</h3>
                    </div>
                    <div 
                      className="panel-content"
                      style={{
                        fontFamily: currentTheme.fonts.body
                      }}
                    >
                      <div dangerouslySetInnerHTML={{ __html: previewContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>') }} />
                      <pre 
                        style={{
                          fontFamily: currentTheme.fonts.monospace,
                          backgroundColor: 'rgba(0, 0, 0, 0.2)',
                          padding: '8px',
                          borderRadius: `calc(${currentTheme.effects.borderRadius} * 0.5)`
                        }}
                      >
                        <code>console.log('Ejemplo de código');</code>
                      </pre>
                    </div>
                  </div>
                  
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
                    nunc nisl aliquam nisl, eget aliquam nunc nisl eget nisl. Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                    Eius, voluptatibus. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  </p>
                  
                  <div style={{ clear: 'both' }}></div>
                  
                  <textarea
                    className="w-full mt-4 bg-gray-200 border-gray-300 text-gray-800 rounded-md p-2"
                    value={previewContent}
                    onChange={(e) => setPreviewContent(e.target.value)}
                    placeholder="Edita este contenido para ver cómo se ve en la vista previa"
                    rows={3}
                  ></textarea>
                </div>
              </div>
              
              {/* Fuentes y Efectos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Fuentes */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-800">
                  <h2 className="text-xl font-bold mb-4 text-purple-400">Fuentes</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(currentTheme.fonts).map(([key, value]) => (
                      <div key={key} className="form-control">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                        <select
                          className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                          value={value}
                          onChange={(e) => handleFontChange(e.target.value, key as keyof ThemeFonts)}
                        >
                          {fontOptions.map(font => (
                            <option key={font} value={font}>
                              {font.split(',')[0]}
                            </option>
                          ))}
                        </select>
                        <div 
                          className="font-preview mt-1 p-2 bg-gray-700 rounded text-sm"
                          style={{ fontFamily: value }}
                        >
                          {value.split(',')[0]} - The quick brown fox jumps over the lazy dog
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Efectos */}
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-green-800">
                  <h2 className="text-xl font-bold mb-4 text-green-400">Efectos</h2>
                  
                  <div className="space-y-4">
                    {Object.entries(currentTheme.effects).map(([key, value]) => (
                      <div key={key} className="form-control">
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                        </label>
                        <input
                          type={
                            key === 'glowStrength' || key === 'animationSpeed' 
                              ? 'range' 
                              : 'text'
                          }
                          min={key === 'glowStrength' || key === 'animationSpeed' ? '0.1' : undefined}
                          max={key === 'glowStrength' || key === 'animationSpeed' ? '2' : undefined}
                          step={key === 'glowStrength' || key === 'animationSpeed' ? '0.1' : undefined}
                          className={
                            key === 'glowStrength' || key === 'animationSpeed'
                              ? 'w-full' 
                              : 'w-full bg-gray-700 border-gray-600 text-white rounded-md p-2'
                          }
                          value={value}
                          onChange={(e) => handleEffectChange(e.target.value, key as keyof ThemeEffects)}
                        />
                        {(key === 'glowStrength' || key === 'animationSpeed') && (
                          <div className="text-right text-xs mt-1">{value}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* CSS Generado */}
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-yellow-800">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">CSS Generado</h2>
                
                <div className="relative">
                  <pre className="bg-gray-900 p-4 rounded-md overflow-x-auto text-sm max-h-96 overflow-y-auto">
                    <code className="text-yellow-300">{generateThemeCSS()}</code>
                  </pre>
                  <button
                    className="absolute top-2 right-2 bg-yellow-700 hover:bg-yellow-800 text-white rounded-md py-1 px-2 text-xs"
                    onClick={() => navigator.clipboard.writeText(generateThemeCSS())}
                  >
                    Copiar CSS
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Temas Guardados */}
        <div className="mt-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold mb-4 text-gray-300">Temas Guardados</h2>
            
            {savedThemes.length === 0 ? (
              <p className="text-gray-400">No hay temas guardados. Crea y guarda un tema para verlo aquí.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedThemes.map((theme) => (
                  <div 
                    key={theme.id} 
                    className="bg-gray-700 rounded-lg overflow-hidden border border-gray-600 hover:border-blue-500 transition-colors"
                  >
                    <div 
                      className="p-3"
                      style={{
                        backgroundColor: theme.colors.background,
                        borderBottom: `${theme.effects.borderWidth} solid ${theme.colors.border}`
                      }}
                    >
                      <h3 
                        className="font-bold text-lg truncate"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.heading
                        }}
                      >
                        {theme.name}
                      </h3>
                      <p 
                        className="text-sm opacity-80 truncate"
                        style={{
                          color: theme.colors.text,
                          fontFamily: theme.fonts.body
                        }}
                      >
                        {theme.description}
                      </p>
                    </div>
                    
                    <div className="flex p-2 justify-between items-center bg-gray-800">
                      <div className="flex">
                        <div className="color-preview" style={{ backgroundColor: theme.colors.primary }}></div>
                        <div className="color-preview" style={{ backgroundColor: theme.colors.secondary }}></div>
                        <div className="color-preview" style={{ backgroundColor: theme.colors.accent }}></div>
                      </div>
                      
                      <div className="flex space-x-1">
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-1 px-2 text-xs transition-colors"
                          onClick={() => loadTheme(theme)}
                        >
                          Cargar
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white rounded-md py-1 px-2 text-xs transition-colors"
                          onClick={() => theme.id && deleteTheme(theme.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 