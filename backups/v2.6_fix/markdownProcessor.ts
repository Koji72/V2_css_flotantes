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
        marked.setOptions({
            gfm: true,
            breaks: true,
            pedantic: false,
        });
    }

    // Patrón Singleton
    public static getInstance(): MarkdownProcessor {
        if (!MarkdownProcessor.instance) {
            MarkdownProcessor.instance = new MarkdownProcessor();
        }
        return MarkdownProcessor.instance;
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
            const html = await marked.parse(preProcessedMarkdown, { async: true }) as string;
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
}
// !!! NI REGISTRO DE EXTENSIONES ::: !!!
// !!! NI REGISTRO DE EXTENSIONES ::: !!!