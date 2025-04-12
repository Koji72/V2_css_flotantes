// src/core/processing/01_normalizer.ts
// Etapa 1: Normalización del Markdown de entrada 

/**
 * Normaliza el string de markdown.
 * - Reemplaza saltos de línea CR+LF (Windows) por LF (Unix/Mac).
 * - (Podría añadir trim() o eliminar caracteres BOM si es necesario).
 * @param markdown El markdown crudo.
 * @returns El markdown normalizado.
 */
export function normalize(markdown: string): string {
    if (typeof markdown !== 'string') {
        console.warn('[Normalizer] Input was not a string, returning empty string.');
        return '';
    }
    // Reemplazar CR LF (Windows) por LF (Unix/Mac)
    let normalized = markdown.replace(/\r\n/g, '\n');
    // Se podrían añadir otras normalizaciones aquí
    // Ejemplo: Eliminar Byte Order Mark (BOM) si aparece al principio
    // if (normalized.charCodeAt(0) === 0xFEFF) {
    //     normalized = normalized.slice(1);
    // }
    return normalized;
} 