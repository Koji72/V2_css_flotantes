import { visit } from 'unist-util-visit';
// Importar tipos correctos de mdast y mdast-util-directive
import type { Root, Parent, Content } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Plugin } from 'unified';
import { h } from 'hastscript';

// Ya no necesitamos nuestras interfaces Node/DirectiveNode

const remarkCustomPanels: Plugin<[], Root> = () => {
  return (tree) => {
    // Usar el tipo importado ContainerDirective y una firma de visitor más simple
    visit(tree, 'containerDirective', (node: ContainerDirective) => { 
      if (node.name === 'panel') {
        // Los atributos pueden ser undefined o null según el tipo
        const attributes = node.attributes || {};
        const layout = attributes.layout;
        const style = attributes.style;
        const title = attributes.title;

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

        // --- Añadir lógica para el título ---
        if (title && typeof title === 'string') {
          // Asegurar que node.children exista y sea un array
          if (!node.children) {
             node.children = [];
          } else if (!Array.isArray(node.children)) {
             console.warn("[remarkCustomPanels] Panel directive children was not an array, converting...");
             node.children = [node.children];
          }

          // Crear el nodo HAST para el título usando hastscript
          const titleHastNode = h('h4', { className: 'panel-title' }, title); 

          // Intento 1: Crear un nodo MDAST compatible con HAST (usando data)
          const titleMdastNode: Content = {
            type: 'paragraph',
            data: {
              hName: titleHastNode.tagName, 
              hProperties: titleHastNode.properties,
            },
            children: [{ type: 'text', value: title }]
          };
          
          // Insertar el nodo MDAST con datos HAST al principio
          node.children.unshift(titleMdastNode);
        } else if (attributes.hasOwnProperty('title')) {
        }
        // --- Fin de la lógica del título ---

        // Establecer el nombre del tag HTML
        data.hName = 'div';

        // Actualizar className en hProperties
        hProperties.className = classList;

      }
    });
  };
};

export default remarkCustomPanels; 