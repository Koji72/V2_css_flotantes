import React from 'react';

interface PanelAttribute {
  name: string;
  type: string;
  description: string;
  example?: string;
  required?: boolean;
}

interface PanelStyle {
  name: string;
  description: string;
  example: string;
}

const ATTRIBUTES: PanelAttribute[] = [
  {
    name: 'layout',
    type: 'string',
    description: 'Define la disposición del panel',
    example: 'float-left, float-right, centered, stack-mobile',
    required: false
  },
  {
    name: 'style',
    type: 'string',
    description: 'Estilo visual del panel',
    example: 'tech, fantasy, glass, metal',
    required: false
  },
  {
    name: 'width',
    type: 'string',
    description: 'Ancho del panel',
    example: '30%, 300px, 45vw',
    required: false
  },
  {
    name: 'height',
    type: 'string',
    description: 'Alto del panel',
    example: '200px, 50vh',
    required: false
  },
  {
    name: 'animation',
    type: 'string',
    description: 'Animaciones aplicadas al panel',
    example: 'glow, shake, fade, slide, pulse',
    required: false
  },
  {
    name: 'responsive',
    type: 'string',
    description: 'Comportamiento responsivo',
    example: 'stack-mobile',
    required: false
  },
  {
    name: 'title',
    type: 'string',
    description: 'Título del panel',
    example: 'Mi Panel',
    required: false
  },
  {
    name: 'icon',
    type: 'string',
    description: 'Nombre del icono a mostrar',
    example: 'Settings, Info, ShieldCheck',
    required: false
  },
  {
    name: 'icon-props',
    type: 'object',
    description: 'Propiedades adicionales para el icono',
    example: '{ size: 20, className: "text-blue-500" }',
    required: false
  }
];

const STYLES: PanelStyle[] = [
  {
    name: 'tech',
    description: 'Estilo tecnológico con bordes y efectos de neón',
    example: ':::float[left]{style=tech width=30%}'
  },
  {
    name: 'fantasy',
    description: 'Estilo de fantasía con bordes ornamentales',
    example: ':::float[right]{style=fantasy width=30%}'
  },
  {
    name: 'glass',
    description: 'Efecto de cristal con transparencia y desenfoque',
    example: ':::float[left]{style=glass width=45%}'
  },
  {
    name: 'metal',
    description: 'Apariencia metálica con reflejos y texturas',
    example: ':::float[right]{style=metal width=45%}'
  }
];

export const PanelDocumentation: React.FC = () => {
  return (
    <div className="panel-documentation">
      <h2>Documentación de Paneles</h2>
      
      <section className="attributes-section">
        <h3>Atributos</h3>
        <div className="attributes-grid">
          {ATTRIBUTES.map(attr => (
            <div key={attr.name} className="attribute-card">
              <h4>{attr.name}</h4>
              <p className="type">{attr.type}</p>
              <p className="description">{attr.description}</p>
              {attr.example && (
                <div className="example">
                  <code>{attr.example}</code>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="styles-section">
        <h3>Estilos</h3>
        <div className="styles-grid">
          {STYLES.map(style => (
            <div key={style.name} className="style-card">
              <h4>{style.name}</h4>
              <p className="description">{style.description}</p>
              <div className="example">
                <code>{style.example}</code>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}; 