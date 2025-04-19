import React, { useState, useEffect, ReactNode } from 'react';

interface ResizablePanelProps {
  leftPanel: ReactNode;
  rightPanel: ReactNode;
  initialLeftWidth?: number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  leftPanel,
  rightPanel,
  initialLeftWidth = 50
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    document.body.classList.add('resizing');
  };

  const resize = (e: MouseEvent) => {
    if (!isResizing) return;

    const container = e.currentTarget as Window;
    const containerWidth = container.innerWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;

    if (newLeftWidth >= 20 && newLeftWidth <= 80) {
      setLeftWidth(newLeftWidth);
      // Forzar reflow para una actualización más suave
      window.requestAnimationFrame(() => {
        document.body.style.cursor = 'col-resize';
      });
    }
  };

  const stopResize = () => {
    setIsResizing(false);
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
    document.body.classList.remove('resizing');
    document.body.style.cursor = '';
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
      document.body.classList.remove('resizing');
      document.body.style.cursor = '';
    };
  }, [isResizing]);

  return (
    <div className="resizable-container" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      <div 
        className="editor-container" 
        style={{ 
          width: `${leftWidth}%`,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {leftPanel}
      </div>

      <div
        className="resizer"
        onMouseDown={startResize}
        style={{
          width: '6px',
          backgroundColor: 'var(--border-color)',
          cursor: 'col-resize',
          transition: 'background-color 0.2s',
          zIndex: 10
        }}
      />

      <div 
        className="preview-container" 
        style={{ 
          width: `${100 - leftWidth - 0.5}%`,
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanel; 