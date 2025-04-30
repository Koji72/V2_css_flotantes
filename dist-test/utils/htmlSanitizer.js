"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLSanitizer = void 0;
const dompurify_1 = __importDefault(require("dompurify"));
class HTMLSanitizer {
    constructor() {
        this.config = {
            ALLOWED_TAGS: [
                'b', 'i', 'em', 'strong', 'a', 'p', 'div', 'span', 'ul', 'ol', 'li',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr',
                'th', 'td', 'img', 'br', 'hr', 'blockquote', 'pre', 'code', 'section',
                'article', 'header', 'footer', 'nav', 'aside', 'figure', 'figcaption'
            ],
            ALLOWED_ATTR: [
                'href', 'target', 'class', 'style', 'id', 'src', 'alt', 'title',
                'width', 'height', 'data-*', 'aria-*', 'role'
            ],
            FORBID_TAGS: ['script', 'iframe', 'object', 'embed'],
            FORBID_ATTR: ['onclick', 'onload', 'onerror', 'onmouseover'],
            ADD_ATTR: ['target'],
            ADD_TAGS: ['section', 'article', 'header', 'footer', 'nav', 'aside', 'figure', 'figcaption'],
            WHOLE_DOCUMENT: true,
            SANITIZE_DOM: true,
            KEEP_CONTENT: true,
            RETURN_TRUSTED_TYPE: false
        };
    }
    static getInstance() {
        if (!HTMLSanitizer.instance) {
            HTMLSanitizer.instance = new HTMLSanitizer();
        }
        return HTMLSanitizer.instance;
    }
    sanitize(html) {
        try {
            const sanitized = dompurify_1.default.sanitize(html, this.config);
            return String(sanitized);
        }
        catch (error) {
            console.error('Error sanitizing HTML:', error);
            return html;
        }
    }
    sanitizeElement(element) {
        try {
            const sanitizedHTML = this.sanitize(element.innerHTML);
            element.innerHTML = sanitizedHTML;
            return element;
        }
        catch (error) {
            console.error('Error sanitizing element:', error);
            return element;
        }
    }
}
exports.HTMLSanitizer = HTMLSanitizer;
