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

// Función para verificar si un nodo es una directiva específica
function isDirectiveNode(node: Node, name: string): node is DirectiveNode {
  // Ajustar la comprobación de tipo según la estructura real de tus nodos directiva
  // A menudo son 'leafDirective', 'containerDirective', o 'textDirective'
  return (
    (node.type === 'leafDirective' || 
     node.type === 'containerDirective' || 
     node.type === 'textDirective') && 
    (node as DirectiveNode).name === name
  );
}

/**
 * Remark plugin to transform :::corner directives (CONTAINER SYNTAX)
 * into styled <div> elements for decorative corners inside panels.
 *
 * Expects directives like: :::corner{pos=top-left type=stripes} :::
 * Transforms them into: <div class="panel-corner corner-pos--top-left corner-type--stripes"></div>
 */
export default function remarkCornerDirectives() {
  return (tree: Root) => {
    // console.log("AST ANTES de remarkCornerDirectives:", JSON.stringify(tree, null, 2));

    visit(tree, (node, index, parent: Parent | undefined) => {
      // Solo procesamos directivas con nombre 'corner'
      if (isDirectiveNode(node, 'corner')) {
        const directiveNode = node; // Ya sabemos que es DirectiveNode por la comprobación
        const attributes = directiveNode.attributes || {};
        const position = attributes.pos || 'top-left'; // Valor por defecto
        let typeValue = attributes.type || '1';     // Valor por defecto, numérico
        let offsetValue = 1; // Valor por defecto para el offset (compensa borde de 1px)
        const flip = attributes.flip === 'true'; // Comprobar si se debe invertir estilo
        const flipH = attributes.flipH === 'true'; // Comprobar si se debe invertir forma H
        const flipV = attributes.flipV === 'true'; // Comprobar si se debe invertir forma V

        // Leer y validar offset
        if (attributes.offset) {
          const parsedOffset = parseInt(attributes.offset, 10);
          if (!isNaN(parsedOffset) && parsedOffset >= 0) {
            offsetValue = parsedOffset;
          } else {
            console.warn(`[corner] Offset inválido '${attributes.offset}'. Se usará offset por defecto '1'. Atributos:`, attributes);
            offsetValue = 1; // Reset to default 1 if invalid before negating
          }
        }
        
        // Calcular el valor negativo para la variable CSS
        const negativeOffsetValue = -offsetValue;

        // Validar si typeValue es realmente un número
        if (!/^[1-9]\d*$/.test(typeValue)) {
          console.warn(`[corner] Tipo inválido '${typeValue}'. Se usará tipo '1'. Atributos:`, attributes);
          typeValue = '1'; // Usar '1' como fallback si no es un número válido
        }

        console.log(`[corner] Encontrada directiva corner:`, JSON.stringify(directiveNode));
        console.log(`[corner] Índice: ${index}, Nodo Padre:`, parent?.type);
        if (parent) {
          // Log más seguro: solo mostrar tipos de hijos
          console.log(`[corner] Tipos de hijos del padre ANTES:`, JSON.stringify(parent.children.map(c => c.type), null, 2));
        }

        // Asegurarse de que el objeto data exista
        const data = directiveNode.data || (directiveNode.data = {});
        // Asegurarse de que hProperties exista dentro de data
        const hProperties = data.hProperties || (data.hProperties = {});

        // Construir clases CSS
        let classNames = `panel-corner corner-pos--${position} corner-type-${typeValue}`;
        if (flip) {
          classNames += ' corner-flipped'; // Para invertir estilo (e.g., gradiente)
        }
        if (flipH) {
          classNames += ' corner-shape-flipped-h'; // Para invertir forma H (clip-path)
        }
        if (flipV) {
          classNames += ' corner-shape-flipped-v'; // Para invertir forma V (clip-path)
        }

        // Establecer las propiedades HAST para que se renderice como <div>
        data.hName = 'div';
        hProperties.className = classNames; // Asignar clases construidas
        // Añadir el estilo inline con la variable CSS para el offset (ya negativo)
        hProperties.style = `--corner-offset: ${negativeOffsetValue}px;`;

        // REINSERTAR: Eliminar cualquier hijo que la directiva pudiera tener (importante para leafDirective)
        directiveNode.children = [];
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