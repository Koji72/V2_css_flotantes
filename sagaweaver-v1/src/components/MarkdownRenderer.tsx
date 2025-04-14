import React, { useMemo } from 'react';
import { processLayoutElements } from '../utils/markdownLayoutProcessor';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
  onPanelRender?: (html: string) => React.ReactNode;
  components?: Record<string, () => React.ReactNode>;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  markdown, 
  className,
  onPanelRender,
  components
}) => {
  // Procesar el markdown para convertir las directivas en HTML
  const processedHtml = useMemo(() => {
    console.log('[MarkdownRenderer] Processing markdown into HTML');
    
    // Si hay componentes personalizados, reemplazar los marcadores en el markdown
    if (components) {
      console.log('[MarkdownRenderer] Applying custom components');
      let processedMarkdown = markdown;
      
      // Reemplazar cada marcador de componente con un placeholder único
      Object.keys(components).forEach(key => {
        const marker = `:::${key}`;
        const placeholder = `<div class="custom-component" data-component="${key}"></div>`;
        processedMarkdown = processedMarkdown.replace(new RegExp(marker, 'g'), placeholder);
      });
      
      return processLayoutElements(processedMarkdown);
    }
    
    return processLayoutElements(markdown);
  }, [markdown, components]);

  // Si se proporciona onPanelRender, extraer paneles para validación
  const validationPanels = useMemo(() => {
    if (!onPanelRender) return [];

    console.log('[MarkdownRenderer] Extracting panels for validation');
    
    // Usar una expresión regular para encontrar divs que sean elementos flotantes o paneles
    const panelRegex = /<div[^>]*class="[^"]*(?:floating-element|panel)[^"]*"[^>]*>(?:[\s\S]*?)<\/div>/g;
    const panels: string[] = [];
    let match;
    
    // Buscar todos los paneles en el HTML procesado
    while ((match = panelRegex.exec(processedHtml)) !== null) {
      panels.push(match[0]);
    }
    
    console.log(`[MarkdownRenderer] Found ${panels.length} panels for validation`);
    return panels;
  }, [processedHtml, onPanelRender]);

  // Extraer componentes personalizados del HTML procesado
  const customComponentsElements = useMemo(() => {
    if (!components) return [];

    console.log('[MarkdownRenderer] Extracting custom components');
    
    const componentRegex = /<div[^>]*class="custom-component"[^>]*data-component="([^"]+)"[^>]*><\/div>/g;
    const customElements: { key: string; index: number }[] = [];
    let match;
    let html = processedHtml;
    
    // Encontrar todos los marcadores de componentes personalizados
    while ((match = componentRegex.exec(html)) !== null) {
      const key = match[1];
      customElements.push({
        key,
        index: match.index
      });
    }
    
    return customElements;
  }, [processedHtml, components]);

  return (
    <div className={className}>
      {/* Renderizar el HTML procesado con los componentes intercalados */}
      {components && customComponentsElements.length > 0 ? (
        <>
          {/* Dividir el HTML y renderizar los componentes en las posiciones correctas */}
          {customComponentsElements.reduce((result: React.ReactNode[], element, i) => {
            const startIndex = i === 0 ? 0 : customComponentsElements[i-1].index + 1;
            const endIndex = element.index;
            
            // Agregar el fragmento de HTML antes del componente
            if (endIndex > startIndex) {
              result.push(
                <div 
                  key={`html-${i}`}
                  dangerouslySetInnerHTML={{ 
                    __html: processedHtml.substring(startIndex, endIndex) 
                  }} 
                />
              );
            }
            
            // Agregar el componente
            if (components[element.key]) {
              result.push(
                <React.Fragment key={`component-${element.key}-${i}`}>
                  {components[element.key]()}
                </React.Fragment>
              );
            }
            
            // Si es el último elemento, agregar el resto del HTML
            if (i === customComponentsElements.length - 1) {
              result.push(
                <div 
                  key={`html-last`}
                  dangerouslySetInnerHTML={{ 
                    __html: processedHtml.substring(element.index + 1) 
                  }} 
                />
              );
            }
            
            return result;
          }, [])}
        </>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      )}
      
      {/* Renderizar validaciones si se proporciona onPanelRender */}
      {onPanelRender && validationPanels.length > 0 && (
        <div className="panel-validation-container">
          {validationPanels.map((panelHtml, index) => (
            <React.Fragment key={index}>
              {onPanelRender(panelHtml)}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};