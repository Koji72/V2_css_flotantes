import React from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import Icon, { IconName, IconsMap } from '../components/IconsInline';
import FloatingElement from '../components/FloatingElement';

const IconLibraryPage = () => {
  // Lista de iconos disponibles
  const availableIcons = Object.keys(IconsMap) as IconName[];

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>Biblioteca de Iconos - SagaWeaver</title>
        <meta name="description" content="Biblioteca de iconos disponibles en SagaWeaver" />
      </Head>

      <NavigationBar />
      
      <div className="container mx-auto p-6 bg-gray-100 text-gray-800 min-h-screen font-sans">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Biblioteca de Iconos</h1>
          
          <p className="mb-8">
            SagaWeaver incluye una biblioteca de iconos SVG que puedes usar en tus componentes React o directamente en tus paneles flotantes.
          </p>
          
          <FloatingElement 
            position="left" 
            style="tech" 
            title="Uso de Iconos" 
            width="100%"
            icon="Info"
          >
            <p className="mb-4">Hay dos formas principales de usar estos iconos:</p>
            
            <ol className="list-decimal pl-6">
              <li className="mb-2">
                <strong>En componentes FloatingElement:</strong> Usa la prop <code>icon</code> con el nombre del icono, y opcionalmente <code>iconProps</code> para personalización.
                <pre className="bg-gray-800 text-white p-3 rounded mt-2 text-sm">
                  {`<FloatingElement 
  position="left" 
  style="tech" 
  title="Panel con Icono" 
  icon="Shield"
  iconProps={{ size: 20, className: 'text-blue-500' }}
>
  Contenido del panel...
</FloatingElement>`}
                </pre>
              </li>
              <li className="mb-2">
                <strong>Como componente directo:</strong> Importa y usa el componente <code>Icon</code> en cualquier lugar de tu aplicación React.
                <pre className="bg-gray-800 text-white p-3 rounded mt-2 text-sm">
                  {`import Icon from '../components/IconsInline';

// Luego en tu componente:
<Icon name="Settings" size={24} className="text-indigo-500" />`}
                </pre>
              </li>
            </ol>
          </FloatingElement>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">Iconos Disponibles</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {availableIcons.map(iconName => (
              <div 
                key={iconName} 
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <Icon name={iconName} size={24} />
                  </div>
                  <h3 className="text-lg font-semibold">{iconName}</h3>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                    <code>icon="{iconName}"</code>
                  </div>
                </div>
                <div className="mt-4 border-t pt-4">
                  <div className="text-sm text-gray-500">Ejemplos:</div>
                  <div className="flex items-center gap-6 mt-2">
                    <Icon name={iconName} size={16} />
                    <Icon name={iconName} size={24} />
                    <Icon name={iconName} size={32} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <h2 className="text-2xl font-bold mt-12 mb-6">Añadir Nuevos Iconos</h2>
          
          <FloatingElement 
            position="left" 
            style="scroll" 
            title="Proceso para Añadir Iconos" 
            width="100%"
            icon="Settings"
          >
            <p className="mb-4">Para añadir nuevos iconos a la biblioteca:</p>
            
            <ol className="list-decimal pl-6">
              <li className="mb-2">
                Abre el archivo <code>src/components/IconsInline.tsx</code>
              </li>
              <li className="mb-2">
                Crea un nuevo componente para tu icono siguiendo el patrón existente
              </li>
              <li className="mb-2">
                Actualiza el tipo <code>IconName</code> para incluir el nuevo nombre
              </li>
              <li className="mb-2">
                Agrega el nuevo icono al mapa <code>IconsMap</code>
              </li>
            </ol>
            
            <p className="mt-4">
              Ejemplo de código para añadir un nuevo icono llamado "Star":
            </p>
            
            <pre className="bg-gray-800 text-white p-3 rounded mt-2 text-sm">
              {`export const StarIcon: React.FC<SVGProps> = ({ size = 24, className = '', ...props }) => (
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
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export type IconName = 'Shield' | 'Settings' | 'Info' | 'Star';

export const IconsMap: Record<IconName, React.FC<SVGProps>> = {
  'Shield': ShieldIcon,
  'Settings': SettingsIcon,
  'Info': InfoIcon,
  'Star': StarIcon
};`}
            </pre>
          </FloatingElement>
        </div>
      </div>
    </div>
  );
};

export default IconLibraryPage; 