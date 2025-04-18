interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface PanelStructure {
  header?: string;
  content?: string;
  attributes: Record<string, string>;
}

const VALID_ATTRIBUTES = new Set([
  'layout',
  'style',
  'width',
  'height',
  'animation',
  'responsive',
  'mobile-layout',
  'title',
  'icon',
  'icon-props',
  'class'
]);

const VALID_LAYOUTS = new Set([
  'float-left',
  'float-right',
  'float-center',
  'centered',
  'stack-mobile',
  'split-columns'
]);

const VALID_ANIMATIONS = new Set([
  'glow',
  'shake',
  'fade',
  'slide',
  'pulse',
  'none'
]);

export function validatePanel(html: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Verificar si es un nuevo elemento flotante
  if (html.includes('floating-element')) {
    return validateFloatingElement(html);
  }

  // Extraer estructura básica para paneles tradicionales
  const structure = extractPanelStructure(html);
  if (!structure) {
    result.isValid = false;
    result.errors.push('Invalid panel structure: Could not parse HTML');
    return result;
  }

  // Validar estructura básica
  if (!structure.header) {
    result.warnings.push('Panel is missing a header section');
  }
  if (!structure.content) {
    result.errors.push('Panel is missing a content section');
    result.isValid = false;
  }

  // Validar atributos
  validateAttributes(structure.attributes, result);

  return result;
}

function validateFloatingElement(html: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Verificar header
  const headerMatch = html.includes('floating-element-header');
  if (!headerMatch) {
    result.warnings.push('Panel is missing a header section');
  }

  // Verificar content
  const contentMatch = html.includes('floating-element-content');
  if (!contentMatch) {
    result.errors.push('Panel is missing a content section');
    result.isValid = false;
  }

  // Extraer y validar clases
  const classMatch = html.match(/class="([^"]+)"/);
  if (classMatch) {
    const classes = classMatch[1].split(/\s+/);
    
    // Verificar clases principales
    if (!classes.includes('floating-element')) {
      result.warnings.push('Unknown attribute: class');
    }
  }

  return result;
}

function extractPanelStructure(html: string): PanelStructure | null {
  // Primero intentamos con formato de floating-element
  let headerMatch = html.match(/<div\s+class="floating-element-header">([\s\S]*?)<\/div>/);
  let contentMatch = html.match(/<div\s+class="floating-element-content">([\s\S]*?)<\/div>/);
  
  // Si no, intentamos con formato antiguo
  if (!headerMatch) {
    headerMatch = html.match(/<div\s+class="panel-header">([\s\S]*?)<\/div>/);
  }
  if (!contentMatch) {
    contentMatch = html.match(/<div\s+class="panel-content">([\s\S]*?)<\/div>/);
  }
  
  const attributesMatch = html.match(/<div\s+([^>]+)>/);

  if (!attributesMatch) return null;

  const attributes = parseAttributes(attributesMatch[1]);

  return {
    header: headerMatch?.[1],
    content: contentMatch?.[1],
    attributes
  };
}

function parseAttributes(attrString: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const regex = /(\w+[-\w]*)=["']([^"']+)["']/g;
  let match;

  while ((match = regex.exec(attrString)) !== null) {
    attributes[match[1]] = match[2];
  }

  return attributes;
}

function validateAttributes(attributes: Record<string, string>, result: ValidationResult): void {
  for (const [key, value] of Object.entries(attributes)) {
    if (!VALID_ATTRIBUTES.has(key)) {
      result.warnings.push(`Unknown attribute: ${key}`);
    }

    switch (key) {
      case 'layout':
        if (!VALID_LAYOUTS.has(value)) {
          result.errors.push(`Invalid layout value: ${value}`);
          result.isValid = false;
        }
        break;

      case 'animation':
        const animations = value.split(',').map(a => a.trim());
        for (const anim of animations) {
          if (!VALID_ANIMATIONS.has(anim)) {
            result.errors.push(`Invalid animation: ${anim}`);
            result.isValid = false;
          }
        }
        break;

      case 'width':
      case 'height':
        if (!/^\d+(px|%|rem|em|vh|vw)$/.test(value)) {
          // Hacemos una excepción para valores simples como '30%'
          if (!/^\d+%$/.test(value)) {
            result.warnings.push(`Potentially invalid ${key} value: ${value}`);
          }
        }
        break;
    }
  }
} 