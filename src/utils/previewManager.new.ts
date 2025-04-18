import { marked } from 'marked';
import { MarkdownProcessor } from './markdownProcessor';
import { useStore } from '../store';
import { setupButtonInteractions, cleanupButtonInteractions } from './markdownDirectives';

// Helper local para escapar HTML si es necesario dentro de esta clase
const escapeHtmlPreview = (unsafe: string): string => {
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
    title?: string;
}

interface PanelAttributes {
    id?: string;
    class?: string;
    layout?: string;
    width?: string;
    animation?: string;
    title?: string;
    type?: string;
}

interface ButtonAttributes {
    style?: string;
    action?: string;
}

export class PreviewManager {
    private static instance: PreviewManager | null = null;
    private iframe: HTMLIFrameElement | null = null;
    public isReady: boolean = false;
    private currentCSSText: string = '';
    private loadedFonts: Set<string> = new Set();
    private scrollSyncTimeout: number | null = null;
    private lastScrollSource: 'editor' | 'preview' | null = null;
    private lastKnownMarkdown: string = '';
    private interactionListenersAttached: boolean = false;
    private isProcessing: boolean = false;
    private buttonListeners: Map<string, (event: Event) => void> = new Map();
    private panelCache: Map<string, string> = new Map();
    private iframeLoadListener: (() => void) | null = null;
    private initialContentQueue: string | null = null;
    private initialCSSQueue: string | null = null;

    constructor() {
        if (PreviewManager.instance) {
            throw new Error("Use PreviewManager.getInstance() instead of new.");
        }
        PreviewManager.instance = this;
    }

    static getInstance(): PreviewManager {
        if (!PreviewManager.instance) {
            throw new Error("PreviewManager instance not initialized.");
        }
        return PreviewManager.instance;
    }

