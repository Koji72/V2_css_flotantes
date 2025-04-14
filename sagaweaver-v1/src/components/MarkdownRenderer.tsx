import React, { useMemo } from 'react';
import { processLayoutElements } from '../utils/markdownLayoutProcessor';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
  onPanelRender?: (html: string) => React.ReactNode;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  markdown, 
  className,
  onPanelRender 
}) => {
  // Procesar el markdown para convertir las directivas en HTML
  const processedHtml = useMemo(() => {
    console.log('[MarkdownRenderer] Processing markdown into HTML');
    return processLayoutElements(markdown);
  }, [markdown]);

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

  return (
    <div className={className}>
      {/* Renderizar el HTML procesado */}
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      
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