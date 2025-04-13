import { useState, useCallback } from 'react';

type ElementStyle = 'tech' | 'hologram' | 'neo' | 'circuit' | 'glass' | 'default';
type ElementPosition = 'left' | 'right' | 'center';
type ElementAnimation = 'pulse' | 'rotate' | 'fade' | 'none';

interface FloatingElementConfig {
  id: string;
  title?: string;
  position: ElementPosition;
  style: ElementStyle;
  width: string;
  animation: ElementAnimation;
  content: string;
}

interface ColumnConfig {
  id: string;
  columns: 2 | 3;
  style: 'parchment' | 'modern' | 'tech' | 'default';
  gap: string;
  content: string;
}

interface UseLayoutElementsReturn {
  floatingElements: FloatingElementConfig[];
  columns: ColumnConfig[];
  addFloatingElement: (element: Omit<FloatingElementConfig, 'id'>) => string;
  updateFloatingElement: (id: string, element: Partial<FloatingElementConfig>) => void;
  removeFloatingElement: (id: string) => void;
  addColumn: (column: Omit<ColumnConfig, 'id'>) => string;
  updateColumn: (id: string, column: Partial<ColumnConfig>) => void;
  removeColumn: (id: string) => void;
  resetElements: () => void;
}

/**
 * Hook personalizado para gestionar elementos de diseño como paneles flotantes y columnas
 */
export const useLayoutElements = (): UseLayoutElementsReturn => {
  const [floatingElements, setFloatingElements] = useState<FloatingElementConfig[]>([]);
  const [columns, setColumns] = useState<ColumnConfig[]>([]);
  
  // Función para generar un ID único
  const generateId = () => `el_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  
  // Añadir un nuevo elemento flotante
  const addFloatingElement = useCallback((element: Omit<FloatingElementConfig, 'id'>) => {
    const id = generateId();
    const newElement = { ...element, id };
    
    setFloatingElements(prev => [...prev, newElement]);
    return id;
  }, []);
  
  // Actualizar un elemento flotante existente
  const updateFloatingElement = useCallback((id: string, element: Partial<FloatingElementConfig>) => {
    setFloatingElements(prev => 
      prev.map(el => el.id === id ? { ...el, ...element } : el)
    );
  }, []);
  
  // Eliminar un elemento flotante
  const removeFloatingElement = useCallback((id: string) => {
    setFloatingElements(prev => prev.filter(el => el.id !== id));
  }, []);
  
  // Añadir una nueva columna
  const addColumn = useCallback((column: Omit<ColumnConfig, 'id'>) => {
    const id = generateId();
    const newColumn = { ...column, id };
    
    setColumns(prev => [...prev, newColumn]);
    return id;
  }, []);
  
  // Actualizar una columna existente
  const updateColumn = useCallback((id: string, column: Partial<ColumnConfig>) => {
    setColumns(prev => 
      prev.map(col => col.id === id ? { ...col, ...column } : col)
    );
  }, []);
  
  // Eliminar una columna
  const removeColumn = useCallback((id: string) => {
    setColumns(prev => prev.filter(col => col.id !== id));
  }, []);
  
  // Resetear todos los elementos
  const resetElements = useCallback(() => {
    setFloatingElements([]);
    setColumns([]);
  }, []);
  
  return {
    floatingElements,
    columns,
    addFloatingElement,
    updateFloatingElement,
    removeFloatingElement,
    addColumn,
    updateColumn,
    removeColumn,
    resetElements
  };
};

export default useLayoutElements; 