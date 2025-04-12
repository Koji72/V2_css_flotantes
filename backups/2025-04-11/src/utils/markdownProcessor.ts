import { marked, TokenizerExtension, RendererExtension, Token, RendererThis } from "marked";
import { create } from 'zustand';
import matter from 'gray-matter';
import markedFootnote from 'marked-footnote';

// --- STORE DEFINITION MOVED HERE TEMPORARILY ---
export interface AppState {
  markdown: string;
  setMarkdown: (markdown: string) => void;
  css: string;
  setCSS: (css: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentTemplate: string;
  setCurrentTemplate: (template: string) => void;
  isDebugMode: boolean;
  toggleDebugMode: () => void;
}
export const useAppStore = create<AppState>((set) => ({
  markdown: localStorage.getItem('markdown') || '',
  setMarkdown: (markdown) => { localStorage.setItem('markdown', markdown); set({ markdown }); },
  css: localStorage.getItem('currentCSS') || '',
  setCSS: (css) => { localStorage.setItem('currentCSS', css); set({ css }); },
  darkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () => set((state) => { const v = !state.darkMode; localStorage.setItem('darkMode', String(v)); return { darkMode: v }; }),
  currentTemplate: localStorage.getItem('currentTemplate') || 'default',
  setCurrentTemplate: (template) => { localStorage.setItem('currentTemplate', template); set({ currentTemplate: template }); },
  isDebugMode: localStorage.getItem('isDebugMode') === 'true',
  toggleDebugMode: () => set((state) => { const v = !state.isDebugMode; localStorage.setItem('isDebugMode', String(v)); console.log(`[App] Debug Mode ${v ? 'ENABLED' : 'DISABLED'}`); return { isDebugMode: v }; }),
}));
// --- END STORE DEFINITION ---

// --- Logging Helpers (Now correctly use the defined store) ---
const logDebug = (message: string, ...optionalParams: any[]) => {
    if (useAppStore.getState().isDebugMode) { console.log(`[MP] ${message}`, ...optionalParams); }
};
const logWarn = (message: string, ...optionalParams: any[]) => {
    if (useAppStore.getState().isDebugMode) { console.warn(`[MP] ${message}`, ...optionalParams); }
};

// Definición de tipos para hacer TypeScript feliz
interface CustomBlockToken {
    type: string;
    raw: string;
    blockType: string;
    title: string;
    content: string;
    floatClass: string;
    customClasses: string;
    tokens: any[];
    styles: string[];
    layout: string;
}

/**
 * Palabras clave para detectar y asignar clases de estado CSS.
 */
const statusKeywords: { [key: string]: string } = {
    // Mapeo de keywords (lowercase) a clases CSS
    "high": "status-error", "critical": "status-error", "error": "status-error", "comms lost": "status-error", "hostile action": "status-error",
    "medium": "status-warn", "warning": "status-warn", "low ammunition": "status-warn", "resupply requested": "status-warn", "interference": "status-warn", "jamming": "status-warn",
    "low": "status-ok", "ok": "status-ok", "actively engaged": "status-ok", "ready": "status-ok", "nominal": "status-ok", "secure uplink": "status-ok", "active cyberwarfare": "status-ok", "air superiority patrol": "status-ok", "engaged": "status-ok", "fully operational": "status-ok",
    "standby": "status-neutral", "none": "status-neutral", "unknown": "status-neutral", "info": "status-neutral", "redacted": "status-neutral", "medical triage": "status-neutral", "secure zone": "status-ok", // Algunos neutrales pueden ser OK
};

/**
 * Busca una palabra clave de estado en el texto y devuelve la clase CSS correspondiente.
 * @param text Texto a analizar.
 * @returns Clase CSS de estado o null.
 */
function findStatusClass(text: string): string | null {
    const lowerText = text?.toLowerCase().trim() || '';
    if (!lowerText) return null;
    // Prioriza keywords más largos o específicos primero si hubiera solapamiento
    for (const keyword in statusKeywords) {
        // Busca la keyword como palabra completa para evitar coincidencias parciales (ej. 'low' en 'low ammunition')
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowerText)) return statusKeywords[keyword];
    }
    // Permite usar la clase directamente en el markdown
    const statusClasses = Object.values(statusKeywords);
    if (statusClasses.includes(lowerText)) return lowerText;
    return null;
}

