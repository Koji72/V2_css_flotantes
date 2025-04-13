import { marked } from 'marked';

interface FloatingElementAttributes {
  position?: 'left' | 'right' | 'center';
  style?: string;
  title?: string;
  width?: string;
  animation?: string;
  class?: string;
}

interface ColumnAttributes {
  columns?: string;
  gap?: string;
  style?: string;
  class?: string;
}

/**
 * Procesa contenido markdown para convertir bloques personalizados en elementos HTML de diseño
 */
export const processLayoutElements = (markdown: string): string => {
  // Procesar elementos flotantes
  markdown = processFloatingElements(markdown);
  
  // Procesar columnas divididas
  markdown = processSplitColumns(markdown);
  
  return markdown;
};

/**
 * Procesa bloques de elementos flotantes en markdown
 */
const processFloatingElements = (markdown: string): string => {
  const floatingElementRegex = /:::float(?:\[([^\]]*)\])?(?:\{([^}]*)\})?\n([\s\S]*?):::/g;
  
  return markdown.replace(floatingElementRegex, (match, positionArg, attributesStr, content) => {
    // Extraer atributos
    const attributes = parseAttributes(attributesStr || '');
    const position = positionArg || attributes.position || 'left';
    
    // Construir clases CSS
    const styleClass = attributes.style ? `floating-${attributes.style}` : 'floating-default';
    const positionClass = `float-${position}`;
    const animationClass = attributes.animation ? `animate-${attributes.animation}` : '';
    const customClass = attributes.class || '';
    
    const width = attributes.width || '30%';
    const titleHtml = attributes.title 
      ? `<div class="floating-element-header">${attributes.title}</div>` 
      : '';
    
    // Procesar el contenido con marked
    const processedContent = marked.parse(content.trim());
    
    // Crear el HTML del elemento flotante
    const html = `
<div class="floating-element ${positionClass} ${styleClass} ${animationClass} ${customClass}" style="width: ${position === 'center' ? 'auto' : width}; max-width: ${position === 'center' ? width : '100%'}">
  ${titleHtml}
  <div class="floating-element-content">
    ${processedContent}
  </div>
</div>`;
    
    return html;
  });
};

/**
 * Procesa bloques de columnas divididas en markdown
 */
const processSplitColumns = (markdown: string): string => {
  const columnsRegex = /:::columns(?:\{([^}]*)\})?\n([\s\S]*?):::/g;
  const columnBreakRegex = /:::break:::/g;
  
  // Reemplazar marcadores de salto de columna
  const contentWithBreaks = markdown.replace(columnBreakRegex, '<div style="break-after: column; page-break-after: always;"></div>');
  
  // Procesar bloques de columnas
  return contentWithBreaks.replace(columnsRegex, (match, attributesStr, content) => {
    // Extraer atributos
    const attributes = parseAttributes(attributesStr || '') as ColumnAttributes;
    const columns = attributes.columns || '2';
    const gap = attributes.gap || '2rem';
    const style = attributes.style || 'default';
    const customClass = attributes.class || '';
    
    // Construir clases CSS
    const styleClass = `split-columns-${style}`;
    
    // Procesar el contenido con marked
    const processedContent = marked.parse(content.trim());
    
    // Crear el HTML del elemento de columnas
    const html = `
<div class="split-columns-container ${styleClass} ${customClass}">
  <div class="split-columns-content" style="column-count: ${columns}; column-gap: ${gap};">
    ${processedContent}
  </div>
</div>`;
    
    return html;
  });
};

/**
 * Analiza una cadena de atributos y devuelve un objeto con los valores
 */
const parseAttributes = (attributesStr: string): Record<string, string> => {
  const attributes: Record<string, string> = {};
  
  // Si no hay atributos, devolver objeto vacío
  if (!attributesStr || attributesStr.trim() === '') {
    return attributes;
  }
  
  // Dividir por pipes y procesar cada atributo
  const attributePairs = attributesStr.split('|').map(pair => pair.trim());
  
  attributePairs.forEach(pair => {
    // Ignorar elementos vacíos
    if (!pair) return;
    
    // Verificar si usa formato key=value
    if (pair.includes('=')) {
      const [key, value] = pair.split('=').map(part => part.trim());
      // Eliminar comillas si las hay
      const cleanValue = value.replace(/^["'](.*)["']$/, '$1');
      attributes[key] = cleanValue;
    } else {
      // Si solo hay una palabra, asumimos que es un estilo
      attributes.style = pair;
    }
  });
  
  return attributes;
};

export default processLayoutElements; 