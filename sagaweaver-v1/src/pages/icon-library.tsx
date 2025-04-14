import React from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import Icon, { IconName, IconsMap } from '../components/IconsInline';
import FloatingElement from '../components/FloatingElement';

const IconLibraryPage: React.FC = () => {
  // Obtener todas las keys de IconsMap
  const allIcons: IconName[] = Object.keys(IconsMap) as IconName[];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>Biblioteca de Iconos - SagaWeaver</title>
        <meta name="description" content="Biblioteca de iconos disponibles para SagaWeaver" />
      </Head>

      <NavigationBar />
      
      <div className="container mx-auto p-6 bg-gray-100 text-gray-800 min-h-screen font-sans">
        <div className="prose max-w-none mb-8">
          <h1 className="text-3xl font-bold mb-6">Biblioteca de Iconos</h1>
          <p className="mb-4">
            Esta biblioteca contiene todos los iconos disponibles para usar en tus componentes SagaWeaver.
            Puedes utilizarlos en cualquier componente que acepte el parámetro <code>icon</code>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allIcons.map((iconName) => (
            <div key={iconName} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 mr-4 flex items-center justify-center bg-gray-100 rounded-lg">
                  <Icon name={iconName} size={32} />
                </div>
                <h2 className="text-xl font-semibold">{iconName}</h2>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">React</h3>
                <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                  <code>{`<Icon name="${iconName}" size={24} />`}</code>
                </pre>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">FloatingElement</h3>
                <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                  <code>{`<FloatingElement
  icon="${iconName}"
  ...
/>`}</code>
                </pre>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Markdown</h3>
                <pre className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto">
                  <code>{`:::float[position]{icon=${iconName}}`}</code>
                </pre>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4">
                <Icon name={iconName} size={16} />
                <Icon name={iconName} size={24} />
                <Icon name={iconName} size={32} />
                <Icon name={iconName} size={48} />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cómo añadir nuevos iconos</h2>
          <p className="mb-4">
            Para añadir nuevos iconos a la biblioteca, sigue estos pasos:
          </p>
          <ol className="list-decimal list-inside space-y-2 mb-4">
            <li>Abre el archivo <code>src/components/IconsInline.tsx</code></li>
            <li>Añade un nuevo componente de icono basado en los existentes</li>
            <li>Actualiza el tipo <code>IconName</code> para incluir el nombre del nuevo icono</li>
            <li>Añade el icono al objeto <code>IconsMap</code></li>
          </ol>
          <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
            <code>{`export const NewIcon: React.FC<SVGProps> = ({ size = 24, className = '', ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <!-- Aquí va el path del icono -->
  </svg>
);

// Actualizar el tipo IconName
export type IconName = 'Shield' | ... | 'NewIcon';

// Añadir al mapa de iconos
export const IconsMap: Record<IconName, React.FC<SVGProps>> = {
  'Shield': ShieldIcon,
  // ...
  'NewIcon': NewIcon
};`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default IconLibraryPage; 