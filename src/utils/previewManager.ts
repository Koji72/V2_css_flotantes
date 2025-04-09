import markdownProcessor from './markdownProcessor';

class PreviewManager {
    private iframe: HTMLIFrameElement | null = null;
    public isReady: boolean = false;
    private currentCSSText: string = '';
    private loadedFonts: Set<string> = new Set();
    private scrollSyncTimeout: number | null = null;
    private lastScrollSource: 'editor' | 'preview' | null = null;
    private lastKnownMarkdown: string = '';

    initialize(iframeElement: HTMLIFrameElement): void {
        if (this.iframe) {
            this.destroy();
        }
        console.log(`PreviewManager: Initializing (Adapter Mode)...`);
        this.iframe = iframeElement;
        this.isReady = false;
        this.currentCSSText = '';
        this.loadedFonts.clear();
        this.lastKnownMarkdown = '';

        this.iframe.onload = () => {
            if (!this.iframe?.contentWindow?.document) {
                console.error('PreviewManager: Iframe document not accessible.');
                this.isReady = false;
                return;
            }
            console.log('PreviewManager: Iframe loaded. Ready.');
            this.isReady = true;
            this.applyStyles();
            this.updateContent(this.lastKnownMarkdown);
            this.setupScrollListener();
        };

        this.iframe.srcdoc = '<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><title>Preview</title></head><body style="margin:0;"></body></html>';
    }

    destroy(): void {
        console.log("PreviewManager: Destroying...");
        if (this.iframe && this.iframe.contentWindow) {
            this.iframe.contentWindow.removeEventListener('scroll', this.handleIframeScroll);
        }
        this.iframe = null;
        this.isReady = false;
        this.currentCSSText = '';
        this.loadedFonts.clear();
        if (this.scrollSyncTimeout) {
            clearTimeout(this.scrollSyncTimeout);
        }
        this.lastScrollSource = null;
        console.log("PreviewManager: Destroyed.");
    }

    updateContent(markdown: string): void {
        this.lastKnownMarkdown = markdown;
        if (!this.isReady || !this.iframe?.contentWindow?.document) {
            return;
        }
        const doc = this.iframe.contentWindow.document;
        const processedHTML = markdownProcessor.process(markdown);
        doc.body.innerHTML = processedHTML;
        console.log("PreviewManager: Content updated.");
    }

    applyCustomCSS(cssContent: string): void {
        console.log("PreviewManager: Applying new custom CSS.");
        if (typeof cssContent !== 'string') {
            console.error("Invalid CSS content");
            return;
        }
        this.currentCSSText = cssContent;
        this.loadedFonts.clear();
        if (this.isReady) {
            this.applyStyles();
            this.updateContent(this.lastKnownMarkdown);
        }
    }

    private applyStyles(): void {
        if (!this.isReady || !this.iframe?.contentWindow?.document) {
            return;
        }
        const doc = this.iframe.contentWindow.document;
        const head = doc.head;

        // Inject/Update CSS
        let styleElement = doc.getElementById('custom-theme-style') as HTMLStyleElement | null;
        if (!styleElement) {
            styleElement = doc.createElement('style');
            styleElement.id = 'custom-theme-style';
            head.appendChild(styleElement);
        }
        if (styleElement.textContent !== this.currentCSSText) {
            styleElement.textContent = this.currentCSSText;
        }

        // Extract and Apply data-theme
        let themeName = "default-theme";
        if (this.currentCSSText) {
            const themeMatch = this.currentCSSText.match(/\/\*\s*Theme:\s*([^*]*?)\s*\*\//);
            if (themeMatch && themeMatch[1]) {
                themeName = themeMatch[1].trim().toLowerCase().replace(/\s+/g, '-');
            }
        }
        doc.documentElement.setAttribute('data-theme', themeName);

        // Extract and Inject Fonts
        this.injectFontsFromCSS(doc, this.currentCSSText);
        console.log(`PreviewManager: Styles applied (Theme: ${themeName}).`);
    }

    private injectFontsFromCSS(doc: Document, cssText: string): void {
        if (!doc || !doc.head || !cssText) {
            return;
        }
        const head = doc.head;
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
                console.log(`PreviewManager: Injected Font: ${fontUrl}`);
            }
        }
    }

    syncScroll(scrollPercentage: number): void {
        if (!this.isReady || !this.iframe?.contentWindow || this.lastScrollSource === 'preview') {
            return;
        }
        this.lastScrollSource = 'editor';
        const doc = this.iframe.contentWindow.document;
        const maxScroll = doc.documentElement.scrollHeight - doc.documentElement.clientHeight;
        const targetScroll = (maxScroll * scrollPercentage) / 100;
        doc.documentElement.scrollTop = targetScroll;
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
        if (this.iframe?.contentWindow) {
            this.iframe.contentWindow.addEventListener('scroll', this.handleIframeScroll);
        }
    }
}

const previewManager = new PreviewManager();
export default previewManager; 