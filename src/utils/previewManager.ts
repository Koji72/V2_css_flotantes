import markdownProcessor from './markdownProcessor';

/**
 * Gestor de la previsualización en iframe que optimiza la manipulación directa
 * del contenido sin recargar el iframe completo cada vez.
 */
class PreviewManager {
    private iframe: HTMLIFrameElement | null = null;
    private isInitialized: boolean = false;
    private currentCSSText: string = '';
    private loadedFonts: Set<string> = new Set();
    private scrollSyncTimeout: number | null = null;
    private lastScrollSource: 'editor' | 'preview' | null = null;
    private lastKnownMarkdown: string = '';

    /**
     * Inicializa el PreviewManager con una referencia al iframe
     */
    initialize(iframe: HTMLIFrameElement): void {
        if (this.iframe) {
            this.destroy();
        }
        console.log(`PreviewManager: Initializing (Adapter Mode)...`);
        this.iframe = iframe;
        this.isInitialized = false;
        this.currentCSSText = '';
        this.loadedFonts.clear();
        this.lastKnownMarkdown = '';

        // Escuchar mensajes del iframe
        window.addEventListener('message', this.handleIframeMessage);

        // Configurar el iframe con el documento base
        iframe.srcdoc = `
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta http-equiv="Content-Security-Policy" content="default-src * 'self' 'unsafe-inline' 'unsafe-eval' data: http: https:;">
                    <style id="base-styles">
                        body { 
                            margin: 0; 
                            padding: 10px; 
                            font-family: Arial, sans-serif;
                            color: #333;
                        }
                        #content {
                            min-height: 100%;
                        }
                    </style>
                    <style id="custom-css"></style>
                </head>
                <body>
                    <div id="content"></div>
                    <script>
                        // Notificar cuando la página esté lista
                        document.addEventListener('DOMContentLoaded', function() {
                            console.log('Preview iframe contenido cargado');
                            
                            // Función para recibir CSS del padre
                            window.applyCss = function(css) {
                                try {
                                    const styleEl = document.getElementById('custom-css');
                                    if (styleEl) {
                                        styleEl.textContent = css;
                                        console.log('CSS aplicado desde iframe');
                                        return true;
                                    }
                                } catch (e) {
                                    console.error('Error aplicando CSS:', e);
                                }
                                return false;
                            };
                            
                            // Notificar al padre que estamos listos
                            if (window.parent) {
                                try {
                                    window.parent.postMessage({type: 'IFRAME_READY'}, '*');
                                    console.log('Notificación enviada al padre');
                                } catch (e) {
                                    console.error('Error notificando al padre');
                                }
                            }
                        });
                    </script>
                </body>
            </html>
        `;
        
        // Esperar a que el iframe cargue inicialmente
        iframe.onload = () => {
            try {
                if (!this.iframe?.contentWindow?.document) {
                    console.error('PreviewManager: Iframe document not accessible.');
                    this.isInitialized = false;
                    return;
                }
                console.log('PreviewManager: Iframe loaded. Ready.');
                this.isInitialized = true;
                this.applyStyles();
                this.updateContent(this.lastKnownMarkdown);
                this.setupScrollListener();
            } catch (error) {
                console.error('PreviewManager: Error during iframe initialization', error);
                this.isInitialized = false;
            }
        };
    }

    /**
     * Actualiza el contenido HTML del iframe con el markdown procesado
     */
    updateContent(markdown: string): void {
        this.lastKnownMarkdown = markdown;
        if (!this.isReady) {
            console.log('PreviewManager: Not ready yet, content update delayed');
            return;
        }
        
        try {
            // Primero, mostrar un indicador de carga
            const doc = this.getDocument();
            if (!doc) {
                console.error('PreviewManager: Document not available');
                return;
            }
            
            // Intentar procesar el markdown
            let html;
            try {
                html = markdownProcessor.process(markdown);
            } catch (processingError: unknown) {
                console.error('PreviewManager: Error processing markdown', processingError);
                const errorMessage = processingError instanceof Error ? processingError.message : 'Unknown error';
                this.showError('Error processing markdown: ' + errorMessage);
                return;
            }
            
            // Actualizar el contenido
            try {
                const contentDiv = doc.getElementById('content');
                if (contentDiv) {
                    contentDiv.innerHTML = html || '';
                    console.log('PreviewManager: Content updated successfully');
                } else {
                    // Fallback si no existe el div #content
                    doc.body.innerHTML = `<div id="content">${html || ''}</div>`;
                    console.log('PreviewManager: Created new content container');
                }
            } catch (contentError) {
                console.error('PreviewManager: Error updating content DOM', contentError);
                this.showError('Error updating preview content');
            }
        } catch (error) {
            console.error('PreviewManager: Unhandled error in updateContent', error);
            // No podemos mostrar el error porque si llegamos aquí probablemente
            // ni siquiera podemos acceder al documento
        }
    }

