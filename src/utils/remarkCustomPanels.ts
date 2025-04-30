import { visit } from 'unist-util-visit';
// Importar tipos correctos de mdast y mdast-util-directive
import type { Root, Content, Text, Paragraph } from 'mdast';
import type { ContainerDirective, LeafDirective } from 'mdast-util-directive';
import type { Plugin } from 'unified';

const remarkCustomPanels: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'panel') {
        const attributes = node.attributes || {};
        const layout = attributes.layout;
        const style = attributes.style;
        const title = attributes.title;
        const directiveClass = attributes.class;

        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});

        let finalClasses: Set<string> = new Set();
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

        // Copiar los hijos para modificarlos de forma segura
        let currentChildren: Content[] = [...(node.children || [])];

        // Insertar título como primer hijo si existe
        if (title && typeof title === 'string') {
          const titleMdastNode: Content = {
            type: 'heading',
            depth: 4,
            data: {
              hName: 'h4',
              hProperties: { className: 'panel-title' },
            },
            children: [{ type: 'text', value: title }]
          };
           // @ts-ignore - Unshift es seguro aquí, TS se queja de tipos complejos
           currentChildren.unshift(titleMdastNode);
        }

        // --- NUEVA Lógica de Limpieza del ::: final --- 
        if (currentChildren.length > 0) {
          let lastContentNodeIndex = -1;
          let markerFound = false;

          // 1. Buscar hacia atrás el último nodo que PUEDE contener el marcador
          for (let i = currentChildren.length - 1; i >= 0; i--) {
            const child = currentChildren[i];
            // @ts-ignore - Acceso seguro a type, aunque TS infiera tipos complejos
            if (child.type === 'paragraph' || child.type === 'text') {
              lastContentNodeIndex = i;
              break;
            // @ts-ignore - Acceso seguro a type
            } else if (child.type === 'leafDirective') {
              continue;
            } else {
              break;
            }
          }

          // 2. Si encontramos un nodo candidato, intentar limpiar el marcador
          if (lastContentNodeIndex !== -1) {
            const targetNode = currentChildren[lastContentNodeIndex] as Paragraph | Text;

            const cleanClosingMarkerFromText = (textNode: any): boolean => {
              if (textNode && typeof textNode.value === 'string') {
                const originalValue = textNode.value;
                const trimmedEndValue = originalValue.trimEnd();
                if (trimmedEndValue.endsWith(':::')) {
                  const lastIndex = originalValue.lastIndexOf(':::');
                  textNode.value = originalValue.slice(0, lastIndex);
                  return true;
                } else if (trimmedEndValue === ':::') {
                  textNode.value = '';
                  return true;
                }
              }
              return false;
            };

            if (targetNode.type === 'paragraph' && targetNode.children) {
              const paragraphChildren: any[] = targetNode.children;
              for (let j = paragraphChildren.length - 1; j >= 0; j--) {
                const inlineNode = paragraphChildren[j];
                // @ts-ignore - Acceso seguro a type y value después de la verificación
                if (inlineNode.type === 'text') {
                  markerFound = cleanClosingMarkerFromText(inlineNode);
                  // @ts-ignore - Acceso seguro a value
                  if (markerFound && !inlineNode.value.trim()) {
                    paragraphChildren.splice(j, 1);
                  }
                  if (markerFound) break;
                }
              }
              if (markerFound && paragraphChildren.length === 0) {
                currentChildren.splice(lastContentNodeIndex, 1);
              }
            } 
            // @ts-ignore - Acceso seguro a type y value después de la verificación
            else if (targetNode.type === 'text') {
              markerFound = cleanClosingMarkerFromText(targetNode);
              // @ts-ignore - Acceso seguro a value
              if (markerFound && !targetNode.value.trim()) {
                currentChildren.splice(lastContentNodeIndex, 1);
              }
            }
          }
        }
        // --- FIN NUEVA Lógica de Limpieza ---
        
        // Reasignar los hijos modificados al nodo original
        // @ts-ignore - La asignación es compleja para TS pero lógicamente correcta
        node.children = currentChildren;

        data.hName = 'div'; // Siempre es div en esta versión
      }
    });
  };
};

export default remarkCustomPanels; 