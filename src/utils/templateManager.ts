/**
 * Template Manager handles loading, storing, and applying CSS templates
 * with fallback mechanisms to ensure templates always work
 */
import { SecureStorage } from './secureStorage';
import { Template, templates } from '../types/templates';
import panelStyleThemes from '../data/panelStyleThemes.json';

interface PanelStyleDetail {
  id: string;
  name: string;
}

interface PanelStyleThemesData {
  themes: Record<string, string[]>;
  styleDetails: PanelStyleDetail[];
}

// Type assertion for the imported JSON
const styleThemesData = panelStyleThemes as PanelStyleThemesData;

export class TemplateManager {
  private static instance: TemplateManager;
  private secureStorage: SecureStorage;
  private currentTemplate: Template | null = null;
  private templates: Map<string, Template> = new Map();
  private currentTemplateId: string = 'purple_neon_grid';
  private embeddedTemplates: { [key: string]: string } = {};

  // Singleton pattern
  private constructor() {
    this.secureStorage = SecureStorage.getInstance();
    this.initEmbeddedTemplates();
    this.loadStoredPreferences();
    this.initializeTemplates();
  }

  private initializeTemplates(): void {
    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  public static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  /**
   * Gets the current template ID
   */
  public getCurrentTemplateId(): string {
    return this.currentTemplateId;
  }

  /**
   * Sets the current template ID and stores it in localStorage
   */
  public setCurrentTemplateId(templateId: string): void {
    this.currentTemplateId = templateId;
    localStorage.setItem('currentTemplate', templateId);
  }

  /**
   * Loads a template by ID, first trying external files, then fallbacks
   */
  public async loadTemplate(templateId: string): Promise<void> {
    try {
      const template = this.templates.get(templateId);
      if (!template) {
        throw new Error(`Template not found: ${templateId}`);
      }

      const response = await fetch(template.path);
      if (!response.ok) {
        throw new Error(`Failed to load template: ${response.statusText}`);
      }

      const cssContent = await response.text();
      template.styles = cssContent;
      this.setCurrentTemplate(template);

    } catch (error) {
      console.error('Error loading template:', error);
      // Fallback to default template
      const defaultTemplate = this.templates.get('default');
      if (defaultTemplate) {
        this.setCurrentTemplate(defaultTemplate);
      }
    }
  }

  /**
   * Apply CSS content to the iframe
   */
  private applyTemplateCSS(iframe: HTMLIFrameElement, css: string): void {
    if (!iframe || !iframe.contentDocument) {
      console.error('No se puede aplicar CSS: iframe o documento no disponible');
      return;
    }

    const iframeDoc = iframe.contentDocument;
    
    // Buscar o crear el elemento <style> para el template
    let styleElement = iframeDoc.getElementById('template-styles');
    if (!styleElement) {
      styleElement = iframeDoc.createElement('style');
      styleElement.id = 'template-styles';
      iframeDoc.head.appendChild(styleElement);
    }
    
    // Actualizar el CSS
    styleElement.textContent = css;
    
    // Añadir fix para visibilidad de texto
    let visibilityFixStyle = iframeDoc.getElementById('text-visibility-fix');
    if (!visibilityFixStyle) {
      visibilityFixStyle = iframeDoc.createElement('style');
      visibilityFixStyle.id = 'text-visibility-fix';
      iframeDoc.head.appendChild(visibilityFixStyle);
      
      // Añadir reglas específicas para forzar la visibilidad del texto
      visibilityFixStyle.textContent = `
        /* Fix de emergencia para garantizar visibilidad del texto */
        .panel *, .mixed-panel * {
          position: relative !important;
          z-index: 99 !important;
          visibility: visible !important;
          opacity: 1 !important;
        }
        
        .panel p, .panel li, .panel a, .panel h3, .panel h4, .panel div,
        .mixed-panel p, .mixed-panel li, .mixed-panel a, .mixed-panel h3, .mixed-panel h4, .mixed-panel div {
          color: inherit !important;
          visibility: visible !important;
          position: relative !important;
          z-index: 100 !important;
        }
        
        .panel::before, .panel::after,
        .mixed-panel::before, .mixed-panel::after {
          z-index: -1 !important;
          pointer-events: none !important;
        }
        
        /* Tipos de panel específicos con problemas */
        .panel-style--reality-glitch *, 
        .panel-style--void-touched *,
        .panel-style--crystal-matrix *,
        .panel-style--nanite-construct *,
        .panel-style--scanline-terminal * {
          color: inherit !important;
          visibility: visible !important;
          opacity: 1 !important;
          z-index: 999 !important;
        }
      `;
    }
  }

  /**
   * Gets all available template options dynamically by reading the public/templates directory
   */
  public getAvailableTemplates(): { id: string, name: string }[] {
    // Use import.meta.glob to get all .css files in the templates directory
    // Use type assertion to bypass TypeScript linter error if vite types are not recognized
    const templateFiles = (import.meta as any).glob('/public/templates/*.css', { eager: false });

    const templateOptions = Object.keys(templateFiles).map(path => {
      const filename = path.split('/').pop() || '';
      const id = filename.replace('.css', '');
      const name = id
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { id, name };
    });

    templateOptions.sort((a, b) => a.name.localeCompare(b.name));
    console.log("Dynamically loaded templates:", templateOptions);
    return templateOptions;
  }

  /**
   * Attempts to load a template from various possible file paths
   */
  private async loadFromFiles(filePath: string): Promise<string> {
    try {
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load CSS file ${filePath}: ${response.status} ${response.statusText}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Error loading CSS file ${filePath}:`, error);
      throw error;
    }
  }

  private loadStoredPreferences(): void {
    try {
      const storedTemplate = this.secureStorage.get('currentTemplate');
      if (storedTemplate) {
        this.currentTemplate = JSON.parse(storedTemplate);
      }
    } catch (error) {
      console.error('Error loading stored template:', error);
    }
  }

  public setCurrentTemplate(template: Template): void {
    this.currentTemplate = template;
    try {
      this.secureStorage.set('currentTemplate', JSON.stringify(template));
    } catch (error) {
      console.error('Error storing template:', error);
    }
  }

  public getCurrentTemplate(): Template | null {
    return this.currentTemplate;
  }

  /**
   * Initializes the embedded templates as fallbacks
   */
  private initEmbeddedTemplates(): void {
    this.embeddedTemplates = {
      default: `
        /* Default embedded template */
        body { 
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #fff;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        h1, h2, h3 {
          color: #1e90ff;
          font-weight: 600;
        }
        
        h1 {
          font-size: 28px;
          border-bottom: 2px solid #1e90ff;
          padding-bottom: 5px;
        }
        
        h2 {
          font-size: 24px;
          margin-top: 20px;
        }
        
        h3 {
          font-size: 18px;
          margin-top: 15px;
        }
        
        .panel-header {
          margin-bottom: 10px;
          padding-bottom: 5px;
          border-bottom: 2px solid #1e90ff;
          display: flex;
          align-items: center;
        }
        
        .data-matrix {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        
        .data-matrix th {
          text-align: left;
          padding: 10px;
          background-color: #f0f8ff;
          border-bottom: 2px solid #1e90ff;
          color: #1e90ff;
        }
        
        .data-matrix td {
          text-align: left;
          padding: 8px 10px;
          border-bottom: 1px solid #ddd;
        }
        
        .note-block {
          background-color: #f0f8ff;
          border-left: 4px solid #1e90ff;
          padding: 10px 15px;
          margin: 15px 0;
        }
        
        .status-error { color: #d9534f; font-weight: bold; }
        .status-warn { color: #f0ad4e; font-weight: bold; }
        .status-ok { color: #5cb85c; font-weight: bold; }
        .status-neutral { color: #5bc0de; font-style: italic; }
        
        .mixed-panel {
          border: 1px solid #ddd;
          border-radius: 4px;
          margin-bottom: 20px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .panel-content { padding: 10px 15px; }
      `,
      cyberpunk: `
        /* Cyberpunk embedded template */
        body {
          font-family: 'Share Tech Mono', monospace;
          line-height: 1.6;
          color: #defff2;
          background-color: #0d0221;
          padding: 20px;
          text-shadow: 0 0 5px rgba(0, 242, 255, 0.2);
          background-image: linear-gradient(0deg, rgba(0, 242, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        h1, h2, h3 {
          font-family: 'Orbitron', sans-serif;
          color: #ff00a0;
          text-transform: uppercase;
          letter-spacing: 1px;
          text-shadow: 0 0 5px #ff00a0, 0 0 10px rgba(255, 0, 160, 0.5);
        }
        
        h1 {
          font-size: 2.5rem;
          border-bottom: 1px solid #ff00a0;
        }
        
        h2 {
          font-size: 2rem;
        }
        
        h3 {
          font-size: 1.75rem;
        }
        
        .mixed-panel {
          border: 1px solid #ff00a0;
          border-radius: 0;
          background-color: rgba(13, 2, 33, 0.9);
          margin-bottom: 25px;
          box-shadow: 0 0 10px rgba(255, 0, 160, 0.5), 0 0 20px rgba(49, 8, 123, 0.3);
          position: relative;
        }
        
        .panel-header {
          padding: 15px 20px;
          background-color: rgba(49, 8, 123, 0.5);
          border-bottom: 1px solid #ff00a0;
        }
        
        .data-matrix {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-family: 'Share Tech Mono', monospace;
        }
        
        .data-matrix th {
          background-color: rgba(49, 8, 123, 0.5);
          color: #00f2ff;
          padding: 12px 15px;
          border-bottom: 2px solid #ff00a0;
          letter-spacing: 1px;
          text-transform: uppercase;
        }
        
        .status-ok { color: #00ff9d; text-shadow: 0 0 5px #00ff9d; }
        .status-warn { color: #ffef00; text-shadow: 0 0 5px #ffef00; }
        .status-error { color: #ff0057; text-shadow: 0 0 5px #ff0057; }
        .status-neutral { color: #8d86c9; }
      `,
      corporate: `
        /* Corporate embedded template */
        body {
          font-family: 'Inter', sans-serif;
          line-height: 1.7;
          color: #2c3e50;
          background-color: #ffffff;
          margin: 0;
          padding: 30px;
          font-size: 15px;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: #1e3a8a;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
          line-height: 1.3;
        }
        
        h1 {
          font-size: 2.2rem;
          letter-spacing: -0.03em;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.3em;
        }
        
        .mixed-panel {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background-color: white;
          margin-bottom: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .panel-header {
          padding: 16px 20px;
          background-color: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .data-matrix {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 24px;
          font-size: 0.95rem;
        }
        
        .data-matrix th {
          background-color: #f8fafc;
          color: #1e3a8a;
          font-weight: 600;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .status-ok { color: #10b981; font-weight: 500; }
        .status-warn { color: #f59e0b; font-weight: 500; }
        .status-error { color: #ef4444; font-weight: 500; }
        .status-neutral { color: #64748b; }
      `,
      minimalist: `
        /* Minimalist embedded template */
        body {
          font-family: 'Work Sans', sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #ffffff;
          margin: 0;
          padding: 40px;
          font-size: 16px;
          font-weight: 300;
          max-width: 980px;
          margin: 0 auto;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: #000000;
          margin-top: 1.8em;
          margin-bottom: 0.7em;
          font-weight: 500;
          line-height: 1.2;
        }
        
        h1 {
          font-size: 2.2rem;
          letter-spacing: -0.03em;
          font-weight: 600;
        }
        
        .mixed-panel {
          border: 1px solid #ececec;
          border-radius: 4px;
          background-color: white;
          margin-bottom: 30px;
        }
        
        .panel-header {
          padding: 16px 20px;
          background-color: #fafafa;
          border-bottom: 1px solid #ececec;
        }
        
        .data-matrix {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }
        
        .data-matrix th {
          background-color: #fafafa;
          color: #000000;
          font-weight: 500;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid #ececec;
        }
        
        .status-ok { color: #63a375; }
        .status-warn { color: #e3aa75; }
        .status-error { color: #d16b6b; }
        .status-neutral { color: #a0a0a0; }
      `,
      modern: `
        /* Modern embedded template */
        body {
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
          line-height: 1.7;
          color: #1f2937;
          background-color: #ffffff;
          margin: 0;
          padding: 2rem;
          font-size: 16px;
          font-weight: 400;
          max-width: 1024px;
          margin: 0 auto;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: #111827;
          margin-top: 2em;
          margin-bottom: 0.8em;
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: -0.025em;
        }
        
        h1 {
          font-size: 2.25rem;
          margin-top: 0;
        }
        
        .mixed-panel {
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background-color: white;
          margin-bottom: 2rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        
        .mixed-panel:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .panel-header {
          padding: 1rem 1.25rem;
          background-color: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .data-matrix {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 1.5rem;
          font-size: 0.9375rem;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        .data-matrix th {
          background-color: #f9fafb;
          color: #111827;
          font-weight: 500;
          text-align: left;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .status-ok { 
          color: #10b981;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
        }
        
        .status-ok:before {
          content: "";
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #10b981;
          margin-right: 6px;
        }
        
        .status-warn { 
          color: #f59e0b;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
        }
        
        .status-error { 
          color: #ef4444;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
        }
        
        .status-neutral { 
          color: #6b7280;
          display: inline-flex;
          align-items: center;
          font-weight: 500;
        }
      `
    };
  }

  public applyTemplateStyles(): void {
    if (!this.currentTemplate) return;

    const styleElement = document.createElement('style');
    styleElement.id = 'template-styles';
    
    styleElement.textContent = `
      /* Estilos base del template */
      :root {
        --template-bg: ${this.currentTemplate.colors.background};
        --template-text: ${this.currentTemplate.colors.text};
        --template-accent: ${this.currentTemplate.colors.accent};
      }

      body {
        background-color: var(--template-bg);
        color: var(--template-text);
      }

      /* Estilos específicos del template */
      ${this.currentTemplate.styles}
    `;

    // Eliminar estilos anteriores si existen
    const oldStyles = document.getElementById('template-styles');
    if (oldStyles) {
      oldStyles.remove();
    }

    // Agregar nuevos estilos
    document.head.appendChild(styleElement);
  }

  public removeTemplateStyles(): void {
    const styleElement = document.getElementById('template-styles');
    if (styleElement) {
      styleElement.remove();
    }
  }

  public destroy(): void {
    this.removeTemplateStyles();
    this.currentTemplate = null;
  }

  // --- New methods for visual styles ---

  /**
   * Gets the details (id, name) for a specific visual style id.
   */
  public getVisualStyleDetail(styleId: string): PanelStyleDetail | undefined {
    return styleThemesData.styleDetails.find(style => style.id === styleId);
  }

  /**
   * Gets the list of available visual styles filtered for the given template ID.
   * Includes theme-specific styles and 'other' styles.
   * @param templateId The ID of the currently active template (e.g., 'lv426-distress-signal').
   * @returns An array of {id, name} for the available visual styles.
   */
  public getVisualStylesForTemplate(templateId: string): PanelStyleDetail[] {
    const themeStyles = styleThemesData.themes[templateId] || [];
    const otherStyles = styleThemesData.themes['other'] || [];
    const combinedStyleIds = new Set([...themeStyles, ...otherStyles]);

    // Get the full details (id, name) for the combined list
    const availableStyles = styleThemesData.styleDetails.filter(style =>
      combinedStyleIds.has(style.id)
    );

    // Optional: Sort alphabetically by name?
    availableStyles.sort((a, b) => a.name.localeCompare(b.name));

    // Add a default/none option
    return [{ id: '', name: 'None' }, ...availableStyles]; 
  }
} 