    /**
     * Aplica CSS personalizado sin recargar el iframe
     */
    applyCustomCSS(css: string): void {
        // Guardar el CSS actual
        this.currentCSSText = css;
        
        if (!this.iframe || !this.iframe.contentWindow) {
            console.error('PreviewManager: No se puede acceder al iframe');
            return;
        }
        
        try {
            // Intentar usar la función applyCss definida en el iframe
            const iframeWindow = this.iframe.contentWindow as any;
            if (iframeWindow.applyCss && typeof iframeWindow.applyCss === 'function') {
                const success = iframeWindow.applyCss(css);
                if (success) {
                    console.log('PreviewManager: CSS aplicado a través de la función del iframe');
                    return;
                }
            }
            
            // Fallback si la función no está disponible
            if (this.iframe.contentWindow.document) {
                const doc = this.iframe.contentWindow.document;
                let styleEl = doc.getElementById('custom-css') as HTMLStyleElement;
                if (!styleEl) {
                    styleEl = doc.createElement('style');
                    styleEl.id = 'custom-css';
                    doc.head.appendChild(styleEl);
                }
                styleEl.textContent = css;
                console.log('PreviewManager: CSS aplicado mediante fallback');
            } else {
                console.error('PreviewManager: No se puede acceder al documento del iframe');
            }
        } catch (error) {
            console.error('PreviewManager: Error al aplicar CSS:', error);
        }
    }

    /**
     * Sincroniza el scroll del preview basado en un porcentaje
     */
    syncScroll(scrollPercentage: number): void {
        if (!this.isReady) return;
        
        try {
            const doc = this.getDocument();
            if (doc) {
                const maxScroll = doc.documentElement.scrollHeight - doc.documentElement.clientHeight;
                const targetScroll = (maxScroll * scrollPercentage) / 100;
                doc.documentElement.scrollTop = targetScroll;
            }
        } catch (error) {
            console.error('PreviewManager: Error syncing scroll', error);
        }
    }

    /**
     * Muestra un mensaje de error en el iframe
     */
    private showError(message: string): void {
        if (!this.isReady) {
            console.error('PreviewManager: Cannot show error, not ready:', message);
            return;
        }
        
        try {
            const doc = this.getDocument();
            if (!doc) {
                console.error('PreviewManager: Cannot show error, document not available:', message);
                return;
            }
            
            // Crear un contenedor de error con estilo
            const errorHtml = `
                <div id="content">
                    <div style="
                        color: #721c24;
                        background-color: #f8d7da;
                        border: 1px solid #f5c6cb;
                        padding: 20px;
                        margin: 20px 0;
                        border-radius: 5px;
                        font-family: Arial, sans-serif;
                    ">
                        <h3 style="margin-top: 0; color: #721c24;">Error</h3>
                        <p>${message}</p>
                    </div>
                </div>
            `;
            
            doc.body.innerHTML = errorHtml;
            console.error('PreviewManager: Displayed error in preview:', message);
        } catch (error) {
            console.error('PreviewManager: Failed to show error in preview:', message, error);
            // No podemos hacer más si no podemos mostrar el error
        }
    }

    /**
     * Obtiene el documento del iframe de forma segura
     */
    private getDocument(): Document | null {
        return this.iframe?.contentWindow?.document || null;
    }

    /**
     * Limpia los recursos cuando el componente se desmonta
     */
    destroy(): void {
        console.log("PreviewManager: Destroying...");
        try {
            // Eliminar listener de mensajes
            window.removeEventListener('message', this.handleIframeMessage);
            
            if (this.iframe && this.iframe.contentWindow) {
                try {
                    this.iframe.contentWindow.removeEventListener('scroll', this.handleIframeScroll);
                } catch (error) {
                    console.log("PreviewManager: Error removing event listener, iframe may be cross-origin", error);
                }
            }
            this.iframe = null;
            this.isInitialized = false;
            this.currentCSSText = '';
            this.loadedFonts.clear();
            if (this.scrollSyncTimeout) {
                clearTimeout(this.scrollSyncTimeout);
            }
            this.lastScrollSource = null;
            console.log("PreviewManager: Destroyed.");
        } catch (error) {
            console.error("PreviewManager: Error during destroy", error);
        }
    }

    /**
     * Verifica si el preview manager está listo para ser usado
     */
    get isReady(): boolean {
        return this.isInitialized && this.iframe !== null && this.iframe.contentWindow !== null;
    }

