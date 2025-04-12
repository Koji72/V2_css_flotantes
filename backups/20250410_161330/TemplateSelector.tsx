import React from 'react';
import { useStore } from '../store';

const templates = [
  {
    id: 'default',
    name: 'Default',
    description: 'Tema básico por defecto'
  },
  {
    id: 'infinitycommand',
    name: 'Infinity Command',
    description: 'Tema futurista con colores neón y efectos de brillo'
  },
  {
    id: 'purple_neon_grid',
    name: 'Purple Neon Grid',
    description: 'Tema con fondo de cuadrícula púrpura y efectos neón'
  },
  {
    id: 'aetherium_codex',
    name: 'Aetherium Codex',
    description: 'Tema místico con efectos de texto brillante y bordes suaves'
  }
];

const TemplateSelector: React.FC = () => {
  const { templateId, setTemplateId } = useStore();

  return (
    <div className="flex items-center gap-2">
      <span className="text-white text-sm">Tema:</span>
      <select
        value={templateId}
        onChange={(e) => setTemplateId(e.target.value)}
        className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
      >
        {templates.map((template) => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
      <div className="text-sm text-gray-300">
        {templates.find(t => t.id === templateId)?.description}
      </div>
    </div>
  );
};

export default TemplateSelector; 