import React, { useState } from 'react';
import Head from 'next/head';
import { icons, LucideIcon, LucideProps } from 'lucide-react';

// Categorías de iconos para RPG
interface IconCategory {
  name: string;
  description: string;
  icons: IconItem[];
}

// Tipo para un icono individual
interface IconItem {
  name: string;
  icon: LucideIcon;
  keywords: string[];
  category: string;
}

// Estructura para iconos favoritos guardados
interface FavoriteIcon {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function IconLibrary() {
  // Estado para iconos favoritos
  const [favoriteIcons, setFavoriteIcons] = useState<FavoriteIcon[]>([]);
  
  // Estado para la búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  
  // Estado para la categoría activa
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Estado para el icono seleccionado
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  
  // Estado para opciones de personalización
  const [iconOptions, setIconOptions] = useState({
    size: 24,
    color: '#ffffff',
    strokeWidth: 2,
  });

  // Función para clasificar iconos en categorías RPG
  const classifyIconsForRPG = (): IconCategory[] => {
    const categorizedIcons: Record<string, IconItem[]> = {
      combat: [],
      items: [],
      navigation: [],
      creatures: [],
      spells: [],
      settings: [],
      misc: [],
    };
    
    // Mapeo de iconos Lucide a categorías de RPG (ejemplo parcial)
    const iconMapping: Record<string, IconItem> = {
      // Combate
      Swords: { name: 'Swords', icon: icons.Swords, keywords: ['weapon', 'combat', 'duel', 'fight'], category: 'combat' },
      Shield: { name: 'Shield', icon: icons.Shield, keywords: ['defense', 'protection', 'armor'], category: 'combat' },
      Target: { name: 'Target', icon: icons.Target, keywords: ['aim', 'focus', 'precision'], category: 'combat' },
      Axe: { name: 'Axe', icon: icons.Axe, keywords: ['weapon', 'battle', 'warrior'], category: 'combat' },
      Hammer: { name: 'Hammer', icon: icons.Hammer, keywords: ['weapon', 'smithing', 'craft'], category: 'combat' },
      Bow: { name: 'Bow', icon: icons.Bow, keywords: ['weapon', 'ranged', 'archer'], category: 'combat' },
      Skull: { name: 'Skull', icon: icons.Skull, keywords: ['death', 'danger', 'undead'], category: 'combat' },
      
      // Items
      Backpack: { name: 'Backpack', icon: icons.Backpack, keywords: ['inventory', 'equipment', 'storage'], category: 'items' },
      Key: { name: 'Key', icon: icons.Key, keywords: ['lock', 'door', 'secret'], category: 'items' },
      Potion: { name: 'Potion', icon: icons.Flask, keywords: ['potion', 'drink', 'elixir', 'alchemy'], category: 'items' },
      Scroll: { name: 'Scroll', icon: icons.ScrollText, keywords: ['spell', 'magic', 'document'], category: 'items' },
      Gem: { name: 'Gem', icon: icons.Diamond, keywords: ['jewel', 'treasure', 'value'], category: 'items' },
      Coin: { name: 'Coin', icon: icons.CircleDollarSign, keywords: ['money', 'gold', 'currency'], category: 'items' },
      Ring: { name: 'Ring', icon: icons.CircleOff, keywords: ['jewelry', 'magic', 'power'], category: 'items' },
      
      // Navegación
      Map: { name: 'Map', icon: icons.Map, keywords: ['location', 'journey', 'exploration'], category: 'navigation' },
      Compass: { name: 'Compass', icon: icons.Compass, keywords: ['direction', 'guidance', 'navigation'], category: 'navigation' },
      Mountain: { name: 'Mountain', icon: icons.Mountain, keywords: ['terrain', 'landscape', 'obstacle'], category: 'navigation' },
      Castle: { name: 'Castle', icon: icons.Building, keywords: ['fortress', 'kingdom', 'royalty'], category: 'navigation' },
      Tent: { name: 'Tent', icon: icons.Tent, keywords: ['camp', 'rest', 'shelter'], category: 'navigation' },
      Tree: { name: 'Tree', icon: icons.TreePine, keywords: ['forest', 'nature', 'landscape'], category: 'navigation' },
      
      // Criaturas
      Dragon: { name: 'Dragon', icon: icons.Skull, keywords: ['monster', 'legendary', 'beast', 'fire'], category: 'creatures' },
      Ghost: { name: 'Ghost', icon: icons.Ghost, keywords: ['undead', 'spirit', 'ethereal'], category: 'creatures' },
      Wolf: { name: 'Wolf', icon: icons.Dog, keywords: ['animal', 'predator', 'pack'], category: 'creatures' },
      Bird: { name: 'Bird', icon: icons.Bird, keywords: ['flying', 'scout', 'messenger'], category: 'creatures' },
      Fish: { name: 'Fish', icon: icons.Fish, keywords: ['water', 'ocean', 'sea'], category: 'creatures' },
      Spider: { name: 'Spider', icon: icons.Bug, keywords: ['insect', 'poison', 'web'], category: 'creatures' },
      
      // Hechizos
      Fire: { name: 'Fire', icon: icons.Flame, keywords: ['spell', 'element', 'destruction'], category: 'spells' },
      Ice: { name: 'Ice', icon: icons.Snowflake, keywords: ['spell', 'element', 'cold'], category: 'spells' },
      Lightning: { name: 'Lightning', icon: icons.Zap, keywords: ['spell', 'element', 'electricity'], category: 'spells' },
      Wind: { name: 'Wind', icon: icons.Wind, keywords: ['spell', 'element', 'air'], category: 'spells' },
      Magic: { name: 'Magic', icon: icons.Sparkles, keywords: ['spell', 'arcane', 'energy'], category: 'spells' },
      Heal: { name: 'Heal', icon: icons.Heart, keywords: ['spell', 'restoration', 'health'], category: 'spells' },
      Shield: { name: 'Shield Spell', icon: icons.ShieldCheck, keywords: ['spell', 'protection', 'defense'], category: 'spells' },
      Wand: { name: 'Wand', icon: icons.Wand2, keywords: ['spell', 'magic', 'cast'], category: 'spells' },
      
      // Configuración y UI
      DiceD6: { name: 'Dice D6', icon: icons.Dice1, keywords: ['roll', 'chance', 'random'], category: 'settings' },
      DiceD20: { name: 'Dice D20', icon: icons.Dice4, keywords: ['roll', 'chance', 'random'], category: 'settings' },
      Book: { name: 'Book', icon: icons.BookOpen, keywords: ['rules', 'lore', 'knowledge'], category: 'settings' },
      Character: { name: 'Character', icon: icons.UserCircle, keywords: ['avatar', 'player', 'profile'], category: 'settings' },
      Crown: { name: 'Crown', icon: icons.Crown, keywords: ['king', 'ruler', 'noble'], category: 'settings' },
      
      // Misceláneo
      Heart: { name: 'Heart', icon: icons.Heart, keywords: ['life', 'love', 'health'], category: 'misc' },
      Eye: { name: 'Eye', icon: icons.Eye, keywords: ['vision', 'sight', 'perception'], category: 'misc' },
      Star: { name: 'Star', icon: icons.Star, keywords: ['celestial', 'night', 'magic'], category: 'misc' },
      Sun: { name: 'Sun', icon: icons.Sun, keywords: ['day', 'light', 'radiance'], category: 'misc' },
      Moon: { name: 'Moon', icon: icons.Moon, keywords: ['night', 'darkness', 'cycle'], category: 'misc' },
      Bell: { name: 'Bell', icon: icons.Bell, keywords: ['alarm', 'sound', 'alert'], category: 'misc' },
    };
    
    // Llenar las categorías con los iconos mapeados
    Object.values(iconMapping).forEach(iconItem => {
      if (categorizedIcons[iconItem.category]) {
        categorizedIcons[iconItem.category].push(iconItem);
      }
    });
    
    // Convertir a formato de categorías
    return [
      {
        name: 'combat',
        description: 'Armas, escudos y equipamiento de combate',
        icons: categorizedIcons.combat
      },
      {
        name: 'items',
        description: 'Objetos, tesoros y equipo de aventura',
        icons: categorizedIcons.items
      },
      {
        name: 'navigation',
        description: 'Mapas, ubicaciones y elementos de exploración',
        icons: categorizedIcons.navigation
      },
      {
        name: 'creatures',
        description: 'Monstruos, bestias y seres fantásticos',
        icons: categorizedIcons.creatures
      },
      {
        name: 'spells',
        description: 'Magia, hechizos y efectos arcanos',
        icons: categorizedIcons.spells
      },
      {
        name: 'settings',
        description: 'Elementos de juego y configuración',
        icons: categorizedIcons.settings
      },
      {
        name: 'misc',
        description: 'Iconos misceláneos útiles para diversas situaciones',
        icons: categorizedIcons.misc
      }
    ];
  };

