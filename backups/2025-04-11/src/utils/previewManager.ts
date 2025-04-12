import { marked } from 'marked';
import markdownProcessor from './markdownProcessor';
import { useAppStore } from './markdownProcessor';

/**
 * Gestor de la previsualización en iframe V2.5.
 * Muestra HTML procesado, aplica CSS cargado dinámicamente,
 * y añade mejoras visuales/interactivas con JS (barras, hover).
 */
class PreviewManager {
    private iframe: HTMLIFrameElement | null = null;
    public isReady: boolean = false;
    private currentCSSText: string = '';
    private loadedFonts: Set<string> = new Set();
    private scrollSyncTimeout: NodeJS.Timeout | null = null;
    private lastScrollSource: 'editor' | 'preview' | null = null;
    private lastKnownMarkdown: string = '';
    private interactionListenersAttached: boolean = false; // Para evitar duplicar listeners

    // --- Logging Helpers as private methods ---
    private logDebug(message: string, ...optionalParams: any[]): void {
        if (useAppStore.getState().isDebugMode) {
            console.log(`[PM] ${message}`, ...optionalParams);
        }
    }
    private logWarn(message: string, ...optionalParams: any[]): void {
        console.warn(`[PM] ${message}`, ...optionalParams);
    }
    private logError(message: string, ...optionalParams: any[]): void {
        console.error(`[PM] ${message}`, ...optionalParams);
    }
    // --- End Logging Helpers ---