    private applyStyles(): void {
        if (!this.isReady || !this.iframe?.contentWindow?.document) {
            console.log('PreviewManager: Not ready to apply styles');
            return;
        }
        
        try {
            const doc = this.iframe.contentWindow.document;
            const head = doc.head;

            // Inyectar/Actualizar CSS
            let styleElement = doc.getElementById('custom-theme-style') as HTMLStyleElement | null;
            if (!styleElement) {
                styleElement = doc.createElement('style');
                styleElement.id = 'custom-theme-style';
                head.appendChild(styleElement);
            }
            
            if (styleElement.textContent !== this.currentCSSText) {
                styleElement.textContent = this.currentCSSText;
                console.log('PreviewManager: Theme styles updated');
            }

            // Extraer y aplicar data-theme
            let themeName = "default-theme";
            if (this.currentCSSText) {
                const themeMatch = this.currentCSSText.match(/\/\*\s*Theme:\s*([^*]*?)\s*\*\//);
                if (themeMatch && themeMatch[1]) {
                    themeName = themeMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
                }
            }
            doc.documentElement.setAttribute('data-theme', themeName);
            
            // Extraer e inyectar fuentes
            this.injectFontsFromCSS(doc, this.currentCSSText);
            console.log(`PreviewManager: Styles applied (Theme: ${themeName}).`);
        } catch (error) {
            console.error('PreviewManager: Error applying styles', error);
        }
    }

    private injectFontsFromCSS(doc: Document, cssText: string): void {
        if (!doc || !doc.head || !cssText) {
            return;
        }
        
        try {
            const head = doc.head;
            
            // Detectar importaciones de Google Fonts
            const importRegex = /@import\s+url\(['"]?(.+?)['"]?\);?/g;
            let match;
            while ((match = importRegex.exec(cssText)) !== null) {
                const fontUrl = match[1];
                if (fontUrl.includes('fonts.googleapis.com') && !this.loadedFonts.has(fontUrl)) {
                    const link = doc.createElement('link');
                    link.href = fontUrl;
                    link.rel = 'stylesheet';
                    head.appendChild(link);
                    this.loadedFonts.add(fontUrl);
                    console.log(`PreviewManager: Injected Google Font: ${fontUrl}`);
                }
            }
            
            // Detectar reglas @font-face
            const fontFaceRegex = /@font-face\s*{[^}]*}/g;
            const fontFaces = cssText.match(fontFaceRegex);
            
            if (fontFaces && fontFaces.length > 0) {
                // Si hay reglas @font-face, crear un estilo específico para ellas
                let fontFaceStyle = doc.getElementById('font-face-styles');
                if (!fontFaceStyle) {
                    fontFaceStyle = doc.createElement('style');
                    fontFaceStyle.id = 'font-face-styles';
                    head.appendChild(fontFaceStyle);
                }
                
                // Aplicar todas las reglas @font-face encontradas
                fontFaceStyle.textContent = fontFaces.join('\n');
                console.log(`PreviewManager: Injected ${fontFaces.length} @font-face rules`);
            }
        } catch (error) {
            console.error('PreviewManager: Error injecting fonts', error);
        }
    }

    private handleIframeScroll = (): void => {
        if (!this.isReady || !this.iframe?.contentWindow || this.lastScrollSource === 'editor') {
            return;
        }
        this.lastScrollSource = 'preview';
        if (this.scrollSyncTimeout) {
            clearTimeout(this.scrollSyncTimeout);
        }
        this.scrollSyncTimeout = window.setTimeout(() => {
            this.lastScrollSource = null;
        }, 100);
    };

    private setupScrollListener(): void {
        if (!this.iframe?.contentWindow) return;
        
        try {
            this.iframe.contentWindow.addEventListener('scroll', this.handleIframeScroll);
            console.log("PreviewManager: Scroll listener setup successful");
        } catch (error) {
            console.warn("PreviewManager: Could not set up scroll listener. This is likely due to cross-origin restrictions.", error);
        }
    }

    /**
     * Maneja los mensajes enviados desde el iframe
     */
    private handleIframeMessage = (event: MessageEvent): void => {
        // Solo procesamos mensajes de nuestro iframe
        if (!this.iframe || !this.iframe.contentWindow || event.source !== this.iframe.contentWindow) {
            return;
        }
        
        try {
            const message = event.data;
            if (message && message.type === 'IFRAME_READY') {
                console.log('PreviewManager: Iframe ha notificado que está listo');
                
                // Si tenemos CSS pendiente, aplicarlo ahora
                if (this.currentCSSText) {
                    setTimeout(() => {
                        this.applyCustomCSS(this.currentCSSText);
                    }, 100);
                }
            }
        } catch (error) {
            console.error('PreviewManager: Error procesando mensaje del iframe', error);
        }
    };
}

// Exportar una instancia única para usar en toda la aplicación
const previewManager = new PreviewManager();
export default previewManager; 