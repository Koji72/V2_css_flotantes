import { visit } from 'unist-util-visit';
import { h } from 'hastscript';
import type { Transformer } from 'unified';

// Procesador de la directiva de botón
export function remarkDirectiveButton(): Transformer {
  return (tree) => {
    visit(tree, (node: any) => {
      if (
        (node.type === 'textDirective' || 
         node.type === 'leafDirective' || 
         node.type === 'containerDirective') &&
        node.name === 'button'
      ) {
        const data = node.data || (node.data = {});
        const attributes = node.attributes || {};
        
        // Aplicar atributos por defecto si no se especifican
        const style = attributes.style || 'primary';
        const action = attributes.action || '';
        const disabled = attributes.disabled === 'true';
        
        // Crear un elemento button con los atributos correspondientes
        const hast = h(
          'button',
          {
            class: `panel-button panel-button-${style}`,
            'data-action': action,
            disabled: disabled ? '' : undefined,
          },
          // Contenido del botón
          node.children
        );

        // Asignar el nodo hast a los datos del nodo
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

// Procesador para otras directivas que se puedan implementar
export function remarkDirectiveCustom(): Transformer {
  return (tree) => {
    visit(tree, (node: any) => {
      // Aquí se pueden implementar otros tipos de directivas
      // como alertas, tarjetas, etc.
    });
  };
}

// Función para añadir interactividad a los botones en el cliente
export function setupButtonInteractions(container: HTMLElement): void {
  const buttons = container.querySelectorAll('.panel-button[data-action]');
  
  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const action = (button as HTMLElement).dataset.action;
      if (action) {
        // Disparar un evento personalizado que puede ser capturado por la aplicación
        const customEvent = new CustomEvent('panel-button-click', {
          bubbles: true,
          detail: { action }
        });
        button.dispatchEvent(customEvent);
        
        // Evitar comportamiento predeterminado del botón en el contexto del markdown
        event.preventDefault();
      }
    });
  });
}

// Función para eliminar los listener de eventos cuando se desmonta el componente
export function cleanupButtonInteractions(container: HTMLElement): void {
  const buttons = container.querySelectorAll('.panel-button[data-action]');
  
  buttons.forEach((button) => {
    // Clonar y reemplazar para eliminar todos los event listeners
    const newButton = button.cloneNode(true);
    if (button.parentNode) {
      button.parentNode.replaceChild(newButton, button);
    }
  });
} 