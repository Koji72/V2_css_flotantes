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
  private currentTemplateId: string = 'lv426-distress-signal'; // Default ID
  private currentTemplate: Template | null = null;

  // Singleton pattern
  private constructor() {
    this.secureStorage = SecureStorage.getInstance();
    this.loadStoredPreferences();
  }

  public static getInstance(): TemplateManager {
    if (!TemplateManager.instance) {
      TemplateManager.instance = new TemplateManager();
    }
    return TemplateManager.instance;
  }

  public getCurrentTemplateId(): string {
    // Attempt to load from localStorage first on instantiation?
    const storedId = localStorage.getItem('currentTemplateId'); // Use a dedicated key for ID
    if (storedId) {
      this.currentTemplateId = storedId;
    } 
    // else it keeps the default set in the class property
    return this.currentTemplateId;
  }

  public setCurrentTemplateId(templateId: string): void {
    if (templateId !== this.currentTemplateId) {
        console.log(`[TemplateManager] Setting current template ID to: ${templateId}`);
    this.currentTemplateId = templateId;
        localStorage.setItem('currentTemplateId', templateId); // Use dedicated key
    } else {
        console.log(`[TemplateManager] Template ID already set to: ${templateId}`);
    }
  }

  public async fetchTemplateContent(templateId: string): Promise<string> {
    console.log(`[TemplateManager] Fetching content for template: ${templateId}`);
    // Ensure the path starts correctly for fetch (relative to public root)
    const templatePath = `/templates/${templateId}.css`;
    try {
      // Add timestamp to potentially bust browser cache during development
      const response = await fetch(`${templatePath}?t=${Date.now()}`); 
      if (!response.ok) {
        throw new Error(`Failed to fetch template CSS from ${templatePath}: ${response.status} ${response.statusText}`);
      }
      const cssContent = await response.text();
      console.log(`[TemplateManager] Fetched CSS for ${templateId} (length: ${cssContent.length})`);
      return cssContent;
    } catch (error) {
      console.error(`Error fetching template content for ${templateId}:`, error);
      // Re-throw the error so the caller (App.tsx) can handle it (e.g., show toast, fallback)
      throw error; 
      }
    }

  public applyTemplateCSS(iframe: HTMLIFrameElement, css: string): void {
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
    console.log(`[TemplateManager] Applying CSS (length: ${css.length}) to iframe.`); // Add log
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

  public getAvailableTemplates(): { id: string, name: string }[] {
    const templateFiles = (import.meta as any).glob('/public/templates/*.css', { eager: false });

    const templateOptions = Object.keys(templateFiles).map(path => {
      const filename = path.split('/').pop() || '';
      const id = filename.replace('.css', '');
      const name = id
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { id, name };
    });

    templateOptions.sort((a, b) => a.name.localeCompare(b.name));
    return templateOptions;
  }

  public getTemplateNameById(templateId: string): string {
      return templateId
        .replace(/[-_]/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
  }

  private loadStoredPreferences(): void {
    try {
      // Load only the ID
      const storedTemplateId = localStorage.getItem('currentTemplateId');
      if (storedTemplateId) {
        console.log(`[TemplateManager] Loaded stored template ID: ${storedTemplateId}`);
        this.currentTemplateId = storedTemplateId;
      } else {
          console.log(`[TemplateManager] No stored template ID found, using default: ${this.currentTemplateId}`);
      }
      // Remove old theme object storage if it exists
      if (localStorage.getItem('currentTemplate')) {
          localStorage.removeItem('currentTemplate');
          console.log('[TemplateManager] Removed obsolete stored theme object.');
      }
    } catch (error) {
      console.error('Error loading stored template ID:', error);
    }
  }

  public getVisualStyleDetail(styleId: string): PanelStyleDetail | undefined {
    return styleThemesData.styleDetails.find(detail => detail.id === styleId);
  }

  public getVisualStylesForTemplate(templateId: string): PanelStyleDetail[] {
    const themeStyles = styleThemesData.themes[templateId] || [];
    const details = styleThemesData.styleDetails;
    
    const relevantStyles = details.filter(detail => themeStyles.includes(detail.id));
    
    // Añadir siempre estilos semánticos básicos si no están ya definidos por el tema
    const basicSemanticIds = ['note', 'warning', 'success', 'danger', 'info', 'muted'];
    basicSemanticIds.forEach(id => {
      if (!relevantStyles.some(style => style.id === id)) {
        const basicDetail = details.find(d => d.id === id);
        if (basicDetail) {
          relevantStyles.push(basicDetail);
        }
      }
    });
    
    // Ordenar alfabéticamente por nombre
    relevantStyles.sort((a, b) => a.name.localeCompare(b.name));
    
    // console.log(`Available visual styles for ${templateId}:`, relevantStyles);
    return relevantStyles;
  }

  public applyTemplateStyles(): void {
    if (!this.currentTemplate) return;

    const styleElement = document.createElement('style');
    styleElement.id = 'template-styles';
    
    styleElement.textContent = `
      /* Estilos base del template */
      .preview-html {
        --template-bg: ${this.currentTemplate.colors.background};
        --template-text: ${this.currentTemplate.colors.text};
        --template-accent: ${this.currentTemplate.colors.accent};
      }

      .preview-html {
        background-color: var(--template-bg);
        color: var(--template-text);
      }

      /* Estilos específicos del template */
      .preview-html ${this.currentTemplate.styles}
    `;

    // Eliminar estilos anteriores si existen
    const oldStyles = document.getElementById('template-styles');
    if (oldStyles) {
      oldStyles.remove();
    }

    // Agregar nuevos estilos
    document.head.appendChild(styleElement);
  }
} 