import { marked } from "marked";

// --- Status Definitions ---
const statusKeywords: { [key: string]: string } = {
    "high": "status-error", "comms lost": "status-error", "hostile action": "status-error",
    "critical": "status-error", "error": "status-error", "medium": "status-warn",
    "low ammunition": "status-warn", "resupply requested": "status-warn",
    "potential counter": "status-warn", "interference": "status-warn", "warning": "status-warn",
    "jamming": "status-warn", "low": "status-ok", "actively engaged": "status-ok",
    "standby": "status-ok", "ready": "status-ok", "nominal": "status-ok",
    "secure uplink": "status-ok", "active cyberwarfare": "status-ok",
    "air superiority patrol": "status-ok", "engaged": "status-ok",
    "fully operational": "status-ok", "ok": "status-ok", "none": "status-neutral",
    "unknown": "status-neutral", "info": "status-neutral", "redacted": "status-neutral",
    "medical triage": "status-neutral", "secure zone": "status-ok",
};

function findStatusClass(text: string): string | null {
    if (!text) return null;
    const lowerText = text.toLowerCase().trim();
    if (!lowerText) return null;
    
    // Check for direct keyword matches
    for (const keyword in statusKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, 'i');
        if (regex.test(lowerText)) return statusKeywords[keyword];
    }
    
    // Check if the text is already a status class
    const statusClasses = Object.values(statusKeywords);
    if (statusClasses.includes(lowerText)) return lowerText;
    
    return null;
}

