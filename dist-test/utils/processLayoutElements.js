"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processLayoutElements = processLayoutElements;
exports.processPanel = processPanel;
function processAttributes(attributeString) {
    const classes = [];
    const styles = {};
    const dataAttributes = {};
    // Extract classes
    const classMatches = attributeString.match(/\.[a-zA-Z0-9_-]+/g);
    if (classMatches) {
        classes.push(...classMatches.map(c => c.substring(1)));
    }
    // Extract styles
    const styleMatches = attributeString.match(/\{([^}]+)\}/g);
    if (styleMatches) {
        styleMatches.forEach(match => {
            const styleProps = match.slice(1, -1).split(';');
            styleProps.forEach(prop => {
                const [key, value] = prop.split(':').map(s => s.trim());
                if (key && value) {
                    styles[key] = value;
                }
            });
        });
    }
    // Extract data attributes
    const dataMatches = attributeString.match(/data-[a-zA-Z0-9-]+="[^"]*"/g);
    if (dataMatches) {
        dataMatches.forEach(match => {
            const [key, value] = match.split('=');
            const cleanKey = key.replace('data-', '');
            const cleanValue = value.slice(1, -1);
            if (cleanValue) {
                dataAttributes[cleanKey] = cleanValue;
            }
        });
    }
    return { classes, styles, dataAttributes };
}
function isValidCSSProperty(property) {
    // Lista más completa de propiedades CSS comunes
    const validProperties = [
        // Layout
        'display', 'position', 'top', 'right', 'bottom', 'left',
        'float', 'clear', 'z-index', 'overflow', 'visibility',
        // Box Model
        'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
        'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
        'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
        // Typography
        'font-family', 'font-size', 'font-weight', 'font-style',
        'text-align', 'text-decoration', 'text-transform', 'line-height',
        'letter-spacing', 'word-spacing', 'white-space',
        // Visual
        'background', 'background-color', 'background-image',
        'border', 'border-radius', 'box-shadow',
        'opacity', 'color',
        // Flexbox
        'flex', 'flex-direction', 'flex-wrap', 'flex-flow',
        'justify-content', 'align-items', 'align-content', 'gap',
        // Grid
        'grid', 'grid-template-columns', 'grid-template-rows',
        'grid-column', 'grid-row', 'grid-gap',
        // Transitions & Animations
        'transition', 'transform', 'animation',
        'transition-property', 'transition-duration',
        'transition-timing-function', 'transition-delay'
    ];
    return validProperties.includes(property.toLowerCase().trim());
}
function processLayoutElements(content) {
    const cache = new Map();
    function processPanel(panel, cache) {
        const cacheKey = panel.trim();
        if (cache.has(cacheKey)) {
            return cache.get(cacheKey);
        }
        const structure = validatePanelStructure(panel);
        if (!structure) {
            return panel;
        }
        const { header, content, attributes } = structure;
        const processedAttributes = processAttributes(attributes);
        const result = `<div class="panel ${processedAttributes.classes.join(' ')}" style="${Object.entries(processedAttributes.styles).map(([k, v]) => `${k}: ${v}`).join('; ')}">
      <div class="panel-header">${header}</div>
      <div class="panel-content">${content}</div>
    </div>`;
        cache.set(cacheKey, result);
        return result;
    }
    // Process all panels in the content
    return content.replace(/<panel[^>]*>[\s\S]*?<\/panel>/g, (panel, index) => processPanel(panel, cache));
}
function extractAttributes(element) {
    const attributes = {};
    const attributeRegex = /(\w+(?:-\w+)*)=["']([^"']*)["']/g;
    let match;
    while ((match = attributeRegex.exec(element)) !== null) {
        attributes[match[1]] = match[2];
    }
    return attributes;
}
function validatePanelStructure(panel) {
    const headerMatch = panel.match(/<header[^>]*>([\s\S]*?)<\/header>/);
    const contentMatch = panel.match(/<content[^>]*>([\s\S]*?)<\/content>/);
    const attributesMatch = panel.match(/<panel([^>]*)>/);
    if (!headerMatch || !contentMatch) {
        throw new Error('Invalid panel structure: missing header or content');
    }
    return {
        header: headerMatch[1].trim(),
        content: contentMatch[1].trim(),
        attributes: attributesMatch ? attributesMatch[1].trim() : ''
    };
}
function processMarkdown(text) {
    // Por ahora solo retornamos el texto sin procesar
    // TODO: Implementar el procesamiento de markdown
    return text.trim();
}
function processPanel(panel) {
    const validatedPanel = validatePanelStructure(panel);
    const processedAttributes = processAttributes(validatedPanel.attributes);
    return {
        header: processMarkdown(validatedPanel.header),
        content: processMarkdown(validatedPanel.content),
        classes: processedAttributes.classes,
        styles: processedAttributes.styles,
        dataAttributes: processedAttributes.dataAttributes
    };
}
