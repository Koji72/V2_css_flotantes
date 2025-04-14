import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon, icons, LucideIcon } from 'lucide-react';

// Tipos de notificación
export type NotificationType = 'success' | 'warning' | 'info' | 'error' | 'custom';

// Estilos de panel para las notificaciones
export type NotificationStyle = 
  | 'tech' 
  | 'fantasy' 
  | 'neo' 
  | 'glass'
  | 'hologram'
  | 'tech-corners'
  | 'cut-corners'
  | 'corner-brackets'
  | 'circuit'
  | 'metal'
  | 'scroll';

// Animaciones disponibles
export type NotificationAnimation = 
  | 'none'
  | 'slide'
  | 'fade'
  | 'bounce'
  | 'pulse'
  | 'glow'
  | 'shake';

// Posiciones para las notificaciones
export type NotificationPosition = 
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

// Interfaz para las notificaciones
export interface NotificationProps {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
  style?: NotificationStyle;
  animation?: NotificationAnimation;
  icon?: LucideIcon | keyof typeof icons;
  position?: NotificationPosition;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}

// Contexto para el sistema de notificaciones
interface NotificationContextProps {
  notifications: NotificationProps[];
  addNotification: (notification: Omit<NotificationProps, 'id'>) => string;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  updateNotification: (id: string, updates: Partial<NotificationProps>) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  addNotification: () => '',
  removeNotification: () => {},
  clearAllNotifications: () => {},
  updateNotification: () => {}
});

// Hook para usar el sistema de notificaciones
export const useNotifications = () => useContext(NotificationContext);

