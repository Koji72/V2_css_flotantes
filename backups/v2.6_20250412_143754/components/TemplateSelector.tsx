import React from 'react';
import { useStore } from '../store';

const availableTemplates = [
  {
    id: 'default',
    name: 'Default',
    description: 'Tema básico por defecto'
  },
  {
    id: 'infinitycommand',
    name: 'Infinity Command',
    description: 'Tema oscuro inspirado en interfaces de comando futuristas'
  },
  {
    id: 'purple_neon_grid',
    name: 'Purple Neon Grid',
    description: 'Tema cyberpunk con acentos neón y cuadrícula'
  },
  {
    id: 'aetherium_codex',
    name: 'Aetherium Codex',
    description: 'Tema místico con elementos arcanos y pergaminos'
  },
  {
    id: 'grid_halo',
    name: 'Grid Halo',
    description: 'Interfaz táctica inspirada en Halo con estilo de cuadrícula energética'
  },
  {
    id: 'halo_infini',
    name: 'Halo Infinity',
    description: 'Tema inspirado en la interfaz futurista de Halo Infinite'
  },
  {
    id: 'michael_noir',
    name: 'Michael Noir',
    description: 'Tema noir con estilo retro y contraste dramático'
  },
  {
    id: 'rpg_fantasy',
    name: 'Codex Antiqua',
    description: 'Tema para libros de rol con estilo de pergamino y columnas'
  },
  {
    id: 'aegis-tactical-interface-v2.5',
    name: 'Aegis Tactical',
    description: 'Interfaz táctica UNSC con marquesinas SVG inline'
  }
];

interface TemplateSelectorProps {
  value?: string;
  onChange?: (id: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ value, onChange }) => {
  const store = useStore();
  // Usar props si se proporcionan, de lo contrario usar el store
  const templateId = value !== undefined ? value : store.templateId;
  const setTemplateId = onChange || store.setTemplateId;

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm">Tema:</span>
      <select
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
      >
        {availableTemplates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
      <div className="text-sm text-gray-300">
        {availableTemplates.find(t => t.id === templateId)?.description}
      </div>
    </div>
  );
};

export default TemplateSelector; 