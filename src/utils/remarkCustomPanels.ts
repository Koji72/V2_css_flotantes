import { visit } from 'unist-util-visit';
// Importar tipos correctos de mdast y mdast-util-directive
import type { Root, Parent, Content } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Plugin } from 'unified';

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
        if (title) {
          // Asegurar que node.children exista
          node.children = node.children || [];

          // Convertir el nodo HAST a un nodo mdast compatible si es necesario,
          // o insertarlo directamente si el ecosistema lo maneja.
          // Por ahora, intentaremos insertarlo directamente asumiendo
          // que rehype manejará la conversión o que el tipo es compatible.
          // ¡Importante! Esto podría necesitar ajustes dependiendo de la cadena completa de plugins.
          // Si esto falla, podríamos necesitar un paso intermedio o un tipo diferente.
          // Necesitamos asegurar que `titleNode` sea del tipo `Content` de mdast
          // Lo más seguro es crear un nodo 'html' crudo si rehype-raw está activado
          // O, más correctamente, manipular el árbol después con rehype. 
          // Vamos a intentarlo añadiendo el nodo como 'html' para rehype-raw

          const titleHtmlNode = {
              type: 'html' as const, // Usar 'html' para que rehype-raw lo procese
              value: `<h4 class="panel-title">${title}</h4>` // Generar el HTML directamente
          };

          node.children.unshift(titleHtmlNode);
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