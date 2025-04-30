/**
 * Button Manager for Panel System
 * Handles button rendering and interactions in markdown panels
 */

export interface ButtonAttributes {
  action: string;
  style?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  disabled?: boolean;
  loading?: boolean;
  'aria-label'?: string;
  role?: string;
  class?: string;
  'custom-style'?: string;
  'on-click'?: string;
  'on-custom'?: string;
}

export class ButtonManager {
  private static instance: ButtonManager;
  private buttonElements: Map<string, HTMLButtonElement>;

  private constructor() {
    this.buttonElements = new Map();
  }

  public static getInstance(): ButtonManager {
    if (!ButtonManager.instance) {
      ButtonManager.instance = new ButtonManager();
    }
    return ButtonManager.instance;
  }

  public createButton(attributes: ButtonAttributes): HTMLButtonElement {
    const button = document.createElement('button');
    
    // Set base class
    button.className = 'panel-button';
    
    // Add style class if specified and valid
    const validStyles: ButtonAttributes['style'][] = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
    if (attributes.style && validStyles.includes(attributes.style)) {
      button.classList.add(attributes.style);
    }
    
    // Add custom classes if specified
    if (attributes.class) {
      button.classList.add(...attributes.class.split(' '));
    }
    
    // Set attributes
    button.setAttribute('data-action', attributes.action);
    if (attributes.disabled) button.disabled = true;
    if (attributes.loading) button.classList.add('loading');
    if (attributes['aria-label']) button.setAttribute('aria-label', attributes['aria-label']);
    if (attributes.role) button.setAttribute('role', attributes.role);
    if (attributes['custom-style']) button.setAttribute('style', attributes['custom-style']);
    
    // Store button reference
    this.buttonElements.set(attributes.action, button);
    
    return button;
  }

  public getButton(action: string): HTMLButtonElement | undefined {
    return this.buttonElements.get(action);
  }

  public removeButton(action: string): void {
    const button = this.buttonElements.get(action);
    if (button) {
      button.remove();
      this.buttonElements.delete(action);
    }
  }

  public clearButtons(): void {
    this.buttonElements.forEach(button => button.remove());
    this.buttonElements.clear();
  }
} 