import React from 'react';
import { LucideProps } from 'lucide-react';

// Tipos para las estadísticas
export interface Stat {
  name: string;
  value: number | string;
  modifier?: number;
}

export type StatBlockType = 
  | 'creature'    // Para monstruos y bestias
  | 'character'   // Para personajes jugables
  | 'item'        // Para objetos mágicos
  | 'location'    // Para lugares especiales
  | 'spell';      // Para hechizos y conjuros

export interface Ability {
  name: string;
  description: string;
}

export interface StatBlockProps {
  name: string;
  type: StatBlockType;
  level?: number | string;
  description?: string;
  mainStats?: Stat[];
  secondaryStats?: Stat[];
  abilities?: Ability[];
  icon?: React.ElementType;
  iconProps?: Omit<LucideProps, 'ref'>;
  className?: string;
  color?: string;
  backgroundImage?: string;
}

const StatBlock: React.FC<StatBlockProps> = ({
  name,
  type = 'creature',
  level = 1,
  description = '',
  mainStats = [],
  secondaryStats = [],
  abilities = [],
  icon: Icon,
  iconProps = { size: 24 },
  className = '',
  color,
  backgroundImage
}) => {
  // Determinar estilo basado en el tipo
  const typeStyles = {
    creature: {
      bgClass: 'bg-gradient-to-br from-red-900 to-red-700',
      borderClass: 'border-red-500',
      headerClass: 'bg-red-800 text-amber-200',
      statsClass: 'border-red-600 bg-red-800/30',
      accentColor: color || '#ffc107'
    },
    character: {
      bgClass: 'bg-gradient-to-br from-blue-900 to-blue-700',
      borderClass: 'border-blue-500',
      headerClass: 'bg-blue-800 text-cyan-200',
      statsClass: 'border-blue-600 bg-blue-800/30',
      accentColor: color || '#0dcaf0'
    },
    item: {
      bgClass: 'bg-gradient-to-br from-purple-900 to-purple-700',
      borderClass: 'border-purple-500',
      headerClass: 'bg-purple-800 text-fuchsia-200',
      statsClass: 'border-purple-600 bg-purple-800/30',
      accentColor: color || '#e879f9'
    },
    location: {
      bgClass: 'bg-gradient-to-br from-emerald-900 to-emerald-700',
      borderClass: 'border-emerald-500',
      headerClass: 'bg-emerald-800 text-green-200',
      statsClass: 'border-emerald-600 bg-emerald-800/30',
      accentColor: color || '#10b981'
    },
    spell: {
      bgClass: 'bg-gradient-to-br from-indigo-900 to-indigo-700',
      borderClass: 'border-indigo-500',
      headerClass: 'bg-indigo-800 text-violet-200',
      statsClass: 'border-indigo-600 bg-indigo-800/30',
      accentColor: color || '#a78bfa'
    }
  };
  
  // Obtener estilos para el tipo actual
  const style = typeStyles[type];
  
  // Función para renderizar modificador
  const renderModifier = (mod: number | undefined) => {
    if (mod === undefined) return null;
    return <span className="text-sm font-bold ml-1">({mod >= 0 ? `+${mod}` : mod})</span>;
  };

  return (
    <div 
      className={`
        stat-block relative overflow-hidden rounded-lg border-2 
        ${style.borderClass} ${style.bgClass} text-white shadow-2xl
        transform transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]
        ${className}
      `}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'soft-light'
      }}
    >
      {/* Efectos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-white rounded-full opacity-10"></div>
        <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-white rounded-full opacity-5"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-white rounded-full opacity-5 animate-pulse"></div>
      </div>

      {/* Encabezado */}
      <div className={`${style.headerClass} px-4 py-3 flex items-center justify-between border-b-2 ${style.borderClass}`}>
        <div className="flex items-center gap-2">
          {Icon && 
            <Icon 
              {...iconProps} 
              className={`inline-block ${iconProps?.className || ''}`} 
              color={style.accentColor}
            />
          }
          <h3 className="text-xl font-bold tracking-wide">{name}</h3>
        </div>
        <div className="flex items-center">
          <span 
            className="inline-block rounded-full px-2 py-0.5 text-xs font-bold" 
            style={{ backgroundColor: style.accentColor, color: '#000', opacity: 0.9 }}
          >
            {typeof level === 'number' ? `Nivel ${level}` : level}
          </span>
        </div>
      </div>

      {/* Cuerpo */}
      <div className="p-4">
        {/* Descripción */}
        {description && (
          <div className="mb-4 italic text-sm opacity-90">
            {description}
          </div>
        )}
        
        {/* Estadísticas principales */}
        {mainStats.length > 0 && (
          <div className={`grid grid-cols-3 gap-2 mb-4 p-2 rounded ${style.statsClass}`}>
            {mainStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="uppercase text-xs tracking-wider opacity-80">{stat.name}</div>
                <div className="font-bold text-lg">
                  {stat.value}{renderModifier(stat.modifier)}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Estadísticas secundarias */}
        {secondaryStats.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {secondaryStats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center border-b border-white/20 pb-1">
                <span className="text-sm opacity-80">{stat.name}</span>
                <span className="font-bold">
                  {stat.value}{renderModifier(stat.modifier)}
                </span>
              </div>
            ))}
          </div>
        )}
        
        {/* Habilidades */}
        {abilities.length > 0 && (
          <div className="mt-4">
            <h4 
              className="text-sm font-bold pb-1 mb-2 border-b"
              style={{ borderColor: style.accentColor }}
            >
              HABILIDADES
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              {abilities.map((ability, index) => (
                <li key={index} className="text-sm">
                  <span className="font-bold">{ability.name}:</span> {ability.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Efecto de brillo en hover */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-20 transition-opacity duration-500 pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${style.accentColor}, transparent 70%)`,
          mixBlendMode: 'screen'
        }}
      ></div>
    </div>
  );
};

export default StatBlock; 