    initialize(iframe: HTMLIFrameElement): void {
        this.logDebug('Initializing PreviewManager with iframe:', iframe);
        if (this.iframe) { this.destroy(); }
        console.log(`PreviewManager: Initializing (V2.5 Enhanced Adapter Mode)...`);
        this.iframe = iframe; 
        this.isReady = false; 
        this.currentCSSText = ''; 
        this.loadedFonts.clear(); 
        this.lastKnownMarkdown = ''; 
        this.interactionListenersAttached = false;

        // Usar el HTML base que incluye los estilos por defecto
        const baseHtml = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <base target="_blank">
                    <style id="base-styles">
                        body { 
                            margin: 0; 
                            padding: 10px; 
                            font-family: Arial, sans-serif;
                            color: #333;
                            background-color: #fff;
                        }
                        #content {
                            min-height: 100%;
                        }
                    </style>
                    <style id="custom-theme-style"></style>
                </head>
                <body>
                    <div id="content"></div>
                </body>
            </html>
        `;

        iframe.srcdoc = baseHtml;
        
        iframe.onload = () => {
            if (!this.iframe?.contentWindow?.document) { 
                this.logError('PM: Iframe doc not accessible.'); 
                this.isReady = false; 
                return; 
            }
            console.log('PM: Iframe loaded. Ready.'); 
            this.isReady = true;
            this.applyStyles(); // Aplica CSS inicial
            this.updateContent(this.lastKnownMarkdown); // Aplica contenido inicial y mejoras
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
        if (this.scrollSyncTimeout) clearTimeout(this.scrollSyncTimeout); this.lastScrollSource = null; this.interactionListenersAttached = false;
        this.logDebug('PreviewManager destroyed.');
    }

    updateContent(markdown: string): void {
        this.lastKnownMarkdown = markdown;
        this.logDebug('UpdateContent called. Markdown length:', markdown.length);
        
        if (!this.isReady || !this.iframe?.contentWindow?.document) {
            this.logWarn('PM: Cannot update content - iframe not ready');
            return;
        }

        const doc = this.iframe.contentWindow.document;
        const contentDiv = doc.getElementById('content');
        
        if (!contentDiv) {
            this.logError('PM: Content div not found');
            return;
        }

        const scrollable = doc.scrollingElement || doc.body;
        const currentScroll = scrollable.scrollTop;

        try {
            // Procesar el markdown
            const processedHTML = markdownProcessor.process(markdown);
            
            // Actualizar el contenido
            contentDiv.innerHTML = processedHTML;
            
            // Aplicar mejoras JS
            this.renderProgressBars(doc);
            
            // Restaurar el scroll
            requestAnimationFrame(() => {
                scrollable.scrollTop = currentScroll;
            });

            console.log('PM: Content updated successfully');
        } catch (error) {
            console.error('PM: Error updating content:', error);
            contentDiv.innerHTML = '<div class="error-message">Error rendering content.</div>';
        }
    }

    applyCustomCSS(cssContent: string): void {
        this.logDebug('ApplyCustomCSS called. CSS length:', cssContent?.length ?? 0);
        if (typeof cssContent !== 'string') { console.error("Invalid CSS content"); return; }
        this.currentCSSText = cssContent;
        this.loadedFonts.clear();
        if (this.isReady) {
            this.applyStyles(); // Aplica el nuevo CSS y fuentes
            this.updateContent(this.lastKnownMarkdown); // Re-renderiza HTML y aplica mejoras JS
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
            // Asegurarse de que el elemento style existe
            let styleElement = doc.getElementById('custom-theme-style') as HTMLStyleElement | null;
            if (!styleElement) {
                styleElement = doc.createElement('style');
                styleElement.id = 'custom-theme-style';
                head.appendChild(styleElement);
                console.log('PM: Created custom-theme-style element');
            }

            // Aplicar el CSS
            if (styleElement.textContent !== this.currentCSSText) {
                styleElement.textContent = this.currentCSSText;
                console.log('PM: Applied new CSS content');
            }

            // Extraer y aplicar el nombre del tema
            let themeName = "default-theme";
            const themeMatch = this.currentCSSText?.match(/\/\*\s*Theme:\s*([^*]*?)\s*\*\//);
            if (themeMatch?.[1]) {
                themeName = themeMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
            }
            doc.documentElement.setAttribute('data-theme', themeName);

            // Cargar fuentes
            this.injectFontsFromCSS(doc, this.currentCSSText);

            // Forzar un repintado para asegurar que los estilos se apliquen
            doc.body.style.opacity = '0.99';
            setTimeout(() => {
                doc.body.style.opacity = '1';
            }, 10);

            console.log(`PM: Styles applied successfully (Theme: ${themeName})`);
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
                head.appendChild(link); this.loadedFonts.add(fontUrl); console.log(`PM: Injected Font: ${fontUrl}`);
            }
        }
    }

    // --- Funciones de Mejora JS ---

    private renderProgressBars(doc: Document): void {
        this.logDebug('Rendering progress bars...');
        let count = 0;
        const elements = doc.querySelectorAll('[data-value][data-max]'); 
        this.logDebug(`Found ${elements.length} potential elements for progress bars.`);

        elements.forEach((el, index) => {
            if (!(el instanceof HTMLElement)) return;

            el.querySelectorAll('.dynamic-progress-bar').forEach(oldBar => oldBar.remove());

             try {
                const valueStr = el.dataset.value;
                const maxStr = el.dataset.max;
                const stat = el.dataset.stat || 'value';

                if (valueStr === undefined || maxStr === undefined) {
                     this.logWarn(`Skipping element ${index} (${el.tagName}): Missing data-value or data-max.`);
                     return;
                 }

                const value = parseFloat(valueStr);
                const max = parseFloat(maxStr);

                if (isNaN(value) || isNaN(max) || max <= 0) {
                    this.logWarn(`Invalid numeric value/max for element ${index} (${stat}): value='${valueStr}', max='${maxStr}'. Skipping.`);
                    return;
                }

                const percentage = Math.max(0, Math.min(100, (value / max) * 100));
                this.logDebug(`  Element ${index} (${stat}): Value=${value}, Max=${max}, Percentage=${percentage.toFixed(1)}%`);

                const progressBarContainer = doc.createElement('div');
                progressBarContainer.className = 'dynamic-progress-bar'; 
                progressBarContainer.setAttribute('data-stat', stat);
                progressBarContainer.setAttribute('role', 'progressbar');
                progressBarContainer.setAttribute('aria-valuenow', value.toString());
                progressBarContainer.setAttribute('aria-valuemin', '0');
                progressBarContainer.setAttribute('aria-valuemax', max.toString());
                progressBarContainer.title = `${stat}: ${value} / ${max}`;

                const barFill = doc.createElement('div');
                barFill.className = 'bar-fill';
                barFill.style.width = `${percentage}%`;

                let statusClass = 'ok';
                if (percentage < 30) statusClass = 'error';
                else if (percentage < 60) statusClass = 'warn';
                barFill.classList.add(statusClass);

                progressBarContainer.appendChild(barFill);

                el.appendChild(progressBarContainer);
                count++;
                this.logDebug(`    -> Progress bar added to element ${index} (${stat})`);

            } catch (error) {
                this.logError(`Error rendering progress bar for element ${index}:`, el, error);
            }
        });
         this.logDebug(`Finished rendering progress bars. ${count} bars added/updated.`);
    }

    // Configura listeners DELEGADOS en el body del iframe
    private setupInteractionListeners(): void {
        if (!this.iframe?.contentWindow?.document || this.interactionListenersAttached) return;
        const doc = this.iframe.contentWindow.document;

        this.logDebug('Setting up delegated interaction listeners (mouseover/mouseout) on iframe body.');

        // Usar delegación de eventos en el body para hover
        doc.body.addEventListener('mouseover', this.handleMouseOver);
        doc.body.addEventListener('mouseout', this.handleMouseOut);

        // Podríamos añadir listener de click de forma similar
        // doc.body.addEventListener('click', this.handleClick);

        this.interactionListenersAttached = true;
        this.logDebug('Interaction listeners attached to body.');
    }

     // Quita listeners delegados
     private removeInteractionListeners(doc: Document | null): void {
         if (!doc?.body) return;
         this.logDebug('Removing interaction listeners from iframe body.');
         doc.body.removeEventListener('mouseover', this.handleMouseOver);
         doc.body.removeEventListener('mouseout', this.handleMouseOut);
         // doc.body.removeEventListener('click', this.handleClick);
     }

    // Handler para mouseover (delegado)
    private handleMouseOver = (event: MouseEvent): void => {
        const isDebug = useAppStore.getState().isDebugMode;
        if (isDebug) this.logDebug(`MouseOver detected. Target: ${event.target ? (event.target as Element).tagName : 'null'}`);

        try {
            if (!(event.target instanceof Element)) return;

            const interactiveContainer = (event.target as Element).closest('[data-interactive-container="true"]');

            if (interactiveContainer) {
                const hoverClass = 'is-hovered';
                if (!interactiveContainer.classList.contains(hoverClass)) {
                   interactiveContainer.classList.add(hoverClass);
                   if (isDebug) this.logDebug(`  -> Added class "${hoverClass}" to:`, interactiveContainer.tagName, interactiveContainer.classList);
                } else {
                    if (isDebug) this.logDebug(`  -> Class "${hoverClass}" already present on:`, interactiveContainer.tagName);
                }
            } else {
                 if (isDebug) this.logDebug('  -> No interactive container ancestor found for target.');
            }
        } catch (error) {
             this.logError('Error in handleMouseOver:', error);
        }
    };

    // Handler para mouseout (delegado)
    private handleMouseOut = (event: MouseEvent): void => {
        const isDebug = useAppStore.getState().isDebugMode;
        if (isDebug) this.logDebug(`MouseOut detected. Target: ${event.target ? (event.target as Element).tagName : 'null'}, RelatedTarget: ${event.relatedTarget ? (event.relatedTarget as Element).tagName : 'null'}`);

         try {
             if (!(event.target instanceof Element)) return;

            const interactiveContainer = (event.target as Element).closest('[data-interactive-container="true"]');
            const hoverClass = 'is-hovered';

            if (interactiveContainer) {
                 const relatedTarget = event.relatedTarget as Node | null;
                 if (!relatedTarget || !interactiveContainer.contains(relatedTarget)) {
                    interactiveContainer.classList.remove(hoverClass);
                    if (isDebug) this.logDebug(`  -> Removed class "${hoverClass}" from:`, interactiveContainer.tagName, interactiveContainer.classList);
                 } else {
                      if (isDebug) this.logDebug(`  -> Mouse moved within interactive container, class "${hoverClass}" kept.`);
                 }
            } else {
                if (!event.relatedTarget && this.iframe?.contentWindow?.document) { 
                    this.logDebug('Mouse left iframe, clearing all hover states.');
                    this.iframe.contentWindow.document.querySelectorAll('.' + hoverClass).forEach(el => el.classList.remove(hoverClass));
                } else {
                     if (isDebug) this.logDebug('  -> Target was not within an interactive container.');
                }
            }
          } catch (error) {
               this.logError('Error in handleMouseOut:', error);
          }
    };

    // Placeholder para futura interactividad de click
    // private handleClick = (event: MouseEvent): void => {
    //     const diceRollSpan = (event.target as Element)?.closest('span.dice-roll');
    //     if (diceRollSpan) {
    //         const roll = diceRollSpan.dataset.roll;
    //         console.log(`TODO: Roll dice for ${roll}`);
    //         // Aquí iría la lógica para tirar el dado y mostrar resultado
    //     }
    // };


    // --- Funciones de Scroll Sync (Sin cambios) ---
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
        this.scrollSyncTimeout = setTimeout(() => {
            this.lastScrollSource = null;
        }, 150);
    }

    private handleIframeScroll = (): void => {
        if (this.lastScrollSource === 'editor' || !this.iframe?.contentWindow?.document) return;
        
        this.lastScrollSource = 'preview';
        const scrollable = this.iframe.contentWindow.document.scrollingElement || this.iframe.contentWindow.document.body;
        const maxScroll = scrollable.scrollHeight - scrollable.clientHeight;
        if (maxScroll <= 0) return;
        
        const scrollPercentage = (scrollable.scrollTop / maxScroll) * 100;
        
        if (this.scrollSyncTimeout) clearTimeout(this.scrollSyncTimeout);
        this.scrollSyncTimeout = setTimeout(() => {
            this.lastScrollSource = null;
        }, 150);
        
        // Aquí, podríamos emitir un evento si fuera necesario para que App.tsx actualizara CodeMirror
        // window.dispatchEvent(new CustomEvent('previewScroll', { detail: { percentage: scrollPercentage } }));
        
        // O guardar el porcentaje por si App.tsx pregunta por él
        // this.lastScrollPercentage = scrollPercentage;
    };

    private setupScrollListener(): void {
        if (!this.iframe?.contentWindow?.document) return;
        const doc = this.iframe.contentWindow.document;
        doc.addEventListener('scroll', this.handleIframeScroll);
    }
}

// Exportar la instancia singleton
const previewManager = new PreviewManager();
export default previewManager; 

// Función para procesar el markdown
const processMarkdown = async (markdown: string): Promise<string> => {
  try {
    // Procesar el markdown
    const html = await marked(markdown);
    return html;
  } catch (error: any) {
    console.error('Error processing markdown:', error);
    return `<div class="error">Error processing markdown: ${error.message}</div>`;
  }
};

// Función para actualizar el contenido del iframe
const updateIframeContent = async (iframe: HTMLIFrameElement, markdown: string, css: string): Promise<void> => {
  try {
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) return;
    
    // Procesar el markdown
    const processedHTML = await processMarkdown(markdown);
    
    // Reiniciar completamente el documento
    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Markdown Preview</title>
          <style>
            ${css}
          </style>
        </head>
        <body>
          ${processedHTML}
        </body>
      </html>
    `);
    iframeDoc.close();
  } catch (error: any) {
    console.error('Error updating iframe content:', error);
  }
}; 