// Define the custom block extension with appropriate typing
const customBlockExtension: TokenizerExtension & RendererExtension = {
    name: 'customBlock',
    level: 'block',
    tokenizer(src: string) {
        // Detecta bloques con formato :::tipo [título] [float-left/right]\ncontenido\n:::
        // Nueva versión: :::tipo [título] | [options]\ncontenido\n:::
        const rule = /^:::\s*(\w+(?:-\w+)*)(?:\s+(.+))?\n([\s\S]*?)\n:::/;
        const match = rule.exec(src);
        
        if (match) {
            logDebug("Tokenizer encontró un bloque custom:", `Tipo: ${match[1]}, Título: ${match[2] || 'Sin título'}, Contenido: ${match[3].length} caracteres`);
            
            const type = match[1];
            let title = match[2] ? match[2].trim() : '';
            const content = match[3];
            
            // Extraer parámetros usando el nuevo formato con |
            let floatClass = '';
            let customClasses = '';
            let styles: string[] = [];
            let layout = '';
            let cleanTitle = title;

            // Comprobar si hay un separador | para las opciones
            if (title && title.includes('|')) {
                const parts = title.split('|');
                cleanTitle = parts[0].trim();
                
                // Procesar cada sección de opciones después del |
                for (let i = 1; i < parts.length; i++) {
                    const optionSection = parts[i].trim();
                    
                    // Buscar pares clave=valor
                    const styleMatch = optionSection.match(/\s*style\s*=\s*([^|,\s]+(?:,[^|,\s]+)*)/i);
                    if (styleMatch) {
                        styles = styleMatch[1].split(',').map(s => s.trim());
                    }
                    
                    // Buscar layout=valor
                    const layoutMatch = optionSection.match(/\s*layout\s*=\s*([^|,\s]+)/i);
                    if (layoutMatch) {
                        layout = layoutMatch[1].trim();
                        
                        // Para mantener compatibilidad con float-left/right existente
                        if (layout === 'float-left' || layout === 'float-right') {
                            floatClass = ` ${layout}`;
                        } else {
                            floatClass = ` layout--${layout}`;
                        }
                    }
                    
                    // Buscar class=valor
                    const classMatch = optionSection.match(/\s*class\s*=\s*(.+?)(?:\s*\||$)/i);
                    if (classMatch) {
                        customClasses = ` ${classMatch[1].trim().replace(/[^a-zA-Z0-9\s_-]/g, '')}`;
                    }
                }
            } else {
                // Mantener compatibilidad con el formato anterior
                // Extract float-
                const floatMatch = title.match(/\s+(float-(?:left|right))/i);
                if (floatMatch) {
                    floatClass = ` ${floatMatch[1]}`;
                    cleanTitle = cleanTitle.replace(floatMatch[0], '').trim();
                }
                // Extract class=
                const classMatch = cleanTitle.match(/\s*\|\s*class=(.+)$/i);
                if (classMatch) {
                    customClasses = ` ${classMatch[1].trim().replace(/[^a-zA-Z0-9\s_-]/g, '')}`; // Sanitize classes
                    cleanTitle = cleanTitle.replace(classMatch[0], '').trim();
                }
            }
            
            return {
                type: 'customBlock',
                raw: match[0],
                blockType: type,
                title: cleanTitle,
                content,
                floatClass,
                customClasses,
                styles,
                layout,
                tokens: []
            };
        }
        
        return undefined;
    },
    
    renderer(this: RendererThis, token: Token) {
        const customToken = token as unknown as CustomBlockToken;
        const processor = new MarkdownProcessor();
        logDebug("Renderizando bloque custom:", `Tipo: ${customToken.blockType}, Título: ${customToken.title || 'Sin título'}, Float: ${customToken.floatClass || 'none'}, Classes: ${customToken.customClasses || 'none'}`);
        
        // Procesar los estilos para añadir clases CSS adicionales
        let styleClasses = '';
        if (customToken.styles && customToken.styles.length > 0) {
            styleClasses = ' ' + customToken.styles.map(style => `panel-style--${style}`).join(' ');
        }
        
        // Combinar todas las clases: float/layout, estilos y custom
        const combinedClasses = `${customToken.floatClass || ''}${styleClasses || ''}${customToken.customClasses || ''}`;

        try {
            // Procesar diferentes tipos de bloques
            switch (customToken.blockType) {
                case 'datamatrix':
                    return processor.processDataMatrixBlock(customToken.title, customToken.content, combinedClasses);
                
                case 'statblock':
                    return processor.processStatBlock(customToken.title, customToken.content, combinedClasses);
                
                case 'panel':
                case 'panel-info-box':
                case 'panel-log':
                case 'panel-objectives':
                case 'panel-warning':
                case 'panel-error':
                    return processor.processPanelBlock(customToken.blockType, customToken.title, customToken.content, combinedClasses);
                
                case 'note':
                case 'warning':
                case 'error':
                    return processor.processStatusBlock(customToken.blockType, customToken.title, customToken.content, combinedClasses);
                
                case 'codeblock':
                    return processor.processCodeBlock(customToken.title, customToken.content, combinedClasses);
                
                case 'quote':
                    return processor.processQuoteBlock(customToken.title, customToken.content, combinedClasses);
                
                case 'image':
                    return processor.processImageBlock(customToken.title, customToken.content, combinedClasses);
                
                case 'dice-roll':
                    return processor.processDiceRollBlock(customToken.title, customToken.content, combinedClasses);
                
                // New Grid Block
                case 'grid-2col':
                case 'grid-3col':
                case 'grid-4col':
                    return processor.processGridBlock(customToken.blockType, customToken.title, customToken.content, combinedClasses);
                
                // New Tabs Block
                case 'tabs':
                     return processor.processTabsBlock(customToken.title, customToken.content, combinedClasses);
                
                // New Spoiler/Collapsible Block
                case 'spoiler':
                    return processor.processSpoilerBlock(customToken.title, customToken.content, combinedClasses);
                
                default:
                    // Bloque genérico con clases personalizadas
                    logWarn(`Unhandled custom block type: ${customToken.blockType}. Rendering as generic panel.`);
                    const genericTitleAttr = customToken.title ? ` data-title="${escapeHtml(customToken.title)}"` : '';
                    const genericHeader = customToken.title ? `<div class="panel-header">${marked.parseInline(customToken.title)}</div>` : '';
                    return `<section class="mixed-panel panel-generic ${customToken.blockType}${combinedClasses}" data-panel-type="${customToken.blockType}" data-interactive-container="true"${genericTitleAttr}>
                                ${genericHeader}
                                <div class="panel-content">${marked.parse(customToken.content)}</div>
                            </section>`;
            }
        } catch (error: any) {
            return `<div class="mixed-panel error${combinedClasses}">
                <div class="panel-header">Error processing ${customToken.blockType}</div>
                <div class="panel-content">Error: ${error.message || 'Unknown error'}</div>
            </div>`;
        }
    }
};

