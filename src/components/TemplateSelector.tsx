import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';

// Definición de plantillas disponibles
const TEMPLATES = [
  { id: 'default', name: 'Default Theme', description: 'Tema base simple y minimalista' },
  { id: 'minimalist', name: 'Minimalist', description: 'Diseño limpio con estética minimalista y espacios en blanco' },
  { id: 'modern', name: 'Modern', description: 'Tema moderno con efectos sutiles y diseño contemporáneo' },
  { id: 'cyberpunk', name: 'Cyberpunk', description: 'Estilo futurista con neones y estética de alta tecnología' },
  { id: 'corporate', name: 'Corporate', description: 'Diseño empresarial limpio y profesional' },
  { id: 'aegis_overdrive', name: 'Aegis Overdrive', description: 'Tema V2.5 con barras de progreso y efectos avanzados' },
];

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  currentTemplate?: string;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate,
  currentTemplate = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentTemplateName = TEMPLATES.find(t => t.id === currentTemplate)?.name || 'Select Template';
  
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-4 py-2 bg-inf-accent1 text-inf-secondary rounded cursor-pointer hover:bg-inf-accent2 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Template:</span>
        <span className="font-medium">{currentTemplateName}</span>
        <ChevronDown size={18} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-inf-secondary border border-inf-tertiary rounded shadow-lg z-10">
          <ul className="py-1">
            {TEMPLATES.map(template => (
              <li 
                key={template.id}
                className={`px-4 py-2 cursor-pointer hover:bg-inf-tertiary/10 ${
                  template.id === currentTemplate ? 'bg-inf-accent1/20' : ''
                }`}
                onClick={() => {
                  onSelectTemplate(template.id);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{template.name}</span>
                  {template.id === currentTemplate && <Check size={16} />}
                </div>
                <p className="text-xs text-inf-secondary mt-1">{template.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector; 