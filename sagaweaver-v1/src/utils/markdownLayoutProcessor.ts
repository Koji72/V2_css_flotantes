import { marked } from 'marked';
import { FloatingElementStyle, FloatingElementPosition, FloatingElementAnimation } from '../components/FloatingElement';
import { SplitColumnsStyle } from '../components/SplitColumns';

// Tipos más estrictos para los atributos extraídos
interface FloatingElementAttributes {
  position?: FloatingElementPosition;
  style?: FloatingElementStyle;
  title?: string;
  width?: string;
  animation?: FloatingElementAnimation;
  class?: string;
}

interface ColumnAttributes {
  columns?: '2' | '3'; // Ahora como string pero limitado
  gap?: string;
  style?: SplitColumnsStyle;
  class?: string;
}

// Logging helper
const log = (level: 'info' | 'warn' | 'error', message: string, data?: any) => {
  const prefix = `[LayoutProcessor:${level.toUpperCase()}]`;
  if (data) {
    console[level](prefix, message, data);
  } else {
    console[level](prefix, message);
  }
};

/**
 * Procesa contenido markdown para convertir bloques personalizados en elementos HTML de diseño
 */
export const processLayoutElements = (markdown: string): string => {
  log('info', 'Starting layout element processing');
  try {
    // Procesar elementos flotantes
    markdown = processFloatingElements(markdown);
    
    // Procesar columnas divididas
    markdown = processSplitColumns(markdown);
    
    log('info', 'Layout element processing finished');
    return markdown;
  } catch (error) {
    log('error', 'Error during layout element processing', error);
    // Devuelve el markdown original en caso de error grave para no romper la app
    return markdown; 
  }
};

/**
 * Procesa bloques de elementos flotantes en markdown
 */
const processFloatingElements = (markdown: string): string => {
  const floatingElementRegex = /:::float(?:\[([^\]]*)\])?(?:\{([^}]*)\})?\n([\s\S]*?):::/g;
  let matchIndex = 0;
  
  return markdown.replace(floatingElementRegex, (match, positionArg, attributesStr, content) => {
    const currentMatch = ++matchIndex;
    log('info', `Processing float block #${currentMatch}`, { positionArg, attributesStr });
    
    try {
      // Extraer atributos
      const attributes = parseAttributes(attributesStr || '') as FloatingElementAttributes;
      const position = (positionArg as FloatingElementPosition) || attributes.position || 'left';
      const style = attributes.style || 'default';
      const animation = attributes.animation || 'none';
      const customClass = attributes.class || '';
      const width = attributes.width || '30%';
      
      log('info', `Float block #${currentMatch} attributes:`, { position, style, animation, width, customClass });
      
      // Construir clases CSS
      const styleClass = `floating-${style}`;
      const positionClass = `float-${position}`;
      const animationClass = animation !== 'none' ? `animate-${animation}` : '';
            
      const titleHtml = attributes.title 
        ? `<div class="floating-element-header">${marked.parseInline(attributes.title.trim(), { async: false })}</div>` 
        : '';
      
      // Procesar el contenido con marked
      const processedContent = marked.parse(content.trim(), { async: false });
      
      // Crear el HTML del elemento flotante
      const elementClasses = `floating-element ${positionClass} ${styleClass} ${animationClass} ${customClass}`.trim().replace(/\s+/g, ' ');
      log('info', `Float block #${currentMatch} generated classes: ${elementClasses}`);
      
      const html = `
<div class="${elementClasses}" style="width: ${position === 'center' ? width : width}; max-width: ${position === 'center' ? width : '100%'}">
  ${titleHtml}
  <div class="floating-element-content">
    ${processedContent}
  </div>
</div>`;
      
      return html;
    } catch (error) {
      log('error', `Error processing float block #${currentMatch}`, { match, error });
      // Devuelve el bloque original sin procesar en caso de error
      return match; 
    }
  });
};

/**
 * Procesa bloques de columnas divididas en markdown
 */
