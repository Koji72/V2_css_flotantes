import { visit } from 'unist-util-visit';
// Importar tipos correctos de mdast y mdast-util-directive
import type { Root, Parent } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Plugin } from 'unified';

// Ya no necesitamos nuestras interfaces Node/DirectiveNode

const remarkCustomPanels: Plugin<[], Root> = () => {
  return (tree) => {
    // Usar el tipo importado ContainerDirective
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'panel') {
        // Los atributos pueden ser undefined o null según el tipo
        const attributes = node.attributes || {};
        const layout = attributes.layout;
        const style = attributes.style;

        // Asegurarse de que node.data y node.data.hProperties existan
        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});

        // Asegurar que className sea un array
        let classList: string[] = [];
        if (hProperties.className) {
          if (Array.isArray(hProperties.className)) {
            classList = hProperties.className.map(String);
          } else {
            classList = String(hProperties.className).split(' ');
          }
        } else {
           hProperties.className = classList;
        }

        // Añadir clase base 'panel'
        if (!classList.includes('panel')) {
          classList.push('panel');
        }

        // Añadir clase de layout
        if (layout) {
          classList.push(`layout--${layout}`);
        }

        // Añadir clase de estilo
        if (style) {
          classList.push(`panel-style--${style}`);
        }

        // Establecer el nombre del tag HTML
        data.hName = 'div';

        // Actualizar className en hProperties
        hProperties.className = classList;

      }
    });
  };
};

export default remarkCustomPanels; 