import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { Plugin } from 'unified';

// Tipos básicos para el nodo de directiva (pueden ser más complejos)
interface DirectiveNode extends Node {
  type: 'containerDirective' | 'leafDirective' | 'textDirective';
  name: string;
  attributes?: Record<string, string>;
  data?: {
    hName?: string;
    hProperties?: Record<string, any>;
  };
  children: Node[];
}

interface Node {
  type: string;
  data?: any;
  children?: Node[];
  value?: string;
  attributes?: Record<string, string>; // Añadido para consistencia
}


const remarkCustomPanels: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'containerDirective', (node: DirectiveNode) => {
      // Comprobar si es una directiva de panel
      if (node.name === 'panel') {
        const attributes = node.attributes || {};
        const layout = attributes.layout;
        const style = attributes.style;

        // Asegurarse de que node.data y node.data.hProperties existan
        if (!node.data) {
          node.data = {};
        }
        if (!node.data.hProperties) {
          node.data.hProperties = {};
        }

        // Inicializar clases si no existen
        if (!node.data.hProperties.className) {
          node.data.hProperties.className = [];
        } else if (typeof node.data.hProperties.className === 'string') {
          // Convertir a array si es un string
          node.data.hProperties.className = [node.data.hProperties.className];
        }

        // Añadir clase base 'panel' (si no está ya por otro plugin)
        if (!node.data.hProperties.className.includes('panel')) {
          node.data.hProperties.className.push('panel');
        }

        // Añadir clase de layout
        if (layout) {
          // Prefijo 'layout--' como en los CSS de plantilla
          node.data.hProperties.className.push(`layout--${layout}`);
        }

        // Añadir clase de estilo
        if (style) {
          // Prefijo 'panel-style--' como en los CSS de plantilla
          node.data.hProperties.className.push(`panel-style--${style}`);
        }

        // Opcional: Establecer el nombre del tag HTML si es necesario
        // node.data.hName = 'div'; // remark-directive usualmente lo hace si no existe
      }
    });
  };
};

export default remarkCustomPanels; 