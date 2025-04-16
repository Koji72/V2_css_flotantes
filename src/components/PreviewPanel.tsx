import React, { useRef } from 'react';

interface PreviewPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isLoading: boolean;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ iframeRef, isLoading }) => {
  return (
    <div className="preview-panel">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
          <p>Cargando vista previa...</p>
        </div>
      )}
      <iframe
        ref={iframeRef}
        title="preview"
        className="preview-iframe"
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: 'var(--bg-secondary)'
        }}
      />
    </div>
  );
};

export default PreviewPanel; 