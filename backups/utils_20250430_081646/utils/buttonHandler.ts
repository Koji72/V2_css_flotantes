/**
 * Manejador de eventos para botones en paneles markdown
 * Gestiona la captura y procesamiento de eventos de botones interactivos
 */

// Interfaz para los datos del evento de botón
export interface PanelButtonEvent {
  action: string;
  buttonId: string;
  buttonText: string;
  panelId?: string;
  sourceEvent?: Event;
}

// Mapa de manejadores de acciones registrados
const actionHandlers: Map<string, (event: PanelButtonEvent) => void> = new Map();

/**
 * Registra un manejador para una acción específica de botón
 * @param action Nombre de la acción (ej: "guardar", "cancelar")
 * @param handler Función manejadora que procesará el evento
 */
export function registerButtonAction(
  action: string, 
  handler: (event: PanelButtonEvent) => void
): void {
  actionHandlers.set(action, handler);
  console.log(`[ButtonHandler] Acción registrada: ${action}`);
}

/**
 * Elimina un manejador de acción previamente registrado
 * @param action Nombre de la acción a eliminar
 */
export function unregisterButtonAction(action: string): void {
  if (actionHandlers.has(action)) {
    actionHandlers.delete(action);
    console.log(`[ButtonHandler] Acción eliminada: ${action}`);
  }
}

/**
 * Manejador por defecto para acciones no registradas
 */
function defaultButtonHandler(event: PanelButtonEvent): void {
  console.warn(`[ButtonHandler] No hay manejador registrado para la acción: ${event.action}`);
}

/**
 * Procesa los eventos de clic en botones
 * @param event Evento con los detalles del botón
 */
export function handleButtonClick(event: Event): void {
  const button = event.target as HTMLElement;
  if (!button || !button.hasAttribute('data-action')) {
    console.error('[ButtonHandler] Botón sin atributo data-action');
    return;
  }

  const action = button.getAttribute('data-action') || '';
  const buttonId = button.id || `button-${Date.now()}`;
  const buttonText = button.textContent || '';
  const panelId = button.closest('.panel')?.id;

  const buttonEvent: PanelButtonEvent = {
    action,
    buttonId,
    buttonText,
    panelId,
    sourceEvent: event
  };

  console.log(`[ButtonHandler] Botón clickeado: "${buttonText}" (acción: ${action})`);

  // Buscar un manejador registrado para esta acción
  if (actionHandlers.has(action)) {
    console.log(`[ButtonHandler] Ejecutando manejador para acción: ${action}`);
    actionHandlers.get(action)!(buttonEvent);
  } else {
    // Si no hay manejador específico, usar el manejador por defecto
    console.log(`[ButtonHandler] Sin manejador específico, utilizando default para acción: ${action}`);
    defaultButtonHandler(buttonEvent);
  }
}

/**
 * Inicializa el manejador de eventos de botones
 * Debe llamarse una vez al iniciar la aplicación
 */
export function initButtonHandler(): void {
  console.log('[ButtonHandler] Inicializando handler de botones...');
  
  // Eliminar listeners previos si existen
  document.removeEventListener('panel-button-click', handleButtonClick);
  document.removeEventListener('panel-button-action', handleButtonClick);
  
  // Añadir listeners para capturar eventos de botones (ambos tipos para compatibilidad)
  document.addEventListener('panel-button-click', handleButtonClick);
  document.addEventListener('panel-button-action', handleButtonClick);
  
  // Registrar manejadores para acciones comunes
  if (!actionHandlers.has('mostrar-mensaje')) {
    registerButtonAction('mostrar-mensaje', (event) => {
      const message = event.sourceEvent?.currentTarget instanceof HTMLElement ? 
        event.sourceEvent.currentTarget.getAttribute('data-message') : null;
      
      alert(message || `Mensaje del botón: ${event.buttonText}`);
    });
  }
  
  if (!actionHandlers.has('cambiar-tema')) {
    registerButtonAction('cambiar-tema', () => {
      document.body.classList.toggle('dark-theme');
      document.body.classList.toggle('dark-mode');
    });
  }
  
  console.log('[ButtonHandler] Inicializado y escuchando eventos de botones');
}

// Inicializar el sistema de eventos
document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target?.classList.contains('panel-button')) {
    handleButtonClick(event);
  }
});

/**
 * Ejemplo de uso:
 * 
 * // Importar en el archivo principal
 * import { initButtonHandler, registerButtonAction } from './utils/buttonHandler';
 * 
 * // Inicializar una vez al cargar la aplicación
 * initButtonHandler();
 * 
 * // Registrar manejadores para acciones específicas
 * registerButtonAction('guardar', (event) => {
 *   console.log('Guardando datos...', event);
 *   // Implementar lógica de guardado
 * });
 */

// Exportar singleton para uso en la aplicación
export default {
  init: initButtonHandler,
  register: registerButtonAction,
  unregister: unregisterButtonAction
}; 