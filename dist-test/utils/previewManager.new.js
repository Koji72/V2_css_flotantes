"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewManager = void 0;
// Helper local para escapar HTML si es necesario dentro de esta clase
const escapeHtmlPreview = (unsafe) => {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
class PreviewManager {
    constructor() {
        this.iframe = null;
        this.isReady = false;
        this.currentCSSText = '';
        this.loadedFonts = new Set();
        this.scrollSyncTimeout = null;
        this.lastScrollSource = null;
        this.lastKnownMarkdown = '';
        this.interactionListenersAttached = false;
        this.isProcessing = false;
        this.buttonListeners = new Map();
        this.panelCache = new Map();
        this.iframeLoadListener = null;
        this.initialContentQueue = null;
        this.initialCSSQueue = null;
        if (PreviewManager.instance) {
            throw new Error("Use PreviewManager.getInstance() instead of new.");
        }
        PreviewManager.instance = this;
    }
    static getInstance() {
        if (!PreviewManager.instance) {
            throw new Error("PreviewManager instance not initialized.");
        }
        return PreviewManager.instance;
    }
    // Método para parsear atributos del panel
    parseAttributes(headerLine) {
        const result = {
            styles: [],
            layout: '',
            classes: [],
            animation: '',
            title: ''
        };
        if (!headerLine)
            return result;
        const attributeSections = headerLine.split(/\s+(?=\w+=|\.)/);
        for (const section of attributeSections) {
            const trimmedSection = section.trim();
            if (!trimmedSection)
                continue;
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
    processButtons(content) {
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
    parseButtonAttributes(attrString) {
        const attributes = {};
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
    renderSinglePanelHtml(panelType, headerLine, innerContent) {
        try {
            const attributes = this.parseAttributes(headerLine);
            const processedContent = this.processButtons(innerContent);
            const baseClasses = ['panel', `panel-${panelType}`];
            const styleClasses = attributes.styles.map((style) => `panel-${style}`);
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
        }
        catch (error) {
            console.error('[PreviewManager] Error al renderizar panel:', error);
            return Promise.resolve(`<div class="panel panel-error">Error al renderizar panel: ${escapeHtmlPreview(String(error))}</div>`);
        }
    }
    // Método para configurar los listeners de interacción
    setupInteractionListeners(doc) {
        if (!doc)
            return;
        const buttons = doc.querySelectorAll('.panel-button');
        buttons.forEach(button => {
            const action = button.getAttribute('data-action');
            if (action) {
                const handler = (event) => {
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
    removeInteractionListeners(doc) {
        if (!doc)
            return;
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
exports.PreviewManager = PreviewManager;
PreviewManager.instance = null;
const previewManager = new PreviewManager();
exports.default = previewManager;