// Aplicar extensión y opciones
marked.use(
    {
        extensions: [customBlockExtension],
        gfm: true,
        breaks: true,
        pedantic: false
    },
    markedFootnote({ description: 'Footnotes' })
);

console.log('[MarkdownProcessor] Marked extensions registered (Custom Blocks, Footnotes, GFM).');

/**
 * Clase MarkdownProcessor V2.5
 * Procesa Markdown, añade clases semánticas y atributos de datos.
 */
export class MarkdownProcessor {
    private static instance: MarkdownProcessor;
    private cache: Map<string, Promise<{ html: string, metadata: Record<string, any> }>> = new Map();
    private readonly MAX_CACHE_SIZE = 25;
    private readonly DEBUG = true;

    public constructor() {}

    static getInstance(): MarkdownProcessor {
        if (!MarkdownProcessor.instance) {
            MarkdownProcessor.instance = new MarkdownProcessor();
        }
        return MarkdownProcessor.instance;
    }

    async process(markdown: string): Promise<{ html: string, metadata: Record<string, any> }> {
        const cacheKey = markdown;
        if (this.cache.has(cacheKey)) {
            logDebug("Returning cached promise for markdown");
            return this.cache.get(cacheKey)!;
        }

        logDebug("Processing new markdown content...");
        const processPromise = (async (): Promise<{ html: string, metadata: Record<string, any> }> => {
            try {
                // 1. Parse Front Matter
                const { data: metadata, content: contentWithoutFrontMatter } = matter(markdown);
                logDebug("Parsed Front Matter:", metadata);

                // 2. Pre-process (if any custom logic needed before marked)
                const preProcessedContent = this.preProcessMarkdown(contentWithoutFrontMatter);

                // 3. Process with Marked (await the async parse)
                let rawHtml: string | undefined;
                try {
                    rawHtml = await marked.parse(preProcessedContent);
                    logDebug("Raw HTML generated by Marked:", rawHtml ? rawHtml.substring(0, 200) + "..." : "(empty)");
                } catch (parseError: any) {
                     logWarn("marked.parse() failed:", parseError);
                     // Return structured error
                     return { html: `<div class="error">Markdown Parsing Error: ${escapeHtml(parseError.message)}</div>`, metadata: {} };
                }

                if (!rawHtml) {
                    return { html: '', metadata };
                }

                // 4. Post-process HTML (DOM manipulation)
                const dom = new DOMParser().parseFromString(rawHtml, 'text/html');
                this.postProcessHTML(dom.body);
                if (this.DEBUG) logDebug("Post-processed HTML:", dom.body.innerHTML.substring(0, 500) + "...");

                const finalHtml = dom.body.innerHTML;
                return { html: finalHtml, metadata };
            } catch (error: any) {
                logWarn("Error during Markdown processing pipeline:", error);
                // Return structured error
                return { html: `<div class="error">Error processing Markdown: ${escapeHtml(error.message)}</div>`, metadata: {} };
            }
        })();

        this.updateCache(cacheKey, processPromise);
        return processPromise;
    }

