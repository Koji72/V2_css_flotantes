"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeManager = void 0;
class ThemeManager {
    constructor(rootElement) {
        this.themes = new Map();
        this.currentTheme = 'default';
        this.rootElement = rootElement;
    }
    registerTheme(theme) {
        this.themes.set(theme.name, theme);
    }
    setTheme(name) {
        const theme = this.themes.get(name);
        if (!theme) {
            throw new Error(`Theme ${name} not found`);
        }
        this.currentTheme = name;
        this.applyTheme(theme);
    }
    getCurrentTheme() {
        return this.currentTheme;
    }
    getTheme(name) {
        return this.themes.get(name);
    }
    applyTheme(theme) {
        // Aplicar variables CSS
        Object.entries(theme.variables).forEach(([key, value]) => {
            this.rootElement.style.setProperty(`--${key}`, value);
        });
        // Aplicar estilos globales
        Object.entries(theme.styles).forEach(([selector, styles]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                Object.entries(styles).forEach(([property, value]) => {
                    element.style.setProperty(property, value);
                });
            });
        });
    }
    createTheme(name, baseTheme) {
        const base = baseTheme ? this.themes.get(baseTheme) : undefined;
        const theme = {
            name,
            variables: { ...base?.variables },
            styles: { ...base?.styles }
        };
        this.registerTheme(theme);
        return theme;
    }
    updateTheme(name, updates) {
        const theme = this.themes.get(name);
        if (!theme) {
            throw new Error(`Theme ${name} not found`);
        }
        const updatedTheme = {
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
    toJSON() {
        return Object.fromEntries(this.themes);
    }
    fromJSON(data) {
        this.themes.clear();
        Object.entries(data).forEach(([name, theme]) => {
            this.registerTheme(theme);
        });
    }
}
exports.ThemeManager = ThemeManager;