  const categories = classifyIconsForRPG();
  
  // Filtrar iconos según la búsqueda y categoría
  const getFilteredIcons = () => {
    const query = searchQuery.toLowerCase();
    
    let filteredIcons: IconItem[] = [];
    
    if (activeCategory === 'all') {
      filteredIcons = categories.flatMap(category => category.icons);
    } else {
      const category = categories.find(c => c.name === activeCategory);
      filteredIcons = category ? category.icons : [];
    }
    
    if (query) {
      return filteredIcons.filter(icon => 
        icon.name.toLowerCase().includes(query) || 
        icon.keywords.some(keyword => keyword.toLowerCase().includes(query))
      );
    }
    
    return filteredIcons;
  };
  
  // Función para añadir un icono a favoritos
  const addToFavorites = (name: string) => {
    if (!favoriteIcons.some(fav => fav.name === name)) {
      setFavoriteIcons([
        ...favoriteIcons,
        {
          name,
          size: iconOptions.size,
          color: iconOptions.color,
          strokeWidth: iconOptions.strokeWidth
        }
      ]);
    }
  };
  
  // Función para eliminar un icono de favoritos
  const removeFromFavorites = (name: string) => {
    setFavoriteIcons(favoriteIcons.filter(icon => icon.name !== name));
  };
  
