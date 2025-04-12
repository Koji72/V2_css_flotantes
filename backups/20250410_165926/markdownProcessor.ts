import { marked } from "marked";
import { create } from 'zustand';
import { customBlockExtension as importedCustomBlockExtension } from './customBlockExtension';

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
const customBlockExtension = {
    name: 'customBlock',
    level: 'block',
    tokenizer: (src: string): marked.Token | undefined => {
        // Detecta bloques con formato :::tipo [título] [float-left/right]\ncontenido\n:::
        const rule = /^:::\s*(\w+(?:-\w+)*)(?:\s+(.+))?\n([\s\S]*?)\n:::/;
        const match = rule.exec(src);
        
        if (match) {
            logDebug("Tokenizer encontró un bloque custom:", `Tipo: ${match[1]}, Título: ${match[2] || 'Sin título'}, Contenido: ${match[3].length} caracteres`);
            
            const type = match[1];
            const title = match[2] ? match[2].trim() : '';
            const content = match[3];
            
            // Extraer parámetros de flotado del título
            let floatClass = '';
            let cleanTitle = title;
            if (title) {
                const floatMatch = title.match(/\s+float-(left|right)/i);
                if (floatMatch) {
                    floatClass = ` float-${floatMatch[1]}`;
                    cleanTitle = title.replace(floatMatch[0], '').trim();
                }
            }
            
            return {
                type: 'customBlock',
                raw: match[0],
                blockType: type,
                title: cleanTitle,
                content,
                floatClass,
                tokens: []
            } as unknown as marked.Token;
        }
        
        return undefined;
    },
    
    renderer: (token: any) => {
        const processor = new MarkdownProcessor();
        logDebug("Renderizando bloque custom:", `Tipo: ${token.blockType}, Título: ${token.title || 'Sin título'}, Float: ${token.floatClass || 'none'}`);
        
        try {
            // Procesar diferentes tipos de bloques
            switch (token.blockType) {
                case 'datamatrix':
                    return processor.processDataMatrixBlock(token.title, token.content, token.floatClass);
                
                case 'statblock':
                    return processor.processStatBlock(token.title, token.content, token.floatClass);
                
                case 'panel':
                case 'panel-info-box':
                case 'panel-log':
                case 'panel-objectives':
                case 'panel-warning':
                case 'panel-error':
                    return processor.processPanelBlock(token.blockType, token.title, token.content, token.floatClass);
                
                case 'note':
                case 'warning':
                case 'error':
                    return processor.processStatusBlock(token.blockType, token.title, token.content, token.floatClass);
                
                case 'codeblock':
                    return processor.processCodeBlock(token.title, token.content, token.floatClass);
                
                case 'quote':
                    return processor.processQuoteBlock(token.title, token.content, token.floatClass);
                
                case 'image':
                    return processor.processImageBlock(token.title, token.content, token.floatClass);
                
                case 'dice-roll':
                    return processor.processDiceRollBlock(token.title, token.content, token.floatClass);
                
                default:
                    // Bloque genérico
                    return `<div class="mixed-panel ${token.blockType}${token.floatClass || ''}" data-title="${token.title}">
                        <div class="panel-header">${token.title}</div>
                        <div class="panel-content">${marked.parse(token.content)}</div>
                    </div>`;
            }
        } catch (error: any) {
            return `<div class="mixed-panel error${token.floatClass || ''}">
                <div class="panel-header">Error</div>
                <div class="panel-content">Error processing ${token.blockType} block: ${error.message || 'Unknown error'}</div>
            </div>`;
        }
    }
};

// Aplicar extensión y opciones
marked.use({ extensions: [customBlockExtension] });
console.log('[MarkdownProcessor] Marked extension registered.');

marked.setOptions({ gfm: true, breaks: true, headerIds: false, mangle: false });
console.log('[MarkdownProcessor] Marked options set.');

/**
 * Clase MarkdownProcessor V2.5
 * Procesa Markdown, añade clases semánticas y atributos de datos.
 */
