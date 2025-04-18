import React from 'react';
import { SimpleTest } from './simple-test';

export const TestPage: React.FC = () => {
  const customExample = `// Ejemplo de un panel personalizado
const CustomPanel = () => {
  const panelManager = PanelManager.getInstance();
  
  useEffect(() => {
    const panel = panelManager.createPanel({
      title: 'Panel Personalizado',
      content: 'Contenido dinámico...',
      styles: {
        '--panel-bg': 'rgba(255, 255, 255, 0.1)',
        '--panel-border': '2px solid var(--accent-color)'
      }
    });
    
    return () => panel.destroy();
  }, []);
  
  return <div id="panel-container" />;
};`;

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ 
        color: 'var(--text-primary)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        Página de Pruebas
      </h1>
      
      <SimpleTest />
      
      <SimpleTest 
        title="Panel Manager Demo"
        description="Ejemplo de cómo crear un panel personalizado usando PanelManager."
        codeExample={customExample}
      />
    </div>
  );
}; 