  // Función para generar código JSX para un icono
  const generateIconJSX = (name: string, options?: {size?: number, color?: string, strokeWidth?: number}) => {
    const size = options?.size || iconOptions.size;
    const color = options?.color || iconOptions.color;
    const strokeWidth = options?.strokeWidth || iconOptions.strokeWidth;
    
    return `<${name} size={${size}} color="${color}" strokeWidth={${strokeWidth}} />`;
  };
  
  // Función para renderizar un icono
  const renderIcon = (iconItem: IconItem, options?: {size?: number, color?: string, strokeWidth?: number}) => {
    const IconComponent = iconItem.icon;
    const size = options?.size || iconOptions.size;
    const color = options?.color || iconOptions.color;
    const strokeWidth = options?.strokeWidth || iconOptions.strokeWidth;
    
    return (
      <IconComponent 
        size={size} 
        color={color} 
        strokeWidth={strokeWidth} 
      />
    );
  };
  
  const filteredIcons = getFilteredIcons();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Biblioteca de Iconos RPG - SagaWeaver</title>
        <meta name="description" content="Biblioteca de iconos temáticos para juegos de rol y narrativas fantásticas" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-300">
          Biblioteca de Iconos RPG
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Panel de control */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-cyan-800 mb-6">
              <h2 className="text-xl font-bold mb-4 text-cyan-400">Categorías</h2>
              
              <div className="space-y-2">
                <button
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeCategory === 'all'
                      ? 'bg-cyan-700 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveCategory('all')}
                >
                  Todos los iconos
                </button>
                
