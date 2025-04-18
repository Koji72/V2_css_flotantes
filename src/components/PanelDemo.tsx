import React, { useEffect } from 'react';
import { PanelManager } from '../utils/panelManager';

const PanelDemo: React.FC = () => {
  useEffect(() => {
    const panelManager = new PanelManager();
    panelManager.initialize();

    // Crear contenedor de demostración
    const demoContainer = document.getElementById('panel-demo');
    if (!demoContainer) return;

    // Panel básico
    const basicPanel = panelManager.createPanel({
      style: 'basic',
      class: 'panel-content',
      'custom-style': JSON.stringify({
        '--panel-bg': 'var(--bg-secondary)',
        '--panel-border': 'var(--border-color)'
      })
    });
    basicPanel.innerHTML = `
      <div class="panel-header">
        <h3>Panel Básico</h3>
      </div>
      <div class="panel-content">
        <p>Este es un panel básico con contenido simple.</p>
      </div>
    `;

    // Panel con efecto cristal
    const glassPanel = panelManager.createPanel({
      style: 'glass',
      class: 'floating hoverable',
      'custom-style': JSON.stringify({
        '--panel-glass-bg': 'rgba(255, 255, 255, 0.1)',
        '--panel-glass-border': 'rgba(255, 255, 255, 0.2)'
      })
    });
    glassPanel.innerHTML = `
      <div class="panel-header">
        <h3>Panel Cristal</h3>
      </div>
      <div class="panel-content">
        <p>Panel con efecto de cristal y hover.</p>
      </div>
    `;

    // Panel con esquinas cortadas
    const cutCornerPanel = panelManager.createPanel({
      style: 'cut-corner',
      class: 'border-accent',
      'custom-style': JSON.stringify({
        '--cut-size': '15px'
      })
    });
    cutCornerPanel.innerHTML = `
      <div class="panel-header">
        <h3>Panel Esquinas Cortadas</h3>
      </div>
      <div class="panel-content">
        <p>Panel con esquinas cortadas y borde acentuado.</p>
      </div>
    `;

    // Panel con patrón de cuadrícula
    const gridPanel = panelManager.createPanel({
      style: 'pattern-grid',
      class: 'rounded-lg shadow-lg',
      'custom-style': JSON.stringify({
        '--panel-bg': 'var(--bg-primary)'
      })
    });
    gridPanel.innerHTML = `
      <div class="panel-header">
        <h3>Panel Cuadrícula</h3>
      </div>
      <div class="panel-content">
        <p>Panel con patrón de cuadrícula y sombra.</p>
      </div>
    `;

    // Añadir paneles al contenedor
    demoContainer.appendChild(basicPanel);
    demoContainer.appendChild(glassPanel);
    demoContainer.appendChild(cutCornerPanel);
    demoContainer.appendChild(gridPanel);

    return () => {
      panelManager.destroy();
    };
  }, []);

  return (
    <div id="panel-demo" className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Demostración de Paneles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Los paneles se insertarán aquí dinámicamente */}
      </div>
    </div>
  );
};

export default PanelDemo; 