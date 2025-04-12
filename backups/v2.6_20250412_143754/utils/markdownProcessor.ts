import { marked } from 'marked';

// Helper para escapar HTML básico (puede seguir siendo útil para errores o post-procesamiento)
const escapeHtmlLocal = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;") // Use &amp; for ampersand
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/\'/g, "&#039;"); // Use &#039; for single quote
 };

// Definir interface para el resultado del procesamiento
interface ProcessResult {
  html: string;
  metadata: any;
}

// --- Clase Principal del Procesador de Markdown (VERSIÓN SIMPLIFICADA DEFINITIVA) ---
export class MarkdownProcessor {
    private static instance: MarkdownProcessor;

    private constructor() {
       console.log("MarkdownProcessor instance created (Simplified - No Custom Extensions).");
       // Configurar Marked con opciones básicas SOLAMENTE.
       // NO registrar extensiones aquí ni globalmente para paneles :::.
       marked.setOptions({
           gfm: true,       // Habilitar GitHub Flavored Markdown (tablas, task lists, etc.)
           breaks: true,    // Convertir saltos de línea simples en <br> (común para notas)
           pedantic: false, // No ser estrictamente pedante
       });
       console.log("Basic Marked options set in MarkdownProcessor constructor.");
    }

    // Método Singleton
    public static getInstance(): MarkdownProcessor {
        if (!MarkdownProcessor.instance) {
            MarkdownProcessor.instance = new MarkdownProcessor();
        }
        return MarkdownProcessor.instance;
    }

    // !!! ELIMINADOS: customBlockExtension, PanelBlockToken, renderPanelHtml, lógica de registro global !!!
    // !!! ELIMINADOS: Métodos específicos como processDataMatrixBlock, processStatBlock si no se usan en post-procesamiento !!!

    /**
     * Método principal para procesar markdown.
     * Usa marked.parse() sólo con opciones básicas.
     * @param markdown Markdown a procesar
     * @returns Objeto con HTML y metadatos
     */
    async process(markdown: string): Promise<ProcessResult> {
        console.log('[Processor] Starting process with markdown length:', markdown?.length);
        console.log('[Processor] Markdown preview:', markdown?.substring(0, 100));
        
        if (!markdown || typeof markdown !== 'string') {
            const errorMsg = `Invalid markdown: ${typeof markdown}`;
            console.error('[Processor] ' + errorMsg);
            return {
                html: `<div class="error">Error: ${errorMsg}</div>`,
                metadata: {},
            };
        }

        try {
            // Pre-procesar el markdown antes de pasarlo a marked
            console.log("[Processor] Pre-processing markdown...");
            const processedMarkdown = this.replacePanelBlocks(markdown);
            console.log("[Processor] Pre-processing complete. Length:", processedMarkdown.length);
            
            // VERIFICACIÓN EXPLÍCITA: ¿El markdown pre-procesado contiene los paneles transformados?
            const stillHasPanels = /:::(panel|datamatrix)/.test(processedMarkdown);
            console.log("[Processor] VERIFICATION: Does pre-processed markdown still contain panels?", stillHasPanels);
            if (stillHasPanels) {
                console.warn("[Processor] ⚠️ WARNING: Panels were not completely replaced in pre-processing!");
            }
            
            // Llamar a marked con el markdown pre-procesado
            console.log("[Processor] Calling marked.parse (with basic options only)...");
            const html = await marked.parse(processedMarkdown, { async: true }) as string;
            console.log("[Processor] marked.parse finished successfully.");
            console.log("[Processor] HTML preview:", html.substring(0, 100));

            // Devolver resultado exitoso
            return {
                html,
                metadata: {},
            };
        } catch (error) {
            console.error('[Processor process] CATCH BLOCK - Error durante marked.parse:', error);
            console.error('Markdown que causó el error en marked.parse:', JSON.stringify(markdown)); // Log importante en caso de error
            
            // Devolver HTML de error en caso de fallo
            return { html: `<div class="error markdown-error">FATAL MARKED.PARSE ERROR: ${escapeHtmlLocal(String(error))}<br><pre>${escapeHtmlLocal(markdown.substring(0, 500))}...</pre></div>`, metadata: {} };
        }
    }