export class MarkdownProcessor {
    private static instance: MarkdownProcessor;
    private cache: Map<string, string> = new Map();
    private readonly MAX_CACHE_SIZE = 25;
    private readonly DEBUG = false;

    public constructor() {}

    static getInstance(): MarkdownProcessor {
        if (!MarkdownProcessor.instance) {
            MarkdownProcessor.instance = new MarkdownProcessor();
        }
        return MarkdownProcessor.instance;
    }

    process(markdown: string): string {
        // console.log(`[MD Process DEBUG] Processing called with markdown length: ${markdown.length}`);
        // --- COMPLETELY BYPASS PROCESSING FOR DEBUGGING ---
        // return '<p>Markdown processing temporarily bypassed.</p>';
        /* --- Original Code Start --- */
        try {
            console.log('[MD Process] Processing markdown (' + markdown.length + ' chars)');
            // Reactivate Cache
            if (this.cache.has(markdown)) { 
                if (this.DEBUG) console.log('[MD Proc] Cache hit'); 
                console.log('[MD Process] Using cached result');
                return this.cache.get(markdown)!; 
            }
            // console.log("[MD Process] Cache check bypassed for debugging.");
            
            // Preprocesar el markdown para detectar bloques personalizados
            const preprocessed = this.preProcessMarkdown(markdown);
            console.log('[MD Process] Preprocessing completed');
            
            // Convertir a HTML con marked (esto ejecuta la extensión)
            let html = marked.parse(preprocessed);
            console.log('[MD Process] HTML after marked.parse (renderer executed):', html.slice(0, 150) + '...');
            
            // Procesamiento final del DOM
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            this.postProcessHTML(doc); // Trabaja directamente sobre el HTML generado por el renderer
            html = doc.body.innerHTML;
            
            console.log('[MD Process] Post-processed HTML:', html.slice(0, 250) + '...');
            
            this.updateCache(markdown, html); // Reactivate cache update
            return html;
        } catch (error: any) { 
            console.error('[MD Proc] Error:', error); 
            return '<div class="error-message">Markdown Error: ' + (error instanceof Error ? error.message : 'Unknown') + '</div>'; 
        }
        /* --- Original Code End --- */
    }

