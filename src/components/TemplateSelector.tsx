'use client';

import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { Template, templates } from '../types/templates';

interface TemplateSelectorProps {
  onSelect: (template: Template) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Obtener todas las categorías y tags únicas
  const categories = useMemo(() => 
    Array.from(new Set(templates.map((t: Template) => t.category))), 
    []
  );

  const allTags = useMemo(() => 
    Array.from(new Set(templates.flatMap((t: Template) => t.tags))), 
    []
  );

  // Filtrar templates basado en búsqueda, categoría y tags
  const filteredTemplates = useMemo(() => {
    return templates.filter((template: Template) => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = !selectedCategory || template.category === selectedCategory;
      
      const matchesTags = selectedTags.length === 0 || 
                         selectedTags.every(tag => template.tags.includes(tag));
      
      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchTerm, selectedCategory, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="p-2 overflow-hidden">
      {/* Barra de búsqueda */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Buscar plantillas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-1 pl-8 text-sm rounded border focus:outline-none focus:ring-1"
          style={{
            borderColor: 'var(--border-color)',
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
          }}
        />
        <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
      </div>

      {/* Filtros de categoría */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {categories.map((category: string) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(prev => prev === category ? null : category)}
              className={`px-2 py-0.5 rounded-full text-xs transition-colors`}
              style={{
                backgroundColor: selectedCategory === category ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                color: selectedCategory === category ? 'white' : 'var(--text-secondary)',
              }}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Filtros de tags */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 max-h-16 overflow-y-auto pb-1">
          {allTags.map((tag: string) => (
            <button
              key={tag}
              onClick={() => handleTagToggle(tag)}
              className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 transition-colors`}
              style={{
                backgroundColor: selectedTags.includes(tag) ? 'var(--accent-color)' : 'var(--bg-tertiary)',
                color: selectedTags.includes(tag) ? 'white' : 'var(--text-secondary)',
              }}
            >
              {tag}
              {selectedTags.includes(tag) && <X className="h-3 w-3" />}
            </button>
          ))}
        </div>
      )}

      {/* Grid de plantillas */}
      <div className="grid grid-cols-2 gap-2 max-h-[calc(40vh-10rem)] overflow-y-auto">
        {filteredTemplates.map((template: Template) => (
          <div
            key={template.id}
            onClick={() => onSelect(template)}
            className="p-2 rounded cursor-pointer transition-colors"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'var(--border-color)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            <h3 className="font-medium text-sm mb-1" style={{color: 'var(--text-primary)'}}>{template.name}</h3>
            <p className="text-xs mb-1 line-clamp-2" style={{color: 'var(--text-secondary)'}}>{template.description}</p>
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 2).map((tag: string) => (
                <span
                  key={tag}
                  className="px-1 py-0.5 rounded-sm text-[10px]"
                  style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 2 && 
                <span className="text-[10px]" style={{color: 'var(--text-secondary)'}}>+{template.tags.length - 2}</span>
              }
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-4 text-sm" style={{color: 'var(--text-secondary)'}}>
          No se encontraron plantillas que coincidan con los criterios de búsqueda.
        </div>
      )}
    </div>
  );
};

export default TemplateSelector; 