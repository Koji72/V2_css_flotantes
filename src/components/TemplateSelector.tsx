import { ChangeEvent } from 'react';
import { useStore } from '../store';

const templates = [
  {
    id: 'default',
    name: 'Default',
    path: 'templates/default.css',
    description: 'Tema básico por defecto'
  },
  {
    id: 'purple_neon_grid',
    name: 'Purple Neon Grid',
    path: 'templates/purple_neon_grid.css',
    description: 'Tema cyberpunk con acentos neón y cuadrícula'
  },
  {
    id: 'michael_noir',
    name: 'Michael Noir',
    path: 'templates/michael_noir.css',
    description: 'Tema noir con estilo retro y contraste dramático'
  },
  {
    id: 'aegis-tactical-interface-v2.6',
    name: 'Aegis Tactical v2.6',
    path: 'templates/aegis-tactical-interface-v2.6.css',
    description: 'Interfaz táctica UNSC con paneles mejorados y hologramas'
  },
  {
    id: 'aegis-tactical-interface-v2.5',
    name: 'Aegis Tactical v2.5',
    path: 'templates/aegis-tactical-interface-v2.5.css',
    description: 'Interfaz táctica UNSC con marquesinas SVG inline'
  },
  {
    id: 'aetherium_codex',
    name: 'Aetherium Codex',
    path: 'templates/aetherium_codex.css',
    description: 'Tema místico con elementos arcanos y pergaminos'
  },
  {
    id: 'rpg_fantasy',
    name: 'RPG Fantasy',
    path: 'templates/rpg_fantasy.css',
    description: 'Tema para libros de rol con estilo de pergamino y columnas'
  },
  {
    id: 'infinitycommand',
    name: 'Infinity Command',
    path: 'templates/infinitycommand.css',
    description: 'Tema oscuro inspirado en interfaces de comando futuristas'
  },
  {
    id: 'grid_halo',
    name: 'Grid Halo',
    path: 'templates/grid_halo.css',
    description: 'Interfaz táctica inspirada en Halo con estilo de cuadrícula energética'
  },
  {
    id: 'halo_infini',
    name: 'Halo Infinity',
    path: 'templates/halo_infini.css',
    description: 'Tema inspirado en la interfaz futurista de Halo Infinite'
  },
  {
    id: 'master_template',
    name: 'Master Template',
    path: 'templates/master_template.css',
    description: 'Template maestro con todas las características disponibles'
  },
];

export default function TemplateSelector() {
  const { templateId, setTemplateId } = useStore();

  const handleTemplateChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedTemplate = templates.find(t => t.id === e.target.value);
    if (selectedTemplate) {
      setTemplateId(selectedTemplate.id);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor="template-selector" className="block text-sm font-medium text-gray-300 mb-1">
        Template
      </label>
      <select
        id="template-selector"
        value={templateId}
        onChange={handleTemplateChange}
        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
      >
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
      <div className="text-sm text-gray-300 mt-1">
        {templates.find(t => t.id === templateId)?.description}
      </div>
    </div>
  );
} 