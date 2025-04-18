import React, { useState } from 'react';

const KeyboardShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHelp = () => {
    setIsOpen(!isOpen);
  };

  const shortcuts = [
    { keys: 'Ctrl+B', description: 'Texto en negrita' },
    { keys: 'Ctrl+I', description: 'Texto en cursiva' },
    { keys: 'Ctrl+K', description: 'Insertar enlace' },
    { keys: 'Ctrl+1', description: 'Encabezado nivel 1' },
    { keys: 'Ctrl+2', description: 'Encabezado nivel 2' },
    { keys: 'Ctrl+3', description: 'Encabezado nivel 3' },
    { keys: 'Ctrl+L', description: 'Lista no ordenada' },
    { keys: 'Ctrl+Q', description: 'Cita' },
    { keys: 'Ctrl+`', description: 'Código inline' },
    { keys: 'Tab', description: 'Insertar dos espacios' },
    { keys: 'Ctrl+S', description: 'Guardar contenido' },
  ];

  return (
    <div className="relative">
      <button 
        onClick={toggleHelp}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded flex items-center"
        title="Mostrar atajos de teclado"
      >
        <span className="mr-1">⌨️</span>
        <span className="text-sm">Atajos</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded shadow-lg z-10">
          <div className="p-3 border-b border-gray-700">
            <h3 className="text-white font-semibold">Atajos de Teclado</h3>
          </div>
          <div className="p-2 max-h-96 overflow-auto">
            <table className="w-full text-sm">
              <tbody>
                {shortcuts.map((shortcut, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="py-1 px-2 font-mono text-blue-400">{shortcut.keys}</td>
                    <td className="py-1 px-2 text-gray-300">{shortcut.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2 border-t border-gray-700 text-xs text-center text-gray-400">
            Haz clic en cualquier parte para cerrar
          </div>
        </div>
      )}
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-0"
          onClick={toggleHelp}
        />
      )}
    </div>
  );
};

export default KeyboardShortcutsHelp; 