import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { EnhancedTable } from '../components/EnhancedTable';
import { ChevronLeft } from 'lucide-react';

// Tipos de tabla
const tableStyles = [
  'default',
  'cyber',
  'arcane',
  'modern',
  'ancient',
  'shadowy',
  'rpg'
] as const;

// Datos de ejemplo
const generateData = (count: number) => {
  return Array.from({ length: count }, (_, index) => {
    return {
      id: index + 1,
      name: `Item ${index + 1}`,
      category: ['Arma', 'Armadura', 'Poción', 'Libro', 'Herramienta'][Math.floor(Math.random() * 5)],
      rarity: ['Común', 'Poco común', 'Raro', 'Muy raro', 'Legendario'][Math.floor(Math.random() * 5)],
      value: Math.floor(Math.random() * 1000) + 10,
      weight: (Math.random() * 20).toFixed(1),
      highlighted: index % 7 === 0
    };
  });
};

// Columnas
const columns = [
  { key: 'name', header: 'Nombre' },
  { key: 'category', header: 'Categoría' },
  { key: 'rarity', header: 'Rareza' },
  { key: 'value', header: 'Valor', align: 'right' as const, render: (value: number) => `${value} oro` },
  { key: 'weight', header: 'Peso', align: 'right' as const, render: (value: string) => `${value} kg` }
];

const EnhancedTablesDemo = () => {
  const [selectedStyle, setSelectedStyle] = useState<typeof tableStyles[number]>('default');
  const [zebra, setZebra] = useState(true);
  const [hover, setHover] = useState(true);
  const [bordered, setBordered] = useState(false);
  const [compact, setCompact] = useState(false);
  const [glowing, setGlowing] = useState(false);
  
  const items = generateData(12);

  const handleStyleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStyle(e.target.value as typeof tableStyles[number]);
  };

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    return () => setter(prev => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>SagaWeaver - Demostración de Tablas Mejoradas</title>
        <meta name="description" content="Tablas con múltiples estilos visuales para tus interfaces" />
      </Head>

      <Link 
        href="/" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8"
      >
        <ChevronLeft className="mr-1 h-5 w-5" />
        <span>Volver al inicio</span>
      </Link>

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Tablas Mejoradas</h1>
        <p className="text-lg text-gray-600">Un componente con múltiples estilos visuales y opciones de personalización</p>
      </header>

      <div className="mb-12 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Personalización</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label htmlFor="styleSelector" className="block text-sm font-medium text-gray-700 mb-1">
              Estilo de Tabla
            </label>
            <select
              id="styleSelector"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedStyle}
              onChange={handleStyleChange}
            >
              {tableStyles.map(style => (
                <option key={style} value={style}>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <p className="block text-sm font-medium text-gray-700 mb-1">Opciones</p>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={zebra}
                  onChange={handleToggle(setZebra)}
                />
                <span className="ml-2">Zebra</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={hover}
                  onChange={handleToggle(setHover)}
                />
                <span className="ml-2">Hover</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={bordered}
                  onChange={handleToggle(setBordered)}
                />
                <span className="ml-2">Bordes</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={compact}
                  onChange={handleToggle(setCompact)}
                />
                <span className="ml-2">Compacto</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  checked={glowing}
                  onChange={handleToggle(setGlowing)}
                />
                <span className="ml-2">Brillante</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <EnhancedTable
            columns={columns}
            data={items}
            style={selectedStyle}
            zebra={zebra}
            hover={hover}
            bordered={bordered}
            compact={compact}
            glowing={glowing}
            ariaLabel="Tabla de ítems"
            onRowClick={(row) => console.log('Fila clickeada:', row)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Estilos Disponibles</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Default:</strong> Estilo limpio y minimalista</li>
            <li><strong>Cyber:</strong> Tema futurista con acentos neón</li>
            <li><strong>Arcane:</strong> Tema místico con tonos púrpura</li>
            <li><strong>Modern:</strong> Diseño profesional con sombras sutiles</li>
            <li><strong>Ancient:</strong> Apariencia tipo pergamino para temas históricos</li>
            <li><strong>Shadowy:</strong> Tema oscuro con acentos rojos</li>
            <li><strong>RPG:</strong> Diseñado para contenido de juegos de rol</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4">Características</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personalización de columnas:</strong> Define ancho, alineación y renderizado personalizado</li>
            <li><strong>Resaltado de filas:</strong> Marca filas importantes con la propiedad <code>highlighted</code></li>
            <li><strong>Estilo de cebra:</strong> Colores alternos para mejor legibilidad</li>
            <li><strong>Efectos hover:</strong> Feedback interactivo al pasar el ratón</li>
            <li><strong>Diseño adaptable:</strong> Las tablas se adaptan a diferentes tamaños de pantalla</li>
            <li><strong>Opciones compactas:</strong> Reduce el espaciado para diseños densos</li>
          </ul>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-12">
        <h2 className="text-2xl font-bold mb-4">Código de Ejemplo</h2>
        
        <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { EnhancedTable } from '../components/EnhancedTable';

// Define columnas
const columns = [
  { key: 'name', header: 'Nombre' },
  { key: 'category', header: 'Categoría' },
  { key: 'value', header: 'Valor', align: 'right', 
    render: (value) => \`\${value} oro\` }
];

// Define datos
const items = [
  { id: 1, name: 'Espada', category: 'Arma', value: 50 },
  { id: 2, name: 'Escudo', category: 'Armadura', value: 35, highlighted: true },
  { id: 3, name: 'Poción', category: 'Consumible', value: 20 }
];

// Renderiza tabla
<EnhancedTable 
  columns={columns}
  data={items}
  style="rpg"
  zebra
  hover
  bordered
/>`}
        </pre>
      </div>

      <div className="text-center text-gray-600 my-8">
        <p>
          Visita la <Link href="/documentation" className="text-indigo-600 hover:text-indigo-800">documentación</Link> para 
          obtener más información sobre cómo integrar estos componentes en tus proyectos.
        </p>
      </div>
    </div>
  );
};

export default EnhancedTablesDemo; 