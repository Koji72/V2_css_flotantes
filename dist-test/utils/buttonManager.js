"use strict";
/**
 * Button Manager for Panel System
 * Handles button rendering and interactions in markdown panels
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonManager = void 0;
class ButtonManager {
    constructor() {
        this.buttonElements = new Map();
        this.handlers = new Map();
        // Singleton
    }
    static getInstance() {
        if (!ButtonManager.instance) {
            ButtonManager.instance = new ButtonManager();
        }
        return ButtonManager.instance;
    }
    registerHandler(action, handler) {
        this.handlers.set(action, handler);
    }
    unregisterHandler(action) {
        this.handlers.delete(action);
    }
    parseButtonAttributes(attributeString) {
        const attributes = {}; // Use Partial initially
        const validStyles = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
        const attributeRegex = /([a-zA-Z0-9_-]+)=["']([^"']+)["']/g;
        let match;
        while ((match = attributeRegex.exec(attributeString)) !== null) {
            const [, key, value] = match;
            // Type assertion for keyof ButtonAttributes is okay here if we handle specific cases
            const attrKey = key;
            switch (attrKey) {
                case 'action':
                    attributes.action = value;
                    break;
                case 'style':
                    if (validStyles.includes(value)) {
                        attributes.style = value;
                    }
                    else {
                        console.warn(`[ButtonManager] Invalid style attribute value: '${value}'. Ignoring.`);
                    }
                    break;
                case 'disabled':
                case 'loading':
                    attributes[attrKey] = value === 'true'; // Convert to boolean
                    break;
                case 'aria-label':
                case 'role':
                case 'class':
                case 'custom-style':
                case 'on-click':
                case 'on-custom':
                    attributes[attrKey] = value;
                    break;
                default:
                    // Optional: Warn about unknown attributes
                    // console.warn(`[ButtonManager] Unknown button attribute: ${key}`);
                    break;
            }
        }
        // Ensure required 'action' attribute exists, provide a default or throw error
        if (!attributes.action) {
            console.error("[ButtonManager] Button attribute 'action' is required.");
            attributes.action = 'default-action'; // Provide a default or handle error appropriately
        }
        return attributes; // Cast back to ButtonAttributes after processing
    }
    createButton(attributes) {
        const button = document.createElement('button');
        // Set base class
        button.className = 'panel-button';
        // Add style class if specified and valid
        const validStyles = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
        if (attributes.style && validStyles.includes(attributes.style)) {
            button.classList.add(attributes.style);
        }
        else if (attributes.style) {
            // Warn if the style is provided but not valid
            console.warn(`[ButtonManager] Invalid style '${attributes.style}' provided for button action '${attributes.action}'. Using default style.`);
            // Optionally, add a default style class like 'primary' or no style class
            // button.classList.add('primary'); 
        }
        // Add custom classes if specified
        if (attributes.class) {
            button.classList.add(...attributes.class.split(' '));
        }
        // Set attributes
        button.setAttribute('data-action', attributes.action);
        if (attributes.disabled)
            button.disabled = true;
        if (attributes.loading)
            button.classList.add('loading');
        if (attributes['aria-label'])
            button.setAttribute('aria-label', attributes['aria-label']);
        if (attributes.role)
            button.setAttribute('role', attributes.role);
        if (attributes['custom-style'])
            button.setAttribute('style', attributes['custom-style']);
        // Store button reference
        this.buttonElements.set(attributes.action, button);
        return button;
    }
    setupButtonListeners(button, attributes) {
        // Handle click events
        if (attributes['on-click']) {
            const handler = this.handlers.get(attributes.action);
            if (handler) {
                button.addEventListener('click', (event) => {
                    try {
                        handler(attributes.action, event);
                    }
                    catch (error) {
                        console.error('Error executing button click handler:', error);
                    }
                });
            }
            else {
                console.warn(`No handler registered for action: ${attributes.action}`);
            }
        }
        // Handle custom events
        if (attributes['on-custom']) {
            button.addEventListener('click', () => {
                const event = new CustomEvent(attributes['on-custom'], {
                    detail: { action: attributes.action }
                });
                document.dispatchEvent(event);
            });
        }
        // Default action handler
        if (!attributes['on-click'] && !attributes['on-custom']) {
            const defaultHandler = this.handlers.get('default');
            if (defaultHandler) {
                button.addEventListener('click', (event) => {
                    defaultHandler(attributes.action, event);
                });
            }
        }
    }
    removeButtonListeners(action) {
        const button = this.buttonElements.get(action);
        if (button) {
            const newButton = button.cloneNode(true);
            button.parentNode?.replaceChild(newButton, button);
            this.buttonElements.set(action, newButton);
        }
    }
    setLoading(action, isLoading) {
        const button = this.buttonElements.get(action);
        if (button) {
            if (isLoading) {
                button.classList.add('loading');
                button.disabled = true;
            }
            else {
                button.classList.remove('loading');
                button.disabled = false;
            }
        }
    }
    setDisabled(action, isDisabled) {
        const button = this.buttonElements.get(action);
        if (button) {
            button.disabled = isDisabled;
        }
    }
}
exports.ButtonManager = ButtonManager;
