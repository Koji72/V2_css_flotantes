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
        console.log("MarkdownProcessor: Inicializando con configuración v2.6");
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
    async process(markdown: string): Promise<ProcessResult> {
        console.log('[Procesador] Iniciando procesamiento');
        
        if (!markdown || typeof markdown !== 'string') {
            const errorMsg = `Markdown inválido: ${typeof markdown}`;
            console.error('[Procesador] ' + errorMsg);
            return {
                html: `<div class="error">Error: ${errorMsg}</div>`,
                metadata: {},
            };
        }

        try {
            // Pre-procesar el markdown antes de pasarlo a marked
            const processedMarkdown = this.processCustomBlocks(markdown);
            
            // Llamar a marked con el markdown pre-procesado
            const html = await marked.parse(processedMarkdown, { async: true }) as string;
            
            return {
                html,
                metadata: {},
            };
        } catch (error) {
            console.error('[Procesador] Error durante el procesamiento:', error);
            return { 
                html: `<div class="error markdown-error">Error: ${escapeHtml(String(error))}</div>`, 
                metadata: {} 
            };
        }
    }

    /**
     * Procesa todos los bloques personalizados en el markdown
     */
    private processCustomBlocks(markdown: string): string {
        // Procesar paneles
        let processedMarkdown = this.processPanels(markdown);
        
        // Aquí podrían procesarse otros tipos de bloques personalizados en el futuro
        
        return processedMarkdown;
    }

    /**
     * Procesa específicamente los bloques de panel
     */
    private processPanels(markdown: string): string {
        // OPTIMIZACIÓN: Un solo regex principal más completo que capture todas las variantes
        const panelRegex = /:::(panel|datamatrix)(?:\[\]|\{\}|\[|\{)?([^\n]*?)(?:\|\s*style=([^\s,}\n]+))?(?:\|\s*layout=([^\s,}\n]+))?([\s\S]*?):::/g;
        
        return markdown.replace(panelRegex, (match, type, attributes, style, layout, content) => {
            // Extraer título
            let title = '';
            const titleMatch = (attributes || match).match(/title\s*=\s*["']([^"']*)["']/i);
            if (titleMatch) {
                title = titleMatch[1];
            }
            
            // Si no se definió estilo en el pipe, buscarlo en los atributos
            if (!style && attributes) {
                const styleMatch = attributes.match(/style\s*=\s*["']?([^"'\s,}]*)["']?/i);
                if (styleMatch) {
                    style = styleMatch[1];
                }
            }
            
            // Si no se definió layout en el pipe, buscarlo en los atributos
            if (!layout && attributes) {
                const layoutMatch = attributes.match(/layout\s*=\s*["']?([^"'\s,}]*)["']?/i);
                if (layoutMatch) {
                    layout = layoutMatch[1];
                }
            }
            
            // Construir clases CSS
            let cssClasses = `mixed-panel panel-${type}`;
            if (style) cssClasses += ` panel-style--${style}`;
            if (layout) cssClasses += ` layout--${layout}`;
            
            // Construir HTML para el panel
            let html = `<section class="${cssClasses}" data-panel-type="${type}" data-interactive-container="true">`;
            
            // Añadir título si existe
            if (title) {
                html += `\n  <h3 class="panel-header">${title}</h3>`;
            }
            
            // Añadir contenido
            html += `\n  <div class="panel-content">\n${content}\n  </div>\n</section>`;
            
            return html;
        });
    }
}
// !!! NI REGISTRO DE EXTENSIONES ::: !!!
// !!! NI REGISTRO DE EXTENSIONES ::: !!!