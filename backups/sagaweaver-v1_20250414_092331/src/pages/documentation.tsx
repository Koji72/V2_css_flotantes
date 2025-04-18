import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Layout, FileText, Table2 } from 'lucide-react';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState('floating');

  const tabs = [
    { id: 'floating', label: 'Elementos Flotantes', icon: <Layout size={18} /> },
    { id: 'rpg', label: 'Paneles RPG', icon: <FileText size={18} /> },
    { id: 'tables', label: 'Tablas Mejoradas', icon: <Table2 size={18} /> }
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>SagaWeaver - Documentación</title>
        <meta name="description" content="Documentación completa de los componentes de SagaWeaver" />
      </Head>

      <Link 
        href="/" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
      >
        <ChevronLeft className="mr-1 h-5 w-5" />
        <span>Volver al inicio</span>
      </Link>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Documentación</h1>
        <p className="text-lg text-gray-600">Guía completa para integrar los componentes de SagaWeaver en tus proyectos</p>
      </header>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-indigo-100">
              <h2 className="font-semibold text-indigo-800">Componentes</h2>
            </div>
            <nav className="p-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-md flex items-center text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-900 mb-3">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/floating-elements-demo" className="text-indigo-600 hover:text-indigo-800">
                  Demo de Elementos Flotantes
                </Link>
              </li>
              <li>
                <Link href="/rpg-panels-demo" className="text-indigo-600 hover:text-indigo-800">
                  Demo de Paneles RPG
                </Link>
              </li>
              <li>
                <Link href="/enhanced-tables-demo" className="text-indigo-600 hover:text-indigo-800">
                  Demo de Tablas Mejoradas
                </Link>
              </li>
              <li>
                <a href="https://github.com/usuario/sagaweaver" className="text-indigo-600 hover:text-indigo-800">
                  Repositorio GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'floating' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Elementos Flotantes</h2>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                    <p className="text-gray-700">
                      Los elementos flotantes permiten crear diseños más dinámicos donde el contenido puede 
                      fluir alrededor de paneles que flotan a la izquierda, derecha o se muestran centrados.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Propiedades del Componente</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left border">Propiedad</th>
                            <th className="px-4 py-2 text-left border">Tipo</th>
                            <th className="px-4 py-2 text-left border">Valor Predeterminado</th>
                            <th className="px-4 py-2 text-left border">Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border"><code>position</code></td>
                            <td className="px-4 py-2 border"><code>left | right | center</code></td>
                            <td className="px-4 py-2 border"><code>right</code></td>
                            <td className="px-4 py-2 border">Posición del elemento flotante</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>style</code></td>
                            <td className="px-4 py-2 border"><code>string</code></td>
                            <td className="px-4 py-2 border"><code>default</code></td>
                            <td className="px-4 py-2 border">Estilo visual del elemento (tech, hologram, neo, etc.)</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>width</code></td>
                            <td className="px-4 py-2 border"><code>string</code></td>
                            <td className="px-4 py-2 border"><code>30%</code></td>
                            <td className="px-4 py-2 border">Ancho del elemento (%, px, rem, etc.)</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>title</code></td>
                            <td className="px-4 py-2 border"><code>string</code></td>
                            <td className="px-4 py-2 border"><code>''</code></td>
                            <td className="px-4 py-2 border">Título del elemento flotante</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>animation</code></td>
                            <td className="px-4 py-2 border"><code>pulse | glow | scan | none</code></td>
                            <td className="px-4 py-2 border"><code>none</code></td>
                            <td className="px-4 py-2 border">Efecto de animación aplicado al elemento</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>className</code></td>
                            <td className="px-4 py-2 border"><code>string</code></td>
                            <td className="px-4 py-2 border"><code>''</code></td>
                            <td className="px-4 py-2 border">Clases CSS adicionales</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Ejemplo de Uso</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Importación del componente
import { FloatingElement } from '../components/FloatingElement';

// Uso básico
<FloatingElement 
  position="left"
  title="Elemento Flotante"
  style="tech"
  width="35%"
  animation="pulse"
>
  <p>Este es un elemento que flota a la izquierda con estilo tech y animación.</p>
</FloatingElement>

// Contenido que fluye alrededor
<p>Texto que fluye alrededor del elemento flotante...</p>`}
                    </pre>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'rpg' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Paneles RPG</h2>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                    <p className="text-gray-700">
                      Los paneles RPG ofrecen un diseño de dos columnas optimizado para hojas de personaje,
                      documentación de juegos y cualquier contenido que requiera una organización visual clara
                      con un estilo temático de juego de rol.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Estructura HTML</h3>
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<section className="rpg-panel">
  {/* Esquinas decorativas */}
  <div className="rpg-corner rpg-corner--tl"></div>
  <div className="rpg-corner rpg-corner--tr"></div>
  <div className="rpg-corner rpg-corner--bl"></div>
  <div className="rpg-corner rpg-corner--br"></div>
  
  {/* Encabezado del panel */}
  <div className="rpg-panel__header">
    Título del Panel
  </div>
  
  {/* Layout de dos columnas */}
  <div className="rpg-columns">
    <div className="rpg-column rpg-column--left">
      <div className="rpg-column__header">Título Columna Izquierda</div>
      {/* Contenido columna izquierda */}
    </div>
    
    <div className="rpg-column rpg-column--right">
      <div className="rpg-column__header">Título Columna Derecha</div>
      {/* Contenido columna derecha */}
    </div>
  </div>
</section>`}
                    </pre>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Clases CSS Principales</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left border">Clase</th>
                            <th className="px-4 py-2 text-left border">Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border"><code>rpg-panel</code></td>
                            <td className="px-4 py-2 border">Contenedor principal del panel RPG</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>rpg-corner</code></td>
                            <td className="px-4 py-2 border">Elemento decorativo para las esquinas del panel</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>rpg-panel__header</code></td>
                            <td className="px-4 py-2 border">Encabezado principal del panel</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>rpg-columns</code></td>
                            <td className="px-4 py-2 border">Contenedor del layout de dos columnas</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>rpg-column</code></td>
                            <td className="px-4 py-2 border">Columna individual dentro del layout</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>rpg-column__header</code></td>
                            <td className="px-4 py-2 border">Encabezado de una columna individual</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'tables' && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Tablas Mejoradas</h2>
                
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                    <p className="text-gray-700">
                      El componente EnhancedTable proporciona tablas con múltiples estilos visuales y opciones
                      de personalización, perfecto para mostrar datos con un diseño atractivo y temático.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Propiedades del Componente</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="px-4 py-2 text-left border">Propiedad</th>
                            <th className="px-4 py-2 text-left border">Tipo</th>
                            <th className="px-4 py-2 text-left border">Valor Predeterminado</th>
                            <th className="px-4 py-2 text-left border">Descripción</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-2 border"><code>columns</code></td>
                            <td className="px-4 py-2 border"><code>TableColumn[]</code></td>
                            <td className="px-4 py-2 border">Requerido</td>
                            <td className="px-4 py-2 border">Definición de columnas</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>data</code></td>
                            <td className="px-4 py-2 border"><code>TableRow[]</code></td>
                            <td className="px-4 py-2 border">Requerido</td>
                            <td className="px-4 py-2 border">Datos a mostrar en la tabla</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>style</code></td>
                            <td className="px-4 py-2 border"><code>TableStyle</code></td>
                            <td className="px-4 py-2 border"><code>'default'</code></td>
                            <td className="px-4 py-2 border">Estilo visual de la tabla</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>zebra</code></td>
                            <td className="px-4 py-2 border"><code>boolean</code></td>
                            <td className="px-4 py-2 border"><code>false</code></td>
                            <td className="px-4 py-2 border">Activar el efecto de rayas</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>hover</code></td>
                            <td className="px-4 py-2 border"><code>boolean</code></td>
                            <td className="px-4 py-2 border"><code>false</code></td>
                            <td className="px-4 py-2 border">Activar efecto al pasar el ratón</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>bordered</code></td>
                            <td className="px-4 py-2 border"><code>boolean</code></td>
                            <td className="px-4 py-2 border"><code>false</code></td>
                            <td className="px-4 py-2 border">Mostrar bordes en las celdas</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 border"><code>compact</code></td>
                            <td className="px-4 py-2 border"><code>boolean</code></td>
                            <td className="px-4 py-2 border"><code>false</code></td>
                            <td className="px-4 py-2 border">Reducir el espaciado interno</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-xl font-semibold mb-3">Estilos Disponibles</h3>
                    <p className="text-gray-700 mb-3">
                      El componente soporta los siguientes estilos visuales:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li><code>default</code>: Estilo limpio y minimalista</li>
                      <li><code>cyber</code>: Tema futurista con acentos neón</li>
                      <li><code>arcane</code>: Tema místico con tonos púrpura</li>
                      <li><code>modern</code>: Diseño profesional con sombras sutiles</li>
                      <li><code>ancient</code>: Apariencia tipo pergamino para temas históricos</li>
                      <li><code>shadowy</code>: Tema oscuro con acentos rojos</li>
                      <li><code>rpg</code>: Diseñado específicamente para contenido de juegos de rol</li>
                    </ul>
                  </section>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-3">Recursos Adicionales</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Link href="/rpg-panels-demo" className="text-indigo-600 hover:text-indigo-800">
                  Documentación detallada de Paneles RPG
                </Link>
              </li>
              <li>
                <Link href="https://github.com/usuario/sagaweaver-examples" className="text-indigo-600 hover:text-indigo-800">
                  Ejemplos avanzados de implementación
                </Link>
              </li>
              <li>
                <Link href="https://github.com/usuario/sagaweaver/issues" className="text-indigo-600 hover:text-indigo-800">
                  Reporte de problemas y sugerencias
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation; 