    // Método para parsear atributos del panel
    private parseAttributes(headerLine: string): PanelStyles {
        const result: PanelStyles = {
            styles: [],
            layout: '',
            classes: [],
            animation: '',
            title: ''
        };

        if (!headerLine) return result;

        const attributeSections = headerLine.split(/\s+(?=\w+=|\.)/);
        
        for (const section of attributeSections) {
            const trimmedSection = section.trim();
            if (!trimmedSection) continue;

            if (!trimmedSection.includes('=') && !trimmedSection.includes(' ')) {
                if (!result.styles.includes(trimmedSection.toLowerCase())) {
                    result.styles.push(trimmedSection.toLowerCase());
                }
                continue;
            }

            const attributeRegex = /([a-zA-Z0-9_-]+)=([^"\s}]+|"[^"]*")/g;
            let foundInRegex = false;
            let match;
            
            while ((match = attributeRegex.exec(trimmedSection)) !== null) {
                foundInRegex = true;
                const key = match[1].toLowerCase();
                const value = match[2].replace(/^"|"$/g, '');
                
                switch (key) {
                    case 'layout':
                    case 'l':
                        result.layout = value.toLowerCase();
                        break;
                    case 'animation':
                    case 'a':
                        result.animation = value.toLowerCase();
                        break;
                    case 'title':
                    case 't':
                        result.title = value;
                        break;
                    default:
                        if (!result.styles.includes(value.toLowerCase())) {
                            result.styles.push(value.toLowerCase());
                        }
                }
            }
            
            if (!foundInRegex && trimmedSection) {
                if (!trimmedSection.includes('=')) {
                    if (!result.styles.includes(trimmedSection.toLowerCase())) {
                        result.styles.push(trimmedSection.toLowerCase());
                    }
                }
            }
        }

        return result;
    }

    // Método para procesar botones en el contenido
    private processButtons(content: string): string {
        const buttonRegex = /::button{([^}]*)}([^:]*)::/g;
        return content.replace(buttonRegex, (match, attributes, text) => {
            const buttonAttrs = this.parseButtonAttributes(attributes);
            const buttonId = `btn-${Math.random().toString(36).substring(2, 10)}`;
            const style = buttonAttrs.style || 'primary';
            const action = buttonAttrs.action || '';
            
            return `<button id="${buttonId}" class="panel-button panel-button-${style}" data-action="${action}">${text}</button>`;
        });
    }

    // Método para parsear atributos de botones
    private parseButtonAttributes(attrString: string): ButtonAttributes {
        const attributes: ButtonAttributes = {};
        const attrRegex = /(\w+)=["']([^"']+)["']/g;
        let match;

        while ((match = attrRegex.exec(attrString)) !== null) {
            const [, key, value] = match;
            if (key === 'style' || key === 'action') {
                attributes[key] = value;
            }
        }

        return attributes;
    }

    // Método para renderizar el contenido de un panel
    private renderSinglePanelHtml(panelType: string, headerLine: string, innerContent: string): Promise<string> {
        try {
            const attributes = this.parseAttributes(headerLine);
            const processedContent = this.processButtons(innerContent);

            const baseClasses = ['panel', `panel-${panelType}`];
            const styleClasses = attributes.styles.map((style: string) => `panel-${style}`);
            const layoutClass = attributes.layout ? `panel-layout-${attributes.layout}` : '';
            const animationClass = attributes.animation ? `panel-animation-${attributes.animation}` : '';

            const combinedClasses = [...baseClasses, ...styleClasses, layoutClass, animationClass, ...attributes.classes]
                .filter(Boolean)
                .join(' ');

            const dataAttrs = Object.entries(attributes)
                .filter(([key]) => !['styles', 'layout', 'classes', 'animation'].includes(key))
                .map(([key, value]) => `data-${key}="${value}"`)
                .join(' ');

            const headerHtml = headerLine ? `<div class="panel-header">${headerLine}</div>` : '';
            const ariaLabel = attributes.title ? ` aria-label="${attributes.title}"` : '';

            const outputHtml = `<section class="${combinedClasses}" ${dataAttrs}${ariaLabel}>
<div class="corner-decoration top-left"></div>
<div class="corner-decoration top-right"></div>
<div class="corner-decoration bottom-left"></div>
<div class="corner-decoration bottom-right"></div>
${headerHtml}
<div class="panel-content-wrapper">
    <div class="panel-content">
${processedContent}
    </div>
</div>
${animationClass ? `<div class="animation-overlay ${attributes.animation}-effect"></div>` : ''}
</section>\n`;

            return Promise.resolve(outputHtml);
        } catch (error) {
            console.error('[PreviewManager] Error al renderizar panel:', error);
            return Promise.resolve(`<div class="panel panel-error">Error al renderizar panel: ${escapeHtmlPreview(String(error))}</div>`);
        }
    }

    // Método para configurar los listeners de interacción
    private setupInteractionListeners(doc: Document): void {
        if (!doc) return;

        const buttons = doc.querySelectorAll('.panel-button');
        buttons.forEach(button => {
            const action = button.getAttribute('data-action');
            if (action) {
                const handler = (event: Event) => {
                    event.preventDefault();
                    const customEvent = new CustomEvent('panelButtonClick', {
                        detail: { action, button }
                    });
                    doc.dispatchEvent(customEvent);
                };
                button.addEventListener('click', handler);
                this.buttonListeners.set(button.id, handler);
            }
        });

        this.interactionListenersAttached = true;
    }

    // Método para eliminar los listeners de interacción
    private removeInteractionListeners(doc: Document): void {
        if (!doc) return;

        const buttons = doc.querySelectorAll('.panel-button');
        buttons.forEach(button => {
            const handler = this.buttonListeners.get(button.id);
            if (handler) {
                button.removeEventListener('click', handler);
                this.buttonListeners.delete(button.id);
            }
        });

        this.interactionListenersAttached = false;
    }
}

const previewManager = new PreviewManager();
export default previewManager; 