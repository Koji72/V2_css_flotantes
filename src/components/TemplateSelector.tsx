'use client';

import React from 'react';
import { useStore } from '../store';
import { Template } from '../types/templates';

const TemplateSelector: React.FC = () => {
  const templateId = useStore((state) => state.templateId);
  const selectedTemplate = useStore((state) => state.selectedTemplate);
  const setTemplateId = useStore((state) => state.setTemplateId);
  const setSelectedTemplate = useStore((state) => state.setSelectedTemplate);

  // Lista de plantillas disponibles simplificadas
  const templates = [
    { 
      id: 'default', 
      name: 'Default', 
      description: 'Estilo limpio y sencillo',
      category: 'basic',
      tags: ['simple', 'clean'],
      path: '/templates/default.css',
      colors: {
        background: '#ffffff',
        text: '#333333',
        accent: '#0066cc'
      },
      styles: ''
    },
    { 
      id: 'github', 
      name: 'GitHub', 
      description: 'Estilo similar a GitHub Markdown',
      category: 'professional',
      tags: ['github', 'markdown'],
      path: '/templates/github.css',
      colors: {
        background: '#ffffff',
        text: '#24292e',
        accent: '#0366d6'
      },
      styles: ''
    },
    { 
      id: 'dark', 
      name: 'Dark Mode', 
      description: 'Tema oscuro con acentos de color',
      category: 'dark',
      tags: ['dark', 'night'],
      path: '/templates/dark.css',
      colors: {
        background: '#1e1e1e',
        text: '#e0e0e0',
        accent: '#00aaff'
      },
      styles: ''
    },
    { 
      id: 'technical', 
      name: 'Technical', 
      description: 'Optimizado para documentación técnica',
      category: 'documentation',
      tags: ['technical', 'docs'],
      path: '/templates/technical.css',
      colors: {
        background: '#f8f9fa',
        text: '#202124',
        accent: '#4285f4'
      },
      styles: ''
    }
  ] as Template[];

  // Maneja el cambio de plantilla
  const handleTemplateChange = (id: string) => {
    setTemplateId(id);
    const template = templates.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  return (
    <div className="template-selector p-2 border-b border-gray-700">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-300">Plantilla para Vista Previa</h3>
        <span className="text-xs text-gray-400">
          {selectedTemplate?.name || templates.find(t => t.id === templateId)?.name || 'Default'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {templates.map(template => (
          <button
            key={template.id}
            onClick={() => handleTemplateChange(template.id)}
            className={`text-left p-2 text-xs rounded border transition-colors
              ${templateId === template.id 
                ? 'bg-blue-600 border-blue-500 text-white' 
                : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
              }`}
          >
            <div className="font-medium">{template.name}</div>
            <div className="text-xs opacity-80">{template.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector; 