// Componente para una notificación individual
const Notification: React.FC<NotificationProps & { onClose: () => void }> = ({
  id,
  title,
  message,
  type,
  style = 'tech',
  animation = 'slide',
  icon,
  actions = [],
  onClose
}) => {
  // Determinar el icono según el tipo
  const getIcon = () => {
    if (icon) {
      if (typeof icon === 'string' && icons[icon as keyof typeof icons]) {
        const IconComponent = icons[icon as keyof typeof icons];
        return <IconComponent size={20} />;
      } else if (typeof icon !== 'string') {
        const IconComponent = icon;
        return <IconComponent size={20} />;
      }
    }

    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'error':
        return <AlertOctagon size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  // Determinar las clases según el tipo, estilo y animación
  const getTypeClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-800 border-green-500 text-green-100';
      case 'warning':
        return 'bg-yellow-800 border-yellow-500 text-yellow-100';
      case 'error':
        return 'bg-red-800 border-red-500 text-red-100';
      case 'info':
        return 'bg-blue-800 border-blue-500 text-blue-100';
      case 'custom':
      default:
        return 'bg-gray-800 border-gray-500 text-gray-100';
    }
  };

  const getStyleClasses = () => {
    switch (style) {
      case 'tech':
        return 'floating-tech';
      case 'fantasy':
        return 'floating-fantasy';
      case 'neo':
        return 'floating-neo';
      case 'glass':
        return 'floating-glass';
      case 'hologram':
        return 'floating-hologram';
      case 'tech-corners':
        return 'floating-tech-corners';
      case 'cut-corners':
        return 'floating-cut-corners';
      case 'corner-brackets':
        return 'floating-corner-brackets';
      case 'circuit':
        return 'floating-circuit';
      case 'metal':
        return 'floating-metal';
      case 'scroll':
        return 'floating-scroll';
      default:
        return 'floating-tech';
    }
  };

  const getAnimationClasses = () => {
    switch (animation) {
      case 'slide':
        return 'animate-slideIn';
      case 'fade':
        return 'animate-fade';
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'glow':
        return 'animate-glow';
      case 'shake':
        return 'animate-shake';
      case 'none':
      default:
        return '';
    }
  };

  const getActionButtonClass = (variant: string = 'primary') => {
    switch (variant) {
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-500';
      case 'danger':
        return 'bg-red-600 hover:bg-red-500';
      case 'primary':
      default:
        return 'bg-blue-600 hover:bg-blue-500';
    }
  };

  return (
    <div
      className={`
        notification floating-element ${getStyleClasses()} ${getAnimationClasses()}
        max-w-sm w-full shadow-xl overflow-hidden mb-4 relative
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="panel-header flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2">{getIcon()}</span>
          <h3 className="font-bold">{title}</h3>
        </div>
        <button
          onClick={onClose}
          className="text-white opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Cerrar notificación"
        >
          <X size={18} />
        </button>
      </div>

      <div className="panel-content overflow-hidden">
        <div className="mb-3">{message}</div>
        
        {actions.length > 0 && (
          <div className="flex space-x-2 justify-end">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.onClick();
                  onClose();
                }}
                className={`px-3 py-1 rounded text-white text-sm ${getActionButtonClass(action.variant)}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para el contenedor de notificaciones
const NotificationContainer: React.FC<{
  notifications: NotificationProps[];
  position: NotificationPosition;
  onClose: (id: string) => void;
}> = ({ notifications, position, onClose }) => {
  // Determinar las clases de posición
  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
      default:
        return 'top-4 right-4';
    }
  };

  // Filtrar notificaciones por posición
  const filteredNotifications = notifications.filter(
    notification => (notification.position || 'top-right') === position
  );

  if (filteredNotifications.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed z-50 flex flex-col items-end ${getPositionClasses()} pointer-events-none`}
      role="log"
    >
      {filteredNotifications.map(notification => (
        <div key={notification.id} className="pointer-events-auto">
          <Notification {...notification} onClose={() => onClose(notification.id)} />
        </div>
      ))}
    </div>
  );
};

// Proveedor del sistema de notificaciones
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);
  const [mounted, setMounted] = useState(false);

  // Montar el componente solo en el cliente
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Añadir una nueva notificación
  const addNotification = useCallback((notification: Omit<NotificationProps, 'id'>) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newNotification: NotificationProps = {
      ...notification,
      id,
      position: notification.position || 'top-right',
      duration: notification.duration || 5000,
      style: notification.style || 'tech',
      animation: notification.animation || 'slide'
    };

    setNotifications(prev => [...prev, newNotification]);

    // Configurar temporizador para eliminar la notificación
    if (newNotification.duration !== Infinity) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Eliminar una notificación por ID
  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Limpiar todas las notificaciones
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Actualizar una notificación existente
  const updateNotification = useCallback((id: string, updates: Partial<NotificationProps>) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, ...updates }
          : notification
      )
    );
  }, []);

  // Valor del contexto
  const contextValue = {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    updateNotification
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      {mounted && (
        <>
          {createPortal(
            <NotificationContainer
              notifications={notifications}
              position="top-right"
              onClose={removeNotification}
            />,
            document.body
          )}
          {createPortal(
            <NotificationContainer
              notifications={notifications}
              position="top-left"
              onClose={removeNotification}
            />,
            document.body
          )}
          {createPortal(
            <NotificationContainer
              notifications={notifications}
              position="bottom-right"
              onClose={removeNotification}
            />,
            document.body
          )}
          {createPortal(
            <NotificationContainer
              notifications={notifications}
              position="bottom-left"
              onClose={removeNotification}
            />,
            document.body
          )}
          {createPortal(
            <NotificationContainer
              notifications={notifications}
              position="top-center"
              onClose={removeNotification}
            />,
            document.body
          )}
          {createPortal(
            <NotificationContainer
              notifications={notifications}
              position="bottom-center"
              onClose={removeNotification}
            />,
            document.body
          )}
        </>
      )}
    </NotificationContext.Provider>
  );
};

// Estilos CSS para las animaciones
export const NotificationStyles = () => {
  return (
    <style jsx global>{`
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      
      .animate-slideIn {
        animation: slideIn 0.3s ease-out forwards;
      }
      
      .animate-fade {
        animation: fadeIn 0.3s ease-out forwards;
      }
      
      .notification {
        transition: all 0.3s ease;
      }
      
      .notification .panel-header {
        padding: 0.75rem 1rem;
      }
      
      .notification .panel-content {
        padding: 0.75rem 1rem;
      }
    `}</style>
  );
};

// Componente de demostración para las notificaciones
export const NotificationDemo: React.FC = () => {
  const { addNotification, clearAllNotifications } = useNotifications();

  const showSuccessNotification = () => {
    addNotification({
      title: 'Operación exitosa',
      message: 'Los cambios han sido guardados correctamente.',
      type: 'success',
      style: 'tech',
      animation: 'slide',
      position: 'top-right'
    });
  };

  const showWarningNotification = () => {
    addNotification({
      title: 'Advertencia',
      message: 'Has realizado cambios que podrían afectar a otros elementos.',
      type: 'warning',
      style: 'fantasy',
      animation: 'pulse',
      position: 'top-left'
    });
  };

  const showErrorNotification = () => {
    addNotification({
      title: 'Error',
      message: 'No se pudieron guardar los cambios. Intenta de nuevo más tarde.',
      type: 'error',
      style: 'neo',
      animation: 'shake',
      position: 'bottom-right',
      actions: [
        {
          label: 'Reintentar',
          onClick: () => console.log('Reintentando...'),
          variant: 'primary'
        },
        {
          label: 'Cancelar',
          onClick: () => console.log('Cancelado'),
          variant: 'secondary'
        }
      ]
    });
  };

  const showInfoNotification = () => {
    addNotification({
      title: 'Información',
      message: 'Hay actualizaciones disponibles para el sistema.',
      type: 'info',
      style: 'glass',
      animation: 'fade',
      position: 'bottom-left'
    });
  };

  const showCustomNotification = () => {
    addNotification({
      title: 'Nueva Misión',
      message: 'Has descubierto una nueva misión. ¿Quieres aceptarla ahora?',
      type: 'custom',
      style: 'corner-brackets',
      animation: 'bounce',
      position: 'top-center',
      icon: 'Map',
      actions: [
        {
          label: 'Aceptar',
          onClick: () => console.log('Misión aceptada'),
          variant: 'primary'
        },
        {
          label: 'Más tarde',
          onClick: () => console.log('Misión pospuesta'),
          variant: 'secondary'
        }
      ]
    });
  };

  const showPersistentNotification = () => {
    addNotification({
      title: 'Notificación Persistente',
      message: 'Esta notificación no desaparecerá automáticamente hasta que la cierres.',
      type: 'info',
      style: 'hologram',
      animation: 'glow',
      position: 'bottom-center',
      duration: Infinity
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Demostración de Notificaciones</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <button
          onClick={showSuccessNotification}
          className="bg-green-600 hover:bg-green-700 text-white rounded-md py-2 transition-colors"
        >
          Éxito
        </button>
        
        <button
          onClick={showWarningNotification}
          className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md py-2 transition-colors"
        >
          Advertencia
        </button>
        
        <button
          onClick={showErrorNotification}
          className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 transition-colors"
        >
          Error
        </button>
        
        <button
          onClick={showInfoNotification}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 transition-colors"
        >
          Información
        </button>
        
        <button
          onClick={showCustomNotification}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 transition-colors"
        >
          Personalizada
        </button>
        
        <button
          onClick={showPersistentNotification}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 transition-colors"
        >
          Persistente
        </button>
        
        <button
          onClick={clearAllNotifications}
          className="bg-gray-600 hover:bg-gray-700 text-white rounded-md py-2 transition-colors md:col-span-3"
        >
          Limpiar todas
        </button>
      </div>
      
      <NotificationStyles />
    </div>
  );
}; 