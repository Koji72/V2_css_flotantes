import React, { useState, useEffect, useCallback, useRef } from 'react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  direction?: 'horizontal' | 'vertical';
  showRightPanel?: boolean;
}

const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  leftPanel,
  rightPanel,
  initialLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
  direction = 'horizontal',
  showRightPanel = true
}) => {
  const [leftSize, setLeftSize] = useState(`${initialLeftWidth}%`);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!showRightPanel) return;
    e.preventDefault();
    setIsResizing(true);
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
  }, [direction, showRightPanel]);

  const handleMouseMove = useCallback((clientX: number, clientY: number) => {
    if (!isResizing || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    let percentage;

    if (direction === 'horizontal') {
      percentage = ((clientX - containerRect.left) / containerRect.width) * 100;
    } else {
      percentage = ((clientY - containerRect.top) / containerRect.height) * 100;
    }

    const newSize = Math.max(minLeftWidth, Math.min(maxLeftWidth, percentage));
    setLeftSize(`${newSize}%`);
  }, [isResizing, direction, minLeftWidth, maxLeftWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
  }, []);

  useEffect(() => {
    const handleMouseMoveEvent = (e: MouseEvent) => handleMouseMove(e.clientX, e.clientY);
    const handleTouchMoveEvent = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleMouseMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMoveEvent);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMoveEvent);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveEvent);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMoveEvent);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    setLeftSize(showRightPanel ? `${initialLeftWidth}%` : '100%');
  }, [showRightPanel, initialLeftWidth]);

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <div
        ref={leftPanelRef}
        style={{
          flex: 'none',
          width: direction === 'horizontal' ? leftSize : '100%',
          height: direction === 'vertical' ? leftSize : '100%',
          overflow: 'hidden',
          transition: isResizing ? 'none' : 'all 0.1s ease-out'
        }}
      >
        {leftPanel}
      </div>

      {showRightPanel && (
        <>
          <div
            style={{
              flex: 'none',
              width: direction === 'horizontal' ? '6px' : '100%',
              height: direction === 'vertical' ? '6px' : '100%',
              background: isResizing ? '#0078d7' : '#333',
              cursor: direction === 'horizontal' ? 'col-resize' : 'row-resize',
              transition: 'background-color 0.2s ease',
              position: 'relative',
              zIndex: 10
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: direction === 'horizontal' ? '2px' : '30px',
                height: direction === 'horizontal' ? '30px' : '2px',
                background: isResizing ? '#60d0ff' : '#555'
              }}
            />
          </div>
          <div
            style={{
              flex: 1,
              overflow: 'hidden'
            }}
          >
            {rightPanel}
          </div>
        </>
      )}
    </div>
  );
};

export default ResizablePanels; 