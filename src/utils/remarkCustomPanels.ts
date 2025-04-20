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
        const directiveClass = attributes.class;

        // Asegurarse de que node.data y node.data.hProperties existan
        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});

        // --- Lógica de Fusión de Clases --- 
        let finalClasses: Set<string> = new Set(); // Usar Set para evitar duplicados fácilmente

        // 1. Añadir clases del atributo 'class' de la directiva
        if (directiveClass && typeof directiveClass === 'string') {
            directiveClass.split(' ').forEach(cls => cls.trim() && finalClasses.add(cls));
        }

        // 2. Añadir clase base 'panel'
        finalClasses.add('panel');

        // 3. Añadir clase de layout
        if (layout && typeof layout === 'string') {
            finalClasses.add(`layout--${layout.trim()}`);
        }

        // 4. Añadir clase de estilo
        if (style && typeof style === 'string') {
            finalClasses.add(`panel-style--${style.trim()}`);
        }
        // --- Fin Lógica de Fusión de Clases ---

        // Asignar el array final a hProperties
        hProperties.className = Array.from(finalClasses);

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

      }
    });
  };
};

export default remarkCustomPanels; 