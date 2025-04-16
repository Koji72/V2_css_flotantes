export interface Template {
  id: string;
  name: string;
  path: string;
  description: string;
  category: string;
  tags: string[];
}

export const templates: Template[] = [
  {
    id: 'default',
    name: 'Default',
    path: 'templates/default.css',
    description: 'Tema básico por defecto',
    category: 'basic',
    tags: ['simple', 'default']
  },
  {
    id: 'purple_neon_grid',
    name: 'Purple Neon Grid',
    path: 'templates/purple_neon_grid.css',
    description: 'Tema cyberpunk con acentos neón y cuadrícula',
    category: 'cyberpunk',
    tags: ['neon', 'grid', 'futuristic']
  },
  {
    id: 'michael_noir',
    name: 'Michael Noir',
    path: 'templates/michael_noir.css',
    description: 'Tema noir con estilo retro y contraste dramático',
    category: 'noir',
    tags: ['retro', 'dark', 'dramatic']
  },
  {
    id: 'aegis-tactical-interface-v2.6',
    name: 'Aegis Tactical v2.6',
    path: 'templates/aegis-tactical-interface-v2.6.css',
    description: 'Interfaz táctica UNSC con paneles mejorados y hologramas',
    category: 'tactical',
    tags: ['military', 'holographic', 'interface']
  },
  {
    id: 'aetherium_codex',
    name: 'Aetherium Codex',
    path: 'templates/aetherium_codex.css',
    description: 'Tema místico con elementos arcanos y pergaminos',
    category: 'fantasy',
    tags: ['magical', 'arcane', 'scroll']
  },
  {
    id: 'rpg_fantasy',
    name: 'RPG Fantasy',
    path: 'templates/rpg_fantasy.css',
    description: 'Tema para libros de rol con estilo de pergamino y columnas',
    category: 'fantasy',
    tags: ['rpg', 'scroll', 'columns']
  },
  {
    id: 'infinitycommand',
    name: 'Infinity Command',
    path: 'templates/infinitycommand.css',
    description: 'Tema oscuro inspirado en interfaces de comando futuristas',
    category: 'futuristic',
    tags: ['dark', 'command', 'interface']
  },
  {
    id: 'grid_halo',
    name: 'Grid Halo',
    path: 'templates/grid_halo.css',
    description: 'Interfaz táctica inspirada en Halo con estilo de cuadrícula energética',
    category: 'tactical',
    tags: ['grid', 'energy', 'interface']
  },
  {
    id: 'halo_infini',
    name: 'Halo Infinity',
    path: 'templates/halo_infini.css',
    description: 'Tema inspirado en la interfaz futurista de Halo Infinite',
    category: 'futuristic',
    tags: ['futuristic', 'interface', 'gaming']
  },
  {
    id: 'master_template',
    name: 'Master Template',
    path: 'templates/master_template.css',
    description: 'Template maestro con todas las características disponibles',
    category: 'advanced',
    tags: ['complete', 'all-features', 'master']
  },
  {
    id: 'blank-template',
    name: 'Blank Template',
    path: 'templates/blank-template.css',
    description: 'Template básico con estilos mínimos para paneles',
    category: 'basic',
    tags: ['minimal', 'blank', 'simple']
  }
]; 