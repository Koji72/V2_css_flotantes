import React, { ReactNode } from 'react';
import { icons, LucideProps } from 'lucide-react'; // Importamos iconos

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

// Definimos un tipo para los nombres de iconos válidos de lucide-react
// Usamos keyof typeof icons para obtener una unión de todos los nombres de iconos
type IconName = keyof typeof icons;

// Permitimos pasar className, size, strokeWidth, etc., pero no 'ref' 
// y tampoco 'color' explícitamente (se puede manejar con className)
type AllowedIconProps = Omit<LucideProps, 'ref' | 'color'>;

interface FloatingElementProps {
  children: ReactNode;
  position: FloatingElementPosition;
  style?: FloatingElementStyle;
  title?: string;
  width?: string;
  animation?: FloatingElementAnimation;
  className?: string;
  icon?: IconName; // Nueva prop para el nombre del icono
  iconProps?: AllowedIconProps; // Usamos el tipo corregido
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
  iconProps = { size: 16, strokeWidth: 2 }, // Valores por defecto ok
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
  
  // Renderizar el icono si se proporciona un nombre válido
  const IconComponent = icon && icons[icon] ? icons[icon] : null;
  
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
        <div className="floating-element-header flex items-center gap-2"> {/* Usamos flex para alinear icono y título */} 
          {IconComponent && 
            <IconComponent {...iconProps} className={`inline-block ${iconProps?.className || ''}`} />
          }
          <span>{title}</span> {/* Envolvemos título en span */} 
        </div>
      )}
      {/* Si no hay título pero sí icono, mostramos el icono solo */} 
      {!title && IconComponent && (
         <div className="floating-element-header flex items-center gap-2">
            <IconComponent {...iconProps} className={`inline-block ${iconProps?.className || ''}`} />
         </div>
      )}
      <div className="floating-element-content">
        {children}
      </div>
    </div>
  );
};

export default FloatingElement; 