import React, { useMemo } from 'react';
import { marked } from 'marked';
import processLayoutElements from '../utils/markdownLayoutProcessor';

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  markdown, 
  className = '' 
}) => {
  const processedHtml = useMemo(() => {
    // Primero procesamos los elementos personalizados
    const processedMarkdown = processLayoutElements(markdown);
    
    // Luego convertimos todo el markdown a HTML con marked configurado para no ser asíncrono
    const html = marked.parse(processedMarkdown, {
      breaks: true,
      gfm: true,
      async: false
    });
    
    return html as string;
  }, [markdown]);
  
  return (
    <div 
      className={`markdown-renderer ${className}`}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
};

export default MarkdownRenderer;