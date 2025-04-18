/**
 * Escapa caracteres especiales de HTML para prevenir inyección de código
 * @param unsafe Texto sin escapar que puede contener caracteres especiales HTML
 * @returns Texto escapado seguro para incluir en HTML
 */
export const escapeHtmlPreview = (unsafe: string): string => {
    if (typeof unsafe !== 'string') return '';
    
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}; 