// --- Custom Block Extension ---
const customBlockExtension: any = {
    name: 'customBlock',
    level: 'block',
    start(src: string) { 
        const cap = /^(?: {0,3}|\t):::(\w+)\s*(.*?)\s*(?:\n|$)/.exec(src); 
        return cap ? cap.index : undefined; 
    },
    tokenizer(src: string): any | undefined {
        const rule = /^(?: {0,3}|\t):::(\w+)\s*(.*?)\s*(?:\n|$)([\s\S]*?)(?:\n(?: {0,3}|\t):::\s*(?:\n|$)|$)/;
        const match = rule.exec(src);
        if (match) {
            const type = match[1].trim().toLowerCase();
            let title = match[2] ? match[2].trim() : '';
            let content = match[3] ? match[3].trim() : '';
            
            // Handle case where there's no explicit title but the first line could be a title
            if (!title && content) {
                const lines = content.split('\n');
                const potentialTitle = lines[0].trim();
                if (lines.length > 1 && 
                    !potentialTitle.match(/^#{1,6}\s|^[\*\->+\|]\s|^\s*$/) && 
                    /^[a-zA-Z0-9\s,:;\.\(\)\[\]\{\}\-_\/\\#@!¡¿?'"]+$/.test(potentialTitle) && 
                    potentialTitle.length < 100) {
                    title = potentialTitle;
                    content = lines.slice(1).join('\n').trim();
                } else {
                    title = type.charAt(0).toUpperCase() + type.slice(1);
                }
            } else if (!title) {
                title = type.charAt(0).toUpperCase() + type.slice(1);
            }
            
            const tokens: any[] = [];
            this.lexer.blockTokens(content, tokens);
            
            return { 
                type: 'customBlock', 
                raw: match[0], 
                blockType: type, 
                title: title, 
                text: '',
                tokens: tokens 
            };
        }
        return undefined;
    },
    renderer(token: any): string {
        const { blockType, title, tokens } = token;
        let processedContent = '';
        
        try {
            processedContent = this.parser.parse(tokens);
        } catch(e) {
            console.warn("Renderer fallback: parsing raw content for block", blockType);
            const contentRule = /^(?: {0,3}|\t):::\w+\s*.*?\s*(?:\n|$)([\s\S]*?)(?:\n(?: {0,3}|\t):::\s*(?:\n|$)|$)/;
            const contentMatch = contentRule.exec(token.raw);
            processedContent = marked.parse(contentMatch?.[1]?.trim() ?? '');
        }

        // Note block
        if (blockType === 'note') {
            const titleHTML = title && title.toLowerCase() !== 'note' ? `<strong>${title}:</strong> ` : '';
            return `<blockquote class="note-block">${titleHTML}${processedContent}</blockquote>`;
        }
        
        // Datamatrix block
        if (blockType === 'datamatrix') {
            return `<div class="datamatrix-raw-output" data-title="${title}">${processedContent}</div>`;
        }

        // Panel mappings for various block types
        const panelClassMap: { [key: string]: { panel: string, icon: string, content?: string } } = {
            'statblock': { panel: 'panel-unit-status', icon: 'icon-status' },
            'readaloud': { panel: 'panel-event-log', icon: 'icon-log', content: 'log-list'},
            'objectives': { panel: 'panel-objectives', icon: 'icon-objective', content: 'objective-list'},
            'encounter': { panel: 'panel-mission-intel', icon: 'icon-objective'},
        };

        const { panel: panelClassSpecific, icon: iconClass, content: contentClass = '' } = 
            panelClassMap[blockType] || { panel: `custom-${blockType}`, icon: '', content: '' };
        
        const panelClasses = ['mixed-panel', panelClassSpecific, blockType];
        const headerIcon = iconClass ? `<span class="header-icon ${iconClass}"></span>` : '';
        const headerHTML = `<div class="panel-header">${headerIcon}<h2>${title}</h2></div>`;

        return `<section class="${panelClasses.join(' ')}">${headerHTML}<div class="panel-content ${contentClass}">${processedContent}</div></section>`;
    }
};

// Configure marked renderer
marked.use({ extensions: [customBlockExtension] });
marked.setOptions({ 
    gfm: true,       // GitHub Flavored Markdown
    breaks: true,    // Line breaks are converted to <br>
    headerIds: false, // Don't add IDs to headers
    mangle: false    // Don't escape HTML
});

/**
 * Markdown Processor class with caching and advanced processing
 */
class MarkdownProcessor {
    // Cache for processed markdown to avoid redundant processing
    private cache: Map<string, string> = new Map();
    // Maximum cache size to prevent memory leaks
    private readonly MAX_CACHE_SIZE = 20;
    // Debug mode flag
    private readonly DEBUG = false;

    /**
     * Process markdown into HTML with custom extensions and post-processing
     */
    process(markdown: string): string {
        try {
            // Check cache first
            if (this.cache.has(markdown)) {
                if (this.DEBUG) console.log("[MarkdownProcessor] Cache hit");
                return this.cache.get(markdown)!;
            }

            // Step 1: Pre-process the markdown
            const preprocessed = this.preProcessMarkdown(markdown);
            
            // Step 2: Convert to HTML using marked
            let html = marked.parse(preprocessed);
            
            // Step 3: Post-process the HTML
            html = this.postProcessHTML(html);
            
            // Cache the result
            this.updateCache(markdown, html);
            
            return html;
        } catch (error: unknown) {
            console.error('[MarkdownProcessor] Error:', error);
            return `<div class="error-message">Error processing markdown: ${error instanceof Error ? error.message : 'Unknown error'}</div>`;
        }
    }
    
    /**
     * Pre-process markdown before passing to marked
     */
    private preProcessMarkdown(markdown: string): string {
        // Process dice roll notation [[d20+5]]
        return markdown.replace(
            /(?<!\`\`\`[^\`]*|\`[^\`]*|<code>.*|<pre>.*)(?:\[\[(.+?)\]\])/g, 
            (_match, content: string) => {
                const trimmedContent = content ? content.trim() : '';
                return `<span class="dice-roll">${trimmedContent}</span>`;
            }
        );
    }

    /**
     * Update the cache with new processed content
     */
    private updateCache(key: string, value: string): void {
        // Remove oldest entry if at capacity
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey !== undefined) {
                this.cache.delete(oldestKey);
            }
        }
        
        // Add new entry
        this.cache.set(key, value);
    }

    /**
     * Post-process HTML to apply additional formatting and styling
     */
    postProcessHTML(html: string): string {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');
            const body = doc.body;

            // Process DataMatrix tables
            body.querySelectorAll('div.datamatrix-raw-output').forEach(wrapper => {
                this.processDataMatrixTable(wrapper as HTMLElement, doc);
            });

            // Process standard tables
            body.querySelectorAll('table:not(.data-matrix)').forEach(table => {
                this.processStandardTable(table as HTMLTableElement, doc);
            });

            // Process paragraphs and list items
            body.querySelectorAll('p, li').forEach(element => {
                this.processElementContent(element as HTMLElement, doc);
            });

            // Remove empty paragraphs
            body.querySelectorAll('p:empty').forEach(p => p.remove());
            
            return body.innerHTML;
        } catch (e) {
            console.error("Error post-processing HTML:", e);
            return html; // Return original HTML if post-processing fails
        }
    }

    /**
     * Process a datamatrix table
     */
    private processDataMatrixTable(wrapper: HTMLElement, doc: Document): void {
        const table = wrapper.querySelector('table');
        if (table) {
            table.classList.add('data-matrix');
            
            // Process cells for status classes
            table.querySelectorAll('tbody td').forEach(cell => {
                const element = cell as HTMLElement;
                this.processTableCell(element, doc);
            });
            
            // Create container for the table
            const container = doc.createElement('div');
            container.className = 'table-container datamatrix-container';
            
            // Find the appropriate parent (panel content or wrapper's parent)
            const panelContent = wrapper.closest('.panel-content');
            const parent = panelContent || wrapper.parentNode;
            
            if (parent) {
                // Insert container before wrapper
                parent.insertBefore(container, wrapper);
                // Move table to container
                container.appendChild(table);
                
                // Add title if available
                const title = wrapper.getAttribute('data-title');
                if (title) {
                    const titleEl = doc.createElement('h3');
                    titleEl.className = 'data-matrix-title';
                    titleEl.textContent = title;
                    container.parentNode?.insertBefore(titleEl, container);
                }
            }
            
            // Remove the original wrapper
            wrapper.remove();
        } else {
            // Display error if no table found
            wrapper.innerHTML = '<div class="error-message">Error: No table found in datamatrix block.</div>';
        }
    }
    
    /**
     * Process a standard table
     */
    private processStandardTable(table: HTMLTableElement, doc: Document): void {
        if (table.closest('.table-container')) return; // Skip if already in a container
        
        // Create container
        const container = doc.createElement('div');
        container.className = 'table-container standard-markdown-table';
        
        // Find appropriate parent
        const panelContent = table.closest('.panel-content');
        const parent = panelContent || table.parentNode;
        
        if (parent) {
            // Insert container before table
            parent.insertBefore(container, table);
            // Move table to container
            container.appendChild(table);
            
            // Process table cells
            table.querySelectorAll('tbody td').forEach(cell => {
                this.processTableCell(cell as HTMLElement, doc);
            });
        }
    }
    
    /**
     * Process a table cell for status classes and redacted content
     */
    private processTableCell(element: HTMLElement, doc: Document): void {
        if (!element) return; // Evitar operaciones en elementos nulos
        
        try {
            // Skip if cell already has status spans
            if (!element.querySelector('span[class^="status-"]')) {
                const statusClass = findStatusClass(element.textContent || '');
                if (statusClass) {
                    const span = doc.createElement('span');
                    span.className = statusClass;
                    // Move all content to the span
                    while (element.firstChild) {
                        span.appendChild(element.firstChild);
                    }
                    element.appendChild(span);
                }
            }
            
            // Mark redacted content
            if (element.textContent?.trim().startsWith('[REDACTED')) {
                element.classList.add('redacted');
            }
        } catch (error) {
            console.error('Error processing table cell:', error);
        }
    }
    
    /**
     * Process paragraphs and list items for special formatting
     */
    private processElementContent(element: HTMLElement, doc: Document): void {
        if (!element) return; // Evitar operaciones en elementos nulos
        
        try {
            // Apply status classes if needed
            if (!element.querySelector('span[class^="status-"]')) {
                const statusClass = findStatusClass(element.textContent || '');
                if (statusClass) {
                    const span = doc.createElement('span');
                    span.className = statusClass;
                    // Move all content to the span
                    while (element.firstChild) { 
                        span.appendChild(element.firstChild); 
                    }
                    element.appendChild(span);
                }
            }
            
            const text = element.textContent || '';
            
            // Process stat values (format: "Stat: 10/20")
            const valueMaxMatch = text.match(/([a-zA-Z\s]+):\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i);
            if (valueMaxMatch && 'dataset' in element) {
                element.dataset.stat = valueMaxMatch[1].trim();
                element.dataset.value = valueMaxMatch[2];
                element.dataset.max = valueMaxMatch[3];
            } else {
                // Process percentage values (format: "Stat: 75%")
                const percentageMatch = text.match(/([a-zA-Z\s]+):\s*(\d+(?:\.\d+)?)\s*%/i);
                if (percentageMatch && 'dataset' in element) {
                    element.dataset.stat = percentageMatch[1].trim();
                    element.dataset.value = percentageMatch[2];
                    element.dataset.max = "100";
                }
            }
            
            // Mark redacted content
            if (text.trim().startsWith('[REDACTED')) {
                element.classList.add('redacted');
            }
            
            // Process timestamps
            const timestampMatch = text.match(/(\[[\+\-]\d+(?:\.\d+)?s\])$/);
            if (timestampMatch && 'dataset' in element) {
                element.dataset.timestamp = Date.now().toString();
            }
        } catch (error) {
            console.error('Error processing element content:', error);
        }
    }
}

// Crear una instancia para usar en toda la aplicación
const markdownProcessor = new MarkdownProcessor();
export default markdownProcessor;