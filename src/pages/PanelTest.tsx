import React from 'react';
import PanelDemo from '../components/PanelDemo';

const PanelTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Prueba de Paneles</h1>
          <p className="text-gray-400">Demostración de diferentes estilos y configuraciones de paneles</p>
        </header>
        
        <PanelDemo />
      </div>
    </div>
  );
};

export default PanelTest; 