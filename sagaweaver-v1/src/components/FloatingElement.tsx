import React, { ReactNode } from 'react';
import Icon, { IconName } from './IconsInline';

// Definimos los tipos para los estilos posibles
export type FloatingElementStyle = 
  | 'tech' 
  | 'hologram' 
  | 'neo' 
  | 'circuit' 
  | 'glass' 
  | 'fantasy' // Nuevo
  | 'scroll'  // Nuevo
  | 'metal'   // Nuevo
  | 'tech-corners' // Nuevo v2.6
  | 'cut-corners'  // Nuevo v2.6
  | 'corner-brackets' // Nuevo v2.6
  | 'default';

export type FloatingElementPosition = 'left' | 'right' | 'center';
export type FloatingElementAnimation = 
  | 'pulse' | 'rotate' | 'fade' 
  | 'glow' // Nuevo
  | 'shake' // Nuevo
  | 'none';

// Reexportar IconName para facilitar uso
export type { IconName } from './IconsInline';

interface FloatingElementProps {
  children: ReactNode;
  position: FloatingElementPosition;
  style?: FloatingElementStyle;
  title?: string;
  width?: string;
  animation?: FloatingElementAnimation;
  className?: string;
  icon?: IconName;
  iconProps?: {
    size?: number;
    className?: string;
    [key: string]: any;
  };
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  position = 'left',
  style = 'default',
  title,
  width = '30%',
  animation = 'none',
  className = '',
  icon,
  iconProps = { size: 16 },
}) => {
  console.log(`[FloatingElement] Rendering with style: ${style}, position: ${position}, icon: ${icon}`);
  
  // Clase base para todos los elementos flotantes
  const baseClasses = 'floating-element mb-4'; // Simplificado, estilos visuales van por estilo
  
  // Clases específicas para el posicionamiento
  const positionClasses = {
    left: 'float-left mr-6',
    right: 'float-right ml-6',
    center: 'float-center', // Usamos la nueva clase CSS
  };
  
  // Clases específicas para cada estilo (prefijo ya viene de CSS)
  const styleClass = `floating-${style}`;
  
  // Clases para animaciones
  const animationClasses = {
    pulse: 'animate-pulse',
    rotate: 'animate-rotate',
    fade: 'animate-fade',
    glow: 'animate-glow', // Nuevo
    shake: 'animate-shake', // Nuevo
    none: '',
  };
  
  // Combinamos todas las clases
  const elementClasses = `
    ${baseClasses}
    ${positionClasses[position]}
    ${styleClass} 
    ${animationClasses[animation]}
    ${className}
  `.trim().replace(/\s+/g, ' '); // Limpiar espacios extra

  console.log(`[FloatingElement] Generated classes: ${elementClasses}`);
  
  return (
    // Añadimos clear-float al contenedor si no es centrado
    <div 
      className={`${elementClasses} ${position !== 'center' ? 'clear-float' : ''}`.trim()} 
      style={{ 
        width: position === 'center' ? width : width, // Width aplica siempre, max-width controla centrado
        maxWidth: position === 'center' ? width : '100%' // Max-width para centrado
      }}
    >
      {title && (
        <div className="floating-element-header flex items-center gap-2"> 
          {icon && (
            <Icon 
              name={icon} 
              size={iconProps?.size || 16} 
              className={`inline-block ${iconProps?.className || ''}`}
              {...iconProps}
            />
          )}
          <span>{title}</span>
        </div>
      )}
      {/* Si no hay título pero sí icono, mostramos el icono solo */} 
      {!title && icon && (
         <div className="floating-element-header flex items-center gap-2">
            <Icon 
              name={icon} 
              size={iconProps?.size || 16} 
              className={`inline-block ${iconProps?.className || ''}`}
              {...iconProps}
            />
         </div>
      )}
      <div className="floating-element-content">
        {children}
      </div>
    </div>
  );
};

export default FloatingElement; 