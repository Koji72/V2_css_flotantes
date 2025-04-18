import { CacheManager } from './cacheManager';

interface PanelAttributes {
  layout?: string;
  styles?: string;
  classes?: string;
  animation?: string;
  responsive?: string;
  mobileLayout?: string;
}

interface PanelStructure {
  header: string;
  content: string;
}

// Cache para almacenar paneles ya procesados
const processedPanelsCache = new Map<string, string>();

// Expresiones regulares precompiladas para mejor rendimiento
const PANEL_REGEX = /<div\s+class="([^"]*)"([^>]*)>([\s\S]*?)<\/div>/g;
const HEADER_REGEX = /<div\s+class="panel-header">([\s\S]*?)<\/div>/;
const CONTENT_REGEX = /<div\s+class="panel-content">([\s\S]*?)<\/div>/;
const ATTRIBUTE_REGEXES = {
  layout: /data-layout="([^"]*)"/,
  styles: /data-styles="([^"]*)"/,
  classes: /data-classes="([^"]*)"/,
  animation: /data-animation="([^"]*)"/,
  responsive: /data-responsive="([^"]*)"/,
  mobileLayout: /data-mobile-layout="([^"]*)"/,
};

// Lista de propiedades CSS válidas
const VALID_CSS_PROPERTIES = new Set([
  'background', 'color', 'border', 'padding', 'margin',
  'width', 'height', 'display', 'position', 'font-size',
  'font-family', 'text-align', 'box-shadow', 'opacity',
  'transform', 'transition', 'animation', 'flex', 'grid',
  'gap', 'justify-content', 'align-items', 'z-index'
]);

function validatePanelStructure(html: string): PanelStructure | null {
  const headerMatch = html.match(HEADER_REGEX);
  const contentMatch = html.match(CONTENT_REGEX);

  if (!headerMatch || !contentMatch) {
    return null;
  }

  return {
    header: headerMatch[1],
    content: contentMatch[1]
  };
}

function sanitizeStyles(styles: string): string {
  if (!styles) return '';
  
  const sanitizedStyles = styles.split(';')
    .map(style => style.trim())
    .filter(style => {
      if (!style) return false;
      const [property] = style.split(':').map(s => s.trim());
      return VALID_CSS_PROPERTIES.has(property) || property.startsWith('--');
    })
    .join('; ');

  return sanitizedStyles ? sanitizedStyles + ';' : '';
}

function getAnimationClasses(animation: string): string {
  if (!animation) return '';
  
  return animation.split(' ')
    .map(anim => anim.trim())
    .filter(Boolean)
    .map(anim => `${anim}-animation`)
    .join(' ');
}

function getResponsiveClasses(attrs: PanelAttributes): string {
  let classes = [];
  
  if (attrs.responsive === 'true') {
    classes.push('responsive-panel');
  }
  
  if (attrs.mobileLayout === 'stack') {
    classes.push('mobile-stack');
  }
  
  return classes.join(' ');
}

function parseAttributes(attributes: string): PanelAttributes {
  const attrs: PanelAttributes = {};
  
  // Usar las expresiones regulares precompiladas
  for (const [key, regex] of Object.entries(ATTRIBUTE_REGEXES)) {
    const match = attributes.match(regex);
    if (match) {
      attrs[key as keyof PanelAttributes] = match[1];
    }
  }
  
  // Extraer estilos del atributo data-styles
  const stylesMatch = attributes.match(/data-styles="([^"]*)"/);
  if (stylesMatch) {
    attrs.styles = stylesMatch[1];
  }
  
  return attrs;
}