                {categories.map(category => (
                  <button
                    key={category.name}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      activeCategory === category.name
                        ? 'bg-cyan-700 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                    onClick={() => setActiveCategory(category.name)}
                  >
                    <div>{category.name.charAt(0).toUpperCase() + category.name.slice(1)}</div>
                    <div className="text-xs opacity-70">{category.description}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-800 mb-6">
              <h2 className="text-xl font-bold mb-4 text-purple-400">Búsqueda</h2>
              
              <div className="form-control">
                <input
                  type="text"
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                  placeholder="Buscar por nombre o palabra clave..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="mt-2 text-xs text-gray-400">
                  Prueba con términos como: espada, fuego, magia, arma, etc.
                </div>
              </div>
            </div>
            
            {/* Opciones de personalización */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-green-800 mb-6">
              <h2 className="text-xl font-bold mb-4 text-green-400">Personalización</h2>
              
              <div className="space-y-4">
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Tamaño</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="12"
                      max="48"
                      step="2"
                      className="w-full mr-2"
                      value={iconOptions.size}
                      onChange={(e) => setIconOptions({
                        ...iconOptions,
                        size: parseInt(e.target.value)
                      })}
                    />
                    <span className="text-sm">{iconOptions.size}px</span>
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Color</label>
                  <div className="flex items-center">
                    <input
                      type="color"
                      className="w-12 h-8 mr-2"
                      value={iconOptions.color}
                      onChange={(e) => setIconOptions({
                        ...iconOptions,
                        color: e.target.value
                      })}
                    />
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 border-gray-600 text-white rounded-md p-2"
                      value={iconOptions.color}
                      onChange={(e) => setIconOptions({
                        ...iconOptions,
                        color: e.target.value
                      })}
                    />
                  </div>
                </div>
                
                <div className="form-control">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Grosor de trazo</label>
                  <div className="flex items-center">
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      className="w-full mr-2"
                      value={iconOptions.strokeWidth}
                      onChange={(e) => setIconOptions({
                        ...iconOptions,
                        strokeWidth: parseFloat(e.target.value)
                      })}
                    />
                    <span className="text-sm">{iconOptions.strokeWidth}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Galería de iconos */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-blue-800 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-400">
                  Iconos {activeCategory !== 'all' ? `- ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}` : ''}
                </h2>
                <span className="text-sm text-gray-400">{filteredIcons.length} iconos</span>
              </div>
              
              {filteredIcons.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No se encontraron iconos que coincidan con tu búsqueda.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {filteredIcons.map(iconItem => (
                    <div
                      key={iconItem.name}
                      className={`p-3 bg-gray-700 rounded-lg cursor-pointer transition-colors hover:bg-gray-600 flex flex-col items-center ${
                        selectedIcon === iconItem.name ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedIcon(selectedIcon === iconItem.name ? null : iconItem.name)}
                    >
                      <div className="flex items-center justify-center h-12 mb-2">
                        {renderIcon(iconItem)}
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium truncate w-full">{iconItem.name}</div>
                        <div className="text-xs text-gray-400 truncate w-full">{iconItem.keywords[0]}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Panel de detalles */}
            {selectedIcon && (
              <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-yellow-800 mb-6">
                <h2 className="text-xl font-bold mb-4 text-yellow-400">Detalles del Icono</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1 flex flex-col items-center justify-center p-4 bg-gray-700 rounded-lg">
                    {renderIcon(
                      filteredIcons.find(icon => icon.name === selectedIcon) as IconItem,
                      { size: 64 }
                    )}
                    <div className="mt-2 text-center">{selectedIcon}</div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-1">Palabras clave</h3>
                        <div className="flex flex-wrap gap-2">
                          {filteredIcons.find(icon => icon.name === selectedIcon)?.keywords.map(keyword => (
                            <span key={keyword} className="px-2 py-1 bg-gray-700 rounded-md text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-300 mb-1">Código JSX</h3>
                        <div className="relative">
                          <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto text-xs">
                            <code className="text-green-300">
                              {`import { ${selectedIcon} } from 'lucide-react';\n\n${generateIconJSX(selectedIcon)}`}
                            </code>
                          </pre>
                          <button
                            className="absolute top-2 right-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md py-1 px-2 text-xs"
                            onClick={() => navigator.clipboard.writeText(`import { ${selectedIcon} } from 'lucide-react';\n\n${generateIconJSX(selectedIcon)}`)}
                          >
                            Copiar
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {favoriteIcons.some(fav => fav.name === selectedIcon) ? (
                          <button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-md py-2 transition-colors"
                            onClick={() => removeFromFavorites(selectedIcon)}
                          >
                            Quitar de favoritos
                          </button>
                        ) : (
                          <button
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 transition-colors"
                            onClick={() => addToFavorites(selectedIcon)}
                          >
                            Añadir a favoritos
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Iconos favoritos */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg border border-red-800">
              <h2 className="text-xl font-bold mb-4 text-red-400">Mis Iconos Favoritos</h2>
              
              {favoriteIcons.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No tienes iconos en favoritos. Haz clic en un icono y luego en "Añadir a favoritos".
                </div>
              ) : (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-4">
                    {favoriteIcons.map(favIcon => {
                      const iconItem = filteredIcons.find(icon => icon.name === favIcon.name);
                      if (!iconItem) return null;
                      
                      return (
                        <div
                          key={favIcon.name}
                          className="p-3 bg-gray-700 rounded-lg flex flex-col items-center"
                        >
                          <div className="flex items-center justify-center h-12 mb-2">
                            {renderIcon(iconItem, {
                              size: favIcon.size,
                              color: favIcon.color,
                              strokeWidth: favIcon.strokeWidth
                            })}
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-medium truncate w-full">{favIcon.name}</div>
                          </div>
                          <button
                            className="mt-2 text-xs text-red-400 hover:text-red-300"
                            onClick={() => removeFromFavorites(favIcon.name)}
                          >
                            Quitar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">Código para importar y usar los favoritos</h3>
                    <div className="relative">
                      <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto text-xs">
                        <code className="text-green-300">
                          {`import { ${favoriteIcons.map(f => f.name).join(', ')} } from 'lucide-react';\n\n// Ejemplos de uso\n${
                            favoriteIcons.map(f => `${generateIconJSX(f.name, f)}`).join('\n')
                          }`}
                        </code>
                      </pre>
                      <button
                        className="absolute top-2 right-2 bg-blue-700 hover:bg-blue-800 text-white rounded-md py-1 px-2 text-xs"
                        onClick={() => navigator.clipboard.writeText(`import { ${favoriteIcons.map(f => f.name).join(', ')} } from 'lucide-react';\n\n// Ejemplos de uso\n${
                          favoriteIcons.map(f => `${generateIconJSX(f.name, f)}`).join('\n')
                        }`)}
                      >
                        Copiar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 