    /**
     * Método de post-procesamiento para aplicar mejoras al HTML.
     * @param html HTML generado por marked.parse.
     * @returns HTML mejorado
     */
    postProcess(html: string): string {
        // Aplicar post-procesamiento si es necesario en el futuro
        return html;
    }

    // Método dedicado para reemplazar bloques de panel antes de enviar a marked
    private replacePanelBlocks(markdown: string): string {
        console.log('\n[markdownProcessor] 🔍 PANEL PROCESSING');
        console.log(`[markdownProcessor] Raw input length: ${markdown.length}`);
        console.log(`[markdownProcessor] Raw input preview: ${markdown.substring(0, 100)}`);
        
        // Detectar si hay bloques de panel en el contenido
        const hasPanels = /:::(panel|datamatrix)/.test(markdown);
        console.log(`[markdownProcessor] Contains panel blocks: ${hasPanels}`);
        
        let processedMarkdown = markdown;
        
        try {
            // Detectar y contar todos los paneles en el markdown original
            const panelMatches = markdown.match(/:::(panel|datamatrix)(\{[^}]*\})[\s\S]*?:::/g) || [];
            console.log(`[markdownProcessor] Detected ${panelMatches.length} panel blocks in original text`);
            
            if (panelMatches.length > 0) {
                // Mostrar ejemplos de los primeros paneles encontrados
                console.log('[markdownProcessor] First panel sample:', panelMatches[0]?.substring(0, 100));
            }
            
            // Expresión regular para buscar bloques de panel completos
            const panelRegex = /:::(panel|datamatrix)(\{[^}]*\})([\s\S]*?):::/g;
            
            // Reemplazar cada bloque de panel con HTML
            processedMarkdown = markdown.replace(panelRegex, (match, type, attributes, content) => {
                console.log(`[markdownProcessor] Processing panel match: type=${type}, attr=${attributes}`);
                
                // Extraer título y estilo de los atributos
                let title = '';
                let style = '';
                let layout = '';
                
                // Limpiar las llaves de los atributos
                const attrContent = attributes.replace(/[{}]/g, '').trim();
                
                // Extraer título
                const titleMatch = attrContent.match(/title\s*=\s*["']([^"']*)["']/i);
                if (titleMatch) {
                    title = titleMatch[1];
                    console.log(`[markdownProcessor] Extracted title: "${title}"`);
                }
                
                // Extraer estilo
                const styleMatch = attrContent.match(/style\s*=\s*["']?([^"'\s]*)["']?/i);
                if (styleMatch) {
                    style = styleMatch[1];
                    console.log(`[markdownProcessor] Extracted style: "${style}"`);
                }
                
                // Extraer layout
                const layoutMatch = attrContent.match(/layout\s*=\s*["']?([^"'\s]*)["']?/i);
                if (layoutMatch) {
                    layout = layoutMatch[1];
                    console.log(`[markdownProcessor] Extracted layout: "${layout}"`);
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
                
                console.log(`[markdownProcessor] Generated HTML for panel (truncated): ${html.substring(0, 100)}...`);
                
                return html;
            });
            
            console.log(`[markdownProcessor] Panel replacement complete. Output length: ${processedMarkdown.length}`);
            console.log(`[markdownProcessor] Output preview: ${processedMarkdown.substring(0, 100)}`);
        } catch (e) {
            console.error("[markdownProcessor] Error during panel processing:", e);
            // En caso de error, devolvemos el markdown original sin cambios
            return markdown;
        }
        
        return processedMarkdown;
    }

    // Helper de escape (privado)
    private escapeHtml(unsafe: string): string {
        return escapeHtmlLocal(unsafe);
    }
} // Fin clase MarkdownProcessor

// !!! NO HAY CONFIGURACIÓN GLOBAL DE marked.use() aquí afuera !!!
// !!! NI REGISTRO DE EXTENSIONES ::: !!!