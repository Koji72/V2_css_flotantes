import { visit } from 'unist-util-visit';

const remarkCustomPanels = () => {
  return (tree) => {
    visit(tree, 'containerDirective', (node) => {
      if (node.name === 'panel') {
        const attributes = node.attributes || {};
        const layout = attributes.layout;
        const style = attributes.style;
        const title = attributes.title;
        const directiveClass = attributes.class;

        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});

        let finalClasses = new Set();
        if (directiveClass && typeof directiveClass === 'string') {
          directiveClass.split(' ').forEach(cls => cls.trim() && finalClasses.add(cls));
        }
        finalClasses.add('panel');
        if (layout && typeof layout === 'string') {
          finalClasses.add(`layout--${layout.trim()}`);
        }
        if (style && typeof style === 'string') {
          finalClasses.add(`panel-style--${style.trim()}`);
        }
        hProperties.className = Array.from(finalClasses);

        // Insertar título como primer hijo si existe
        if (title && typeof title === 'string') {
          const titleNode = {
            type: 'heading',
            depth: 4,
            data: {
              hName: 'h4',
              hProperties: { className: 'panel-title' },
            },
            children: [{ type: 'text', value: title }]
          };
          const currentChildren = node.children || [];
          node.children = [titleNode, ...currentChildren];
        }

        // --- NUEVA Lógica de Limpieza del ::: final ---
        if (node.children && node.children.length > 0) {
          let lastContentNodeIndex = -1;
          let markerFound = false;

          // 1. Buscar hacia atrás el último nodo que PUEDE contener el marcador (ignorar directivas de esquina/borde)
          for (let i = node.children.length - 1; i >= 0; i--) {
            const child = node.children[i];
            // Consideramos párrafos y nodos de texto como candidatos a contener el :::
            // Ignoramos explícitamente leafDirectives (esquinas, bordes, etc.)
            if (child.type === 'paragraph' || child.type === 'text') {
              lastContentNodeIndex = i;
              break; // Encontramos el último nodo de contenido relevante
            } else if (child.type === 'leafDirective') {
              // Ignorar, seguir buscando hacia atrás
              continue;
            } else {
              // Si encontramos otro tipo de nodo que no sea ignorable, paramos
              // (podría ser un bloque de código, lista, etc.)
              break;
            }
          }

          // 2. Si encontramos un nodo candidato, intentar limpiar el marcador
          if (lastContentNodeIndex !== -1) {
            const targetNode = node.children[lastContentNodeIndex];

            // Función auxiliar para limpiar el marcador ::: de un nodo de texto
            const cleanClosingMarkerFromText = (textNode) => {
              if (textNode && typeof textNode.value === 'string') {
                const originalValue = textNode.value;
                const trimmedEndValue = originalValue.trimEnd();

                if (trimmedEndValue.endsWith(':::')) {
                  const lastIndex = originalValue.lastIndexOf(':::');
                  textNode.value = originalValue.slice(0, lastIndex);
                  return true; // Marcador encontrado y limpiado
                } else if (trimmedEndValue === ':::') {
                  textNode.value = '';
                  return true; // Marcador encontrado y limpiado
                }
              }
              return false;
            };

            // 2a. Si el nodo es un párrafo, buscar el marcador en sus hijos de texto
            if (targetNode.type === 'paragraph' && targetNode.children) {
              for (let j = targetNode.children.length - 1; j >= 0; j--) {
                const inlineNode = targetNode.children[j];
                if (inlineNode.type === 'text') {
                  markerFound = cleanClosingMarkerFromText(inlineNode);
                  if (markerFound && !inlineNode.value.trim()) {
                    targetNode.children.splice(j, 1); // Eliminar nodo de texto si quedó vacío
                  }
                  if (markerFound) break; // Salir si se encontró en este nodo de texto
                }
              }
              // Si el párrafo quedó vacío después de limpiar, eliminarlo
              if (markerFound && targetNode.children.length === 0) {
                node.children.splice(lastContentNodeIndex, 1);
              }
            } 
            // 2b. Si el nodo es directamente un nodo de texto
            else if (targetNode.type === 'text') {
              markerFound = cleanClosingMarkerFromText(targetNode);
              // Si el nodo de texto quedó vacío, eliminarlo
              if (markerFound && !targetNode.value.trim()) {
                node.children.splice(lastContentNodeIndex, 1);
              }
            }
          }
        }
        // --- FIN NUEVA Lógica de Limpieza ---

        data.hName = 'div';
      }
    });
  };
};

export default remarkCustomPanels; 