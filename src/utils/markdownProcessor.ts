import { marked } from "marked";
import { create } from 'zustand';

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
const customBlockExtension: marked.TokenizerExtension & marked.RendererExtension = {
    name: 'customBlock',
    level: 'block',
    tokenizer: (src: string): marked.Token | undefined => {
        // Detecta bloques con formato :::tipo [título]\ncontenido\n:::
        const rule = /^:::\s*(\w+)(?:\s+(.+))?\n([\s\S]*?)\n:::/;
        const match = rule.exec(src);
        
        if (match) {
            logDebug("Tokenizer encontró un bloque custom:", `Tipo: ${match[1]}, Título: ${match[2] || 'Sin título'}, Contenido: ${match[3].length} caracteres`);
            
            const type = match[1];
            // Si no hay título, usar cadena vacía en lugar de undefined
            const title = match[2] ? match[2].trim() : '';
            const content = match[3];
            
            return {
                type: 'customBlock',
                raw: match[0],
                blockType: type,
                title,
                content,
                tokens: []
            } as unknown as marked.Token;
        }
        
        return undefined;
    },
    
    renderer: (token: any) => {
        logDebug("Renderizando bloque custom:", `Tipo: ${token.blockType}, Título: ${token.title || 'Sin título'}`);
        
        // Extraer parámetros de la clase si están presentes en el título
        let title = token.title || '';
        const floatMatch = title.match(/\s+float-(left|right)/i);
        let floatClass = '';
        
        if (floatMatch) {
            floatClass = `float-${floatMatch[1]}`;
            // Eliminar el parámetro float del título
            title = title.replace(floatMatch[0], '').trim();
        }
        
        try {
            if (token.blockType === 'datamatrix') {
                if (!token.content || !token.content.trim()) {
                    return `<div class="datamatrix-container error ${floatClass}" data-title="${title}">
                        <div class="error-message">Error: Datamatrix content is empty</div>
                    </div>`;
                }
                
                const lines = token.content.split('\n').filter((line: string) => line.trim() && !line.includes(':::'));
                
                if (lines.length === 0) {
                    return `<div class="datamatrix-container error ${floatClass}" data-title="${title}">
                        <div class="error-message">Error: No valid content lines in datamatrix</div>
                    </div>`;
                }
                
                // Extraer encabezados de la primera línea
                const headers = lines[0].split('|')
                    .map((header: string) => header.trim())
                    .filter((header: string) => header);
                
                if (headers.length === 0) {
                    return `<div class="datamatrix-container error ${floatClass}" data-title="${title}">
                        <div class="error-message">Error: Invalid table format - No headers found</div>
                    </div>`;
                }
                
                // Construir la tabla
                let tableHTML = `<div class="datamatrix-container ${floatClass}" data-title="${title}">\n`;
                tableHTML += '<table class="data-matrix" data-matrix-table="true">\n';
                
                // Añadir encabezados
                tableHTML += '<thead>\n<tr>\n';
                headers.forEach((header: string) => {
                    tableHTML += `<th>${header}</th>\n`;
                });
                tableHTML += '</tr>\n</thead>\n';
                
                // Añadir filas de datos
                tableHTML += '<tbody>\n';
                for (let i = 1; i < lines.length; i++) {
                    const cells = lines[i].split('|')
                        .map((cell: string) => cell.trim())
                        .filter((_: string, index: number) => index < headers.length);
                    
                    if (cells.length === 0) continue;
                    
                    tableHTML += '<tr>\n';
                    
                    // Rellenar con celdas vacías si faltan
                    while (cells.length < headers.length) {
                        cells.push('');
                    }
                    
                    cells.forEach((cell: string) => {
                        tableHTML += `<td>${cell}</td>\n`;
                    });
                    
                    tableHTML += '</tr>\n';
                }
                tableHTML += '</tbody>\n';
                tableHTML += '</table>\n</div>';
                
                return tableHTML;
            } else if (token.blockType === 'panel') {
                // Tratar los bloques "panel" como paneles personalizados
                return `<div class="custom-panel ${floatClass}" data-panel-type="${token.blockType}" data-title="${title}">${marked.parse(token.content)}</div>`;
            } else {
                // Para otros tipos, crear un panel genérico
                return `<div class="custom-panel ${floatClass}" data-panel-type="${token.blockType}" data-title="${title}">${marked.parse(token.content)}</div>`;
            }
        } catch (error) {
            logDebug("Error al renderizar bloque custom:", error);
            return `<div class="datamatrix-container error ${floatClass}" data-title="${title}">
                <div class="error-message">Error rendering custom block: ${error instanceof Error ? error.message : String(error)}</div>
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
class MarkdownProcessor {
    private cache: Map<string, string> = new Map();
    private readonly MAX_CACHE_SIZE = 25; // Aumentar caché
    private readonly DEBUG = false;

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
        } catch (error: unknown) { 
            console.error('[MD Proc] Error:', error); 
            return '<div class="error-message">Markdown Error: ' + (error instanceof Error ? error.message : 'Unknown') + '</div>'; 
        }
        /* --- Original Code End --- */
    }

    private preProcessMarkdown(markdown: string): string {
        return markdown.replace(
            /(?<!\`\`\`[^\`]*|\`[^\`]*|<code>.*|<pre>.*)(?:\[\[(.+?)\]\])/g, 
            (_match, content: string) => {
                // Asegurarse de que content nunca sea undefined
                const safeContent = content ? content.trim() : '';
                return '<span class="dice-roll" data-roll="' + safeContent + '">' + safeContent + '</span>';
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
}

const markdownProcessor = new MarkdownProcessor();
export default markdownProcessor;