import { marked } from 'marked';

// Helper para escapar HTML básico
const escapeHtml = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/\'/g, "&#039;");
};

// Interfaz para el resultado del procesamiento
interface ProcessResult {
  html: string;
  metadata: any;
}

// Clase Principal del Procesador de Markdown
export class MarkdownProcessor {
    private static instance: MarkdownProcessor;

    private constructor() {
        console.log("MarkdownProcessor: Inicializando v2.6 (Simplified)");
        // Configuración de marked 
        // Nota: Algunas opciones como 'sanitize' y 'headerIds' se han eliminado en versiones recientes
        marked.setOptions({
            gfm: true,       // GitHub Flavored Markdown
            breaks: true,    // Convertir saltos de línea en <br>
            pedantic: false, // No ser demasiado estricto con la especificación original
        });
    }

    // Patrón Singleton
    public static getInstance(): MarkdownProcessor {
        if (!MarkdownProcessor.instance) {
            MarkdownProcessor.instance = new MarkdownProcessor();
        }
        return MarkdownProcessor.instance;
    }

    // Método para escapar HTML (necesario para data-attrs)
    private escapeHtml(text: string): string {
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
    async process(preProcessedMarkdown: string): Promise<ProcessResult> {
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
            const html = await marked.parse(preProcessedMarkdown, { 
                async: true
            }) as string;
            
            console.log("[Procesador] marked.parse finalizado.");
            
            return {
                html,
                metadata: {},
            };
        } catch (error) {
            console.error('[Procesador] Error durante el procesamiento final con marked:', error);
            console.error('[Procesador] Input que causó el error:', JSON.stringify(preProcessedMarkdown.substring(0, 500))); // Log input
            return { 
                html: `<div class="error markdown-error">Error final en Marked: ${escapeHtml(String(error))}</div>`, 
                metadata: {} 
            };
        }
    }

    replacePanelBlocks(markdown: string): string {
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
        } catch (error) {
            console.error('Error en replacePanelBlocks:', error);
            return markdown;
        }
    }
}
// !!! NI REGISTRO DE EXTENSIONES ::: !!!
// !!! NI REGISTRO DE EXTENSIONES ::: !!!