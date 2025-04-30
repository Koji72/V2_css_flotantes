import { default as DOMPurify } from 'dompurify';
import { Config } from 'dompurify';

export class HTMLSanitizer {
  private static instance: HTMLSanitizer;
  private config: Config;

  private constructor() {
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

  public static getInstance(): HTMLSanitizer {
    if (!HTMLSanitizer.instance) {
      HTMLSanitizer.instance = new HTMLSanitizer();
    }
    return HTMLSanitizer.instance;
  }

  public sanitize(html: string): string {
    try {
      const sanitized = DOMPurify.sanitize(html, this.config);
      return String(sanitized);
    } catch (error) {
      console.error('Error sanitizing HTML:', error);
      return html;
    }
  }

  public sanitizeElement(element: HTMLElement): HTMLElement {
    try {
      const sanitizedHTML = this.sanitize(element.innerHTML);
      element.innerHTML = sanitizedHTML;
      return element;
    } catch (error) {
      console.error('Error sanitizing element:', error);
      return element;
    }
  }
} 