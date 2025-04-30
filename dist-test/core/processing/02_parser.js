"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToAst = parseToAst;
const mdast_util_from_markdown_1 = require("mdast-util-from-markdown");
const micromark_extension_gfm_1 = require("micromark-extension-gfm"); // Extensión Micromark para GFM
const mdast_util_gfm_1 = require("mdast-util-gfm"); // Utilidad MDAST para GFM
const micromark_extension_directive_1 = require("micromark-extension-directive"); // Extensión Micromark para ::: directives
const mdast_util_directive_1 = require("mdast-util-directive"); // Utilidad MDAST para ::: directives
/**
 * Parsea markdown normalizado a un AST (mdast).
 * Utiliza micromark con extensiones GFM y directive (para :::).
 * @param normalizedMarkdown Markdown ya normalizado.
 * @returns Objeto con el AST (Root de mdast) o null, y un array de errores.
 */
async function parseToAst(normalizedMarkdown) {
    const errors = [];
    let ast = null;
    // <<< LOGS ADICIONALES PARA DIAGNÓSTICO >>>
    console.log('[Parser] parseToAst CALLED');
    console.log('[Parser] Input type:', typeof normalizedMarkdown);
    console.log('[Parser] Input is string:', typeof normalizedMarkdown === 'string');
    console.log('[Parser] Input is empty:', !normalizedMarkdown || normalizedMarkdown === '');
    console.log('[Parser] Input first char code:', normalizedMarkdown?.charCodeAt(0));
    console.log('[Parser] Input starts with HTML?', normalizedMarkdown?.startsWith('<!DOCTYPE') || normalizedMarkdown?.startsWith('<html'));
    // <<< FIN LOGS ADICIONALES >>>
    // <<< LOG DE ENTRADA >>>
    console.log('[Parser] Input markdown length:', normalizedMarkdown?.length);
    console.log('[Parser] Input markdown first 100 chars:', normalizedMarkdown?.substring(0, 100));
    // Debug: Buscar si hay directivas panel en el texto
    const panelRegex = /:::(panel|datamatrix)(\{[^}]*\})?/g;
    const panelMatches = normalizedMarkdown.match(panelRegex);
    console.log('[Parser] Panel directives found:', panelMatches?.length || 0, panelMatches);
    // <<< FIN LOG >>>
    if (!normalizedMarkdown || normalizedMarkdown.trim() === '') {
        console.warn('[Parser] Empty or blank markdown received');
        errors.push({
            stage: 'parse',
            message: 'Empty markdown content',
            details: null
        });
        return { ast: null, errors };
    }
    try {
        console.log('[Parser] Starting AST parsing...');
        // Pre-procesamiento para asegurarnos que las directivas tengan el formato correcto
        let processedMarkdown = normalizedMarkdown;
        // Asegurarse que los bloques de panel tengan el formato esperado por el parser
        // Si encontramos :::panel{title="..."} necesitamos transformarlo a :::panel[]{title="..."}
        processedMarkdown = processedMarkdown.replace(/^(:::(?:panel|datamatrix))\{/gm, '$1[]{');
        // --- NEW DEBUG LOG ---
        console.log('[Parser] Markdown AFTER pre-processing to add []:');
        console.log(processedMarkdown.substring(0, 500)); // Log first 500 chars
        // --- END NEW DEBUG LOG ---
        console.log('[Parser] After pre-processing:', processedMarkdown.substring(0, 200));
        // Configurar micromark y mdast-util-from-markdown con las extensiones
        ast = (0, mdast_util_from_markdown_1.fromMarkdown)(processedMarkdown, {
            // Extensiones para la sintaxis de markdown (micromark)
            extensions: [
                (0, micromark_extension_gfm_1.gfm)(), // Habilitar sintaxis GFM (tablas, tachado, etc.)
                (0, micromark_extension_directive_1.directive)() // Habilitar sintaxis :::name[label]{key=val}
            ],
            // Extensiones para construir el árbol AST (mdast)
            mdastExtensions: [
                (0, mdast_util_gfm_1.gfmFromMarkdown)(), // Interpretar nodos GFM en el AST
                (0, mdast_util_directive_1.directiveFromMarkdown)() // Interpretar directivas ::: en el AST
            ]
        });
        console.log('[Parser] AST parsing finished.');
        // Verificar que el AST tenga contenido
        if (!ast || !ast.children || ast.children.length === 0) {
            console.warn('[Parser] Empty AST generated');
            errors.push({
                stage: 'parse',
                message: 'Parser produced empty AST',
                details: { inputLength: normalizedMarkdown.length }
            });
        }
        else {
            // Análisis rápido del AST
            const nodeTypes = ast.children.map(node => node.type);
            console.log('[Parser] AST node types:', nodeTypes);
            console.log('[Parser] AST child count:', ast.children.length);
            // Verificar si hay nodos de tipo "containerDirective" (paneles)
            const directiveNodes = ast.children.filter(node => {
                const nodeWithChildren = node;
                return node.type === 'containerDirective' ||
                    (nodeWithChildren.children &&
                        nodeWithChildren.children.some(child => child.type === 'containerDirective'));
            });
            console.log('[Parser] Found directive nodes:', directiveNodes.length);
        }
        // <<< LOG DETALLADO DEL AST GENERADO >>>
        try {
            // Convertir a JSON para inspección, pero solo los primeros 1000 caracteres para no saturar
            const astJson = JSON.stringify(ast, null, 2);
            console.log('[Parser] Generated AST Structure (truncated):', astJson.length > 1000 ? astJson.substring(0, 1000) + '...' : astJson);
        }
        catch (stringifyError) {
            console.error('[Parser] Error stringifying AST:', stringifyError);
            console.log('[Parser] AST Object (partial):', ast);
        }
        // <<< FIN LOG AST >>>
    }
    catch (error) {
        console.error('[Parser] Error during AST parsing:', error);
        errors.push({
            stage: 'parse',
            message: error.message || 'Error desconocido durante el parseo AST',
            details: error,
            // Intentar extraer posición del error si está disponible (VFileMessage)
            line: error.position?.start?.line,
            column: error.position?.start?.column
        });
        ast = null; // Asegurarse que el AST es null si hay error crítico
    }
    return { ast, errors };
}