    private preProcessMarkdown(markdown: string): string {
        const blockRegex = /:::\s*(\w+(?:-\w+)*)\s+([^|\n]+?)(?:\s+(float-(?:left|right)))?\n([\s\S]*?)\n:::/g;
        
        // Process block syntax with optional float parameter
        let processedMarkdown = markdown.replace(blockRegex, (match, blockType, title, floatDirection, content) => {
            let cleanTitle = title.trim();
            let floatClass = floatDirection ? ` ${floatDirection}` : '';
            
            // Process different block types
            if (blockType === 'datamatrix') {
                return this.processDataMatrixBlock(cleanTitle, content, floatClass);
            } else if (blockType.startsWith('panel') || blockType === 'note' || blockType === 'statblock' || blockType.includes('-')) {
                return this.processPanelBlock(blockType, cleanTitle, content, floatClass);
            } else {
                // Generic block fallback
                return `<div class="mixed-panel ${blockType}${floatClass}" data-title="${cleanTitle}">
                          <div class="panel-header">${cleanTitle}</div>
                          <div class="panel-content">${marked.parse(content)}</div>
                        </div>`;
            }
        });

        // Process the rest with marked
        return marked.parse(processedMarkdown);
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
        console.log('[PostProcessHTML DEBUG] Starting postProcessHTML...');
        if (!doc || !doc.body) {
            console.error('[PostProcessHTML DEBUG] No doc or body found!');
            return;
        }
        
        /* --- REACTIVATING STEPS 1, 2, & 3 --- */
        // Procesar los paneles primero
        this.processPanels(doc);
        console.log('[PostProcessHTML DEBUG] processPanels executed.');
        
        // Procesar datamatrix
        const dataMatrixContainers = doc.querySelectorAll('div.datamatrix-container'); 
        console.log('[PostProcessHTML DEBUG] Found ' + dataMatrixContainers.length + ' datamatrix containers.');
        dataMatrixContainers.forEach((container, index) => {
            if (!container.classList.contains('error')) { 
                 this.processDataMatrixTable(container as HTMLElement, doc, index);
            } else {
                 console.log('[PostProcessHTML DEBUG] Skipping error datamatrix container #' + (index + 1));
            }
        });
        console.log('[PostProcessHTML DEBUG] Datamatrix processing executed.');
        
        // Procesar tablas estándar
        const tables = doc.querySelectorAll('table:not(.data-matrix):not([data-matrix-table="true"])');
        console.log('[PostProcessHTML DEBUG] Found ' + tables.length + ' standard tables.');
        tables.forEach(table => {
            this.processStandardTable(table as HTMLTableElement, doc);
        });
        console.log('[PostProcessHTML DEBUG] Standard table processing executed.');
        
        /* --- REACTIVATING STEP 4 --- */
        // Aplicar estilos a elementos con atributos de estado
        this.applyStateStyling(doc);
        console.log('[PostProcessHTML DEBUG] applyStateStyling executed.');
        
        /* --- STEPS STILL COMMENTED OUT --- */
        /*
        // Procesar otros elementos (p, li, headings)
        const allParagraphs = doc.querySelectorAll('p');
        console.log('[PostProcessHTML] Processing ' + allParagraphs.length + ' paragraphs');
        allParagraphs.forEach(p => {
            this.processElementContent(p as HTMLElement, doc);
        });
        
        const allListItems = doc.querySelectorAll('li');
        console.log('[PostProcessHTML] Processing ' + allListItems.length + ' list items');
        allListItems.forEach(li => {
            this.processElementContent(li as HTMLElement, doc);
        });
        
        // Procesar encabezados especiales para temas específicos
        const allHeadings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
        console.log('[PostProcessHTML] Processing ' + allHeadings.length + ' headings');
        allHeadings.forEach(heading => {
            heading.setAttribute('data-heading-level', heading.tagName.toLowerCase());
        });
        */
        console.log('[PostProcessHTML DEBUG] Remaining internal processing steps skipped.');
    }

