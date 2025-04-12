import { marked } from 'marked';
import { MarkdownProcessor } from './markdownProcessor';
import { useStore } from '../store';

// Helper local para escapar HTML si es necesario dentro de esta clase
const escapeHtmlPreview = (unsafe: string): string => {
    // Simple escape function for logging/error messages
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 };

interface PanelStyles {
    styles: string[];
    layout: string;
    classes: string[];
    animation: string;
}

/**
 * Gestor de la previsualización en iframe V2.6 (Pre-procesamiento de Paneles).
 * PRE-PROCESA bloques ::: a HTML.
 * Llama a MarkdownProcessor para el resto.
 * Aplica CSS y mejoras JS.
 */
class PreviewManager {
    private iframe: HTMLIFrameElement | null = null;
    public isReady: boolean = false;
    private currentCSSText: string = '';
    private loadedFonts: Set<string> = new Set();
    private scrollSyncTimeout: NodeJS.Timeout | null = null;
    private lastScrollSource: 'editor' | 'preview' | null = null;
    private lastKnownMarkdown: string = '';
    private interactionListenersAttached: boolean = false;
    private isProcessing: boolean = false; // Flag para evitar updates concurrentes

    // --- Logging Helpers as private methods ---
    private logDebug(message: string, ...optionalParams: any[]): void {
        console.log(`[PM V4Lite-Fix] ${message}`, ...optionalParams);
    }
    private logWarn(message: string, ...optionalParams: any[]): void {
        console.warn(`[PM V4Lite-Fix] ${message}`, ...optionalParams);
    }
    private logError(message: string, ...optionalParams: any[]): void {
        console.error(`[PM V4Lite-Fix] ${message}`, ...optionalParams);
    }
    // --- End Logging Helpers ---

    initialize(iframe: HTMLIFrameElement): void {
        this.logDebug('Initializing PreviewManager with iframe:', iframe);
        if (this.iframe) { this.destroy(); }
        console.log(`PreviewManager: Initializing (V2.6 Enhanced Adapter Mode)...`);
        this.iframe = iframe; 
        this.isReady = false; 
        this.currentCSSText = ''; 
        this.loadedFonts.clear(); 
        this.lastKnownMarkdown = ''; 
        this.interactionListenersAttached = false;
        this.isProcessing = false;

        // Usar el HTML base que incluye los estilos por defecto
        const baseHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
                    <base target="_blank">
                    <title>Preview</title>
                    <link rel="stylesheet" href="/styles/floating-elements-v2.6.css">
                    <style id="base-styles">
                        body { 
                            margin: 0; 
                            padding: 15px; 
                            font-family: sans-serif;
                            line-height: 1.6;
                            color: #333;
                            background-color: #fff;
                        }
                        #content {
                            min-height: 100%;
                        }
                        .error {
                            color: #e74c3c;
                            border: 1px solid #e74c3c;
                            padding: 10px;
                            margin: 10px 0;
                            border-radius: 4px;
                            background-color: #fcecea;
                        }
                    </style>
                    <style id="custom-theme-style"></style>
                </head>
                <body>
                    <div id="content">Initializing Preview...</div>
                </body>
            </html>
        `;

        // Asegurar que configuramos el iframe correctamente
        try {
            // Usar srcdoc para cargar el HTML
            iframe.srcdoc = baseHtml;
        } catch (srcdocError) {
            // Fallback en caso de que srcdoc no esté soportado
            this.logError('Error setting srcdoc, falling back to contentDocument:', srcdocError);
            try {
                if (iframe.contentDocument) {
                    iframe.contentDocument.open();
                    iframe.contentDocument.write(baseHtml);
                    iframe.contentDocument.close();
                } else {
                    this.logError('No contentDocument available, initialization will likely fail');
                }
            } catch (fallbackError) {
                this.logError('All initialization methods failed:', fallbackError);
            }
        }
        
        iframe.onload = () => {
            if (!this.iframe?.contentWindow?.document) { 
                this.logError('PM: Iframe doc not accessible.'); 
                this.isReady = false; 
                return; 
            }
            console.log('PM: Iframe loaded. Ready.'); 
            this.isReady = true;
            this.applyStyles(); // Aplica CSS inicial
            setTimeout(() => {
                this.updateContent(this.lastKnownMarkdown).catch(e => this.logError("Error during initial content update:", e));
            }, 50); // Pequeño delay
            this.setupScrollListener();
            this.setupInteractionListeners(); // Configurar listeners generales una vez
            this.logDebug('Initialization complete. Ready.');
        };
    }

    destroy(): void {
        this.logDebug('Destroying PreviewManager instance.');
        if (this.iframe && this.iframe.contentWindow) {
             this.iframe.contentWindow.removeEventListener('scroll', this.handleIframeScroll);
             // Limpiar listeners de interacción
             this.removeInteractionListeners(this.iframe.contentWindow.document);
        }
        this.iframe = null; this.isReady = false; this.currentCSSText = ''; this.loadedFonts.clear();
        if (this.scrollSyncTimeout) clearTimeout(this.scrollSyncTimeout); this.lastScrollSource = null; this.interactionListenersAttached = false; this.isProcessing = false;
        this.logDebug('PreviewManager destroyed.');
    }

    // --- PRE-PROCESAMIENTO (VERSIÓN PLACEHOLDERS V3) ---
    // Mapa temporal para almacenar HTML de paneles
    private panelHtmlMap: Map<string, string> = new Map();

    // Función para generar UUID simple (o usar librería)
    private generateUUID(): string {
        return Math.random().toString(36).substring(2, 15);
    }

    private async preprocessPanels(markdown: string): Promise<{ markdownWithPlaceholders: string; panelMap: Map<string, string> }> {
        this.logDebug('[PreProc V3] Initiating panel pre-processing with placeholders...');
        const panelBlockRegex = /^:::\s*(\w[-\w]*)\s*(?:\[([^\]]*)\]|\{([^\}]*)\})?\n([\s\S]*?)\n:::(\s*(\n|$))/gm;
        let lastIndex = 0;
        const outputParts: string[] = []; // Solo strings ahora
        const panelRenderPromises: Promise<{ placeholder: string; html: string }>[] = [];
        let matchesFound = 0;
        const currentPanelMap = new Map<string, string>(); // Mapa para esta ejecución

        try {
            const normalizedMarkdown = markdown.replace(/\r\n/g, '\n');
            let match;
            while ((match = panelBlockRegex.exec(normalizedMarkdown)) !== null) {
                matchesFound++;
                const fullMatch = match[0];
                const panelType = match[1];
                const headerLine = (match[2] || match[3] || '').trim(); // Tomar contenido de [] o {}
                const innerContent = match[4];
                const matchStartIndex = match.index ?? 0;

                this.logDebug(`[PreProc V3] Found panel #${matchesFound}: Type=${panelType}, Header="${headerLine}"`);

