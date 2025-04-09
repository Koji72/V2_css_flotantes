import { marked } from "marked";

// Definición de tipos para hacer TypeScript feliz
type Token = any;
type TokenizerAndRendererExtension = any;

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

/**
 * Extensión de Marked para reconocer y renderizar bloques personalizados :::type Título...
 * Genera HTML con estructura de paneles (<section class="mixed-panel...">)
 */
const customBlockExtension: TokenizerAndRendererExtension = {
    name: 'customBlock',
    level: 'block',
    start(src: string) { const cap = /^(?: {0,3}|\t):::(\w+)\s*(.*?)\s*(?:\n|$)/.exec(src); return cap ? cap.index : undefined; },
    tokenizer(src: string): Token | undefined {
         const rule = /^(?: {0,3}|\t):::(\w+)\s*(.*?)\s*(?:\n|$)([\s\S]*?)(?:\n(?: {0,3}|\t):::\s*(?:\n|$)|$)/;
        const match = rule.exec(src);
        if (match) {
            const type = match[1].trim().toLowerCase();
            let title = match[2] ? match[2].trim() : '';
            let content = match[3] ? match[3].trim() : '';
            // Extracción de título si no está en la primera línea
            if (!title && content) { const lines = content.split('\n'); const pt = lines[0].trim(); if (lines.length > 1 && !pt.match(/^#{1,6}\s|^[\*\->+\|]\s|^\s*$/) && /^[a-zA-Z0-9\s,:;\.\(\)\[\]\{\}\-_\/\\#@!¡¿?'"]+$/.test(pt) && pt.length < 100) { title = pt; content = lines.slice(1).join('\n').trim(); } else { title = type.charAt(0).toUpperCase() + type.slice(1); } } else if (!title) { title = type.charAt(0).toUpperCase() + type.slice(1); }
            const tokens: marked.Token[] = []; // Especificar tipo
            // @ts-ignore - Acceder a this.lexer es necesario aquí
            this.lexer.blockTokens(content, tokens);
            return { type: 'customBlock', raw: match[0], blockType: type, title: title, tokens: tokens };
        } return undefined;
    },
    renderer(token: Token & { blockType: string; title: string; tokens: marked.Token[] }): string {
        const { blockType, title, tokens } = token;
        console.log(`[CustomBlock] Rendering block type: ${blockType}, title: ${title}`);
        
        let processedContent = '';
        try { // Parsear tokens internos
            // @ts-ignore - Acceder a this.parser
            processedContent = this.parser.parse(tokens);
            console.log(`[CustomBlock] Parsed tokens content length: ${processedContent.length}`);
        } catch(e) { // Fallback
             console.error(`[CustomBlock] Error parsing tokens, using fallback:`, e);
             const contentRule = /^(?: {0,3}|\t):::\w+\s*.*?\s*(?:\n|$)([\s\S]*?)(?:\n(?: {0,3}|\t):::\s*(?:\n|$)|$)/;
             const contentMatch = contentRule.exec(token.raw);
             processedContent = marked.parse(contentMatch?.[1]?.trim() ?? '');
        }

        // Renderizado específico por tipo
        if (blockType === 'note') {
            const titleHTML = title && title.toLowerCase() !== 'note' ? `<strong>${title}:</strong> ` : '';
            return `<blockquote class="note-block">${titleHTML}${processedContent}</blockquote>`;
        }
        
        if (blockType === 'panel-data-matrix' || blockType === 'datamatrix') {
            console.log(`[DataMatrix] Processing datamatrix block '${title}'`);
            console.log(`[DataMatrix] Original token.raw: `, token.raw.slice(0, 150) + '...');
            console.log(`[DataMatrix] Initial processedContent:`, processedContent.slice(0, 150) + '...');
            
            // Asegurar que el contenido sea una tabla HTML adecuada
            if (!processedContent.includes('<table')) {
                console.log(`[DataMatrix] No <table> found in content, converting text to HTML table`);
                // Convertir el contenido de texto a una tabla HTML
                const lines = token.raw.split('\n').filter((line: string) => line.trim().length > 0 && !line.includes(':::'));
                console.log(`[DataMatrix] Found ${lines.length} lines to process`);
                
                let tableHTML = '<table><thead><tr>';
                
                // Determinar si tenemos cabecera basado en la línea de separación con guiones
                const hasSeparatorRow = lines.some((line: string) => /^\s*\|[\s\-]+\|/.test(line));
                console.log(`[DataMatrix] Has separator row: ${hasSeparatorRow}`);
                
                let inHeader = true;
                let rowIndex = 0;
                
                for (const line of lines) {
                    const trimmedLine = line.trim();
                    console.log(`[DataMatrix] Processing line: "${trimmedLine}"`);
                    
                    if (!trimmedLine || trimmedLine.startsWith(':::')) {
                        console.log(`[DataMatrix] Skipping empty or ::: line`);
                        continue;
                    }
                    
                    // Detectar fila separadora
                    if (/^\s*\|[\s\-]+\|/.test(trimmedLine)) {
                        console.log(`[DataMatrix] Separator row detected`);
                        inHeader = false;
                        continue;
                    }
                    
                    // Procesar filas de datos
                    const cells = trimmedLine.split('|').map((cell: string) => cell.trim())
                        .filter((cell: string, i: number, arr: string[]) => i > 0 && i < arr.length - 1);
                    
                    console.log(`[DataMatrix] Found ${cells.length} cells in row: ${cells.join('|')}`);
                    
                    if (rowIndex === 0 || (hasSeparatorRow && inHeader)) {
                        // Primera fila como cabecera
                        tableHTML += cells.map((cell: string) => `<th>${cell}</th>`).join('');
                        if (rowIndex === 0 && !hasSeparatorRow) {
                            tableHTML += '</tr></thead><tbody><tr>';
                            inHeader = false;
                            console.log(`[DataMatrix] Added header row (no separator) and starting body`);
                        } else {
                            tableHTML += '</tr>';
                            console.log(`[DataMatrix] Added header row with separator`);
                        }
                    } else {
                        // Filas de datos
                        if (rowIndex === 1 && hasSeparatorRow) {
                            tableHTML += '<tbody><tr>';
                            console.log(`[DataMatrix] Starting body after separator`);
                        } else {
                            tableHTML += '<tr>';
                        }
                        tableHTML += cells.map((cell: string) => `<td>${cell}</td>`).join('') + '</tr>';
                        console.log(`[DataMatrix] Added data row`);
                    }
                    
                    rowIndex++;
                }
                
                tableHTML += '</tbody></table>';
                console.log(`[DataMatrix] Final tableHTML:`, tableHTML);
                processedContent = tableHTML;
            } else {
                console.log(`[DataMatrix] <table> already in processedContent, keeping it`);
            }
            
            // El contenido ya es <table>. El post-procesador la finalizará.
            const result = `<div class="datamatrix-raw-output" data-title="${title}">${processedContent}</div>`;
            console.log(`[DataMatrix] Final result:`, result.slice(0, 150) + '...');
            return result;
        }

        // Mapeo para paneles
        const panelClassMap: { [key: string]: { panel: string, icon: string, content?: string } } = {
            'statblock': { panel: 'panel-unit-status', icon: 'icon-status' },
            'readaloud': { panel: 'panel-event-log', icon: 'icon-log', content: 'log-list'},
            'objectives': { panel: 'panel-objectives', icon: 'icon-objective', content: 'objective-list'},
            'encounter': { panel: 'panel-mission-intel', icon: 'icon-objective'}, // Añadir más según necesites
        };
        const { panel: panelClassSpecific, icon: iconClass, content: contentClass = '' } = panelClassMap[blockType] || { panel: `custom-${blockType}`, icon: '', content: '' };
        const panelClasses = ['mixed-panel', panelClassSpecific, blockType]; // Clase base + específica + tipo
        const headerIcon = iconClass ? `<span class="header-icon ${iconClass}"></span>` : '';
        // Usar H3 como título de panel por defecto para mejor jerarquía semántica
        const headerHTML = `<div class="panel-header">${headerIcon}<h3>${title}</h3></div>`;

        return `<section class="${panelClasses.join(' ')}">${headerHTML}<div class="panel-content ${contentClass}">${processedContent}</div></section>`;
    }
};

// Aplicar extensión y opciones
marked.use({ extensions: [customBlockExtension] });
marked.setOptions({ gfm: true, breaks: true, headerIds: false, mangle: false });

/**
 * Clase MarkdownProcessor V2.5
 * Procesa Markdown, añade clases semánticas y atributos de datos.
 */
class MarkdownProcessor {
    private cache: Map<string, string> = new Map();
    private readonly MAX_CACHE_SIZE = 25; // Aumentar caché
    private readonly DEBUG = false;

    process(markdown: string): string {
        try {
            console.log(`[MD Process] Processing markdown (${markdown.length} chars)`);
            if (this.cache.has(markdown)) { 
                if (this.DEBUG) console.log("[MD Proc] Cache hit"); 
                console.log(`[MD Process] Using cached result`);
                return this.cache.get(markdown)!; 
            }
            
            // Preprocesar el markdown para detectar bloques personalizados
            const preprocessed = this.preProcessMarkdown(markdown);
            console.log(`[MD Process] Preprocessing completed`);
            
            // Convertir a HTML con marked
            let html = marked.parse(preprocessed);
            console.log(`[MD Process] Initial HTML from marked:`, html.slice(0, 150) + '...');
            
            // Procesar bloques personalizados como datamatrix
            html = this.parseCustomBlocks(html);
            console.log(`[MD Process] HTML after block parsing:`, html.slice(0, 150) + '...');
            
            // Procesamiento final del DOM
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            this.postProcessHTML(doc);
            html = doc.body.innerHTML;
            
            console.log(`[MD Process] Post-processed HTML:`, html.slice(0, 150) + '...');
            
            this.updateCache(markdown, html);
            return html;
        } catch (error: unknown) { 
            console.error('[MD Proc] Error:', error); 
            return `<div class="error-message">Markdown Error: ${error instanceof Error ? error.message : 'Unknown'}</div>`; 
        }
    }

    private preProcessMarkdown(markdown: string): string {
        return markdown.replace(
            /(?<!\`\`\`[^\`]*|\`[^\`]*|<code>.*|<pre>.*)(?:\[\[(.+?)\]\])/g, 
            (_match, content: string) => {
                // Asegurarse de que content nunca sea undefined
                const safeContent = content ? content.trim() : '';
                return `<span class="dice-roll" data-roll="${safeContent}">${safeContent}</span>`;
            }
        );
    }

    private updateCache(key: string, value: string): void {
        if (this.cache.size >= this.MAX_CACHE_SIZE) {
            // Si se alcanza el límite, eliminar la entrada más antigua
            const iterator = this.cache.keys();
            const firstItem = iterator.next();
            if (!firstItem.done && firstItem.value !== undefined) {
                this.cache.delete(firstItem.value);
            }
        }
        this.cache.set(key, value);
    }

    clearCache(): number {
        const size = this.cache.size;
        this.cache.clear();
        return size;
    }

    getCacheStats(): { size: number, capacity: number, usage: number } {
        return {
            size: this.cache.size,
            capacity: this.MAX_CACHE_SIZE,
            usage: (this.cache.size / this.MAX_CACHE_SIZE) * 100
        };
    }

    /**
     * Post-procesamiento: Finaliza tablas, añade spans de estado y data-attributes.
     */
    private postProcessHTML(doc: Document): void {
        if (!doc || !doc.body) return;
        
        // Primero procesar los datamatrix para asegurar que se procesen antes que otras tablas
        console.log('[PostProcessHTML] Buscando elementos datamatrix-raw-output');
        const dataMatrixWrappers = doc.querySelectorAll('div.datamatrix-raw-output, div[data-title]');
        console.log(`[PostProcessHTML] Found ${dataMatrixWrappers.length} datamatrix wrappers (raw output divs)`);
        
        dataMatrixWrappers.forEach(wrapper => {
            this.processDataMatrixTable(wrapper as HTMLElement, doc);
        });
        
        // Procesar tablas estándar después
        const tables = doc.querySelectorAll('table:not(.data-matrix):not([data-matrix-table="true"])');
        console.log(`[PostProcessHTML] Processing ${tables.length} standard tables`);
        tables.forEach(table => {
            this.processStandardTable(table as HTMLTableElement, doc);
        });
        
        // Aplicar estilos a elementos con atributos de estado
        this.applyStateStyling(doc);
        
        // Procesar otros elementos
        const allParagraphs = doc.querySelectorAll('p');
        console.log(`[PostProcessHTML] Processing ${allParagraphs.length} paragraphs`);
        allParagraphs.forEach(p => {
            this.processElementContent(p as HTMLElement, doc);
        });
        
        const allListItems = doc.querySelectorAll('li');
        console.log(`[PostProcessHTML] Processing ${allListItems.length} list items`);
        allListItems.forEach(li => {
            this.processElementContent(li as HTMLElement, doc);
        });
    }

    /** Finaliza la tabla datamatrix: añade clase, spans, envuelve, añade título */
    private processDataMatrixTable(wrapper: HTMLElement, doc: Document): void {
        console.log(`[ProcessDataMatrix] Processing wrapper with id: ${wrapper.id}, class: ${wrapper.className}`);
        console.log(`[ProcessDataMatrix] Wrapper data-title: ${wrapper.getAttribute('data-title') || 'none'}`);
        console.log(`[ProcessDataMatrix] Wrapper innerHTML (first 150 chars):`, wrapper.innerHTML.slice(0, 150) + '...');
        
        const table = wrapper.querySelector('table');
        if (table) {
            console.log(`[ProcessDataMatrix] Table found inside wrapper: ${table.className}`);
            
            // Crear primero el contenedor final para preservar referencias
            const container = doc.createElement('div'); 
            container.className = 'table-container datamatrix-container';
            console.log(`[ProcessDataMatrix] Created container with class: ${container.className}`);
            
            // Mover la tabla al contenedor ANTES de modificarla
            container.appendChild(table.cloneNode(true));
            const tableInContainer = container.querySelector('table');
            
            if (tableInContainer) {
                // Ahora aplicar la clase a la tabla que ya está en el contenedor final
                tableInContainer.classList.add('data-matrix');
                console.log(`[ProcessDataMatrix] Added data-matrix class to table in container. Classes: ${tableInContainer.className}`);
                
                // Añadir atributo data-matrix-table="true" para ayudar con la selección CSS
                tableInContainer.setAttribute('data-matrix-table', 'true');
                
                // Procesar las celdas de la tabla en el contenedor
                const tdCells = tableInContainer.querySelectorAll('tbody td');
                console.log(`[ProcessDataMatrix] Processing ${tdCells.length} td cells`);
                
                tdCells.forEach((cell, i) => { 
                    this.processElementContent(cell as HTMLElement, doc); 
                });
                
                // Insertar contenedor y título en el DOM
                const panelContent = wrapper.closest('.panel-content'); 
                const parent = panelContent || wrapper.parentNode;
                if (parent) {
                    console.log(`[ProcessDataMatrix] Parent node found ${panelContent ? '(panel-content)' : '(fallback to parentNode)'}`);
                    
                    // Verificar si necesitamos crear un título
                    const title = wrapper.dataset.title || wrapper.getAttribute('data-title'); 
                    if (title) { 
                        // En lugar de crear un h4, usar un p con clase especial para el formato de título correcto
                        const titleEl = doc.createElement('p'); 
                        titleEl.className = 'data-matrix-title'; 
                        titleEl.textContent = title.toUpperCase(); 
                        parent.insertBefore(titleEl, wrapper);
                        console.log(`[ProcessDataMatrix] Added title element: "${title}"`);
                    }
                    
                    // Insertar la tabla dentro del contenedor 
                    parent.insertBefore(container, wrapper);
                    
                    console.log(`[ProcessDataMatrix] Removing original wrapper`);
                    wrapper.remove();
                    
                    // Verificar después de procesar
                    const tablesAfter = doc.querySelectorAll('table.data-matrix, table[data-matrix-table="true"]');
                    console.log(`[ProcessDataMatrix] DOM CHECK: ${tablesAfter.length} tables with .data-matrix class found after processing`);
                    
                    // Verificar contenido exacto de la tabla procesada
                    if (tablesAfter.length > 0) {
                        console.log(`[ProcessDataMatrix] First table classes: ${tablesAfter[0].className}`);
                        console.log(`[ProcessDataMatrix] First table attributes: data-matrix-table="${tablesAfter[0].getAttribute('data-matrix-table')}"`);
                    }
                } else {
                    console.warn(`[ProcessDataMatrix] No parent node found!`);
                }
            } else {
                console.error(`[ProcessDataMatrix] Failed to find the table in the container after cloning!`);
            }
        } else { 
            console.error(`[ProcessDataMatrix] No table found in wrapper!`);
            wrapper.innerHTML = '<div class="error-message">Error: No table in datamatrix block.</div>'; 
        }
    }

    /** Procesa tabla estándar: envuelve, añade spans/clases */
    private processStandardTable(table: HTMLTableElement, doc: Document): void {
        if (table.closest('.table-container')) return;
        const container = doc.createElement('div'); container.className = 'table-container standard-markdown-table';
        const panelContent = table.closest('.panel-content'); const parent = panelContent || table.parentNode;
        if (parent) { parent.insertBefore(container, table); container.appendChild(table); table.querySelectorAll('tbody td').forEach(cell => { this.processElementContent(cell as HTMLElement, doc); }); } // Usar helper
    }

    /** Procesa P, LI, TD: Añade spans de estado y atributos data-* */
    private processElementContent(element: HTMLElement, doc: Document): void {
        if (!element || typeof element.querySelector !== 'function') return;
        try {
            // 1. Añadir Span de Estado (si no hay)
            if (!element.querySelector('span[class^="status-"]')) {
                const statusClass = findStatusClass(element.textContent || '');
                if (statusClass) { const span = doc.createElement('span'); span.className = statusClass; while (element.firstChild) { span.appendChild(element.firstChild); } element.appendChild(span); }
            }
             // 2. Añadir Atributos Data-*
             const text = element.textContent || '';
             const valueMaxMatch = text.match(/([a-zA-Z\s\-_]+):\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i);
             if (valueMaxMatch && 'dataset' in element) { element.dataset.stat = valueMaxMatch[1].trim(); element.dataset.value = valueMaxMatch[2]; element.dataset.max = valueMaxMatch[3]; }
             else { const percMatch = text.match(/([a-zA-Z\s\-_]+):\s*(\d+(?:\.\d+)?)\s*%/i); if (percMatch && 'dataset' in element) { element.dataset.stat = percMatch[1].trim(); element.dataset.value = percMatch[2]; element.dataset.max = "100"; } }
              // 3. Añadir Clase .redacted
             if (text.trim().toUpperCase().startsWith('[REDACTED')) { element.classList.add('redacted'); }
             // 4. Añadir Timestamps
             const tsMatch = text.match(/(\[[\+\-]\d+(?:\.\d+)?s\])$/); if (tsMatch && 'dataset' in element) { element.dataset.timestamp = Date.now().toString(); }
        } catch (e) { console.error("Error processing element:", e, element); }
    }

    // Detectar si una tabla está dentro de un bloque personalizado tipo datamatrix
    private isDataMatrixTable(container: Element): boolean {
        const isContainer: boolean = container.tagName === 'DIV' && 
            (container.className.includes('datamatrix-raw-output') || 
             container.hasAttribute('data-title') ||
             container.previousElementSibling?.textContent?.includes('datamatrix') || false);
        
        console.log(`[isDataMatrixTable] Checking container: ${container.tagName}, class=${container.className}`);
        console.log(`[isDataMatrixTable] Result: ${isContainer}`);
        return isContainer;
    }

    // Analizar bloques personalizados
    private parseCustomBlocks(html: string): string {
        console.log(`[parseCustomBlocks] Analizando bloques personalizados...`);
        
        // Patrón para detectar bloques datamatrix en formato ::: datamatrix
        const blockRegex = /:::\s*datamatrix\s+(.*?)\s*\n([\s\S]*?):::/g;
        
        // Reemplazar bloques datamatrix con divs con atributo de título
        let processed = html.replace(blockRegex, (match, title, content) => {
            console.log(`[parseCustomBlocks] Found datamatrix block with title: ${title}`);
            return `<div class="datamatrix-raw-output" data-title="${title || ''}">${content}</div>`;
        });
        
        return processed;
    }

    /** Aplica estilos a elementos con atributos data-* */
    private applyStateStyling(doc: Document): void {
        if (!doc || !doc.body) return;
        
        console.log('[ApplyStateStyling] Aplicando estilos a elementos con atributos data-*');
        
        // Procesar elementos con data-value y data-max para barras de progreso
        const progressElements = doc.querySelectorAll('[data-value][data-max]');
        console.log(`[ApplyStateStyling] Found ${progressElements.length} elements with data-value/data-max`);
        
        progressElements.forEach(element => {
            // Verificar si ya tiene una barra de progreso
            if (element.querySelector('.dynamic-progress-bar')) return;
            
            // Ignorar celdas de tabla por ahora (se procesan en processElementContent)
            if (element.tagName === 'TD') return;
            
            try {
                const htmlElement = element as HTMLElement;
                const value = parseFloat(htmlElement.dataset.value || '0');
                const max = parseFloat(htmlElement.dataset.max || '100');
                
                if (isNaN(value) || isNaN(max) || max <= 0) return;
                
                const percent = Math.max(0, Math.min(100, (value / max) * 100));
                let barClass = 'ok';
                if (percent < 60) barClass = 'warn';
                if (percent < 30) barClass = 'error';
                
                // Crear la barra de progreso
                const barContainer = doc.createElement('div');
                barContainer.className = 'dynamic-progress-bar status-bar';
                
                const barFill = doc.createElement('span');
                barFill.className = `bar-fill ${barClass}`;
                barFill.style.width = `${percent}%`;
                
                barContainer.appendChild(barFill);
                element.appendChild(barContainer);
                
                console.log(`[ApplyStateStyling] Added progress bar to element: ${value}/${max} (${percent}%)`);
            } catch (error) {
                console.error('[ApplyStateStyling] Error creating progress bar:', error);
            }
        });
        
        // Procesar otros elementos con clases de estado para asegurar consistencia
        const statusElements = doc.querySelectorAll('.status-ok, .status-warn, .status-error, .status-neutral');
        console.log(`[ApplyStateStyling] Found ${statusElements.length} elements with status classes`);
    }
}

const markdownProcessor = new MarkdownProcessor();
export default markdownProcessor;