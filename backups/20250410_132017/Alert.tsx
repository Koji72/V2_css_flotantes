import React, { useEffect } from 'react';

export interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
  duration?: number; // Duración en ms
}

/**
 * Componente de alerta que se muestra temporalmente y se cierra automáticamente
 */
const Alert: React.FC<AlertProps> = ({ 
  message, 
  type, 
  onDismiss, 
  duration = 5000 // 5 segundos por defecto
}) => {
  // Auto-cerrar después del tiempo especificado
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [onDismiss, duration]);
  
  // Determinar color de fondo basado en el tipo
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];
  
  return (
    <div 
      className={`fixed top-4 right-4 p-4 rounded-md ${bgColor} text-white shadow-lg max-w-xs z-50 flex items-center justify-between animate-fade-in`} 
      role="alert"
    >
      <p>{message}</p>
      <button 
        className="ml-4 text-white hover:text-gray-200" 
        onClick={onDismiss} 
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
};

export default Alert; 