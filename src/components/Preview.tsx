import React, { useEffect, useRef } from 'react';
import { useStore } from '../store'; // Import useStore
import { PreviewManager } from '../utils/previewManager'; // Import PreviewManager

const Preview: React.FC = () => {
  const { content, selectedTemplate } = useStore(); // Get content and selectedTemplate from store
  const iframeRef = useRef<HTMLIFrameElement>(null); // Ref for the iframe
  const previewManagerRef = useRef<PreviewManager | null>(null); // Ref for the manager instance

  // Initialize PreviewManager on mount
  useEffect(() => {
    if (iframeRef.current) {
      // Ensure PreviewManager is a singleton or manage instance appropriately
      // If PreviewManager is designed as a singleton, use its getInstance method
      // Otherwise, create a new instance if needed
      if (!previewManagerRef.current) {
         // Assuming PreviewManager might not be a strict singleton but needs instance management
         // Or if it has a static getInstance method: previewManagerRef.current = PreviewManager.getInstance();
        previewManagerRef.current = new PreviewManager(); // Adjust if using singleton pattern
      }
      previewManagerRef.current.initialize(iframeRef.current);
      console.log('PreviewManager initialized');
    }

    // Cleanup on unmount
    return () => {
      previewManagerRef.current?.destroy();
      previewManagerRef.current = null; // Clear the ref on unmount
      console.log('PreviewManager destroyed');
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Update preview content when store content changes
  useEffect(() => {
    if (previewManagerRef.current && content) {
      console.log('Updating preview content');
      previewManagerRef.current.updateContent(content);
    }
  }, [content]); // Run this effect whenever content changes

  // Apply template styles when selected template changes
  useEffect(() => {
    if (previewManagerRef.current && selectedTemplate) {
      console.log('Applying template styles:', selectedTemplate.name);
      previewManagerRef.current.applyCustomCSS(selectedTemplate.styles || `
        /* Estilos básicos basados en los colores del template */
        body {
          background-color: ${selectedTemplate.colors.background};
          color: ${selectedTemplate.colors.text};
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: ${selectedTemplate.colors.accent};
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }
        
        h1 { font-size: 2.2rem; font-weight: 700; border-bottom: 2px solid ${selectedTemplate.colors.accent}; padding-bottom: 0.3em; }
        h2 { font-size: 1.8rem; font-weight: 600; }
        h3 { font-size: 1.5rem; font-weight: 600; }
        
        p { margin: 1em 0; }
        
        code {
          background-color: rgba(0,0,0,0.1);
          padding: 0.2em 0.4em;
          font-family: monospace;
          border-radius: 3px;
        }
        
        pre {
          background-color: rgba(0,0,0,0.1);
          padding: 1em;
          overflow: auto;
          border-radius: 5px;
        }
        
        pre code {
          background-color: transparent;
          padding: 0;
        }
        
        blockquote {
          border-left: 4px solid ${selectedTemplate.colors.accent};
          padding-left: 1em;
          margin-left: 0;
          color: rgba(${parseInt(selectedTemplate.colors.text.slice(1, 3), 16)}, 
                       ${parseInt(selectedTemplate.colors.text.slice(3, 5), 16)}, 
                       ${parseInt(selectedTemplate.colors.text.slice(5, 7), 16)}, 0.8);
        }
        
        a {
          color: ${selectedTemplate.colors.accent};
          text-decoration: none;
        }
        
        a:hover {
          text-decoration: underline;
        }
        
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        th, td {
          border: 1px solid rgba(0,0,0,0.1);
          padding: 0.5em;
        }
        
        th {
          background-color: ${selectedTemplate.colors.accent};
          color: white;
        }
      `);
    }
  }, [selectedTemplate]);

  return (
    <div className="preview-container h-full w-full relative">
      <div className="absolute top-2 right-2 z-10">
        {selectedTemplate && (
          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-70 hover:opacity-100 transition-opacity">
            {selectedTemplate.name}
          </div>
        )}
      </div>
      {/* Iframe for preview will be managed here */}
      <iframe
        ref={iframeRef} // Attach the ref to the iframe
        title="Preview"
        className="preview-iframe w-full h-full"
        sandbox="allow-scripts allow-same-origin"
        style={{ 
          backgroundColor: selectedTemplate?.colors.background || 'var(--bg-secondary)',
          flex: 1,
          display: 'block',
          width: '100%',
          height: '100%',
          border: 'none'
        }}
      />
    </div>
  );
};

export default Preview; 