"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformAst = transformAst;
const unist_util_visit_1 = require("unist-util-visit"); // Utilidad para recorrer el árbol
// Type guard to check if a node is a DirectiveNode we care about
function isDirectiveNode(node) {
    return node && typeof node === 'object' &&
        (node.type === 'leafDirective' || node.type === 'containerDirective') &&
        typeof node.name === 'string';
}
/**
 * Transforma y enriquece el AST, específicamente procesando los nodos 'directive'
 * generados para la sintaxis :::.
 * - Identifica directivas 'panel'.
 * - Parsea atributos (style, layout, class, title) de la directiva.
 * - Añade clases CSS y data-attributes al nodo para el renderizado HTML.
 * @param ast El AST (Root de mdast) generado por el parser.
 * @returns Objeto con el AST transformado y un array de errores.
 */
function transformAst(ast) {
    const errors = [];
    console.log('[Transformer] Starting AST transformation...');
    try {
        let transformedNodes = 0;
        // Visit ALL nodes using a general visitor
        (0, unist_util_visit_1.visit)(ast, (node) => {
            // Use the type guard INSIDE the visitor
            if (isDirectiveNode(node)) {
                // ---- Inside this block, TypeScript knows 'node' is DirectiveNode ----
                // Process 'panel' and 'datamatrix' directives
                if (node.name === 'panel' || node.name === 'datamatrix') {
                    console.log(`[Transformer] Processing directive node: ${node.name} (Type: ${node.type})`);
                    transformedNodes++;
                    // Ensure data properties exist
                    node.data = node.data || {};
                    node.data.hProperties = node.data.hProperties || {};
                    let panelType = node.name;
                    let title = '';
                    let panelStyleClasses = [];
                    let layoutClass = '';
                    let customClasses = '';
                    let attributes = node.attributes || {};
                    console.log(`  [Transformer] Raw attributes:`, { ...attributes });
                    // Extract known attributes
                    if (attributes.title) {
                        // Asegurarse de que el título esté limpio de comillas
                        title = attributes.title.replace(/^["']|["']$/g, '');
                        delete attributes.title;
                    }
                    else if (attributes.t) {
                        title = attributes.t.replace(/^["']|["']$/g, '');
                        delete attributes.t;
                    }
                    if (attributes.style) {
                        panelStyleClasses = attributes.style.split(',')
                            .map((s) => s.trim().toLowerCase())
                            .filter((s) => s)
                            .map((s) => `panel-style--${s}`);
                        delete attributes.style;
                    }
                    if (attributes.layout) {
                        layoutClass = `layout--${attributes.layout.trim().toLowerCase()}`;
                        delete attributes.layout;
                    }
                    if (attributes.class) {
                        const sanitizedClasses = attributes.class.replace(/[^a-zA-Z0-9\s_-]/g, '').trim();
                        if (sanitizedClasses) {
                            customClasses = ` ${sanitizedClasses}`;
                        }
                        delete attributes.class;
                    }
                    // Build HTML properties
                    const combinedClasses = [
                        'mixed-panel',
                        `panel-${panelType}`,
                        ...panelStyleClasses,
                        layoutClass,
                        customClasses
                    ].filter(Boolean).join(' ').trim().replace(/\s+/g, ' ');
                    // Set hast properties on the node
                    node.data.hName = 'section';
                    node.data.hProperties.className = combinedClasses;
                    node.data.hProperties['data-panel-type'] = panelType;
                    node.data.hProperties['data-interactive-container'] = 'true';
                    // Añadir título si existe
                    if (title) {
                        // Crear un nodo header explícito para el panel
                        node.data.hProperties['aria-label'] = title;
                        node.data.hProperties['data-panel-title'] = title; // Para usar con JS si es necesario
                        // Añadir todos los atributos restantes como data-* 
                        for (const [key, value] of Object.entries(attributes)) {
                            if (key && value) {
                                const dataAttrName = `data-${key.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                                node.data.hProperties[dataAttrName] = value;
                            }
                        }
                    }
                    console.log(`  [Transformer] Applied transformation: hName=section, classes="${combinedClasses}", title="${title}"`);
                    // <<< AÑADIR LOG DETALLADO DEL NODO MODIFICADO >>>
                    try {
                        // Usar JSON.stringify con precaución, puede ser muy grande o tener ciclos.
                        // Seleccionar solo las partes relevantes si es necesario.
                        console.log(`  [Transformer] Node state AFTER transformation:`, JSON.stringify({
                            type: node.type,
                            name: node.name,
                            attributes: node.attributes,
                            data: node.data
                        }, null, 2));
                    }
                    catch (e) {
                        console.error("  [Transformer] Error stringifying node:", e);
                        console.log("  [Transformer] Node data (partial):", node.data);
                    }
                    // <<< FIN LOG DETALLADO >>>
                }
                // Could add: else if (node.name === 'otherDirective') { ... }
            } // End if isDirectiveNode
        }); // End visit callback
        console.log(`[Transformer] AST transformation finished. Transformed ${transformedNodes} nodes.`);
    }
    catch (error) {
        console.error('[Transformer] Error during AST transformation:', error);
        errors.push({
            stage: 'transform',
            message: error.message || 'Error desconocido durante la transformación AST',
            details: error
        });
    }
    return { ast, errors };
}
