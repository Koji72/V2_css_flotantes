import React, { ReactNode } from 'react';

interface SplitColumnsProps {
  children: ReactNode;
  columns?: 2 | 3;
  gap?: string;
  style?: 'parchment' | 'modern' | 'tech' | 'default';
  className?: string;
}

const SplitColumns: React.FC<SplitColumnsProps> = ({
  children,
  columns = 2,
  gap = '2rem',
  style = 'default',
  className = '',
}) => {
  // Clases base para todos los contenedores de columnas
  const baseClasses = 'split-columns-container p-4 rounded-lg mb-4';
  
  // Clases específicas para cada estilo
  const styleClasses = {
    parchment: 'split-columns-parchment bg-amber-50/90 text-amber-900 border border-amber-200',
    modern: 'split-columns-modern bg-slate-100/90 text-slate-800 border border-slate-200',
    tech: 'split-columns-tech bg-slate-900/90 text-cyan-100 border border-cyan-800',
    default: 'split-columns-default bg-white/95 text-gray-800 border border-gray-200',
  };
  
  // Combinamos todas las clases
  const containerClasses = `
    ${baseClasses}
    ${styleClasses[style]}
    ${className}
  `;
  
  return (
    <div className={containerClasses}>
      <div 
        className="split-columns-content" 
        style={{ 
          columnCount: columns, 
          columnGap: gap,
          columnRule: '1px solid rgba(128, 128, 128, 0.2)',
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Componente para forzar un salto de columna
export const ColumnBreak: React.FC = () => (
  <div style={{ breakAfter: 'column', pageBreakAfter: 'always' }}></div>
);

export default SplitColumns; 