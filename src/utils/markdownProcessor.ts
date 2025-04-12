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
        
        // NUEVA DETECCIÓN: También detecta el formato :::panel[][...] y :::panel[]{...}
        const hasPanels = /:::(panel|datamatrix)(\[|\{|\[\]|\{\})/.test(markdown);
        console.log(`[markdownProcessor] Contains panel blocks: ${hasPanels}`);
        
        let processedMarkdown = markdown;
        
        try {
            // Vamos a trabajar con expresiones regulares más específicas para cada caso
            
            // CASO 1: Formato estándar con llaves o corchetes: :::panel{title="..."} o :::panel[title="..."]
            const standardRegex = /:::(panel|datamatrix)(\{[^}]*\}|\[[^\]]*\])([\s\S]*?):::/g;
            
            // CASO 2: Formato con corchetes vacíos: :::panel[][title="..."] o :::panel[]{title="..."}
            const emptyBracketsRegex = /:::(panel|datamatrix)(?:\[\]|\{\})(\[[^\]]*\]|\{[^}]*\})([\s\S]*?):::/g;
            
            // CASO 3: Formato plano sin delimitadores: :::panel title="..."
            const plainRegex = /:::(panel|datamatrix)(?!\[|\{)\s+([^\n]+)([\s\S]*?):::/g;
            
            // CASO 4: Formato con separación por pipe: :::panel[]{title="..."} | style=tech-corners
            const pipeRegex = /:::(panel|datamatrix)(?:\[\]|\{\}|\[|\{)([^\n]*?)\|\s*style=([^\s,}]+)([\s\S]*?):::/g;
            
            // Log de depuración para encontrar la coincidencia
            console.log('[markdownProcessor] Searching for pattern in:', markdown.substring(0, 200));
            
            // NUEVA FORMA DE REEMPLAZO: Intentamos cada patrón por separado para simplificar
            
            // Intento 1: Capturar el caso del pipe (más específico primero)
            processedMarkdown = processedMarkdown.replace(pipeRegex, (match, type, attributes, style, content) => {
                console.log(`[markdownProcessor] 🎯 MATCHED PIPE FORMAT: ${match.substring(0, 50)}...`);
                
                // Extraer título
                let title = '';
                const titleMatch = attributes.match(/title\s*=\s*["']([^"']*)["']/i);
                if (titleMatch) {
                    title = titleMatch[1];
                    console.log(`[markdownProcessor] Extracted title: "${title}"`);
                }
                
                // Construir clases CSS
                let cssClasses = `mixed-panel panel-${type}`;
                if (style) cssClasses += ` panel-style--${style}`;
                
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
            
            // Intento 2: Capturar el formato con corchetes vacíos
            processedMarkdown = processedMarkdown.replace(emptyBracketsRegex, (match, type, attributes, content) => {
                console.log(`[markdownProcessor] 🎯 MATCHED EMPTY BRACKETS: ${match.substring(0, 50)}...`);
                
                // Limpiar las llaves o corchetes de los atributos
                const attrContent = attributes.replace(/[{}\[\]]/g, '').trim();
                
                // Extraer título y estilo
                let title = '';
                let style = '';
                
                const titleMatch = attrContent.match(/title\s*=\s*["']([^"']*)["']/i);
                if (titleMatch) {
                    title = titleMatch[1];
                }
                
                const styleMatch = attrContent.match(/style\s*=\s*["']?([^"'\s,}]*)["']?/i);
                if (styleMatch) {
                    style = styleMatch[1];
                }
                
                // Construir clases CSS
                let cssClasses = `mixed-panel panel-${type}`;
                if (style) cssClasses += ` panel-style--${style}`;
                
                // Construir HTML
                let html = `<section class="${cssClasses}" data-panel-type="${type}" data-interactive-container="true">`;
                if (title) {
                    html += `\n  <h3 class="panel-header">${title}</h3>`;
                }
                html += `\n  <div class="panel-content">\n${content}\n  </div>\n</section>`;
                
                return html;
            });
            
            // Intento 3: Capturar el formato estándar
            processedMarkdown = processedMarkdown.replace(standardRegex, (match, type, attributes, content) => {
                console.log(`[markdownProcessor] 🎯 MATCHED STANDARD: ${match.substring(0, 50)}...`);
                
                // Limpiar las llaves o corchetes de los atributos
                const attrContent = attributes.replace(/[{}\[\]]/g, '').trim();
                
                // Extraer título y estilo
                let title = '';
                let style = '';
                let layout = '';
                
                // Procesar partes separadas por pipe (|)
                const parts = attrContent.split('|');
                const mainAttributes = parts[0].trim();
                
                // Extraer título del atributo principal
                const titleMatch = mainAttributes.match(/title\s*=\s*["']([^"']*)["']/i);
                if (titleMatch) {
                    title = titleMatch[1];
                }
                
                // Procesar atributos adicionales después del pipe
                if (parts.length > 1) {
                    for (let i = 1; i < parts.length; i++) {
                        const part = parts[i].trim();
                        
                        // Buscar style=valor
                        const styleMatch = part.match(/style\s*=\s*([^,\s}]+)/i);
                        if (styleMatch) {
                            style = styleMatch[1];
                        }
                        
                        // Buscar layout=valor
                        const layoutMatch = part.match(/layout\s*=\s*([^,\s}]+)/i);
                        if (layoutMatch) {
                            layout = layoutMatch[1];
                        }
                    }
                } else {
                    // Si no hay pipes, buscar en el atributo principal
                    const styleMatch = mainAttributes.match(/style\s*=\s*["']?([^"'\s}]*)["']?/i);
                    if (styleMatch) {
                        style = styleMatch[1];
                    }
                    
                    const layoutMatch = mainAttributes.match(/layout\s*=\s*["']?([^"'\s}]*)["']?/i);
                    if (layoutMatch) {
                        layout = layoutMatch[1];
                    }
                }
                
                // Construir clases CSS
                let cssClasses = `mixed-panel panel-${type}`;
                if (style) cssClasses += ` panel-style--${style}`;
                if (layout) cssClasses += ` layout--${layout}`;
                
                // Construir HTML
                let html = `<section class="${cssClasses}" data-panel-type="${type}" data-interactive-container="true">`;
                if (title) {
                    html += `\n  <h3 class="panel-header">${title}</h3>`;
                }
                html += `\n  <div class="panel-content">\n${content}\n  </div>\n</section>`;
                
                return html;
            });
            
            // Intento 4: Capturar el formato plano
            processedMarkdown = processedMarkdown.replace(plainRegex, (match, type, attributes, content) => {
                console.log(`[markdownProcessor] 🎯 MATCHED PLAIN: ${match.substring(0, 50)}...`);
                
                // Extraer título y estilo de los atributos planos
                let title = '';
                let style = '';
                
                const titleMatch = attributes.match(/title\s*=\s*["']([^"']*)["']/i);
                if (titleMatch) {
                    title = titleMatch[1];
                }
                
                const styleMatch = attributes.match(/style\s*=\s*["']?([^"'\s}]*)["']?/i);
                if (styleMatch) {
                    style = styleMatch[1];
                }
                
                // Construir clases CSS
                let cssClasses = `mixed-panel panel-${type}`;
                if (style) cssClasses += ` panel-style--${style}`;
                
                // Construir HTML
                let html = `<section class="${cssClasses}" data-panel-type="${type}" data-interactive-container="true">`;
                if (title) {
                    html += `\n  <h3 class="panel-header">${title}</h3>`;
                }
                html += `\n  <div class="panel-content">\n${content}\n  </div>\n</section>`;
                
                return html;
            });
            
            // SOLUCIÓN ESPECÍFICA para el caso de la imagen en la consulta
            const specificPipeFormatRegex = /:::(panel)\[\](?:\{(?:[^}]*)\})?\s*\|\s*style=([^,\s}]+)([\s\S]*?):::/g;
            processedMarkdown = processedMarkdown.replace(specificPipeFormatRegex, (match, type, style, content) => {
                console.log(`[markdownProcessor] 🎯 MATCHED SPECIFIC FORMAT: ${match.substring(0, 50)}...`);
                
                // Extraer título si está disponible
                let title = '';
                const titleMatch = match.match(/title\s*=\s*["']([^"']*)["']/i);
                if (titleMatch) {
                    title = titleMatch[1];
                }
                
                // Construir clases CSS
                let cssClasses = `mixed-panel panel-${type}`;
                if (style) cssClasses += ` panel-style--${style}`;
                
                // Construir HTML
                let html = `<section class="${cssClasses}" data-panel-type="${type}" data-interactive-container="true">`;
                if (title) {
                    html += `\n  <h3 class="panel-header">${title}</h3>`;
                }
                html += `\n  <div class="panel-content">\n${content}\n  </div>\n</section>`;
                
                return html;
            });
            
            console.log(`[markdownProcessor] Panel replacement complete. Output length: ${processedMarkdown.length}`);
            console.log(`[markdownProcessor] Output preview: ${processedMarkdown.substring(0, 100)}`);
            
            // Verificación final para asegurarnos de que se han reemplazado todos los paneles
            const stillHasPanels = /:::(panel|datamatrix)/.test(processedMarkdown);
            if (stillHasPanels) {
                console.error("[markdownProcessor] ⚠️ WARNING: Hay paneles que no fueron reemplazados!");
                // Último intento desesperado: capturar cualquier formato de panel no procesado aún
                const lastResortRegex = /:::(panel|datamatrix)[^\n]*([\s\S]*?):::/g;
                processedMarkdown = processedMarkdown.replace(lastResortRegex, (match, type, content) => {
                    console.log(`[markdownProcessor] 🚨 LAST RESORT MATCHED: ${match.substring(0, 50)}...`);
                    return `<section class="mixed-panel panel-${type}" data-panel-type="${type}">
                      <div class="panel-content">${content}</div>
                    </section>`;
                });
            }
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