    private preProcessMarkdown(markdown: string): string {
        // Placeholder for any pre-processing logic before marked runs
        // e.g., handling custom syntax that marked extensions can't easily parse
        logDebug("Preprocessing markdown (currently no-op)");
        return markdown;
    }

    private updateCache(key: string, valuePromise: Promise<{ html: string, metadata: Record<string, any> }>): void {
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
                logDebug(`Cache full, removed oldest entry: ${firstKey.substring(0, 50)}...`);
            }
        }
        this.cache.set(key, valuePromise);
        logDebug(`Cached new promise for key: ${key.substring(0, 50)}...`);

        // Optional: Handle promise rejection to clear failed entry from cache
        valuePromise.catch(error => {
            logWarn(`Cached promise failed for key ${key.substring(0, 50)}... Removing from cache.`, error);
            if (this.cache.get(key) === valuePromise) { // Ensure it's the same promise
                this.cache.delete(key);
            }
        });
    }

    clearCache(): number {
        const size = this.cache.size;
        this.cache.clear();
        logDebug(`Cache cleared (${size} items).`);
        return size;
    }

    getCacheStats(): { size: number, capacity: number, usage: number } {
        const size = this.cache.size;
        const capacity = this.MAX_CACHE_SIZE;
        const usage = capacity > 0 ? (size / capacity) * 100 : 0;
        return { size, capacity, usage: parseFloat(usage.toFixed(1)) };
    }

    private postProcessHTML(docBody: HTMLElement): void {
        logDebug("Starting HTML post-processing (minimal)..." + docBody.innerHTML.substring(0, 100));

        // Basic processing examples (will be expanded)
        // Example: Add classes to task list items generated by GFM
        docBody.querySelectorAll('li > input[type="checkbox"]').forEach(checkbox => {
            const li = checkbox.parentElement;
            if (li) {
                li.classList.add('task-list-item');
                li.classList.toggle('task-checked', (checkbox as HTMLInputElement).checked);
                li.classList.toggle('task-unchecked', !(checkbox as HTMLInputElement).checked);
            }
        });

        // Example: Add class to footnotes container
        docBody.querySelectorAll('.footnotes').forEach(fnContainer => {
            fnContainer.classList.add('processed-footnotes');
        });
        docBody.querySelectorAll('a.footnote-ref').forEach(fnRef => {
             fnRef.classList.add('processed-footnote-ref');
        });
        docBody.querySelectorAll('li.footnote-item').forEach(fnItem => {
             fnItem.classList.add('processed-footnote-item');
        });


        logDebug("HTML post-processing finished (minimal).");
    }

    // --- Block Processing Methods (Called by Renderer) ---

    public processDataMatrixBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::datamatrix block: Title=${title}, Classes=${combinedClasses}`);
        // Basic table parsing logic - assumes simple pipe-separated values
        const rows = content.trim().split('\n').map(r => r.trim()).filter(Boolean);
        if (rows.length === 0) return '<div class="mixed-panel error">Empty datamatrix content</div>';

        const headers = rows[0].split('|').map(h => `<th>${marked.parseInline(h.trim())}</th>`).join('');
        const bodyRows = rows.slice(1).map(row => {
            const cells = row.split('|').map(c => `<td>${marked.parseInline(c.trim())}</td>`).join('');
            // Add status class to row if a cell contains a keyword? Could be complex.
            return `<tr>${cells}</tr>`;
        }).join('');

        const tableHTML = `<div class="table-wrapper"><table class="data-matrix-table">
            <thead><tr>${headers}</tr></thead>
            <tbody>${bodyRows}</tbody>
        </table></div>`;

        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : '';
        return `<section class="mixed-panel data-matrix-container${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="panel-content">${tableHTML}</div>
                </section>`;
    }

    public processPanelBlock(blockType: string, title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::${blockType} block: Title=${title}, Classes=${combinedClasses}`);
        
        // Verificar si se solicita la decoración
        const shouldDecorate = combinedClasses.includes('decorated');
        const decorationClass = shouldDecorate ? ' panel-decorated' : '';
        
        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : '';
        const parsedContent = marked.parse(content);
        
        return `<section class="mixed-panel ${blockType}${decorationClass}${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="panel-content">${parsedContent}</div>
                </section>`;
    }

    public processStatBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::statblock: Title=${title}, Classes=${combinedClasses}`);
        
        // Check if content contains a table
        if (content.includes('|')) {
            // Process as table
            const tableContent = marked.parse(content);
            return `<section class="mixed-panel panel-statblock${combinedClasses}" data-title="${escapeHtml(title)}">
                        <div class="panel-header">${marked.parseInline(title)}</div>
                        <div class="panel-content">${tableContent}</div>
                    </section>`;
        }

        // Process as key-value pairs (Key: Value)
        const items = content.trim().split('\n').map(line => {
            const parts = line.match(/^([^:]+):\s*(.*)$/); // Match Key: Value
            if (parts && parts[1] && parts[2] !== undefined) {
                const key = parts[1].trim();
                const value = parts[2].trim();
                // Parse key and value separately for inline markdown
                return `<div class="stat-item"><span class="stat-key">${marked.parseInline(key)}:</span> <span class="stat-value">${marked.parseInline(value)}</span></div>`;
            }
            // If no colon, treat the whole line as content (perhaps a sub-header or note)
            return line.trim() ? `<div class="stat-misc">${marked.parseInline(line.trim())}</div>` : '';
        }).filter(Boolean).join('');

        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : '';
        return `<section class="mixed-panel panel-statblock${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="panel-content">${items}</div>
                </section>`;
    }

    public processStatusBlock(blockType: string, title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::${blockType} block: Title=${title}, Classes=${combinedClasses}`);
        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : `<div class="panel-header">${blockType.charAt(0).toUpperCase() + blockType.slice(1)}</div>`;
        // Parse content using marked
        const parsedContent = marked.parse(content);
        return `<div class="mixed-panel status-panel status-${blockType}${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="panel-content">${parsedContent}</div>
                </div>`;
    }

    public processCodeBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::codeblock: Title=${title}, Classes=${combinedClasses}`);
        // Use marked's built-in fence parsing if possible, otherwise basic extraction
        const langMatch = content.match(/^```(\w+)?\n/);
        const lang = langMatch ? langMatch[1] : '';
        const code = langMatch ? content.replace(langMatch[0], '').replace(/^```\n|\n```$/g, '') : content.replace(/^```\n|\n```$/g, '');
        const langClass = lang ? ` language-${lang}` : '';
        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : '';

        // Escape the code content for HTML
        const escapedCode = escapeHtml(code);

        return `<div class="mixed-panel code-panel${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="panel-content">
                        <pre><code class="${langClass}">${escapedCode}</code></pre>
                    </div>
                </div>`;
    }

    public processQuoteBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::quote block: Title=${title}, Classes=${combinedClasses}`);
        const titleAttr = title ? ` data-cite="${escapeHtml(title)}"` : ''; // Attribution
        const citation = title ? `<footer class="quote-citation">— ${marked.parseInline(title)}</footer>` : '';
        // Parse content using marked
        const parsedContent = marked.parse(content);
        return `<blockquote class="mixed-panel quote-panel${combinedClasses}"${titleAttr}>
                    <div class="panel-content">${parsedContent}</div>
                    ${citation}
                </blockquote>`;
    }

    public processImageBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::image block: Title=${title}, Classes=${combinedClasses}`);
        const src = content.trim();
        const alt = title || 'Image';
        const figcaption = title ? `<figcaption>${marked.parseInline(title)}</figcaption>` : '';
        return `<figure class="mixed-panel image-panel${combinedClasses}">
                    <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">
                    ${figcaption}
                </figure>`;
    }

    public processDiceRollBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::dice-roll block: Title=${title}, Classes=${combinedClasses}`);
        // Placeholder - Add actual dice rolling logic here or in JS later
        const rollExpression = content.trim();
        const result = `(Roll: ${rollExpression})`; // Replace with actual roll result
        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : '';
        return `<div class="mixed-panel dice-roll-panel${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="panel-content">
                         <span class="dice-roll-expression">${escapeHtml(rollExpression)}</span>
                         <span class="dice-roll-result">${escapeHtml(result)}</span>
                    </div>
                </div>`;
    }

    // --- NEW Block Processors ---

    public processGridBlock(blockType: string, title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::${blockType}: Title=${title}, Classes=${combinedClasses}`);
        const colCountMatch = blockType.match(/grid-(\d+)col/);
        const colCount = colCountMatch ? parseInt(colCountMatch[1], 10) : 2; // Default to 2 cols

        // Split content into columns based on [[col]] separator
        const columns = content.split(/^[\[\[col]]\n*/i);
        const columnsHTML = columns.map(colContent => 
            `<div class="grid-column">${marked.parse(colContent.trim())}</div>`
        ).join('');

        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : '';
        return `<section class="mixed-panel panel-grid panel-grid-${colCount}col${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="grid-container">${columnsHTML}</div>
                </section>`;
    }

    public processTabsBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::tabs: Title=${title}, Classes=${combinedClasses}`);
        // Split content into tabs based on [[tab: Title]] separator
        const tabSections = content.split(/^[\[\[tab:\s*(.+?)]]\n*/i).filter(Boolean);
        
        let tabsNavHTML = '<div class="tabs-nav" role="tablist">';
        let tabsContentHTML = '<div class="tabs-content-container">';
        
        for (let i = 0; i < tabSections.length; i += 2) {
            const tabTitle = tabSections[i].trim();
            const tabContent = tabSections[i + 1]?.trim() || '';
            const tabId = `tab-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${i/2}`;
            const isActive = i === 0; // Make the first tab active

            tabsNavHTML += `<button class="tab-button${isActive ? ' active' : ''}"" role="tab" aria-selected="${isActive}" aria-controls="${tabId}">${marked.parseInline(tabTitle)}</button>`;
            tabsContentHTML += `<div class="tab-content${isActive ? ' active' : ''}"" id="${tabId}" role="tabpanel">${marked.parse(tabContent)}</div>`;
        }

        tabsNavHTML += '</div>';
        tabsContentHTML += '</div>';

        const titleAttr = title ? ` data-title="${escapeHtml(title)}"` : '';
        const header = title ? `<div class="panel-header">${marked.parseInline(title)}</div>` : '';
        // Note: Requires JS in previewManager.ts to handle tab switching
        return `<section class="mixed-panel panel-tabs${combinedClasses}"${titleAttr}>
                    ${header}
                    <div class="tabs"> ${tabsNavHTML}${tabsContentHTML}</div>
                </section>`;
    }

    public processSpoilerBlock(title: string, content: string, combinedClasses: string = ''): string {
        logDebug(`Processing :::spoiler: Title=${title}, Classes=${combinedClasses}`);
        // Use native <details> and <summary>
        const summaryText = title || 'Details'; // Default summary if no title provided
        return `<details class="mixed-panel collapsible-section${combinedClasses}">
                    <summary class="collapsible-summary">${marked.parseInline(summaryText)}</summary>
                    <div class="collapsible-content">${marked.parse(content)}</div>
                </details>`;
    }
}

// Helper function to escape HTML characters
function escapeHtml(unsafe: string): string {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

const markdownProcessor = new MarkdownProcessor();
export default markdownProcessor;

// Exportar la función processMarkdown
export const processMarkdown = async (markdown: string): Promise<string> => {
  try {
    // Procesar el markdown
    const html = await marked(markdown);
    return html;
  } catch (error: any) {
    console.error('Error processing markdown:', error);
    return `<div class="error">Error processing markdown: ${error.message}</div>`;
  }
};