// src/core/processing/04_renderer.ts
// Etapa 4: Renderizado del AST enriquecido a HTML
import type { Root as MdastRoot } from 'mdast';      // AST de Markdown
import type { Root as HastRoot } from 'hast';        // AST de HTML
import type { ProcessingError } from './pipeline';
import { defaultSchema, sanitize } from 'hast-util-sanitize'; // Sanitizer
import { toHast } from 'mdast-util-to-hast';       // mdast -> hast
import { toHtml } from 'hast-util-to-html';        // hast -> HTML string
import { parse } from 'space-separated-tokens'; // Para parsear clases

// --- Configuración del Sanitizer (Permitir clases y data-attributes) ---
// Clona el schema por defecto para no modificar el original globalmente
const schema = { ...defaultSchema };

// Permitir clases en todos los elementos
schema.attributes = schema.attributes || {};
schema.attributes['*'] = schema.attributes['*'] || [];
// Asegurarse de que 'className' no esté duplicado si ya existe
if (!schema.attributes['*'].includes('className')) {
    schema.attributes['*'].push('className');
}

// Permitir atributos data-* específicos y aria-label
schema.attributes['*'].push(
    'dataPanelType', 
    'dataInteractiveContainer', 
    'dataPanelTitle', 
    // Añadir otros data-* si los usas
    'ariaLabel' 
);

// Permitir tagNames específicos si no están por defecto (ej. section)
if (!schema.tagNames?.includes('section')) {
    schema.tagNames = schema.tagNames || [];
    schema.tagNames.push('section');
}
// Podrías necesitar añadir 'h3', 'pre', etc., si el schema por defecto es muy estricto

/**
 * Renderiza el AST transformado (mdast) a un string HTML.
 * Utiliza mdast-util-to-hast para convertir a hast (HTML Abstract Syntax Tree) y luego
 * hast-util-to-html para serializar a HTML. Aplica sanitización.
 * @param ast El AST (mdast) transformado.
 * @returns Objeto con el string HTML y un array de errores.
 */
export function renderAstToHtml(ast: MdastRoot): { html: string; errors: ProcessingError[] } {
    const errors: ProcessingError[] = [];
    let html = '';
    console.log('[Renderer] Starting AST to HTML rendering...');

    try {
        // 1. Convertir mdast a hast (HTML Abstract Syntax Tree)
        // 'allowDangerousHtml: true' es necesario si quieres que tags HTML crudos en el markdown funcionen
        // Las propiedades hName y hProperties añadidas por el transformer serán usadas aquí.
        console.log('  [Renderer] Converting mdast to hast...');
        const hast = toHast(ast, { allowDangerousHtml: true });
        if (!hast) {
            throw new Error('mdast-util-to-hast returned null or undefined.');
        }
        console.log('  [Renderer] mdast to hast conversion successful.');
        // console.log('  [Renderer] Generated HAST:', JSON.stringify(hast, null, 2)); // Verboso

        // 2. Sanitizar el árbol hast (OPCIONAL pero RECOMENDADO)
        // Esto elimina elementos o atributos potencialmente peligrosos.
        // Usamos un schema personalizado para permitir nuestras clases y data-attributes.
        console.log('  [Renderer] Sanitizing hast...');
        const sanitizedHast = sanitize(hast, schema);
        console.log('  [Renderer] hast sanitization successful.');

        // 3. Convertir hast a string HTML
        console.log('  [Renderer] Converting sanitized hast to HTML string...');
        html = toHtml(sanitizedHast, { allowDangerousHtml: true });
        console.log('  [Renderer] hast to HTML string conversion successful.');

        // <<< AÑADIR LOG DETALLADO DEL HTML FINAL >>>
        console.log('[Renderer] FINAL HTML STRING to be returned:', JSON.stringify(html));
        // <<< FIN LOG DETALLADO >>>

    } catch (error: any) {
        console.error('[Renderer] Error during AST to HTML rendering:', error);
        errors.push({
            stage: 'render',
            message: error.message || 'Error desconocido durante el renderizado HTML',
            details: error
        });
        // Devolver un HTML de error claro
        html = `<div class="error render-error">Error during HTML rendering: ${escapeHtmlLocal(error.message)}</div>`;
    }

    console.log(`[Renderer] Finished AST to HTML rendering. HTML length: ${html.length}`);
    return { html, errors };
}

// Helper de escape local (copiado para autonomía del módulo)
const escapeHtmlLocal = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }; 