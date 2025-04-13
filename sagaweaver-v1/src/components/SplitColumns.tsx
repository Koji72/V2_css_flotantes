import React, { ReactNode } from 'react';

// Definimos los tipos para los estilos posibles
export type SplitColumnsStyle = 
  | 'parchment' 
  | 'modern' 
  | 'tech' 
  | 'fantasy' // Nuevo
  | 'default';

interface SplitColumnsProps {
  children: ReactNode;
  columns?: 2 | 3;
  gap?: string;
  style?: SplitColumnsStyle;
  className?: string;
}

const SplitColumns: React.FC<SplitColumnsProps> = ({
  children,
  columns = 2,
  gap = '2rem',
  style = 'default',
  className = '',
}) => {
  console.log(`[SplitColumns] Rendering with style: ${style}, columns: ${columns}`);
  // Clases base para todos los contenedores de columnas
  const baseClasses = 'split-columns-container';
  
  // Clases específicas para cada estilo (prefijo ya viene de CSS)
  const styleClass = `split-columns-${style}`;
  
  // Combinamos todas las clases
  const containerClasses = `
    ${baseClasses}
    ${styleClass}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  console.log(`[SplitColumns] Generated classes: ${containerClasses}`);

  return (
    <div className={containerClasses}>
      <div 
        className="split-columns-content column-content-wrapper" 
        style={{ 
          columnCount: columns, 
          columnGap: gap,
          // La regla de columna se define en el CSS específico de cada estilo
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Componente para forzar un salto de columna
export const ColumnBreak: React.FC = () => {
  console.log(`[ColumnBreak] Rendering column break`);
  return <div style={{ breakAfter: 'column', pageBreakAfter: 'always' }} className="column-break"></div>;
}

export default SplitColumns; 