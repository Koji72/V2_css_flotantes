/**
 * Panel Manager for Floating Blocks System
 * Handles panel rendering and interactions in markdown content
 */

import { ButtonManager, ButtonAttributes } from './buttonManager';
import { handleButtonClick } from './buttonHandler';

// Helper local para escapar HTML si es necesario dentro de esta clase
const escapeHtmlPreview = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 };

export interface PanelAttributes {
  style?: string;
  class?: string;
  'custom-style'?: string;
}

export class PanelManager {
  private static instance: PanelManager;
  private buttonManager!: ButtonManager;
  private themeObserver!: MutationObserver;
  private panels: Map<string, HTMLElement> = new Map();

  constructor() {
    if (PanelManager.instance) {
      return PanelManager.instance;
    }
    PanelManager.instance = this;
    this.buttonManager = ButtonManager.getInstance();
    this.themeObserver = new MutationObserver(this.handleThemeChange.bind(this));
    console.log('[PanelManager] Constructor initialized with ButtonManager:', this.buttonManager); // DEBUG
  }

  public static getInstance(): PanelManager {
    if (!PanelManager.instance) {
      PanelManager.instance = new PanelManager();
    }
    return PanelManager.instance;
  }

  public initialize(): void {
    // Observar cambios en el tema
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });

    // Aplicar estilos iniciales a los paneles existentes
    this.updatePanelStyles();
  }

  public destroy(): void {
    this.themeObserver.disconnect();
    this.panels.clear();
  }

  private handleThemeChange(mutations: MutationRecord[]): void {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        this.updatePanelStyles();
      }
    });
  }

  private updatePanelStyles(): void {
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    this.panels.forEach(panel => {
      this.applyDynamicStyles(panel, isDarkMode);
    });
  }

  private applyDynamicStyles(panel: HTMLElement, isDarkMode: boolean): void {
    // Style the header if it exists
    const header = panel.querySelector('.panel-header') as HTMLElement;
    if (header) {
      // We can keep styling the header directly if needed, 
      // or rely on CSS variables within the .panel-header rule.
      // For now, let's keep it to see if it was intended.
      header.style.backgroundColor = isDarkMode 
        ? 'var(--panel-header-bg-dark, var(--bg-tertiary-dark))'
        : 'var(--panel-header-bg, var(--bg-tertiary))';
    }

    // --- REMOVED --- 
    // Do NOT set inline styles for the main panel's background/border here.
    // Let the CSS classes (.panel, .glass, .cut-corner) and the 
    // [data-theme="dark"] rules handle this based on the :root variables.
    /*
    panel.style.backgroundColor = isDarkMode
      ? 'var(--panel-bg-dark, var(--bg-secondary-dark))'
      : 'var(--panel-bg, var(--bg-secondary))';
    
    panel.style.borderColor = isDarkMode
      ? 'var(--panel-border-dark, var(--border-color-dark))'
      : 'var(--panel-border, var(--border-color))';
    */
    // --- END REMOVED ---
  }

  public createPanel(attributes: PanelAttributes): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'floating-block panel';
    
    // Añadir clases base desde el atributo 'class'
    if (attributes.class) {
      // Asegurarse de que solo se añaden tokens válidos
      attributes.class.split(' ').forEach(cls => {
        if (cls) { // Evitar añadir strings vacíos
          panel.classList.add(cls.trim());
        }
      });
    }
    
    // Añadir estilo específico si se proporciona, asegurándose de que sea un token válido
    if (attributes.style) {
      const styleValue = attributes.style.trim();
      // Verificar si el estilo contiene espacios
      if (styleValue.includes(' ')) {
        console.warn(`[PanelManager] Invalid multi-word style detected: '${styleValue}'. Only the first word will be used as style class. Use the 'class' attribute for multiple classes.`);
        // Usar solo la primera palabra como clase de estilo
        const firstWord = styleValue.split(' ')[0];
        if (firstWord) { // Asegurarse de que la primera palabra no esté vacía
            // Modificado: Añadir prefijo 'panel-' a la clase derivada del estilo
            panel.classList.add(`panel-${firstWord}`); 
        }
      } else if (styleValue) {
        // Si es un solo token válido, añadirlo con el prefijo 'panel-'
        // Excepción: el estilo 'basic' no necesita prefijo o se maneja de otra forma?
        // Por ahora, añadimos prefijo a todos, pero podría necesitar ajuste.
        // Si 'basic' no tiene una clase .panel-basic, podríamos necesitar lógica condicional.
        // UPDATE: Decidimos PREFIJAR siempre para consistencia, excepto quizás 'basic'.
        // UPDATE 2: Revisando App.css, no hay .panel-basic. No añadiremos clase para 'basic'.
        // UPDATE 3: Revisando PanelDemo, 'basic' no pasa clases especiales. Ok.
        // UPDATE 4: Revisando App.css de nuevo, hay .panel-glass, .panel-cut-corners, .panel-grid.
        //           'pattern-grid' de PanelDemo debe mapear a '.panel-grid'. 
        //           El prefijo `panel-` debe aplicarse a 'glass', 'cut-corners', y 'grid' (quitando 'pattern-').
        
        // Lógica actualizada: Mapear style a clase CSS correcta
        let cssClass = '';
        switch(styleValue) {
          case 'glass':
            cssClass = 'panel-glass';
            break;
          case 'cut-corner':
            cssClass = 'panel-cut-corners'; // CSS usa plural
            break;
          case 'pattern-grid': // Desde PanelDemo
            cssClass = 'panel-grid'; // Hacia App.css
            break;
          case 'basic':
          default:
            // No añadir clase específica para 'basic' o default, 
            // ya que la clase base 'panel' ya existe.
            break;
        }
        if (cssClass) {
            panel.classList.add(cssClass);
        }
      }
    }
    
    // Aplicar estilos personalizados si se proporcionan
    if (attributes['custom-style']) {
      try {
        const customStyles = JSON.parse(attributes['custom-style']);
        Object.entries(customStyles).forEach(([key, value]) => {
          panel.style.setProperty(key, value as string);
        });
      } catch (error) {
        console.error('Error al aplicar estilos personalizados:', error);
      }
    }

    // Generar ID único para el panel
    const panelId = `panel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    panel.id = panelId;
    
    // Almacenar referencia al panel
    this.panels.set(panelId, panel);
    
    // Aplicar estilos dinámicos iniciales
    this.applyDynamicStyles(panel, document.documentElement.getAttribute('data-theme') === 'dark');
    
    return panel;
  }

  public processButtonSyntax(content: string): string {
    console.log('[PanelManager.processButtonSyntax] Processing content:', content); // DEBUG

    // Update regex to handle buttons with or without spaces after the :: prefix
    const buttonRegex = /::(?:\s*)button\{([^}]*)\}([^:]*?)::(?!:)/g;
    console.log('[PanelManager.processButtonSyntax] Using regex:', buttonRegex); // DEBUG

    let result = content;
    let match;
    let matchCount = 0;

    while ((match = buttonRegex.exec(content)) !== null) {
      matchCount++;
      console.log(`[PanelManager.processButtonSyntax] Match #${matchCount}:`, {
        fullMatch: match[0],
        attributes: match[1],
        text: match[2]
      }); // DEBUG

      try {
        const [fullMatch, attributesStr, text] = match;
        const attributes = this.buttonManager.parseButtonAttributes(attributesStr);
        console.log('[PanelManager.processButtonSyntax] Parsed attributes:', attributes); // DEBUG

        const button = this.buttonManager.createButton(attributes);
        button.textContent = text.trim();
        
        // Setup button listeners
        this.buttonManager.setupButtonListeners(button, attributes);
        
        const buttonHTML = button.outerHTML;
        console.log('[PanelManager.processButtonSyntax] Created button HTML:', buttonHTML); // DEBUG

        result = result.replace(fullMatch, buttonHTML);
      } catch (error) {
        console.error('[PanelManager.processButtonSyntax] Error processing button:', error);
        result = result.replace(match[0], `<span class="button-error">${escapeHtmlPreview(match[0])}</span>`);
      }
    }

    console.log('[PanelManager.processButtonSyntax] Found', matchCount, 'buttons'); // DEBUG
    console.log('[PanelManager.processButtonSyntax] Final result:', result); // DEBUG
    return result;
  }

  public processPanelSyntax(markdown: string): string {
    console.log('[PanelManager.processPanelSyntax] Starting to process markdown:', markdown); // DEBUG

    // Update regex to handle panels with or without spaces after the :: prefix
    const panelRegex = /::(?:\s*)panel\{([^}]*)\}(.*?)::(?!:)/gs;
    console.log('[PanelManager.processPanelSyntax] Using regex:', panelRegex); // DEBUG

    let result = markdown;
    let match;
    let matchCount = 0;

    while ((match = panelRegex.exec(markdown)) !== null) {
      matchCount++;
      console.log(`[PanelManager.processPanelSyntax] Match #${matchCount}:`, {
        fullMatch: match[0],
        attributes: match[1],
        content: match[2]
      }); // DEBUG

      try {
        const [fullMatch, attributesStr, innerContent] = match;
        console.log('[PanelManager.processPanelSyntax] Processing attributes:', attributesStr); // DEBUG

        const attributes = this.parsePanelAttributes(attributesStr);
        console.log('[PanelManager.processPanelSyntax] Parsed attributes:', attributes); // DEBUG

        const panelElement = this.createPanel(attributes);
        console.log('[PanelManager.processPanelSyntax] Created panel element:', panelElement.outerHTML); // DEBUG

        const processedContent = this.processButtonSyntax(innerContent);
        console.log('[PanelManager.processPanelSyntax] Processed inner content:', processedContent); // DEBUG

        panelElement.innerHTML = processedContent;
        const finalHTML = panelElement.outerHTML;
        console.log('[PanelManager.processPanelSyntax] Final panel HTML:', finalHTML); // DEBUG

        result = result.replace(fullMatch, finalHTML);
      } catch (error) {
        console.error('[PanelManager.processPanelSyntax] Error processing panel:', error);
        const errorPanel = `<div class="panel panel-error floating-block">
          <strong>Error Processing Panel:</strong><br>
          ${escapeHtmlPreview(String(error))}<br>
          <pre>Attributes: ${escapeHtmlPreview(match[1])}
Content: ${escapeHtmlPreview(match[2].substring(0,100))}...</pre>
        </div>`;
        result = result.replace(match[0], errorPanel);
      }
    }

    console.log('[PanelManager.processPanelSyntax] Found', matchCount, 'panels'); // DEBUG
    console.log('[PanelManager.processPanelSyntax] Final result:', result); // DEBUG
    return result;
  }

  private parsePanelAttributes(attributesStr: string): PanelAttributes {
    const attributes: PanelAttributes = {};
    const pairs = attributesStr.split(',').map(pair => pair.trim());
    
    pairs.forEach(pair => {
      const [key, value] = pair.split('=').map(part => part.trim());
      if (key && value) {
        attributes[key as keyof PanelAttributes] = value.replace(/['"]/g, '');
      }
    });
    
    return attributes;
  }

  public setupPanelInteractions(container: HTMLElement): void {
    // Add any panel-specific interactions here
    const panels = container.querySelectorAll('.floating-block.panel');
    
    panels.forEach(panel => {
      // Example: Add hover effect
      panel.addEventListener('mouseenter', () => {
        panel.classList.add('hover');
      });
      
      panel.addEventListener('mouseleave', () => {
        panel.classList.remove('hover');
      });
    });
  }

  public removePanelInteractions(container: HTMLElement): void {
    const panels = container.querySelectorAll('.floating-block.panel');
    
    panels.forEach(panel => {
      const newPanel = panel.cloneNode(true) as HTMLElement;
      panel.parentNode?.replaceChild(newPanel, panel);
    });
  }
} 