import { marked } from 'marked';
import { useStore } from '../store';
import { HTMLSanitizer } from './htmlSanitizer';
import { PanelManager } from './panelManager';
import { TemplateManager } from './templateManager';

// Helper local para escapar HTML si es necesario dentro de esta clase
const escapeHtmlPreview = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 };

// Configuración personalizada de Marked
marked.use({
    gfm: true, // GitHub Flavored Markdown - habilita varios extras
    breaks: true, // Saltos de línea con solo Enter
    silent: true, // No lanzar errores, intentar procesar lo que pueda
    renderer: {
        // Personalización del renderizado de listas
        listitem(text: string, task: boolean, checked: boolean) {
            if (task) {
                return `<li class="task-list-item"><input type="checkbox" ${checked ? 'checked' : ''} disabled> ${text}</li>`;
            }
            return `<li>${text}</li>`;
        }
    }
});

export class PreviewManager {
    private static instance: PreviewManager | null = null;
    private iframe: HTMLIFrameElement | null = null;
    public isReady: boolean = false;
    private currentCSSText: string = '';
    private loadedFonts: Set<string> = new Set();
    private scrollSyncTimeout: number | null = null;
    private animationTimeout: number | null = null;
    private contentUpdateTimeout: number | null = null;
    private lastScrollSource: 'editor' | 'preview' | null = null;
    private lastKnownMarkdown: string = '';
    private interactionListenersAttached: boolean = false;
    private isProcessing: boolean = false;
    private buttonListeners: Map<string, (event: Event) => void> = new Map();
    private iframeLoadListener: (() => void) | null = null;
    private initialContentQueue: string | null = null;
    private initialCSSQueue: string | null = null;
    private sanitizer!: HTMLSanitizer;
    private panelManager!: PanelManager;
    private templateManager!: TemplateManager;

    constructor() {
        if (PreviewManager.instance) {
            console.warn("PreviewManager already instantiated. Returning existing instance.");
            return PreviewManager.instance;
        }
        PreviewManager.instance = this;
        this.sanitizer = HTMLSanitizer.getInstance();
        this.panelManager = PanelManager.getInstance();
        this.templateManager = TemplateManager.getInstance();
        console.log('[PreviewManager] Constructor initialized with PanelManager:', this.panelManager);
    }

    static getInstance(): PreviewManager {
        if (!PreviewManager.instance) {
            PreviewManager.instance = new PreviewManager();
        }
        return PreviewManager.instance;
    }

    private setupInteractionListeners(doc: Document): void {
        if (this.interactionListenersAttached) {
            this.removeInteractionListeners(doc);
        }
        
        doc.body.addEventListener('click', (event) => {
            const target = event.target as HTMLElement;
            if (target.tagName === 'BUTTON' && target.hasAttribute('data-action')) {
                const action = target.getAttribute('data-action');
                const buttonId = target.id;
                console.log(`Button clicked: ID=${buttonId}, Action=${action}`);
            }
        });

        this.interactionListenersAttached = true;
    }

    private removeInteractionListeners(doc: Document): void {
        const oldBody = doc.body;
        const newBody = oldBody.cloneNode(true) as HTMLBodyElement;
        oldBody.parentNode?.replaceChild(newBody, oldBody);
        this.interactionListenersAttached = false;
    }

    initialize(iframe: HTMLIFrameElement): void {
        if (!iframe) {
            console.error('[PreviewManager] Iframe element is null.');
            return;
        }
        this.iframe = iframe;
        this.isReady = false;
        this.lastKnownMarkdown = '';
        this.panelManager.initialize();

        console.log('[PreviewManager] Initializing...');

        if (this.iframeLoadListener && this.iframe.contentWindow) {
            this.iframe.removeEventListener('load', this.iframeLoadListener);
        }

        this.iframeLoadListener = () => {
            console.log('[PreviewManager] Iframe loaded.');
            this.isReady = true;
            const doc = this.iframe?.contentDocument;
            const win = this.iframe?.contentWindow;

            if (doc && win) {
            this.applyStyles();

                if (this.initialCSSQueue) {
                    console.log('[PreviewManager] Applying queued CSS.');
                    this.applyCustomCSS(this.initialCSSQueue);
                    this.initialCSSQueue = null;
                }
                
                if (this.initialContentQueue) {
                    console.log('[PreviewManager] Applying queued content.');
                    this.updateContent(this.initialContentQueue);
                this.initialContentQueue = null;
                } else {
                    doc.body.innerHTML = '<p>Preview Area</p>';
                }

                this.setupDefaultListeners();

            } else {
                console.error('[PreviewManager] Iframe document or window not available after load.');
            }
        };

        if (this.iframe.contentDocument && this.iframe.contentDocument.readyState === 'complete') {
             console.log('[PreviewManager] Iframe already complete.');
             this.iframeLoadListener();
        } else {
             console.log('[PreviewManager] Adding load listener to iframe.');
        this.iframe.addEventListener('load', this.iframeLoadListener);
        }
    }

