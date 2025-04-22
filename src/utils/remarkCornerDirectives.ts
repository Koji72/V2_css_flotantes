import { visit, SKIP } from 'unist-util-visit';
import type { Root, Content, Parent } from 'mdast';
import type { Node } from 'unist';

// Helper type para asegurar que el nodo tiene data y attributes
interface DirectiveNode extends Node {
  name: string;
  attributes?: Record<string, string>;
  children: Content[];
  data?: {
    hName?: string;
    hProperties?: Record<string, any>;
    [key: string]: unknown;
  };
}

// Función para verificar si un nodo es un tipo de directiva
function isDirective(node: Node): node is DirectiveNode {
  return (
    node.type === 'leafDirective' ||
    node.type === 'containerDirective' ||
    node.type === 'textDirective'
  );
}

/**
 * Remark plugin to transform :::corner, ::T-edge, ::B-edge directives
 * into styled <div> elements for decorative elements on panels.
 */
export default function remarkCornerDirectives() {
  return (tree: Root) => {
    // console.log("AST ANTES de remarkCornerDirectives:", JSON.stringify(tree, null, 2));

    visit(tree, (node, index, parent: Parent | undefined) => {
      // Lista de directivas que procesamos
      const directiveNames = ['corner', 'T-edge', 'B-edge', 'L-edge', 'R-edge'];
      
      if (isDirective(node) && directiveNames.includes(node.name)) {
        const directiveNode = node;
        const attributes = directiveNode.attributes || {};

        // --- Lógica Común: Leer y Validar Atributos --- 
        let typeValue = attributes.type || '1';
        let offsetValue = 1; // Default offset for edge compensation
        const flip = attributes.flip === 'true';
        const flipH = attributes.flipH === 'true';
        const flipV = attributes.flipV === 'true';
        let spanValue: number | null = null;

        // Validar typeValue
        if (!/^[1-9]\d*$/.test(typeValue)) {
          console.warn(`[${directiveNode.name}] Tipo inválido '${typeValue}'. Se usará tipo '1'. Atributos:`, attributes);
          typeValue = '1';
        }

        // Leer y validar offset
        if (attributes.offset) {
          const parsedOffset = parseInt(attributes.offset, 10);
          if (!isNaN(parsedOffset) && parsedOffset >= 0) {
            offsetValue = parsedOffset;
          } else {
            console.warn(`[${directiveNode.name}] Offset inválido '${attributes.offset}'. Se usará offset por defecto '1'. Atributos:`, attributes);
            offsetValue = 1;
          }
        }

        // Leer y validar span (para Edges)
        if (attributes.span && ['T-edge', 'B-edge', 'L-edge', 'R-edge'].includes(directiveNode.name)) {
          const parsedSpan = parseFloat(attributes.span);
          if (!isNaN(parsedSpan) && parsedSpan >= 0 && parsedSpan <= 100) {
            spanValue = parsedSpan;
          } else {
            console.warn(`[${directiveNode.name}] Span inválido '${attributes.span}'. Se usará tamaño por defecto. Debe ser número entre 0 y 100. Atributos:`, attributes);
          }
        }

        // --- Lógica Específica por Directiva --- 
        const data = directiveNode.data || (directiveNode.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});
        data.hName = 'div';
        let classNames = '';
        let offsetVarName = '--corner-offset'; // Default for corner

        if (directiveNode.name === 'corner') {
          const position = attributes.pos || 'top-left';
          offsetVarName = '--corner-offset'; // Confirm variable name
          classNames = `panel-corner corner-pos--${position} corner-type-${typeValue}`;
          if (flipH) {
            classNames += ' corner-shape-flipped-h';
          }
          if (flipV) {
            classNames += ' corner-shape-flipped-v';
          }
        } else if (directiveNode.name === 'T-edge') {
          offsetVarName = '--edge-offset'; 
          classNames = `panel-edge edge-pos--top edge-type-${typeValue}`;
        } else if (directiveNode.name === 'B-edge') {
          offsetVarName = '--edge-offset';
          classNames = `panel-edge edge-pos--bottom edge-type-${typeValue}`;
        } else if (directiveNode.name === 'L-edge') {
          offsetVarName = '--edge-offset';
          classNames = `panel-edge edge-pos--left edge-type-${typeValue}`;
        } else if (directiveNode.name === 'R-edge') {
          offsetVarName = '--edge-offset';
          classNames = `panel-edge edge-pos--right edge-type-${typeValue}`;
        }

        hProperties.className = classNames;
        // Establecer variable de offset (siempre negativa)
        hProperties.style = `${offsetVarName}: ${-offsetValue}px;`; 

        // Añadir variable de span si existe y es válida
        if (spanValue !== null) {
          if (['T-edge', 'B-edge'].includes(directiveNode.name)) {
            hProperties.style += ` --edge-span-width: ${spanValue}%;`;
          } else if (['L-edge', 'R-edge'].includes(directiveNode.name)) {
            hProperties.style += ` --edge-span-height: ${spanValue}%;`;
          }
        }

        // Limpiar hijos (importante para leaf/text directives)
        directiveNode.children = [];

        // Prevenir visitar los hijos de esta directiva (ya procesada)
        // return SKIP; // <-- Descomentar si se usa sintaxis de contenedor :::edge::: 
                     //     Comentado si se usa sintaxis ::edge 
      }
    });

    // console.log("AST DESPUÉS de remarkCornerDirectives:", JSON.stringify(tree, null, 2));
  };
}

// --- Notas sobre el chequeo del padre (Eliminado temporalmente para depuración) ---
/*
        // Comprobación Opcional: ¿Está directamente dentro de un panel?
        // Esto puede ser problemático si hay nodos intermedios (ej: párrafos)
        let isDirectlyInPanel = false;
        if (parent && (parent.type === 'containerDirective' && (parent as DirectiveNode).name === 'panel')) {
           isDirectlyInPanel = true;
        }
        // Podríamos añadir lógica más compleja para buscar ancestros si es necesario

        if (!isDirectlyInPanel) {
           console.warn("Directiva corner encontrada fuera de un panel directo. Ignorando por ahora.", directiveNode);
           return; // No procesar si no está en un panel (o según la lógica deseada)
        }
*/ 