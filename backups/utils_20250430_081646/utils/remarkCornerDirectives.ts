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
    // console.log("AST entrando a remarkCornerDirectives:", JSON.stringify(tree, null, 2)); 

    visit(tree, (node, index, parent: Parent | undefined) => {
      // Lista de directivas que procesamos
      const directiveNames = ['corner', 'T-edge', 'B-edge', 'L-edge', 'R-edge'];
      
      if (isDirective(node) && directiveNames.includes(node.name)) {
        // console.log(`[remarkCornerDirectives] Procesando directiva: ${node.name}`, node); 
        const directiveNode = node;
        const attributes = directiveNode.attributes || {};

        // --- Lógica Común: Leer y Validar Atributos --- 
        let typeValue = attributes.type || '1';
        let offsetValue = 1; // Default offset for edge compensation
        // No flip support (obsolete)
        const flipH = attributes.flipH === 'true';
        const flipV = attributes.flipV === 'true';
        // No span support in this reverted version

        let spanValue: string | null = null; // Ahora guardamos el string con unidad

        // Validar typeValue - Usar parseInt para una validación numérica más robusta
        let parsedTypeValue = parseInt(typeValue, 10);
        if (isNaN(parsedTypeValue) || parsedTypeValue <= 0) {
          console.warn(`[${directiveNode.name}] Tipo inválido '${typeValue}'. Se usará tipo '1'. Debe ser un entero positivo. Atributos:`, attributes);
          typeValue = '1'; // Mantener typeValue como string para la clase CSS
          // Podríamos querer resetear parsedTypeValue aquí también si se usa después
        } else {
           // Si es válido, mantenemos el typeValue original (como string)
           // No necesitamos hacer nada aquí, typeValue ya tiene el valor correcto.
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

        // Leer y validar span (solo para edges) - Ahora acepta px o %
        if (['T-edge', 'B-edge', 'L-edge', 'R-edge'].includes(directiveNode.name) && attributes.span) {
          const rawSpan = attributes.span.trim();
          if (rawSpan.endsWith('%')) {
            const percentValue = parseFloat(rawSpan.substring(0, rawSpan.length - 1));
            if (!isNaN(percentValue) && percentValue > 0 && percentValue <= 100) {
              spanValue = rawSpan; // Guardar como string con %
            } else {
              console.warn(`[${directiveNode.name}] Span inválido '${attributes.span}'. Debe ser un porcentaje válido (0-100%). Se ignorará.`, attributes);
            }
          } else {
            const pixelValue = parseInt(rawSpan, 10);
            if (!isNaN(pixelValue) && pixelValue > 0) {
              spanValue = `${pixelValue}px`; // Guardar como string con px
            } else {
              console.warn(`[${directiveNode.name}] Span inválido '${attributes.span}'. Debe ser un entero positivo (px) o un porcentaje (%). Se ignorará.`, attributes);
            }
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
          offsetVarName = '--corner-offset'; 
          classNames = `panel-corner corner-pos--${position} corner-type-${typeValue}`;
          
          // Añadir clases de flip si están presentes
          if (flipH) classNames += ' corner-shape-flipped-h';
          if (flipV) classNames += ' corner-shape-flipped-v';
          
          // Añadir clase de offset para posicionamiento preciso
          if (offsetValue !== 0) {
            classNames += ` corner-offset-${offsetValue}`;
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
        
        // Construir el string de estilo con variables CSS
        let styleString = `${offsetVarName}: ${-offsetValue}px;`;
        
        // Añadir span para edges si está presente
        if (spanValue !== null) {
          if (['T-edge', 'B-edge'].includes(directiveNode.name)) {
            styleString += ` --edge-span-width: ${spanValue};`;
          } else if (['L-edge', 'R-edge'].includes(directiveNode.name)) {
            styleString += ` --edge-span-height: ${spanValue};`;
          }
        }
        
        hProperties.style = styleString;
        hProperties['aria-hidden'] = 'true'; // Añadir aria-hidden para accesibilidad

        // Limpiar hijos 
        directiveNode.children = [];
      }
    });
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