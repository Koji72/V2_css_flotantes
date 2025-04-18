import React, { useEffect, useRef } from 'react';
import previewManager from '../utils/previewManager';
import { marked } from 'marked';

interface TestEsquinasProps {
  visible: boolean;
}

const TestEsquinas: React.FC<TestEsquinasProps> = ({ visible }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && containerRef.current) {
      const content = `
# Prueba de Paneles con Esquinas Cortadas

## Prueba 1: Esquinas Tech
::panel class="tech-corners"::
### Panel con clase tech-corners
Este panel debería tener esquinas cortadas en el estilo tech-corners.
::panel::

## Prueba 2: Esquinas Cut
::panel class="cut-corners"::
### Panel con clase cut-corners
Este panel debería tener esquinas cortadas en el estilo cut-corners.
::panel::

## Prueba 3: Esquinas Diagonales
::panel class="diagonal-corners"::
### Panel con clase diagonal-corners
Este panel debería tener esquinas cortadas en diagonal.
::panel::

## Prueba 4: Con Botones Interactivos
::panel class="tech-corners"::
### Panel con botones interactivos
Este panel incluye botones para probar la interactividad.

::button{action="mostrar-mensaje" style="primary"}Mostrar Mensaje::
::button{action="cambiar-tema" style="secondary"}Cambiar Tema::
::panel::
      `;
      
      // Renderizar el contenido con marked
      try {
        // Aplicar el procesamiento básico de markdown
        const htmlContent = marked.parse(content) as string;
        if (containerRef.current) {
          containerRef.current.innerHTML = htmlContent;
          
          // Agregar listener para capturar eventos de botones
          document.addEventListener('panel-button-click', (event: Event) => {
            const customEvent = event as CustomEvent;
            console.log('Botón clickeado:', customEvent.detail);
            
            if (customEvent.detail.action === 'mostrar-mensaje') {
              alert('Mensaje de prueba desde el botón');
            } else if (customEvent.detail.action === 'cambiar-tema') {
              document.body.classList.toggle('dark-theme');
            }
          });
        }
      } catch (error) {
        console.error('Error al renderizar el contenido:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="error">Error al renderizar el contenido: ${error}</div>`;
        }
      }
    }
    
    return () => {
      // Limpieza al desmontar
      document.removeEventListener('panel-button-click', () => {});
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="test-esquinas-container p-4">
      <div 
        ref={containerRef} 
        className="test-content"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '20px',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: '8px',
          overflow: 'auto'
        }}
      />
    </div>
  );
};

export default TestEsquinas; 