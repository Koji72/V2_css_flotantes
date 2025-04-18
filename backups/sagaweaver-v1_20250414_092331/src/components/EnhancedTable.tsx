import React from 'react';
import clsx from 'clsx';

// Table style variants
export type TableStyle = 
  | 'default'
  | 'cyber' 
  | 'arcane' 
  | 'modern' 
  | 'ancient' 
  | 'shadowy'
  | 'rpg';

// Column definition
export interface TableColumn {
  key: string;
  header: React.ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any, index: number) => React.ReactNode;
}

// Row data
export interface TableRow {
  id: string | number;
  [key: string]: any;
  highlighted?: boolean;
}

// Enhanced Table Props
export interface EnhancedTableProps {
  // Data props
  columns: TableColumn[];
  data: TableRow[];
  
  // Style props
  style?: TableStyle;
  zebra?: boolean;
  hover?: boolean;
  bordered?: boolean;
  compact?: boolean;
  
  // Effects
  glowing?: boolean;
  
  // Callbacks
  onRowClick?: (row: TableRow, index: number) => void;
  
  // Accessibility
  ariaLabel?: string;
  
  // Extra props
  className?: string;
}

export const EnhancedTable: React.FC<EnhancedTableProps> = ({
  columns,
  data,
  style = 'default',
  zebra = false,
  hover = false,
  bordered = false,
  compact = false,
  glowing = false,
  onRowClick,
  ariaLabel,
  className,
}) => {
  const containerClasses = clsx(
    'enhanced-table__container',
    {
      'enhanced-table--glowing': glowing,
    },
    className
  );
  
  const tableClasses = clsx(
    'enhanced-table',
    `enhanced-table--${style}`,
    {
      'enhanced-table--zebra': zebra,
      'enhanced-table--hover': hover,
      'enhanced-table--bordered': bordered,
      'enhanced-table--compact': compact,
    }
  );
  
  const handleRowClick = (row: TableRow, index: number) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };
  
  return (
    <div className={containerClasses}>
      <div className="enhanced-table__wrapper">
        <table 
          className={tableClasses}
          aria-label={ariaLabel}
        >
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th 
                  key={`header-${column.key}-${index}`}
                  style={{
                    width: column.width,
                    textAlign: column.align,
                  }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr 
                key={`row-${row.id || rowIndex}`}
                className={row.highlighted ? 'highlighted' : ''}
                onClick={() => handleRowClick(row, rowIndex)}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((column, colIndex) => {
                  const cellValue = row[column.key];
                  return (
                    <td 
                      key={`cell-${row.id || rowIndex}-${column.key}`}
                      style={{ textAlign: column.align }}
                    >
                      {column.render 
                        ? column.render(cellValue, row, rowIndex)
                        : cellValue}
                    </td>
                  );
                })}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  No data to display
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}; 