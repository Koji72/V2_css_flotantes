import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationLink {
  path: string;
  label: string;
}

const NavigationBar: React.FC = () => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const links: NavigationLink[] = [
    { path: '/floating-elements-demo', label: 'Elementos Flotantes' },
    { path: '/advanced-elements-demo', label: 'Elementos Avanzados' },
    { path: '/style-selector', label: 'Selector de Estilos' },
    { path: '/template-gallery', label: 'Plantillas' },
    { path: '/rpg-tables-demo', label: 'Tablas RPG' },
    { path: '/components-demo', label: 'Componentes' },
    { path: '/panel-analytics', label: 'Análisis' },
    { path: '/panel-editor', label: 'Editor' },
    { path: '/theme-creator', label: 'Temas' },
    { path: '/icon-library', label: 'Iconos' },
  ];
  
  return (
    <nav className="bg-gray-900 text-white py-3 mb-6 shadow-lg">
      <div className="container mx-auto px-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <span className="text-cyan-400 font-bold text-xl mr-8">SagaWeaver</span>
          <ul className="flex space-x-4">
            {links.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path} 
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${currentPath === link.path 
                      ? 'bg-cyan-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                  `}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-400">v1.0</span>
        </div>
      </div>
    </nav>
  );
};

export default NavigationBar; 