function processAttributes(attrs: PanelAttributes): { classes: string, attributes: string } {
  let additionalClasses: string[] = [];
  let formattedAttrs = '';

  // Procesar animaciones
  if (attrs.animation) {
    const animations = attrs.animation.split(' ').map(a => a.trim()).filter(Boolean);
    animations.forEach(anim => {
      additionalClasses.push(`${anim}-animation`);
    });
    formattedAttrs += ` data-animation="${attrs.animation}"`;
  }

  // Procesar responsividad
  if (attrs.responsive === 'true') {
    additionalClasses.push('responsive-panel');
    formattedAttrs += ` data-responsive="${attrs.responsive}"`;
  }

  if (attrs.mobileLayout === 'stack') {
    additionalClasses.push('mobile-stack');
    formattedAttrs += ` data-mobile-layout="${attrs.mobileLayout}"`;
  }

  // Procesar estilos
  if (attrs.styles) {
    const sanitizedStyles = sanitizeStyles(attrs.styles);
    if (sanitizedStyles) {
      formattedAttrs += ` style="${sanitizedStyles}"`;
    }
  }

  // Procesar layout
  if (attrs.layout) {
    formattedAttrs += ` data-layout="${attrs.layout}"`;
  }

  // Procesar clases adicionales
  if (attrs.classes) {
    additionalClasses.push(attrs.classes);
  }

  return {
    classes: additionalClasses.join(' '),
    attributes: formattedAttrs
  };
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function processPanel(match: string): string | null {
  const [fullMatch, classes, attributes, content] = PANEL_REGEX.exec(match) || [];
  if (!fullMatch) return null;

  // Validar la estructura del panel
  const structure = validatePanelStructure(content);
  if (!structure) {
    console.warn('Invalid panel structure detected. Missing header or content.');
    return fullMatch;
  }

  // Extraer atributos del panel
  const panelAttrs = parseAttributes(attributes);
  
  // Procesar recursivamente el contenido del panel
  const processedContent = processLayoutElements(content);
  
  // Procesar atributos y clases
  const { classes: additionalClasses, attributes: processedAttrs } = processAttributes(panelAttrs);
  
  // Construir el HTML del panel
  const allClasses = [classes];
  if (additionalClasses) {
    allClasses.push(additionalClasses);
  }
  const finalClasses = allClasses.filter(Boolean).join(' ').trim();
  return `<div class="${finalClasses}"${processedAttrs}>${processedContent}</div>`;
}

export function processLayoutElements(markdown: string): string {
  // Verificar caché de documento completo
  const cacheManager = CacheManager.getInstance();
  const documentHash = hashString(markdown);
  const cachedDocument = cacheManager.getDocument(documentHash);
  if (cachedDocument) {
    return cachedDocument;
  }

  // Procesar el documento
  let processedMarkdown = markdown;
  const panelMatches = markdown.match(PANEL_REGEX) || [];

  for (const match of panelMatches) {
    const panelHash = hashString(match);
    const cachedPanel = cacheManager.getPanel(panelHash);
    
    if (cachedPanel) {
      processedMarkdown = processedMarkdown.replace(match, cachedPanel);
      continue;
    }

    const processedPanel = processPanel(match);
    if (processedPanel) {
      cacheManager.setPanel(panelHash, processedPanel);
      processedMarkdown = processedMarkdown.replace(match, processedPanel);
    }
  }

  // Almacenar en caché el documento procesado
  cacheManager.setDocument(documentHash, processedMarkdown);
  return processedMarkdown;
}

function formatAttributes(attrs: PanelAttributes): string {
  let result = '';
  
  if (attrs.layout) {
    result += ` data-layout="${attrs.layout}"`;
  }
  
  if (attrs.styles) {
    result += ` data-styles="${attrs.styles}"`;
  }
  
  if (attrs.classes) {
    result += ` data-classes="${attrs.classes}"`;
  }
  
  if (attrs.animation) {
    result += ` data-animation="${attrs.animation}"`;
  }

  if (attrs.responsive) {
    result += ` data-responsive="${attrs.responsive}"`;
  }

  if (attrs.mobileLayout) {
    result += ` data-mobile-layout="${attrs.mobileLayout}"`;
  }
  
  return result;
} 