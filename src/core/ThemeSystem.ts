export interface Theme {
  name: string;
  variables: Record<string, string>;
  styles: Record<string, Record<string, string>>;
}

export class ThemeManager {
  private themes: Map<string, Theme>;
  private currentTheme: string;
  private rootElement: HTMLElement;

  constructor(rootElement: HTMLElement) {
    this.themes = new Map();
    this.currentTheme = 'default';
    this.rootElement = rootElement;
  }

  registerTheme(theme: Theme): void {
    this.themes.set(theme.name, theme);
  }

  setTheme(name: string): void {
    const theme = this.themes.get(name);
    if (!theme) {
      throw new Error(`Theme ${name} not found`);
    }

    this.currentTheme = name;
    this.applyTheme(theme);
  }

  getCurrentTheme(): string {
    return this.currentTheme;
  }

  getTheme(name: string): Theme | undefined {
    return this.themes.get(name);
  }

  private applyTheme(theme: Theme): void {
    // Aplicar variables CSS
    Object.entries(theme.variables).forEach(([key, value]) => {
      this.rootElement.style.setProperty(`--${key}`, value);
    });

    // Aplicar estilos globales
    Object.entries(theme.styles).forEach(([selector, styles]) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        Object.entries(styles).forEach(([property, value]) => {
          (element as HTMLElement).style.setProperty(property, value);
        });
      });
    });
  }

  createTheme(name: string, baseTheme?: string): Theme {
    const base = baseTheme ? this.themes.get(baseTheme) : undefined;
    const theme: Theme = {
      name,
      variables: { ...base?.variables },
      styles: { ...base?.styles }
    };
    this.registerTheme(theme);
    return theme;
  }

  updateTheme(name: string, updates: Partial<Theme>): void {
    const theme = this.themes.get(name);
    if (!theme) {
      throw new Error(`Theme ${name} not found`);
    }

    const updatedTheme: Theme = {
      ...theme,
      ...updates,
      variables: { ...theme.variables, ...updates.variables },
      styles: { ...theme.styles, ...updates.styles }
    };

    this.themes.set(name, updatedTheme);
    if (name === this.currentTheme) {
      this.applyTheme(updatedTheme);
    }
  }

  toJSON(): Record<string, Theme> {
    return Object.fromEntries(this.themes);
  }

  fromJSON(data: Record<string, Theme>): void {
    this.themes.clear();
    Object.entries(data).forEach(([name, theme]) => {
      this.registerTheme(theme);
    });
  }
} 