    destroy(): void {
        console.log('[PreviewManager] Destroying instance...');
        this.clearTimers();
        if (this.iframe && this.iframeLoadListener) {
                this.iframe.removeEventListener('load', this.iframeLoadListener);
            }
        if (this.iframe?.contentWindow) {
                this.iframe.contentWindow.removeEventListener('scroll', this.handleIframeScroll);
           if(this.iframe.contentDocument && this.interactionListenersAttached) {
               this.removeInteractionListeners(this.iframe.contentDocument);
           }
        }
        this.panelManager.destroy();
        this.iframe = null;
        this.isReady = false;
        this.currentCSSText = '';
        this.loadedFonts.clear();
        this.buttonListeners.clear();
        this.initialContentQueue = null;
        this.initialCSSQueue = null;
        PreviewManager.instance = null;
    }

    private setupDefaultListeners(): void {
        const doc = this.iframe?.contentDocument;
        const win = this.iframe?.contentWindow;

        if (!doc || !win) {
            console.error("[PreviewManager] Cannot setup listeners: iframe doc/win not ready.");
            return;
        }

        win.removeEventListener('scroll', this.handleIframeScroll); 
        win.addEventListener('scroll', this.handleIframeScroll);
        
        this.setupInteractionListeners(doc); 

        console.log("[PreviewManager] Default listeners set up.");
    }

    applyCustomCSS(cssContent: string): void {
        if (!this.iframe || !this.isReady) {
            console.warn('[PreviewManager] Iframe not ready, queuing CSS.');
            this.initialCSSQueue = cssContent;
            return;
        }
        
        this.currentCSSText = cssContent;
        this.applyStyles();
        
        const doc = this.iframe.contentDocument;
        if (doc) {
            this.injectFontsFromCSS(doc, cssContent);
        }
    }

    private applyStyles(): void {
        const doc = this.iframe?.contentDocument;
        if (!doc || !this.isReady) {
            console.warn('[PreviewManager] Cannot apply styles: iframe document not ready.');
            return;
        }

        const existingStyles = doc.head.querySelectorAll('style[data-preview-style]');
        existingStyles.forEach(style => style.remove());

        const baseStyle = doc.createElement('style');
        baseStyle.setAttribute('data-preview-style', 'base');
        baseStyle.textContent = `
            body { 
                font-family: sans-serif; 
                line-height: 1.6; 
                margin: 0; 
                padding: 1rem; 
                background-color: var(--preview-bg, #fff); 
                color: var(--preview-text, #333);
            }
        `;
        doc.head.appendChild(baseStyle);

        if (this.currentCSSText) {
            const customStyle = doc.createElement('style');
            customStyle.setAttribute('data-preview-style', 'custom');
            customStyle.textContent = this.currentCSSText;
            doc.head.appendChild(customStyle);
        }

        console.log('[PreviewManager] Base and custom styles applied.');
    }

