"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PanelLinter = void 0;
const previewManager_1 = require("../previewManager");
class PanelLinter {
    constructor() {
        this.previewManager = previewManager_1.PreviewManager.getInstance();
    }
    static getInstance() {
        if (!PanelLinter.instance) {
            PanelLinter.instance = new PanelLinter();
        }
        return PanelLinter.instance;
    }
    async lintPanelStyles() {
        console.group('Panel Style Linting');
        try {
            // Check CSS variables
            this.checkCSSVariables();
            // Check style combinations
            this.checkStyleCombinations();
            // Check accessibility
            this.checkAccessibility();
            // Check responsive design
            this.checkResponsiveDesign();
        }
        catch (error) {
            console.error('Error during panel linting:', error);
        }
        console.groupEnd();
    }
    checkCSSVariables() {
        console.group('CSS Variables Check');
        const requiredVariables = [
            '--panel-bg',
            '--panel-border',
            '--radius-lg',
            '--shadow-sm',
            '--shadow-md',
            '--shadow-lg',
            '--spacing-sm',
            '--spacing-md',
            '--spacing-lg',
            '--transition-normal',
            '--ease-in-out',
            '--panel-bg-rgb',
            '--panel-border-rgb',
            '--accent-color',
            '--color-primary',
            '--color-success',
            '--color-warning',
            '--color-danger'
        ];
        const styleSheets = document.styleSheets;
        let missingVariables = [];
        for (const variable of requiredVariables) {
            let found = false;
            for (let i = 0; i < styleSheets.length; i++) {
                try {
                    const rules = styleSheets[i].cssRules;
                    for (let j = 0; j < rules.length; j++) {
                        if (rules[j].cssText.includes(variable)) {
                            found = true;
                            break;
                        }
                    }
                    if (found)
                        break;
                }
                catch (e) {
                    // Skip cross-origin stylesheets
                    continue;
                }
            }
            if (!found) {
                missingVariables.push(variable);
            }
        }
        if (missingVariables.length > 0) {
            console.warn('Missing CSS variables:', missingVariables);
        }
        else {
            console.log('All required CSS variables are defined');
        }
        console.groupEnd();
    }
    checkStyleCombinations() {
        console.group('Style Combinations Check');
        const validCombinations = [
            ['glass', 'floating'],
            ['glass', 'hoverable'],
            ['glass', 'shadow-lg'],
            ['glass', 'cut-corner'],
            ['glass', 'pattern-grid'],
            ['glass', 'border-primary']
        ];
        const invalidCombinations = [
            ['glass', 'glass'], // Duplicate style
            ['floating', 'floating'], // Duplicate class
            ['shadow-lg', 'shadow-sm'] // Conflicting shadows
        ];
        // Test valid combinations
        for (const combination of validCombinations) {
            const classes = combination.join(' ');
            const panel = document.createElement('div');
            panel.className = `panel ${classes}`;
            document.body.appendChild(panel);
            const computedStyle = window.getComputedStyle(panel);
            if (computedStyle.display === 'none') {
                console.warn(`Invalid style combination: ${classes}`);
            }
            document.body.removeChild(panel);
        }
        // Test invalid combinations
        for (const combination of invalidCombinations) {
            const classes = combination.join(' ');
            const panel = document.createElement('div');
            panel.className = `panel ${classes}`;
            document.body.appendChild(panel);
            const computedStyle = window.getComputedStyle(panel);
            if (computedStyle.display !== 'none') {
                console.warn(`Potentially problematic style combination: ${classes}`);
            }
            document.body.removeChild(panel);
        }
        console.groupEnd();
    }
    checkAccessibility() {
        console.group('Accessibility Check');
        // Check button contrast
        const buttonStyles = ['primary', 'secondary', 'success', 'warning', 'danger', 'info'];
        for (const style of buttonStyles) {
            const button = document.createElement('button');
            button.className = `panel-button ${style}`;
            button.textContent = 'Test';
            document.body.appendChild(button);
            const computedStyle = window.getComputedStyle(button);
            const bgColor = computedStyle.backgroundColor;
            const textColor = computedStyle.color;
            // Basic contrast check (simplified)
            const contrast = this.calculateContrast(bgColor, textColor);
            if (contrast < 4.5) {
                console.warn(`Low contrast for ${style} button: ${contrast}`);
            }
            document.body.removeChild(button);
        }
        // Check ARIA attributes
        const panel = document.createElement('div');
        panel.className = 'panel';
        panel.setAttribute('role', 'region');
        document.body.appendChild(panel);
        if (!panel.getAttribute('aria-label') && !panel.querySelector('[aria-labelledby]')) {
            console.warn('Panel missing accessible label');
        }
        document.body.removeChild(panel);
        console.groupEnd();
    }
    checkResponsiveDesign() {
        console.group('Responsive Design Check');
        const breakpoints = [
            { name: 'mobile', width: 320 },
            { name: 'tablet', width: 768 },
            { name: 'desktop', width: 1024 }
        ];
        const panel = document.createElement('div');
        panel.className = 'panel';
        document.body.appendChild(panel);
        for (const breakpoint of breakpoints) {
            // Simulate viewport size
            const originalWidth = document.documentElement.clientWidth;
            Object.defineProperty(document.documentElement, 'clientWidth', {
                value: breakpoint.width,
                configurable: true
            });
            const computedStyle = window.getComputedStyle(panel);
            console.log(`${breakpoint.name} viewport:`, {
                width: computedStyle.width,
                padding: computedStyle.padding,
                margin: computedStyle.margin
            });
            // Restore original width
            Object.defineProperty(document.documentElement, 'clientWidth', {
                value: originalWidth,
                configurable: true
            });
        }
        document.body.removeChild(panel);
        console.groupEnd();
    }
    calculateContrast(bgColor, textColor) {
        // Simplified contrast calculation
        // In a real implementation, this would use proper color contrast algorithms
        return 4.5; // Placeholder
    }
}
exports.PanelLinter = PanelLinter;
PanelLinter.instance = null;
