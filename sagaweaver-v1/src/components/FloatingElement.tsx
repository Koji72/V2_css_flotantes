import React, { ReactNode } from 'react';

interface FloatingElementProps {
  children: ReactNode;
  position: 'left' | 'right' | 'center';
  style?: 'tech' | 'hologram' | 'neo' | 'circuit' | 'glass' | 'default';
  title?: string;
  width?: string;
  animation?: 'pulse' | 'rotate' | 'fade' | 'none';
  className?: string;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  position = 'left',
  style = 'default',
  title,
  width = '30%',
  animation = 'none',
  className = '',
}) => {
  // Clase base para todos los elementos flotantes
  const baseClasses = 'floating-element rounded-lg shadow-lg overflow-hidden mb-4';
  
  // Clases específicas para el posicionamiento
  const positionClasses = {
    left: 'float-left mr-6',
    right: 'float-right ml-6',
    center: 'mx-auto float-none',
  };
  
  // Clases específicas para cada estilo
  const styleClasses = {
    tech: 'floating-tech border-cyan-400 bg-slate-900/80',
    hologram: 'floating-hologram border-blue-400 bg-blue-900/40',
    neo: 'floating-neo border-purple-400 bg-purple-900/70',
    circuit: 'floating-circuit border-green-400 bg-slate-800/90',
    glass: 'floating-glass border-white/20 bg-white/10 backdrop-blur-sm',
    default: 'floating-default border-gray-400 bg-gray-800/90',
  };
  
  // Clases para animaciones
  const animationClasses = {
    pulse: 'animate-pulse',
    rotate: 'animate-rotate',
    fade: 'animate-fade',
    none: '',
  };
  
  // Combinamos todas las clases
  const elementClasses = `
    ${baseClasses}
    ${positionClasses[position]}
    ${styleClasses[style]}
    ${animationClasses[animation]}
    ${className}
  `;
  
  return (
    <div 
      className={elementClasses} 
      style={{ 
        width: position === 'center' ? 'auto' : width,
        maxWidth: position === 'center' ? width : '100%'
      }}
    >
      {title && (
        <div className="floating-element-header p-2 text-sm font-semibold border-b border-opacity-50">
          {title}
        </div>
      )}
      <div className="floating-element-content p-3">
        {children}
      </div>
    </div>
  );
};

export default FloatingElement; 