    private injectFontsFromCSS(doc: Document, cssText: string): void {
        const fontFaceRegex = /@font-face\s*{[^}]*?font-family:\s*['"]?([^;'"}]+)['"]?[^}]*?src:\s*url\(['"]?([^'")]+)['"]?\)[^}]*}/g;
        let match;
        
        while ((match = fontFaceRegex.exec(cssText)) !== null) {
            const fontFamily = match[1];
            const fontUrl = match[2];

            if (!this.loadedFonts.has(fontFamily)) {
                console.log(`[PreviewManager] Injecting font: ${fontFamily} from ${fontUrl}`);
                const link = doc.createElement('link');
                link.rel = 'stylesheet';
                link.href = fontUrl;
                doc.head.appendChild(link);
                this.loadedFonts.add(fontFamily);
            }
        }
    }

    private handleIframeScroll = (): void => {
        if (this.lastScrollSource === 'editor') {
            return; 
        }
        this.lastScrollSource = 'preview';
        
        const doc = this.iframe?.contentDocument?.documentElement;
        if (doc) {
            const scrollPercentage = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
            console.log("Iframe scrolled:", scrollPercentage);
        }

        clearTimeout(this.scrollSyncTimeout as number);
        this.scrollSyncTimeout = window.setTimeout(() => { this.lastScrollSource = null; }, 150);
    };

    syncScroll(scrollPercentage: number): void {
        if (!this.iframe || !this.isReady || this.lastScrollSource === 'preview') {
            return;
        }
        this.lastScrollSource = 'editor';

        const doc = this.iframe.contentDocument?.documentElement;
        if (doc) {
            const targetScrollTop = scrollPercentage * (doc.scrollHeight - doc.clientHeight);
            this.iframe.contentWindow?.scrollTo({ top: targetScrollTop, behavior: 'auto' });
        }

        clearTimeout(this.scrollSyncTimeout as number);
        this.scrollSyncTimeout = window.setTimeout(() => { this.lastScrollSource = null; }, 150);
    }

    async updateContent(markdown: string): Promise<void> {
        if (!this.iframe || !this.isReady) {
            console.warn('[PreviewManager] Iframe not ready, queuing content update.');
            this.initialContentQueue = markdown;
            return;
        }

        if (this.isProcessing || markdown === this.lastKnownMarkdown) {
            console.log('[PreviewManager] Skipping content update (processing or unchanged).');
            return;
        }

        this.isProcessing = true;
        this.lastKnownMarkdown = markdown;
        console.log('[PreviewManager] Starting content update...');

        try {
            const doc = this.iframe.contentDocument;
            if (!doc) {
                throw new Error("Iframe document not available.");
            }
            
            // 1. Process panel and button syntax FIRST using PanelManager
            console.log('[PreviewManager] Processing panels/buttons with PanelManager...');
            console.log('[PreviewManager] ---> Markdown BEFORE PanelManager:', markdown.substring(0, 500)); // DEBUG
            let processedMarkdown = this.panelManager.processPanelSyntax(markdown);
            console.log('[PreviewManager] Panel processing complete.');
            console.log('[PreviewManager] ---> HTML/MD AFTER PanelManager:', processedMarkdown.substring(0, 500)); // DEBUG

            // 2. Process the result with marked (handles standard MD and remaining HTML)
            console.log('[PreviewManager] Processing with marked...');
            let htmlContent = await marked(processedMarkdown);
            console.log('[PreviewManager] Marked processing complete.');
            console.log('[PreviewManager] ---> HTML AFTER marked:', htmlContent.substring(0, 500)); // DEBUG

            // 3. Sanitize the final HTML
            console.log('[PreviewManager] Sanitizing final HTML...');
            const sanitizedHtml = this.sanitizer.sanitize(htmlContent);
            console.log('[PreviewManager] Sanitization complete.');
            console.log('[PreviewManager] ---> HTML AFTER sanitize:', sanitizedHtml.substring(0, 500)); // DEBUG

            // 4. Update iframe content
            doc.body.innerHTML = sanitizedHtml;
            
            // 5. Re-setup interaction listeners for new content
            this.setupInteractionListeners(doc);

            // 6. Apply template styles
            this.templateManager.applyTemplateStyles();

            console.log('[PreviewManager] Content update successful.');

        } catch (error) {
            console.error('[PreviewManager] Error updating content:', error);
            if (this.iframe.contentDocument) {
                this.iframe.contentDocument.body.innerHTML = 
                    `<div class="preview-error">Error updating preview: ${escapeHtmlPreview(String(error))}</div>`;
            }
        } finally {
             this.isProcessing = false;
            console.log('[PreviewManager] Finished content update cycle.');
        }
    }

    private clearTimers(): void {
        if (this.scrollSyncTimeout) clearTimeout(this.scrollSyncTimeout);
        if (this.animationTimeout) clearTimeout(this.animationTimeout);
        if (this.contentUpdateTimeout) clearTimeout(this.contentUpdateTimeout);
        this.scrollSyncTimeout = null;
        this.animationTimeout = null;
        this.contentUpdateTimeout = null;
    }
}

const previewManager = PreviewManager.getInstance();
export default previewManager; 