                // Añadir texto antes del bloque
                if (matchStartIndex > lastIndex) {
                    outputParts.push(normalizedMarkdown.substring(lastIndex, matchStartIndex));
                }

                // Crear placeholder y promesa
                const placeholderId = `PANEL_PLACEHOLDER_${this.generateUUID()}`;
                const placeholderComment = `<!-- ${placeholderId} -->`;
                outputParts.push(placeholderComment); // Añadir placeholder al texto

                panelRenderPromises.push(
                    this.renderSinglePanelHtml(panelType, headerLine, innerContent)
                        .then(html => ({ placeholder: placeholderComment, html })) // Devolver placeholder y HTML
                        .catch(error => { // Manejar error y devolver HTML de error asociado al placeholder
                            this.logError(`[PreProc V3] Error rendering panel ${panelType} (Header: "${headerLine}"):`, error);
                            const errorHtml = `<div class="error panel-render-error">Error rendering panel '${escapeHtmlPreview(panelType)}': ${escapeHtmlPreview(String(error))}<pre>${escapeHtmlPreview(innerContent.substring(0, 100))}...</pre></div>`;
                            return { placeholder: placeholderComment, html: errorHtml };
                        })
                );

                lastIndex = matchStartIndex + fullMatch.length;
            }

            // Añadir texto después del último bloque
            if (lastIndex < normalizedMarkdown.length) {
                outputParts.push(normalizedMarkdown.substring(lastIndex));
            }

            if (matchesFound === 0) {
                this.logDebug('[PreProc V3] No panel blocks detected.');
                return { markdownWithPlaceholders: normalizedMarkdown, panelMap: currentPanelMap };
            }

            // Construir el markdown con placeholders
            const markdownWithPlaceholders = outputParts.join('');
            this.logDebug(`[PreProc V3] Markdown with placeholders created. Waiting for ${panelRenderPromises.length} panels...`);

            // Esperar a que todos los paneles se rendericen
            const resolvedPanelsData = await Promise.all(panelRenderPromises);

            // Llenar el mapa con el HTML generado
            resolvedPanelsData.forEach(data => {
                currentPanelMap.set(data.placeholder, data.html);
            });

            this.logDebug(`[PreProc V3] Finished. ${currentPanelMap.size} panels ready in map.`);
            return { markdownWithPlaceholders, panelMap: currentPanelMap };

        } catch (procError) {
            this.logError('[PreProc V3] CRITICAL UNEXPECTED ERROR:', procError);
            // Devolver original y mapa vacío en caso de error crítico
            return { markdownWithPlaceholders: markdown, panelMap: new Map() };
        }
    }

    // --- Helper parseAttributes (CON LOGS MEJORADOS) ---
    private parseAttributes(attrString: string): PanelStyles {
        const result: PanelStyles = { styles: [], layout: '', classes: [], animation: '' };
        if (!attrString || typeof attrString !== 'string') return result;

        this.logDebug(`    [parseAttrs DEBUG] Parsing: "${attrString}"`);

        // Verificar primero si hay un estilo directo (style=xxx sin estar en una sección)
        const directStyleMatch = attrString.match(/\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s\|]+))/);
        if (directStyleMatch) {
            const styleValue = directStyleMatch[1] || directStyleMatch[2] || directStyleMatch[3];
            if (styleValue) {
                // Separar por comas si hay múltiples estilos
                result.styles = styleValue.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
                this.logDebug(`      [parseAttrs DEBUG] Found direct style: ${result.styles.join(', ')}`);
            }
        }

        const attributeSections = attrString.split('|');
        for (const section of attributeSections) {
            const trimmedSection = section.trim();
            if (!trimmedSection) continue;
            this.logDebug(`      [parseAttrs DEBUG] Processing Section: "${trimmedSection}"`);

            // Verificar si esta sección es solo un estilo (sin key=value)
            if (!trimmedSection.includes('=') && !trimmedSection.includes(' ')) {
                // Asumimos que es un valor de estilo directo
                if (!result.styles.includes(trimmedSection.toLowerCase())) {
                    result.styles.push(trimmedSection.toLowerCase());
                    this.logDebug(`      [parseAttrs DEBUG] Added direct style value: "${trimmedSection}"`);
                }
                continue;
            }

            const pairRegex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s\|]+))/g;
            let foundInRegex = false;
            let match;
            while ((match = pairRegex.exec(trimmedSection)) !== null) {
                foundInRegex = true;
                const key = match[1].toLowerCase();
                const value = match[2] || match[3] || match[4];
                this.logDebug(`        [parseAttrs DEBUG] Regex Match: key='${key}', value='${value}'`);
                this.applyAttribute(result, key, value);
            }
            
            // Si no encontramos pares key=value, podría ser un valor de estilo simple
            if (!foundInRegex && trimmedSection) {
                // Verificar si hay un valor de estilo sin key=
                if (!trimmedSection.includes('=')) {
                    if (!result.styles.includes(trimmedSection.toLowerCase())) {
                        result.styles.push(trimmedSection.toLowerCase());
                        this.logDebug(`      [parseAttrs DEBUG] Added implied style value: "${trimmedSection}"`);
                    }
                } else {
                    this.logWarn(`      [parseAttrs DEBUG] No key=value pairs found via regex in section: "${trimmedSection}"`);
                }
            }
        }
        this.logDebug(`    [parseAttrs DEBUG] Final Parsed Result:`, result);
        return result;
    }

    // --- Helper applyAttribute (CON LOGS) ---
    private applyAttribute(result: PanelStyles, key: string, value: string): void {
        if (!value) { this.logDebug(`      [applyAttr DEBUG] Ignored key "${key}" due to empty value.`); return; }
        const lowerKey = key.toLowerCase();
        this.logDebug(`      [applyAttr DEBUG] Applying Key: "${lowerKey}", Value: "${value}"`);
        
        if (lowerKey === 'style' || lowerKey === 's') { 
            // Dividir por comas si hay múltiples estilos
            const styles = value.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
            for (const style of styles) {
                if (!result.styles.includes(style)) {
                    result.styles.push(style);
                    this.logDebug(`      [applyAttr DEBUG] Added style: "${style}"`);
                }
            }
        }
        else if (lowerKey === 'layout' || lowerKey === 'l') { 
            result.layout = value.trim().toLowerCase(); 
        }
        else if (lowerKey === 'class' || lowerKey === 'c') { 
            const newClasses = value.split(/\s+/).map(c => c.trim()).filter(c => c && !result.classes.includes(c)); 
            result.classes.push(...newClasses); 
        }
        else if (lowerKey === 'animation' || lowerKey === 'a') { 
            result.animation = value.trim().toLowerCase(); 
        }
        else { 
            this.logWarn(`      [applyAttr DEBUG] Unknown attribute key: "${lowerKey}"`); 
        }
    }

    // --- Renderizador de UN Panel ::: a HTML (CON PARSEO DE TÍTULO CORREGIDO) ---
    private async renderSinglePanelHtml(panelType: string, headerLine: string, innerContent: string): Promise<string> {
        this.logDebug(`  [renderPanel vFINAL] START: Type=${panelType}, Header Line RAW="${headerLine}"`);
        let title = '', panelStyleClasses = '', layoutClass = '', customClasses = '', titleAttrVal = '', animationClass = '';
        let attributesString = '';
        let animation = ''; // Para la animación

        // --- Parseo de HeaderLine (Sin cambios desde V5) ---
        try {
            const headerTrimmed = headerLine.trim();
            this.logDebug(`  [renderPanel DEBUG] HeaderLine Trimmed: "${headerTrimmed}"`);
            
            // Verificar primero si el formato es title="valor" directamente en la línea
            if (headerTrimmed.startsWith('title=')) {
                const titleValueMatch = headerTrimmed.match(/^title=(?:"([^"]*)"|'([^']*)')(.*)$/);
                if (titleValueMatch) {
                    title = titleValueMatch[1] || titleValueMatch[2] || '';
                    attributesString = titleValueMatch[3] || '';
                    this.logDebug(`  [renderPanel DEBUG] Found direct title= syntax. Title="${title}", Attrs="${attributesString}"`);
                }
            } 
            // Si no es title= directo, intentar con el formato {title="..."}
            else {
                // Verificar {title="..."} en cualquier posición
                const titleMatch = headerTrimmed.match(/{\s*(?:title|t)\s*=\s*(?:"([^"]*)"|'([^']*)')\s*}/);
                if (titleMatch) {
                    title = titleMatch[1] || titleMatch[2] || '';
                    // Eliminar el {title="..."} de la línea para dejar solo los atributos
                    attributesString = headerTrimmed.replace(titleMatch[0], '').trim();
                    this.logDebug(`  [renderPanel DEBUG] Found {title="..."} syntax. Title="${title}", Attrs="${attributesString}"`);
                } 
                // Si no hay {title="..."}, intentar con formato Titulo | Atributos
                else { 
                    const barIndex = headerTrimmed.indexOf('|'); 
                    if (barIndex !== -1) { 
                        title = headerTrimmed.substring(0, barIndex).trim(); 
                        attributesString = headerTrimmed.substring(barIndex + 1).trim(); 
                        this.logDebug(`  [renderPanel DEBUG] Found Titulo | Atributos syntax. Title="${title}", Attrs="${attributesString}"`);
                    } 
                    // Si no hay barra, determinar si es título o atributos
                    else { 
                        if (!headerTrimmed.match(/^\s*(style|layout|class|animation)\s*=/)) { 
                            title = headerTrimmed; 
                            attributesString = ''; 
                            this.logDebug(`  [renderPanel DEBUG] Assuming full line is title. Title="${title}"`);
                        } else { 
                            title = ''; 
                            attributesString = headerTrimmed; 
                            this.logDebug(`  [renderPanel DEBUG] Assuming full line is attributes. Attrs="${attributesString}"`);
                        } 
                    }
                }
            }
            
            // Limpieza del título
            title = title.replace(/^{|}$/g, '').trim(); 
            if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) { 
                title = title.substring(1, title.length - 1); 
            }
            
            this.logDebug(`  [renderPanel DEBUG] After cleanup - Title="${title}", Attrs="${attributesString}"`);
            
            const escapeHtmlPreview = (text: string): string => {
                if (typeof text !== 'string') return '';
                return text.replace(/[&<>"']/g, (match) => {
                    switch (match) {
                        case '&': return '&amp;';
                        case '<': return '&lt;';
                        case '>': return '&gt;';
                        case '"': return '&quot;';
                        case "'": return '&#39;';
                        default: return match;
                    }
                });
            };
            
            titleAttrVal = escapeHtmlPreview(title); // Escapar SOLO para el atributo title

            const parsedAttrs = this.parseAttributes(attributesString);
            panelStyleClasses = parsedAttrs.styles.map(s => ` panel-style--${s}`).join('');
            layoutClass = parsedAttrs.layout ? ` layout--${parsedAttrs.layout}` : '';
            customClasses = parsedAttrs.classes.join(' ');
            animationClass = parsedAttrs.animation ? ` animation--${parsedAttrs.animation}` : '';
            animation = parsedAttrs.animation; // Guardar para usar en animation-overlay

            // Log detallado de los estilos procesados
            this.logDebug(`  [renderPanel DEBUG] Estilos procesados:
              - styles: ${JSON.stringify(parsedAttrs.styles)}
              - panelStyleClasses: "${panelStyleClasses}"
              - layoutClass: "${layoutClass}"
              - customClasses: "${customClasses}"
              - animationClass: "${animationClass}"
            `);

            // Fallback para estilos comunes si no se detectaron correctamente
            if (!panelStyleClasses) {
                // Verificar estilo tech-corners
                if (attributesString.toLowerCase().includes('tech-corners') || 
                    attributesString.toLowerCase().includes('style=tech')) {
                    panelStyleClasses = ' panel-style--tech-corners';
                    this.logDebug(`  [renderPanel DEBUG] Aplicado fallback para tech-corners: "${panelStyleClasses}"`);
                }
                // Verificar circuit-nodes
                else if (attributesString.toLowerCase().includes('circuit-nodes') ||
                        attributesString.toLowerCase().includes('style=circuit')) {
                    panelStyleClasses = ' panel-style--circuit-nodes';
                    this.logDebug(`  [renderPanel DEBUG] Aplicado fallback para circuit-nodes: "${panelStyleClasses}"`);
                }
                // Verificar hologram
                else if (attributesString.toLowerCase().includes('hologram') ||
                        attributesString.toLowerCase().includes('style=holo')) {
                    panelStyleClasses = ' panel-style--hologram';
                    this.logDebug(`  [renderPanel DEBUG] Aplicado fallback para hologram: "${panelStyleClasses}"`);
                }
                // Verificar neo-frame
                else if (attributesString.toLowerCase().includes('neo-frame') ||
                        attributesString.toLowerCase().includes('style=neo')) {
                    panelStyleClasses = ' panel-style--neo-frame';
                    this.logDebug(`  [renderPanel DEBUG] Aplicado fallback para neo-frame: "${panelStyleClasses}"`);
                }
            }

        } catch (e) { 
            this.logError(`  [renderPanel vFINAL] Error parsing headerLine "${headerLine}":`, e); 
            title = `Error Parsing Header`; 
            panelStyleClasses = ' panel-style--error-parse'; 
        }

        const finalPanelClasses = `panel-${panelType}${panelStyleClasses}${layoutClass}${animationClass} ${customClasses}`.trim().replace(/\s+/g, ' ');
        this.logDebug(`    [renderPanel vFINAL] Final Title Candidate: "${title}"`);
        this.logDebug(`    [renderPanel vFINAL] Final Classes Applied: "${finalPanelClasses}"`);

        // --- Limpiar el contenido interno de textos como layout="..." ---
        // Esta es la parte nueva para eliminar el texto de los atributos que aparece incorrectamente
        let cleanInnerContent = innerContent;
        
        // Eliminar todas las ocurrencias de layout=, style=, etc.
        cleanInnerContent = cleanInnerContent
            .replace(/layout\s*=\s*["']floating-left["']/gi, '')
            .replace(/layout\s*=\s*["']floating-right["']/gi, '')
            .replace(/layout\s*=\s*["']centered["']/gi, '')
            .replace(/style\s*=\s*["'][^"']*["']/gi, '')
            .replace(/animation\s*=\s*["'][^"']*["']/gi, '')
            .replace(/class\s*=\s*["'][^"']*["']/gi, '');
        
        this.logDebug(`  [renderPanel DEBUG] Cleaned content (first 50 chars): "${cleanInnerContent.substring(0, 50)}..."`);
        
        // --- Parsear Contenido Interno (Sin Cambios) ---
        let parsedContent = ''; 
        try { 
            marked.setOptions({ gfm: true, breaks: true, pedantic: false }); 
            parsedContent = await marked.parse(cleanInnerContent, { async: true }) as string; 
        } catch (e: any) { 
            this.logError(`  [renderPanel vFINAL] Error parsing INNER CONTENT:`, e); 
            parsedContent = `<div class="error panel-content-error">...Panel Content Parse Error...</div>`; 
        }

        // --- Construir HTML Final (CON TÍTULO PARSEADO CORRECTAMENTE) ---
        const combinedClasses = `mixed-panel ${finalPanelClasses}`.trim().replace(/\s+/g, ' ');
        let headerHtml = '';
        if (title) {
             let parsedTitle = title; // Fallback
             try {
                 // *** ¡¡¡ LA CORRECCIÓN CLAVE ESTÁ AQUÍ !!! ***
                 // Usar marked.parseInline para permitir formato básico en el título
                 // y manejar entidades HTML correctamente para la visualización.
                 parsedTitle = marked.parseInline(title.trim(), {async: false}) || title.trim();
                 this.logDebug(`  [renderPanel vFINAL] Rendering Header: "${parsedTitle}" (Using parseInline)`);
             } catch (titleError) {
                 this.logError(`  [renderPanel vFINAL] Error parsing title inline: "${title}"`, titleError);
                 parsedTitle = escapeHtmlPreview(title.trim()); // Fallback a escapar si parseInline falla
                 this.logDebug(`  [renderPanel vFINAL] Rendering Header: "${parsedTitle}" (Fallback to escapeHtmlPreview)`);
             }
             // Usar titleAttrVal (escapado) para el atributo y parsedTitle para el contenido del H3
             headerHtml = `\n    <div class="panel-header-container"><h3 class="panel-header" title="${titleAttrVal}">${parsedTitle}</h3><div class="panel-header-decoration"></div></div>`;
        } else {
            this.logDebug(`  [renderPanel vFINAL] No title found for panel header.`);
            // Opcional: No renderizar cabecera si no hay título
            // headerHtml = '';
        }

        const dataAttrs = `data-panel-type="${escapeHtmlPreview(panelType)}" data-interactive-container="true"`;
        const ariaLabel = titleAttrVal ? ` aria-label="${titleAttrVal}"` : '';
        const outputHtml = `<section class="${combinedClasses}" ${dataAttrs}${ariaLabel}>
<div class="corner-decoration top-left"></div><div class="corner-decoration top-right"></div><div class="corner-decoration bottom-left"></div><div class="corner-decoration bottom-right"></div>
${headerHtml}
<div class="panel-content-wrapper">
    <div class="panel-content">
${parsedContent}
    </div>
</div>
${animationClass ? `<div class="animation-overlay ${animation}-effect"></div>` : ''}
</section>\n`;
        this.logDebug(`  [renderPanel vFINAL END] Type=${panelType}.`);
        return outputHtml;
    }
    // --- Fin Renderizador de Panel ---

    // --- Método updateContent (adaptado para Placeholders) --- 
    async updateContent(markdown: string): Promise<void> {
        if (this.isProcessing) { this.logWarn("Update skipped: Already processing."); return; } 
        this.isProcessing = true; 
        this.lastKnownMarkdown = markdown; 
        this.logDebug('>>>>>>>>>> [updateContent START V3] >>>>>>>>>>'); 
        if (!this.isReady || !this.iframe?.contentWindow?.document) { 
            this.logWarn('Cannot update: iframe not ready'); 
            this.isProcessing = false; return; 
        } 
        const doc = this.iframe.contentWindow.document; 
        const contentDiv = doc.getElementById('content'); 
        if (!contentDiv) { 
            this.logError('Content div #content not found!'); 
            this.isProcessing = false; return; 
        } 
        const scrollable = doc.scrollingElement || doc.body; 
        const currentScroll = scrollable.scrollTop;

        try {
            // PASO 1: Pre-procesar -> Markdown con Placeholders + Mapa de HTML
            this.logDebug('[updateContent] Starting panel pre-processing (Placeholder method)...');
            const { markdownWithPlaceholders, panelMap } = await this.preprocessPanels(markdown);
            this.logDebug(`[updateContent] Pre-processing finished. ${panelMap.size} panels mapped.`);
            // console.log('[updateContent] Markdown with placeholders:', markdownWithPlaceholders); // Debug

            // PASO 2: Procesar Markdown con Placeholders usando el Processor Simplificado
            this.logDebug('[updateContent] Calling MarkdownProcessor.process...');
            const processor = MarkdownProcessor.getInstance();
            const result = await processor.process(markdownWithPlaceholders);
            this.logDebug('[updateContent] MarkdownProcessor.process finished.');

            // Verificar errores del procesador
            if (result.html.includes("markdown-error")) { 
                // Podríamos intentar mostrar el markdown con placeholders y el error
                this.logError("MarkdownProcessor failed. Displaying placeholders + error.");
                contentDiv.innerHTML = `<div class="error">MarkdownProcessor Error: ${result.html}</div><hr><pre>${escapeHtmlPreview(markdownWithPlaceholders)}</pre>`;
                this.isProcessing = false; return;
            } 

            // PASO 3: Reemplazar Placeholders en el HTML resultante
            this.logDebug('[updateContent] Replacing placeholders in final HTML...');
            let finalHtml = result.html;
            panelMap.forEach((panelHtml, placeholder) => {
                finalHtml = finalHtml.replace(placeholder, panelHtml);
            });
            this.logDebug(`[updateContent] Placeholder replacement done. Final HTML length: ${finalHtml.length}`);
            // console.log('[updateContent] Final HTML after replacement:', finalHtml); // Debug

            // PASO 4: Actualizar iframe
            this.logDebug('[updateContent] Updating iframe #content.innerHTML...');
            
            // Forma segura de actualizar el contenido del iframe para asegurar renderizado correcto
            try {
                // Aseguramos que el documento tiene un tipo de contenido adecuado
                if (doc.contentType !== 'text/html') {
                    this.logWarn('[updateContent] contentType no es text/html, corrigiendo...');
                }
                
                // Actualizamos el contenido de manera que asegure que se renderiza como HTML
                contentDiv.innerHTML = finalHtml;
                
                this.logDebug('[updateContent] Iframe content updated via innerHTML.');
            } catch (updateError) {
                // Si hay algún error, intentamos un enfoque alternativo
                this.logError('[updateContent] Error with innerHTML update, trying alternate method:', updateError);
                
                try {
                    // Método alternativo: escribir en el documento
                    doc.open();
                    doc.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <style id="base-styles">
                                body { margin: 0; padding: 15px; font-family: sans-serif; line-height: 1.6; }
                                #content { min-height: 100%; }
                            </style>
                            <style id="custom-theme-style">${this.currentCSSText || ''}</style>
                        </head>
                        <body>
                            <div id="content">${finalHtml}</div>
                        </body>
                        </html>
                    `);
                    doc.close();
                    this.logDebug('[updateContent] Iframe content updated via document.write.');
                } catch (writeError) {
                    this.logError('[updateContent] Both update methods failed:', writeError);
                    // Si todo falla, mostramos un mensaje de error simple
                    try {
                        contentDiv.innerHTML = '<div class="error">Error fatal actualizando el iframe.</div>';
                    } catch (finalError) {
                        console.error('[CRITICAL] Cannot update iframe by any method:', finalError);
                    }
                }
            }
            
            this.logDebug('[updateContent] Iframe content updated.');

            // PASO 5: Aplicar mejoras JS
            this.renderProgressBars(doc);
            this.removeInteractionListeners(doc);
            this.setupInteractionListeners();

            // PASO 6: Restaurar scroll
            requestAnimationFrame(() => { scrollable.scrollTop = currentScroll; });

            this.logDebug('[updateContent] Process completed successfully.');

        } catch (error) {
            this.logError('[updateContent] CRITICAL ERROR:', error);
            try { 
                contentDiv.innerHTML = `<div class="error-message critical-error"><h2>Preview Update Failed</h2><p>Check console. Error: ${escapeHtmlPreview(String(error))}</p></div>`; 
            }
            catch (displayError) { this.logError("Failed to display critical error in iframe:", displayError); }
        } finally {
             this.isProcessing = false;
             this.logDebug('<<<<<<<<<< [updateContent END V3] <<<<<<<<<<');
        }
    }
    // --- Fin updateContent --- 

    applyCustomCSS(cssContent: string): void { 
         this.logDebug('ApplyCustomCSS called. CSS length:', cssContent?.length ?? 0);
         if (typeof cssContent !== 'string') { console.error("Invalid CSS content"); return; }
         this.currentCSSText = cssContent;
         this.loadedFonts.clear();
         if (this.isReady) {
             this.applyStyles();
             this.updateContent(this.lastKnownMarkdown).catch(e => this.logError("Error during updateContent triggered by CSS change:", e));
         }
      }
    private applyStyles(): void { 
         if (!this.isReady || !this.iframe?.contentWindow?.document) {
             this.logWarn('PM: Cannot apply styles - iframe not ready');
             return;
         }
         const doc = this.iframe.contentWindow.document;
         const head = doc.head;
         try {
             let styleElement = doc.getElementById('custom-theme-style') as HTMLStyleElement | null;
             if (!styleElement) {
                 styleElement = doc.createElement('style');
                 styleElement.id = 'custom-theme-style';
                 head.appendChild(styleElement);
             }
             if (styleElement.textContent !== this.currentCSSText) {
                 styleElement.textContent = this.currentCSSText;
             }
             let themeName = "default-theme";
             const themeMatch = this.currentCSSText?.match(/\/\*\s*Theme:\s*([^*]*?)\s*\*\//);
             if (themeMatch?.[1]) {
                 themeName = themeMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
             }
             doc.documentElement.setAttribute('data-theme', themeName);
             this.injectFontsFromCSS(doc, this.currentCSSText);
             doc.body.style.opacity = '0.99'; setTimeout(() => { doc.body.style.opacity = '1'; }, 10);
         } catch (error) {
             console.error('PM: Error applying styles:', error);
         }
     }
    private injectFontsFromCSS(doc: Document, cssText: string): void { 
         if (!doc?.head || !cssText) return;
         const head = doc.head; const importRegex = /@import\s+url\(['"]?(.+?)['"]?\);?/g; let match;
         while ((match = importRegex.exec(cssText)) !== null) {
             const fontUrl = match[1];
             if (fontUrl.includes('fonts.googleapis.com') && !this.loadedFonts.has(fontUrl)) {
                 const link = doc.createElement('link'); link.href = fontUrl; link.rel = 'stylesheet';
                 head.appendChild(link); this.loadedFonts.add(fontUrl);
             }
         }
      }
    private renderProgressBars(doc: Document): void { 
         this.logDebug('Rendering progress bars...');
         let count = 0;
         const elements = doc.querySelectorAll('[data-value][data-max]');
         elements.forEach((el, index) => {
             if (!(el instanceof HTMLElement)) return;
             el.querySelectorAll('.dynamic-progress-bar').forEach(oldBar => oldBar.remove());
              try {
                 const valueStr = el.dataset.value; const maxStr = el.dataset.max; const stat = el.dataset.stat || 'value';
                 if (valueStr === undefined || maxStr === undefined) return;
                 const value = parseFloat(valueStr); const max = parseFloat(maxStr);
                 if (isNaN(value) || isNaN(max) || max <= 0) return;
                 const percentage = Math.max(0, Math.min(100, (value / max) * 100));
                 const progressBarContainer = doc.createElement('div'); progressBarContainer.className = 'dynamic-progress-bar'; 
                 progressBarContainer.setAttribute('data-stat', stat); progressBarContainer.setAttribute('role', 'progressbar');
                 progressBarContainer.setAttribute('aria-valuenow', value.toString()); progressBarContainer.setAttribute('aria-valuemin', '0');
                 progressBarContainer.setAttribute('aria-valuemax', max.toString()); progressBarContainer.title = `${stat}: ${value} / ${max}`;
                 const barFill = doc.createElement('div'); barFill.className = 'bar-fill'; barFill.style.width = `${percentage}%`;
                 let statusClass = 'ok';
                 if (percentage < 30) statusClass = 'error'; else if (percentage < 60) statusClass = 'warn';
                 barFill.classList.add(statusClass);
                 progressBarContainer.appendChild(barFill);
                 el.appendChild(progressBarContainer); count++;
             } catch (error) { this.logError(`Error rendering progress bar for element ${index}:`, el, error); }
         });
         this.logDebug(`Finished rendering progress bars. ${count} bars added/updated.`);
      }
    private setupInteractionListeners(): void { 
         if (!this.iframe?.contentWindow?.document || this.interactionListenersAttached) return;
         const doc = this.iframe.contentWindow.document;
         this.logDebug('Setting up delegated interaction listeners (mouseover/mouseout) on iframe body.');
         doc.body.addEventListener('mouseover', this.handleMouseOver);
         doc.body.addEventListener('mouseout', this.handleMouseOut);
         this.interactionListenersAttached = true;
      }
      private removeInteractionListeners(doc: Document | null): void { 
          if (!doc?.body) return;
          this.logDebug('Removing interaction listeners from iframe body.');
          doc.body.removeEventListener('mouseover', this.handleMouseOver);
          doc.body.removeEventListener('mouseout', this.handleMouseOut);
          this.interactionListenersAttached = false;
      }
    private handleMouseOver = (event: MouseEvent): void => { 
         if (!(event.target instanceof Element)) return;
         const interactiveContainer = (event.target as Element).closest('[data-interactive-container="true"]');
         if (interactiveContainer) { interactiveContainer.classList.add('is-hovered'); }
      };
    private handleMouseOut = (event: MouseEvent): void => { 
         if (!(event.target instanceof Element)) return;
         const interactiveContainer = (event.target as Element).closest('[data-interactive-container="true"]');
         const hoverClass = 'is-hovered';
         if (interactiveContainer) {
              const relatedTarget = event.relatedTarget as Node | null;
              if (!relatedTarget || !interactiveContainer.contains(relatedTarget)) {
                 interactiveContainer.classList.remove(hoverClass);
              }
         } else if (!event.relatedTarget && this.iframe?.contentWindow?.document) {
              this.iframe.contentWindow.document.querySelectorAll('.' + hoverClass).forEach(el => el.classList.remove(hoverClass));
         }
      };
    private setupScrollListener(): void { 
         if (!this.iframe?.contentWindow?.document) return;
         this.iframe.contentWindow.document.addEventListener('scroll', this.handleIframeScroll);
      }
    private handleIframeScroll = (): void => { 
         if (this.lastScrollSource === 'editor' || !this.iframe?.contentWindow?.document) return;
         this.lastScrollSource = 'preview';
         const scrollable = this.iframe.contentWindow.document.scrollingElement || this.iframe.contentWindow.document.body;
         const maxScroll = scrollable.scrollHeight - scrollable.clientHeight;
         if (maxScroll <= 0) return;
         const scrollPercentage = (scrollable.scrollTop / maxScroll) * 100;
         if (this.scrollSyncTimeout) clearTimeout(this.scrollSyncTimeout);
         this.scrollSyncTimeout = setTimeout(() => { this.lastScrollSource = null; }, 150);
      };
    syncScroll(scrollPercentage: number): void { 
         if (!this.isReady || !this.iframe?.contentWindow?.document) return;
         const doc = this.iframe.contentWindow.document;
         const scrollable = doc.scrollingElement || doc.body;
         const maxScroll = scrollable.scrollHeight - scrollable.clientHeight;
         if (maxScroll <= 0) return;
         this.lastScrollSource = 'editor';
         const targetY = (scrollPercentage / 100) * maxScroll;
         scrollable.scrollTop = targetY;
         if (this.scrollSyncTimeout) clearTimeout(this.scrollSyncTimeout);
         this.scrollSyncTimeout = setTimeout(() => { this.lastScrollSource = null; }, 150);
      }

} // Fin clase PreviewManager

const previewManager = new PreviewManager();
export default previewManager; 