const processSplitColumns = (markdown: string): string => {
  const columnsRegex = /:::columns(?:\{([^}]*)\})?\n([\s\S]*?):::/g;
  const columnBreakRegex = /:::break:::/g;
  let matchIndex = 0;
  
  // Reemplazar marcadores de salto de columna
  const contentWithBreaks = markdown.replace(columnBreakRegex, (match) => {
    log('info', 'Processing column break');
    return '<div style="break-after: column; page-break-after: always;" class="column-break"></div>';
  });
  
  // Procesar bloques de columnas
  return contentWithBreaks.replace(columnsRegex, (match, attributesStr, content) => {
    const currentMatch = ++matchIndex;
    log('info', `Processing columns block #${currentMatch}`, { attributesStr });

    try {
      // Extraer atributos
      const attributes = parseAttributes(attributesStr || '') as ColumnAttributes;
      const columns = attributes.columns || '2';
      const gap = attributes.gap || '2rem';
      const style = attributes.style || 'default';
      const customClass = attributes.class || '';
      
      log('info', `Columns block #${currentMatch} attributes:`, { columns, gap, style, customClass });
      
      // Validar número de columnas
      if (columns !== '2' && columns !== '3') {
        log('warn', `Invalid column count '${columns}' in block #${currentMatch}. Defaulting to 2.`);
      }
      const finalColumns = (columns === '2' || columns === '3') ? parseInt(columns) : 2;
      
      // Construir clases CSS
      const styleClass = `split-columns-${style}`;
            
      // Procesar el contenido con marked
      const processedContent = marked.parse(content.trim(), { async: false });
      
      // Crear el HTML del elemento de columnas
      const containerClasses = `split-columns-container ${styleClass} ${customClass}`.trim().replace(/\s+/g, ' ');
      log('info', `Columns block #${currentMatch} generated classes: ${containerClasses}`);
      
      const html = `
<div class="${containerClasses}">
  <div class="split-columns-content" style="column-count: ${finalColumns}; column-gap: ${gap};">
    ${processedContent}
  </div>
</div>`;
      
      return html;
    } catch (error) {
      log('error', `Error processing columns block #${currentMatch}`, { match, error });
      // Devuelve el bloque original sin procesar en caso de error
      return match;
    }
  });
};

/**
 * Analiza una cadena de atributos y devuelve un objeto con los valores
 * Formato esperado: {key="value" | key=value | flag | styleName}
 */
const parseAttributes = (attributesStr: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  
  if (!attributesStr || attributesStr.trim() === '') {
    return attributes;
  }
  
  // Usamos regex para manejar mejor los atributos con/sin comillas y flags
  const attributeRegex = /([\w-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'|]+)))?|([^\s=|]+)/g;
  let match;
  
  while ((match = attributeRegex.exec(attributesStr)) !== null) {
    const key = match[1] || match[5]; // Clave (grupo 1) o flag/estilo (grupo 5)
    const value = match[2] || match[3] || match[4]; // Valor entre comillas o sin comillas

    if (key) {
      if (value !== undefined) {
        // Es un par key=value
        attributes[key.toLowerCase()] = value;
      } else if (match[5]) {
        // Es un flag o un estilo (sin valor)
        // Añadir nuevos estilos al array de flags/estilos conocidos
        const knownFlags = [
          'left', 'right', 'center',
          'pulse', 'rotate', 'fade', 'none',
          'tech', 'hologram', 'neo', 'circuit', 'glass', 'fantasy', 'scroll', 'metal', 
          'tech-corners', 'cut-corners', 'corner-brackets', // Nuevos v2.6
          'parchment', 'modern', 'default' // Estilos de columna también
        ]; 
        if (!knownFlags.includes(key.toLowerCase())) {
           attributes.class = attributes.class ? `${attributes.class} ${key}` : key; // Añadir como clase si no es conocido
        } else {
           // Si es conocido, podría ser un estilo o flag, la lógica externa lo decidirá
           // Por simplicidad ahora, asignamos a style si no es position/animation
           if (!['left', 'right', 'center', 'pulse', 'rotate', 'fade', 'none'].includes(key.toLowerCase())) {
             attributes.style = key.toLowerCase();
           }
        }
      }
    }
  }
  
  log('info', 'Parsed attributes', attributes);
  return attributes;
};

export default processLayoutElements; 