    /** Finaliza la tabla datamatrix: añade spans/clases a celdas, añade título */
    private processDataMatrixTable(container: HTMLElement, doc: Document, index: number): void {
        console.log('[ProcessDataMatrix #' + (index + 1) + '] Processing container class: ' + container.className);
        const title = container.dataset.title || container.getAttribute('data-title');
        console.log('[ProcessDataMatrix #' + (index + 1) + '] Container data-title: ' + (title || 'none'));
        
        const table = container.querySelector('table.data-matrix[data-matrix-table="true"]');
        
        if (table) {
            console.log('[ProcessDataMatrix #' + (index + 1) + '] Found table.data-matrix inside container.');
            
            // Procesar las celdas de la tabla existente
            const tdCells = table.querySelectorAll('tbody td');
            console.log('[ProcessDataMatrix #' + (index + 1) + '] Processing ' + tdCells.length + ' td cells in existing table');
            tdCells.forEach((cell) => { 
                this.processElementContent(cell as HTMLElement, doc); 
            });
            
            // Añadir el título ANTES del contenedor si existe
            if (title && container.parentNode && !container.previousElementSibling?.classList.contains('data-matrix-title')) { 
                const titleEl = doc.createElement('p'); 
                titleEl.className = 'data-matrix-title'; 
                titleEl.textContent = title.toUpperCase(); 
                container.parentNode.insertBefore(titleEl, container);
                console.log('[ProcessDataMatrix #' + (index + 1) + '] Added title element: "' + title + '"');
            }
            
            // Marcar como procesado para evitar reprocesamiento accidental
            container.dataset.processed = 'true';
            console.log('[ProcessDataMatrix #' + (index + 1) + '] Marked container as processed.');
            
        } else { 
            // Esto no debería ocurrir si el renderer funcionó, pero es una salvaguarda
            console.error('[ProcessDataMatrix #' + (index + 1) + '] No table.data-matrix found inside the container generated by the renderer! Container HTML: ' + container.innerHTML.slice(0, 200));
            // Opcionalmente, mostrar un error en la UI
            container.innerHTML = '<div class="error-message">Internal Error: Failed to find table structure after rendering.</div>';
            container.classList.add('error'); 
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
            (container.className.includes('datamatrix-container') ||
             container.hasAttribute('data-title') ||
             container.previousElementSibling?.textContent?.includes('datamatrix') || false);
        
        console.log('[isDataMatrixTable] Checking container: ' + container.tagName + ', class=' + container.className);
        console.log('[isDataMatrixTable] Result: ' + isContainer);
        return isContainer;
    }

    /** Aplica estilos a elementos con atributos data-* */
    private applyStateStyling(doc: Document): void {
        if (!doc || !doc.body) return;
        
        console.log('[ApplyStateStyling] Aplicando estilos a elementos con atributos data-*');
        
        // Procesar elementos con data-value y data-max para barras de progreso
        const progressElements = doc.querySelectorAll('[data-value][data-max]');
        console.log('[ApplyStateStyling] Found ' + progressElements.length + ' elements with data-value/data-max');
        
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
                barFill.className = 'bar-fill ' + barClass;
                barFill.style.width = percent + '%';
                
                barContainer.appendChild(barFill);
                element.appendChild(barContainer);
                
                console.log('[ApplyStateStyling] Added progress bar to element: ' + value + '/' + max + ' (' + percent + '%)');
            } catch (error) {
                console.error('[ApplyStateStyling] Error creating progress bar:', error);
            }
        });
        
        // Procesar otros elementos con clases de estado para asegurar consistencia
        const statusElements = doc.querySelectorAll('.status-ok, .status-warn, .status-error, .status-neutral');
        console.log('[ApplyStateStyling] Found ' + statusElements.length + ' elements with status classes');
    }

    // Procesar paneles después de la conversión HTML
    private processPanels(doc: Document): void {
        if (!doc || !doc.body) return;
        
        // Procesar primero los paneles personalizados
        const customPanels = doc.querySelectorAll('div.custom-panel');
        console.log('[ProcessPanels] Found ' + customPanels.length + ' custom panels');
        
        customPanels.forEach((panel, index) => {
            const panelType = panel.getAttribute('data-panel-type') || 'generic';
            const panelTitle = panel.getAttribute('data-title') || '';
            console.log('[ProcessPanels] Processing panel #' + (index+1) + ', type: ' + panelType + ', title: ' + panelTitle);
            
            // Convertir a mixed-panel
            panel.classList.add('mixed-panel');
            
            // Crear estructura interna del panel si no existe
            if (!panel.querySelector('.panel-header')) {
                const content = panel.innerHTML;
                panel.innerHTML = '';
                
                // Crear header
                const header = doc.createElement('div');
                header.className = 'panel-header';
                
                // Añadir icono para el header
                const headerIcon = doc.createElement('span');
                headerIcon.className = 'header-icon';
                header.appendChild(headerIcon);
                
                // Añadir título del panel según su tipo
                let headerText = '';
                switch (panelType) {
                    case 'status':
                        headerText = 'Unit Status';
                        break;
                    case 'log':
                        headerText = 'Event Log';
                        break;
                    case 'info':
                        headerText = 'Information';
                        break;
                    case 'warning':
                        headerText = 'Warning';
                        break;
                    case 'error':
                        headerText = 'Error';
                        break;
                    default:
                        headerText = panelTitle || 'Panel';
                }
                
                // Crear y añadir encabezado al panel
                const headerTitle = doc.createElement('span');
                headerTitle.textContent = headerText;
                header.appendChild(headerTitle);
                panel.appendChild(header);
                
                // Crear contenedor para el contenido
                const contentDiv = doc.createElement('div');
                contentDiv.className = 'panel-content';
                contentDiv.innerHTML = content;
                panel.appendChild(contentDiv);
                
                console.log('[ProcessPanels] Panel structure created for ' + panelType);
            }
        });
        
        // Procesar mixed-panels existentes (compatibilidad con versiones anteriores)
        const mixedPanels = doc.querySelectorAll('.mixed-panel:not(.custom-panel)');
        console.log('[ProcessPanels] Found ' + mixedPanels.length + ' additional mixed panels');
        
        mixedPanels.forEach((panel, index) => {
            console.log('[ProcessPanels] Processing mixed panel #' + (index+1));
            
            // Si no tiene estructura interna, crearla
            if (!panel.querySelector('.panel-header') && !panel.querySelector('.panel-content')) {
                const content = panel.innerHTML;
                
                // Intentar extraer un título de un h2/h3 al principio del contenido
                let title = '';
                let restContent = content;
                
                const headerMatch = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/i);
                if (headerMatch) {
                    title = headerMatch[1];
                    restContent = content.replace(headerMatch[0], '');
                    console.log('[ProcessPanels] Extracted title from h2/h3: ' + title);
                }
                
                panel.innerHTML = '';
                
                // Crear header
                const header = doc.createElement('div');
                header.className = 'panel-header';
                
                // Añadir icono
                const headerIcon = doc.createElement('span');
                headerIcon.className = 'header-icon';
                header.appendChild(headerIcon);
                
                // Añadir título
                const headerTitle = doc.createElement('span');
                headerTitle.textContent = title || 'Panel';
                header.appendChild(headerTitle);
                panel.appendChild(header);
                
                // Añadir contenido
                const contentDiv = doc.createElement('div');
                contentDiv.className = 'panel-content';
                contentDiv.innerHTML = restContent;
                panel.appendChild(contentDiv);
                
                console.log('[ProcessPanels] Panel structure created with title: ' + (title || 'Panel'));
            }
        });
    }

    public processDataMatrixBlock(title: string, content: string, floatClass: string = ''): string {
        if (!content.trim()) {
            return `<div class="mixed-panel datamatrix error${floatClass}" data-title="${title}">
                <div class="panel-header">${title}</div>
                <div class="panel-content">Error: Empty datamatrix content</div>
            </div>`;
        }

        try {
            const tableRows = content.trim().split('\n');
            const headerRow = tableRows[0];
            const separatorRow = tableRows[1];
            const dataRows = tableRows.slice(2);

            // Validate table format
            if (!headerRow || !separatorRow || !separatorRow.includes('---')) {
                throw new Error('Invalid table format');
            }

            // Process header
            const headers = headerRow
                .split('|')
                .filter(cell => cell.trim())
                .map(cell => cell.trim());

            // Process data rows
            const rows = dataRows.map(row => {
                return row
                    .split('|')
                    .filter(cell => cell.trim())
                    .map(cell => {
                        const cellContent = cell.trim();
                        let cellClass = '';

                        // Apply status classes based on content
                        if (/ok|normal|good|low|success/i.test(cellContent)) {
                            cellClass = 'status-ok';
                        } else if (/warning|warn|medium|caution/i.test(cellContent)) {
                            cellClass = 'status-warn';
                        } else if (/error|high|critical|danger|alert/i.test(cellContent)) {
                            cellClass = 'status-error';
                        }

                        return { content: cellContent, class: cellClass };
                    });
            });

            // Generate HTML
            const headerHTML = headers
                .map(header => `<th class="table-header-cell">${header}</th>`)
                .join('');

            const rowsHTML = rows
                .map(row => {
                    const cellsHTML = row
                        .map((cell, index) => {
                            const cellClass = cell.class ? ` class="${cell.class}"` : '';
                            return `<td${cellClass}>${cell.content}</td>`;
                        })
                        .join('');
                    return `<tr>${cellsHTML}</tr>`;
                })
                .join('');

            return `<div class="mixed-panel datamatrix${floatClass}" data-theme-component="datamatrix" data-title="${title}">
                <div class="panel-header">${title}</div>
                <div class="panel-content">
                    <table class="theme-table" data-matrix-table="true">
                        <thead class="table-header">
                            <tr>${headerHTML}</tr>
                        </thead>
                        <tbody class="table-body">
                            ${rowsHTML}
                        </tbody>
                    </table>
                </div>
            </div>`;
        } catch (error: any) {
            return `<div class="mixed-panel datamatrix error${floatClass}">
                <div class="panel-header">${title}</div>
                <div class="panel-content">Error processing datamatrix: ${error.message || 'Unknown error'}</div>
            </div>`;
        }
    }

    public processPanelBlock(blockType: string, title: string, content: string, floatClass: string = ''): string {
        return `<div class="mixed-panel ${blockType}${floatClass}" data-title="${title}">
            <div class="panel-header">${title}</div>
            <div class="panel-content">${marked.parse(content)}</div>
        </div>`;
    }

    public processStatBlock(title: string, content: string, floatClass: string = ''): string {
        const lines = content.split('\n').filter(line => line.trim());
        let html = `<div class="mixed-panel statblock${floatClass}" data-title="${title}">
            <div class="panel-header">${title}</div>
            <div class="panel-content">
                <table class="stat-table">`;
        
        lines.forEach(line => {
            const [key, value] = line.split('|').map(s => s.trim());
            if (key && value) {
                html += `<tr>
                    <td class="stat-key">${key}</td>
                    <td class="stat-value">${value}</td>
                </tr>`;
            }
        });
        
        html += `</table></div></div>`;
        return html;
    }

    public processStatusBlock(blockType: string, title: string, content: string, floatClass: string = ''): string {
        return `<div class="mixed-panel status-${blockType}${floatClass}" data-title="${title}">
            <div class="panel-header">${title}</div>
            <div class="panel-content">${marked.parse(content)}</div>
        </div>`;
    }

    public processCodeBlock(title: string, content: string, floatClass: string = ''): string {
        return `<div class="mixed-panel codeblock${floatClass}" data-title="${title}">
            <div class="panel-header">${title}</div>
            <div class="panel-content">
                <pre><code>${content}</code></pre>
            </div>
        </div>`;
    }

    public processQuoteBlock(title: string, content: string, floatClass: string = ''): string {
        return `<div class="mixed-panel quote${floatClass}" data-title="${title}">
            <div class="panel-header">${title}</div>
            <div class="panel-content">
                <blockquote>${marked.parse(content)}</blockquote>
            </div>
        </div>`;
    }

    public processImageBlock(title: string, content: string, floatClass: string = ''): string {
        const [src, alt] = content.split('|').map(s => s.trim());
        return `<div class="mixed-panel image${floatClass}" data-title="${title}">
            <div class="panel-header">${title}</div>
            <div class="panel-content">
                <img src="${src}" alt="${alt || title}" />
            </div>
        </div>`;
    }

    public processDiceRollBlock(title: string, content: string, floatClass: string = ''): string {
        return `<div class="mixed-panel dice-roll${floatClass}" data-title="${title}">
            <div class="panel-header">${title}</div>
            <div class="panel-content">
                <span class="dice-roll" data-roll="${content}">${content}</span>
            </div>
        </div>`;
    }

    processMarkdown(markdown: string): string {
        // Verificar si ya tenemos el resultado en caché
        const cached = this.cache.get(markdown);
        if (cached) {
            return cached;
        }

        // Procesar el markdown
        const html = this.process(markdown);

        // Guardar en caché
        this.cache.set(markdown, html);

        return html;
    }
}

const markdownProcessor = new MarkdownProcessor();
export default markdownProcessor;