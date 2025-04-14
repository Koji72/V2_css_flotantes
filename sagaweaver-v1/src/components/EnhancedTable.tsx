import React, { ReactNode } from 'react';

// Tipos para las tablas
export type TableStyle = 
  | 'cyber'      // Estilo tecnológico con bordes de neón
  | 'arcane'     // Estilo arcano con detalles místicos
  | 'modern'     // Estilo limpio y minimalista
  | 'ancient'    // Estilo de pergamino antiguo
  | 'shadowy';   // Estilo oscuro con efectos sombríos

export interface TableColumn {
  key: string;
  header: ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  highlight?: boolean;
}

export interface TableRow {
  id: string | number;
  [key: string]: any;
}

export interface EnhancedTableProps {
  columns: TableColumn[];
  data: TableRow[];
  style?: TableStyle;
  title?: string;
  caption?: string;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  highlightRows?: boolean;
  zebra?: boolean;
  compact?: boolean;
  bordered?: boolean;
  interactive?: boolean;
  glowing?: boolean;
  hoverEffect?: boolean;
}

const EnhancedTable: React.FC<EnhancedTableProps> = ({
  columns,
  data,
  style = 'modern',
  title,
  caption,
  className = '',
  headerClassName = '',
  rowClassName = '',
  cellClassName = '',
  highlightRows = false,
  zebra = true,
  compact = false,
  bordered = true,
  interactive = true,
  glowing = false,
  hoverEffect = true
}) => {
  // Estilos personalizados basados en el tema
  const styleConfig = {
    cyber: {
      container: 'bg-gray-900 text-cyan-300 border-cyan-500',
      header: 'bg-gray-800 text-cyan-300 border-cyan-400',
      row: 'border-cyan-900',
      rowHighlight: 'bg-cyan-900/20',
      rowHover: 'hover:bg-cyan-900/30',
      zebraOdd: 'bg-gray-800/50',
      zebraEven: 'bg-transparent',
      cell: 'text-cyan-100',
      cellHighlight: 'text-cyan-300 font-semibold',
      glowColor: 'rgba(8, 145, 178, 0.2)',
      title: 'text-cyan-400'
    },
    arcane: {
      container: 'bg-indigo-950 text-purple-300 border-purple-500',
      header: 'bg-indigo-900 text-fuchsia-200 border-purple-400',
      row: 'border-indigo-800',
      rowHighlight: 'bg-purple-900/20',
      rowHover: 'hover:bg-purple-900/30',
      zebraOdd: 'bg-indigo-900/50',
      zebraEven: 'bg-transparent',
      cell: 'text-purple-200',
      cellHighlight: 'text-fuchsia-300 font-semibold',
      glowColor: 'rgba(112, 26, 117, 0.2)',
      title: 'text-fuchsia-400'
    },
    modern: {
      container: 'bg-white text-gray-700 border-gray-200',
      header: 'bg-gray-100 text-gray-800 border-gray-300',
      row: 'border-gray-200',
      rowHighlight: 'bg-blue-50',
      rowHover: 'hover:bg-gray-50',
      zebraOdd: 'bg-gray-50',
      zebraEven: 'bg-white',
      cell: 'text-gray-700',
      cellHighlight: 'text-blue-600 font-semibold',
      glowColor: 'rgba(59, 130, 246, 0.1)',
      title: 'text-gray-800'
    },
    ancient: {
      container: 'bg-amber-50 text-amber-900 border-amber-300',
      header: 'bg-amber-100 text-amber-800 border-amber-300',
      row: 'border-amber-200',
      rowHighlight: 'bg-amber-100/50',
      rowHover: 'hover:bg-amber-100',
      zebraOdd: 'bg-amber-50',
      zebraEven: 'bg-amber-50/50',
      cell: 'text-amber-900',
      cellHighlight: 'text-amber-700 font-semibold',
      glowColor: 'rgba(217, 119, 6, 0.1)',
      title: 'text-amber-800'
    },
    shadowy: {
      container: 'bg-gray-950 text-gray-300 border-gray-700',
      header: 'bg-gray-900 text-gray-200 border-gray-700',
      row: 'border-gray-800',
      rowHighlight: 'bg-gray-800/50',
      rowHover: 'hover:bg-gray-800',
      zebraOdd: 'bg-gray-900',
      zebraEven: 'bg-gray-950',
      cell: 'text-gray-300',
      cellHighlight: 'text-white font-semibold',
      glowColor: 'rgba(75, 85, 99, 0.2)',
      title: 'text-gray-200'
    }
  };
  
  const selectedStyle = styleConfig[style];
  
  // Clases adicionales basadas en props
  const containerClasses = [
    'enhanced-table overflow-hidden',
    'rounded-lg',
    bordered ? 'border' : '',
    selectedStyle.container,
    className
  ].join(' ').trim();
  
  const tableClasses = [
    'w-full',
    'border-collapse',
    compact ? 'text-sm' : '',
  ].join(' ').trim();
  
  const headerClasses = [
    selectedStyle.header,
    headerClassName
  ].join(' ').trim();
  
  const getRowClasses = (row: TableRow, index: number) => [
    selectedStyle.row,
    hoverEffect ? selectedStyle.rowHover : '',
    zebra ? (index % 2 === 0 ? selectedStyle.zebraEven : selectedStyle.zebraOdd) : '',
    highlightRows && row.highlight ? selectedStyle.rowHighlight : '',
    rowClassName
  ].join(' ').trim();
  
  const getCellClasses = (column: TableColumn) => [
    'p-3',
    bordered ? 'border-b' : '',
    selectedStyle.cell,
    column.highlight ? selectedStyle.cellHighlight : '',
    cellClassName,
    column.align === 'center' ? 'text-center' : '',
    column.align === 'right' ? 'text-right' : ''
  ].join(' ').trim();
  
  // Estilos para efectos de brillo
  const glowStyles = glowing ? {
    boxShadow: `0 0 30px ${selectedStyle.glowColor}`,
    position: 'relative' as const,
    zIndex: 1
  } : {};

  return (
    <div className={containerClasses} style={glowStyles}>
      {title && (
        <div className={`px-4 py-3 font-bold text-lg ${selectedStyle.title}`}>
          {title}
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className={tableClasses}>
          <thead>
            <tr className={headerClasses}>
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className={`px-3 py-3 font-semibold text-${column.align || 'left'}`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={row.id} 
                className={getRowClasses(row, rowIndex)}
              >
                {columns.map((column) => (
                  <td 
                    key={`${row.id}-${column.key}`} 
                    className={getCellClasses(column)}
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {caption && (
        <div className="p-3 text-sm italic opacity-80">
          {caption}
        </div>
      )}
      
      {/* Efectos visuales adicionales para estilos específicos */}
      {style === 'cyber' && glowing && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-20 animate-pulse" 
            style={{background: 'linear-gradient(45deg, transparent 65%, rgba(0, 255, 255, 0.8) 100%)'}}
          ></div>
        </div>
      )}
      
      {style === 'arcane' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -right-10 -top-10 w-20 h-20 opacity-10 rotate-45 bg-purple-300"></div>
          <div className="absolute -left-10 -bottom-10 w-20 h-20 opacity-10 rounded-full bg-fuchsia-300"></div>
        </div>
      )}
      
      {style === 'shadowy' && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black opacity-20"></div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTable; 