"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkdownProcessor = void 0;
const marked_1 = require("marked");
// Helper para escapar HTML básico
const escapeHtml = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/\'/g, "&#039;");
};
// Clase Principal del Procesador de Markdown
class MarkdownProcessor {
    constructor() {
        console.log("MarkdownProcessor: Inicializando v2.6 (Simplified)");
        // Configuración de marked 
        // Nota: Algunas opciones como 'sanitize' y 'headerIds' se han eliminado en versiones recientes
        marked_1.marked.setOptions({
            gfm: true, // GitHub Flavored Markdown
            breaks: true, // Convertir saltos de línea en <br>
            pedantic: false, // No ser demasiado estricto con la especificación original
        });
    }
    // Patrón Singleton
    static getInstance() {
        if (!MarkdownProcessor.instance) {
            MarkdownProcessor.instance = new MarkdownProcessor();
        }
        return MarkdownProcessor.instance;
    }
    // Método para escapar HTML (necesario para data-attrs)
    escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    /**
     * Método principal para procesar markdown
     */
    async process(preProcessedMarkdown) {
        console.log('[Procesador] Iniciando procesamiento con markdown pre-procesado');
        if (!preProcessedMarkdown || typeof preProcessedMarkdown !== 'string') {
            console.error('[Procesador] Markdown inválido recibido (posiblemente vacío)');
            return {
                html: `<div class="error">Error: Markdown inválido o vacío recibido por el procesador final.</div>`,
                metadata: {},
            };
        }
        try {
            // Llamar a marked con el markdown pre-procesado
            console.log("[Procesador] Llamando a marked.parse...");
            // En versiones recientes, marked.parse con async: true devuelve una Promise
            const html = await marked_1.marked.parse(preProcessedMarkdown, {
                async: true
            });
            console.log("[Procesador] marked.parse finalizado.");
            return {
                html,
                metadata: {},
            };
        }
        catch (error) {
            console.error('[Procesador] Error durante el procesamiento final con marked:', error);
            console.error('[Procesador] Input que causó el error:', JSON.stringify(preProcessedMarkdown.substring(0, 500))); // Log input
            return {
                html: `<div class="error markdown-error">Error final en Marked: ${escapeHtml(String(error))}</div>`,
                metadata: {}
            };
        }
    }
    replacePanelBlocks(markdown) {
        try {
            console.log("MarkdownProcessor.replacePanelBlocks: Procesando paneles...");
            // Expresiones regulares para ambos formatos: {|} y []
            const panelRegexCurlyBraces = /^:::\s*(\w+)\s*\{([^}]*)\}([\s\S]*?)^:::/gm;
            const panelRegexSquareBrackets = /^:::\s*(\w+)\s*\[([^\]]*)\]([\s\S]*?)^:::/gm;
            // Procesar formato con llaves {}
            let result = markdown.replace(panelRegexCurlyBraces, (match, type, attrsLine, content) => {
                console.log(`Panel detectado (formato {}): Tipo=${type}, AttrLine=${attrsLine}`);
                // Eliminar atributos layout, style, animation, etc. del contenido del panel
                const cleanedContent = content.replace(/^(layout|style|animation|class)="[^"]*"\s*/mgi, '');
                return `<div class="panel ${type}" data-attrs="${this.escapeHtml(attrsLine)}">\n${cleanedContent}\n</div>`;
            });
            // Procesar formato con corchetes []
            result = result.replace(panelRegexSquareBrackets, (match, type, attrsLine, content) => {
                console.log(`Panel detectado (formato []): Tipo=${type}, AttrLine=${attrsLine}`);
                // Eliminar atributos layout, style, animation, etc. del contenido del panel
                const cleanedContent = content.replace(/^(layout|style|animation|class)="[^"]*"\s*/mgi, '');
                return `<div class="panel ${type}" data-attrs="${this.escapeHtml(attrsLine)}">\n${cleanedContent}\n</div>`;
            });
            return result;
        }
        catch (error) {
            console.error('Error en replacePanelBlocks:', error);
            return markdown;
        }
    }
}
exports.MarkdownProcessor = MarkdownProcessor;
// !!! NI REGISTRO DE EXTENSIONES ::: !!!
// !!! NI REGISTRO DE EXTENSIONES ::: !!!
