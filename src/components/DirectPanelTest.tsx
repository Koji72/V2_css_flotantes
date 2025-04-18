import React, { useEffect, useRef } from 'react';
import { PanelManager } from '../utils/panelManager';
import { ButtonManager } from '../utils/buttonManager'; // Import ButtonManager if testing buttons too

const DirectPanelTest: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelManagerRef = useRef<PanelManager | null>(null);
  const buttonManagerRef = useRef<ButtonManager | null>(null); // Ref for ButtonManager

  useEffect(() => {
    // Initialize managers
    if (!panelManagerRef.current) {
      panelManagerRef.current = PanelManager.getInstance();
      panelManagerRef.current.initialize(); // Ensure theme observer is active
    }
    if (!buttonManagerRef.current) {
      buttonManagerRef.current = ButtonManager.getInstance(); 
      // No need to initialize ButtonManager explicitly unless it has an init method
    }

    const pm = panelManagerRef.current;
    const bm = buttonManagerRef.current;
    const container = containerRef.current;

    if (!pm || !bm || !container) {
      console.error("DirectPanelTest: Managers or container not ready.");
      return;
    }

    // Clear previous test elements if component re-renders
    container.innerHTML = ''; 

    // --- Panel Definitions ---

    // 1. Basic Panel
    const basicPanel = pm.createPanel({ class: 'basic-demo' }); // Just base styles
    basicPanel.innerHTML = `
      <div class="panel-header"><h3>Panel Básico (Directo)</h3></div>
      <div class="panel-content"><p>Este panel usa estilos base.</p></div>
    `;
    container.appendChild(basicPanel);

    // 2. Glass Panel
    const glassPanel = pm.createPanel({ style: 'glass', class: 'glass-demo floating' });
    glassPanel.innerHTML = `
      <div class="panel-header"><h3>Panel Glass (Directo)</h3></div>
      <div class="panel-content"><p>Este panel debería tener efecto cristal.</p></div>
    `;
    container.appendChild(glassPanel);

    // 3. Cut Corner Panel with Accent
    const cutCornerPanel = pm.createPanel({ style: 'cut-corner', class: 'cut-corner-demo border-accent' });
    cutCornerPanel.innerHTML = `
      <div class="panel-header"><h3>Panel Esquina Cortada (Directo)</h3></div>
      <div class="panel-content"><p>Con borde acentuado.</p></div>
    `;
    container.appendChild(cutCornerPanel);

    // 4. Pattern Grid with Shadow
    const gridPanel = pm.createPanel({ class: 'pattern-grid shadow-lg grid-demo' });
    gridPanel.innerHTML = `
      <div class="panel-header"><h3>Panel Cuadrícula (Directo)</h3></div>
      <div class="panel-content"><p>Con sombra y patrón.</p></div>
    `;
    container.appendChild(gridPanel);

    // 5. Panel with Buttons
    const buttonPanel = pm.createPanel({ style: 'glass', class: 'button-panel-demo' });
    const buttonContentDiv = document.createElement('div');
    buttonContentDiv.className = 'panel-content';
    buttonContentDiv.innerHTML = '<p>Este panel contiene botones creados directamente:</p>';
    
    // Create buttons programmatically
    const btnPrimary = bm.createButton({ action: 'direct-primary', style: 'primary'});
    btnPrimary.textContent = 'Botón Primario';
    buttonContentDiv.appendChild(btnPrimary);

    const btnSecondary = bm.createButton({ action: 'direct-secondary', style: 'secondary'});
    btnSecondary.textContent = 'Botón Secundario';
    buttonContentDiv.appendChild(btnSecondary);

    const btnSuccess = bm.createButton({ action: 'direct-success', style: 'success'});
    btnSuccess.textContent = 'Botón Éxito';
    buttonContentDiv.appendChild(btnSuccess);

    const btnDanger = bm.createButton({ action: 'direct-danger', style: 'danger'});
    btnDanger.textContent = 'Botón Peligro';
    buttonContentDiv.appendChild(btnDanger);

    buttonPanel.innerHTML = `<div class="panel-header"><h3>Panel con Botones (Directo)</h3></div>`;
    buttonPanel.appendChild(buttonContentDiv); // Append div containing buttons
    container.appendChild(buttonPanel);

    // Cleanup function
    return () => {
      console.log("DirectPanelTest: Cleaning up PanelManager.");
      // No need to destroy singleton instance generally, but disconnect observer if needed
      // pm.destroy(); // If PanelManager needs cleanup like observer disconnection
      // panelManagerRef.current = null; // Optional reset
    };
  }, []); // Run only once on mount

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Prueba Directa de Paneles</h2>
      <p className="text-gray-400 mb-4">Esta página crea paneles directamente usando PanelManager, sin procesar Markdown.</p>
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Paneles se insertarán aquí */}
      </div>
    </div>
  );
};

export default DirectPanelTest; 