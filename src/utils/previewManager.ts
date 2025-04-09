import markdownProcessor from './markdownProcessor';

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

    initialize(iframe: HTMLIFrameElement): void {
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
                console.error('PM: Iframe doc not accessible.'); 
                this.isReady = false; 
                return; 
            }
            console.log('PM: Iframe loaded. Ready.'); 
            this.isReady = true;
            this.applyStyles(); // Aplica CSS inicial
            this.updateContent(this.lastKnownMarkdown); // Aplica contenido inicial y mejoras
            this.setupScrollListener();
            this.setupInteractionListeners(); // Configurar listeners generales una vez
        };
    }

    destroy(): void {
        console.log("PM: Destroying...");
        if (this.iframe && this.iframe.contentWindow) {
             this.iframe.contentWindow.removeEventListener('scroll', this.handleIframeScroll);
             // Limpiar listeners de interacción
             this.removeInteractionListeners(this.iframe.contentWindow.document);
        }
        this.iframe = null; this.isReady = false; this.currentCSSText = ''; this.loadedFonts.clear();
        if (this.scrollSyncTimeout) clearTimeout(this.scrollSyncTimeout); this.lastScrollSource = null; this.interactionListenersAttached = false;
        console.log("PM: Destroyed.");
    }

    updateContent(markdown: string): void {
        this.lastKnownMarkdown = markdown;
        
        if (!this.isReady || !this.iframe?.contentWindow?.document) {
            console.warn('PM: Cannot update content - iframe not ready');
            return;
        }

        const doc = this.iframe.contentWindow.document;
        const contentDiv = doc.getElementById('content');
        
        if (!contentDiv) {
            console.error('PM: Content div not found');
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
        console.log("PM: Applying new custom CSS (V2.5 Mode).");
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
            console.warn('PM: Cannot apply styles - iframe not ready');
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
        doc.querySelectorAll('[data-value][data-max]').forEach(element => {
            // Limpiar barras antiguas si existen
            element.querySelectorAll('.dynamic-progress-bar').forEach(oldBar => oldBar.remove());

            // Ignorar celdas de tabla por ahora
            if (element.tagName === 'TD') return;

            // Cast element to HTMLElement to access dataset
            const htmlElement = element as HTMLElement;
            const value = parseFloat(htmlElement.dataset.value || "0");
            const max = parseFloat(htmlElement.dataset.max || "100");
            if (isNaN(value) || isNaN(max) || max <= 0) return;
            const percent = Math.max(0, Math.min(100, (value / max) * 100));
            let barClass = 'ok'; if (percent < 60) barClass = 'warn'; if (percent < 30) barClass = 'error';

            const barContainer = doc.createElement('div');
            barContainer.className = 'dynamic-progress-bar status-bar';
            const barFill = doc.createElement('span');
            barFill.className = `bar-fill ${barClass}`;
            barFill.style.width = `${percent}%`;
            barContainer.appendChild(barFill);
            element.appendChild(barContainer);
        });
    }

    // Configura listeners DELEGADOS en el body del iframe
    private setupInteractionListeners(): void {
        if (!this.iframe?.contentWindow?.document || this.interactionListenersAttached) return;
        const doc = this.iframe.contentWindow.document;

        console.log("PM: Setting up interaction listeners.");

        // Usar delegación de eventos en el body para hover
        doc.body.addEventListener('mouseover', this.handleMouseOver);
        doc.body.addEventListener('mouseout', this.handleMouseOut);

        // Podríamos añadir listener de click de forma similar
        // doc.body.addEventListener('click', this.handleClick);

        this.interactionListenersAttached = true;
    }

     // Quita listeners delegados
     private removeInteractionListeners(doc: Document | null): void {
         if (!doc?.body) return;
         console.log("PM: Removing interaction listeners.");
         doc.body.removeEventListener('mouseover', this.handleMouseOver);
         doc.body.removeEventListener('mouseout', this.handleMouseOut);
         // doc.body.removeEventListener('click', this.handleClick);
     }

    // Handler para mouseover (delegado)
    private handleMouseOver = (event: MouseEvent): void => {
        // Buscar el ancestro interactivo más cercano (panel o fila)
        const targetElement = (event.target as Element)?.closest('.mixed-panel, tbody tr');
        if (targetElement) {
            // Añadir clase solo a este elemento
            targetElement.classList.add('hover-active');
            // Quitarla de otros elementos que pudieran tenerla por error
            const otherActives = targetElement.parentElement?.querySelectorAll('.hover-active');
            otherActives?.forEach(el => {
                if (el !== targetElement) el.classList.remove('hover-active');
            });
        }
    };

    // Handler para mouseout (delegado)
    private handleMouseOut = (event: MouseEvent): void => {
        const targetElement = (event.target as Element)?.closest('.mixed-panel, tbody tr');
         // El relatedTarget nos dice hacia dónde se movió el ratón
         const relatedTarget = event.relatedTarget as Element | null;

        // Solo quitar la clase si el ratón realmente salió del elemento (y no entró en un hijo)
         if (targetElement && !targetElement.contains(relatedTarget)) {
             targetElement.classList.remove('hover-active');
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