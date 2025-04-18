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
  // Calcular el ancho inicial basado en showRightPanel
  const [leftWidth, setLeftWidth] = useState(showRightPanel ? initialLeftWidth : 100);
  const [isResizing, setIsResizing] = useState(false);
  const requestRef = useRef<number | null>(null);
  const lastMousePosRef = useRef<{x: number, y: number}>({x: 0, y: 0});
  const containerRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  
  // Calcular el ancho derecho basado en el ancho izquierdo
  const rightWidth = 100 - leftWidth;
  
  // Método para actualizar directamente los tamaños usando flex-basis
  const updatePanelSizes = useCallback((newLeftWidthPercent: number) => {
    if (!leftPanelRef.current) return;
    
    // Si no se muestra el panel derecho, asignar 100% al panel izquierdo
    const finalLeftWidth = showRightPanel ? newLeftWidthPercent : 100;
    const finalRightWidth = 100 - finalLeftWidth;
    
    const leftBasis = `${finalLeftWidth}%`;
    const rightBasis = `${finalRightWidth}%`;
    
    if (direction === 'horizontal') {
      // Aplicar estilos directamente para evitar problemas con flexbox
      leftPanelRef.current.style.width = leftBasis;
      leftPanelRef.current.style.flexBasis = leftBasis;
      leftPanelRef.current.style.height = '100%';
      leftPanelRef.current.style.minWidth = leftBasis;
      leftPanelRef.current.style.maxWidth = leftBasis;
      
      if (rightPanelRef.current && showRightPanel) {
        rightPanelRef.current.style.width = rightBasis;
        rightPanelRef.current.style.flexBasis = rightBasis;
        rightPanelRef.current.style.height = '100%';
        rightPanelRef.current.style.minWidth = rightBasis;
        rightPanelRef.current.style.maxWidth = rightBasis;
      }
    } else {
      // Para layout vertical
      leftPanelRef.current.style.height = leftBasis;
      leftPanelRef.current.style.flexBasis = leftBasis;
      leftPanelRef.current.style.width = '100%';
      leftPanelRef.current.style.minHeight = leftBasis;
      leftPanelRef.current.style.maxHeight = leftBasis;
      
      if (rightPanelRef.current && showRightPanel) {
        rightPanelRef.current.style.height = rightBasis;
        rightPanelRef.current.style.flexBasis = rightBasis;
        rightPanelRef.current.style.width = '100%';
        rightPanelRef.current.style.minHeight = rightBasis;
        rightPanelRef.current.style.maxHeight = rightBasis;
      }
    }
  }, [direction, showRightPanel]);

  // Gestor de inicio de resize
  const startResize = useCallback((e: React.MouseEvent) => {
    // Solo permitir resize si se muestra el panel derecho
    if (!showRightPanel) return;
    
    e.preventDefault();
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    setIsResizing(true);
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    
    // Añadir clase resizing al contenedor
    if (containerRef.current) {
      containerRef.current.classList.add('resizing');
    }
    
    // Deshabilitar selección de texto durante el resize
    document.body.style.userSelect = 'none';
    
    // Añadir clase active al divisor para efectos visuales
    if (dividerRef.current) {
      dividerRef.current.classList.add('active');
    }
    
    // Quitar transiciones para movimiento directo
    if (leftPanelRef.current) {
      leftPanelRef.current.style.transition = 'none';
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.style.transition = 'none';
    }
  }, [direction, showRightPanel]);

  // Función para aplicar el resize directamente sin esperar a re-renders
  const applyResize = useCallback((clientX: number, clientY: number) => {
    // No aplicar resize si no se muestra el panel derecho
    if (!showRightPanel) return;
    
    const container = containerRef.current;
    if (!container) return;
    
    const rect = container.getBoundingClientRect();
    let newLeftWidth;
    
    if (direction === 'horizontal') {
      // Calcular el porcentaje horizontal con mayor precisión
      const pixelOffset = clientX - rect.left;
      newLeftWidth = (pixelOffset / rect.width) * 100;
    } else {
      // Calcular el porcentaje vertical con mayor precisión
      const pixelOffset = clientY - rect.top;
      newLeftWidth = (pixelOffset / rect.height) * 100;
    }
    
    // Limitar el ancho izquierdo a los valores mínimo y máximo
    newLeftWidth = Math.max(minLeftWidth, Math.min(maxLeftWidth, newLeftWidth));
    
    // Actualizar DOM directamente para mayor rendimiento
    updatePanelSizes(newLeftWidth);
    
    // Actualizamos el estado solo ocasionalmente para evitar demasiados re-renders
    if (Math.abs(newLeftWidth - leftWidth) > 0.5) {
      setLeftWidth(newLeftWidth);
    }
    
    lastMousePosRef.current = { x: clientX, y: clientY };
  }, [direction, minLeftWidth, maxLeftWidth, updatePanelSizes, leftWidth, showRightPanel]);

  // Gestor de resize con optimización de rendimiento
  const resize = useCallback((e: MouseEvent) => {
    if (!isResizing || !showRightPanel) return;
    
    // Para movimientos muy pequeños del ratón, aplicar cambio inmediatamente sin animación
    if (Math.abs(e.clientX - lastMousePosRef.current.x) < 5 && 
        Math.abs(e.clientY - lastMousePosRef.current.y) < 5) {
      applyResize(e.clientX, e.clientY);
      return;
    }
    
    // Para movimientos mayores, usar requestAnimationFrame
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
    }
    
    requestRef.current = requestAnimationFrame(() => {
      applyResize(e.clientX, e.clientY);
    });
  }, [isResizing, applyResize, showRightPanel]);

  // Gestor de finalización de resize
  const stopResize = useCallback(() => {
    if (!showRightPanel) return;
    
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    
    // Quitar clase resizing del contenedor
    if (containerRef.current) {
      containerRef.current.classList.remove('resizing');
    }
    
    // Quitar clase active del divisor
    if (dividerRef.current) {
      dividerRef.current.classList.remove('active');
    }
    
    // Restaurar transiciones suaves (ahora para flex-basis)
    if (leftPanelRef.current) {
      leftPanelRef.current.style.transition = 'flex-basis 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out';
    }
    if (rightPanelRef.current) {
      rightPanelRef.current.style.transition = 'flex-basis 0.1s ease-out, width 0.1s ease-out, height 0.1s ease-out';
    }
    
    // Cancelar cualquier animación pendiente
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    
    // Asegurar que el estado final refleje la posición real (usando getBoundingClientRect)
    const container = containerRef.current;
    if (container && leftPanelRef.current && showRightPanel) {
      const rect = container.getBoundingClientRect();
      const leftRect = leftPanelRef.current.getBoundingClientRect();
      
      let finalBasisPercent;
      if (direction === 'horizontal') {
        finalBasisPercent = (leftRect.width / rect.width) * 100;
      } else {
        finalBasisPercent = (leftRect.height / rect.height) * 100;
      }
      // Update state based on final calculation
      setLeftWidth(finalBasisPercent);
    }
  }, [direction, updatePanelSizes, showRightPanel]);

  // Configurar event listeners para el resize
  useEffect(() => {
    if (isResizing && showRightPanel) {
      window.addEventListener('mousemove', resize, { passive: true });
      window.addEventListener('mouseup', stopResize);
      window.addEventListener('mouseleave', stopResize);
      
      // Añadir control de toque para dispositivos móviles
      window.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          const touch = e.touches[0];
          resize({ clientX: touch.clientX, clientY: touch.clientY } as MouseEvent);
        }
      }, { passive: false });
      
      window.addEventListener('touchend', stopResize);
      window.addEventListener('touchcancel', stopResize);
    }
    
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResize);
      window.removeEventListener('mouseleave', stopResize);
      window.removeEventListener('touchmove', resize as any);
      window.removeEventListener('touchend', stopResize);
      window.removeEventListener('touchcancel', stopResize);
    };
  }, [isResizing, resize, stopResize, showRightPanel]);

  // Limpiar cualquier animación pendiente al desmontar
  useEffect(() => {
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  // Ajustar tamaños en cambios de dirección o cuando cambia showRightPanel
  useEffect(() => {
    // Cuando cambia la dirección, reiniciar las propiedades de tamaño
    if (leftPanelRef.current) {
      // Eliminar todas las propiedades anteriores para evitar conflictos
      leftPanelRef.current.style.width = '';
      leftPanelRef.current.style.height = '';
      leftPanelRef.current.style.flexBasis = '';
      leftPanelRef.current.style.minWidth = '';
      leftPanelRef.current.style.maxWidth = '';
      leftPanelRef.current.style.minHeight = '';
      leftPanelRef.current.style.maxHeight = '';
    }
    
    if (rightPanelRef.current) {
      // Eliminar todas las propiedades anteriores para evitar conflictos
      rightPanelRef.current.style.width = '';
      rightPanelRef.current.style.height = '';
      rightPanelRef.current.style.flexBasis = '';
      rightPanelRef.current.style.minWidth = '';
      rightPanelRef.current.style.maxWidth = '';
      rightPanelRef.current.style.minHeight = '';
      rightPanelRef.current.style.maxHeight = '';
    }
    
    // Si showRightPanel cambia a false, asignar 100% al panel izquierdo
    if (!showRightPanel) {
      setLeftWidth(100);
    } 
    // Si showRightPanel cambia a true y el panel izquierdo tenía 100%, resetear al valor inicial
    else if (leftWidth === 100) {
      setLeftWidth(initialLeftWidth);
    }
    
    // Pequeño retardo para garantizar que el DOM se actualice antes de recalcular
    setTimeout(() => {
      // Aplicar los tamaños actualizados
      updatePanelSizes(showRightPanel ? leftWidth : 100);
    }, 0);
  }, [direction, updatePanelSizes, leftWidth, showRightPanel, initialLeftWidth]);
  
  // Asegurar que el contenedor también cambie su dirección
  useEffect(() => {
    if (containerRef.current) {
      // Añadir clase para estabilizar durante el cambio
      containerRef.current.classList.add('changing-direction');
      
      // Actualizar la dirección
      if (direction === 'horizontal') {
        containerRef.current.classList.remove('flex-col');
        containerRef.current.classList.add('flex-row');
      } else {
        containerRef.current.classList.remove('flex-row');
        containerRef.current.classList.add('flex-col');
      }
      
      // Eliminar la clase de estabilización después de la transición
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.classList.remove('changing-direction');
        }
      }, 300); // Un poco más que la duración de la transición para asegurar
    }
  }, [direction]);

  // Determinar las clases CSS basadas en la dirección
  const containerClass = `flex ${direction === 'horizontal' ? 'flex-row' : 'flex-col'} h-full w-full relative`;
  const leftPanelClass = `overflow-hidden ${direction === 'horizontal' ? 'h-full' : 'w-full'}`;
  const rightPanelClass = `overflow-hidden ${direction === 'horizontal' ? 'h-full' : 'w-full'}`;
  const dividerClass = `
    divider
    bg-gray-700 flex items-center justify-center
    ${direction === 'horizontal' 
      ? 'cursor-col-resize w-1 h-full hover:w-1.5 hover:bg-blue-500 active:bg-blue-700 active:w-1.5' 
      : 'cursor-row-resize h-1 w-full hover:h-1.5 hover:bg-blue-500 active:bg-blue-700 active:h-1.5'
    }
    transition-all duration-200 ease-out
    ${isResizing ? (direction === 'horizontal' ? 'w-1.5 bg-blue-700' : 'h-1.5 bg-blue-700') : ''}
  `;

  return (
    <div 
      ref={containerRef}
      className={`resizable-container ${direction === 'vertical' ? 'flex-col' : 'flex-row'} ${showRightPanel ? '' : 'fullwidth-left'}`}
    >
      <div
        ref={leftPanelRef}
        className="panel left-panel"
        style={showRightPanel 
          ? (direction === 'horizontal' ? { width: `${leftWidth}%` } : { height: `${leftWidth}%` })
          : { width: '100%', height: '100%' }
        }
      >
        {leftPanel}
      </div>
      
      {showRightPanel && (
        <>
          <div
            ref={dividerRef}
            className={`panel-divider ${direction === 'vertical' ? 'horizontal' : 'vertical'}`}
            onMouseDown={startResize}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              startResize({ preventDefault: () => {}, clientX: touch.clientX, clientY: touch.clientY } as any);
            }}
          />
          
          <div
            ref={rightPanelRef}
            className="panel right-panel"
            style={direction === 'horizontal' ? { width: `${rightWidth}%` } : { height: `${rightWidth}%` }}
          >
            {rightPanel}
          </div>
        </>
      )}
    </div>
  );
};

export default ResizablePanels; 