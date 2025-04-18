# 🔄 Interacción avanzada con botones en paneles

Este documento muestra cómo implementar interacciones avanzadas con botones en paneles flotantes.

## Escucha de eventos básica

Los botones en paneles disparan eventos personalizados que pueden ser capturados usando JavaScript:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonText, buttonId, panelId } = event.detail;
  console.log(`Botón clickeado: ${buttonText} (acción: ${action})`);
  
  // Implementar lógica específica según la acción
  if (action === 'mostrar-mensaje') {
    alert('¡Evento capturado correctamente!');
  }
});
```

::panel{layout="float-right" width="40%"}
### Prueba de eventos

::button{action="mostrar-mensaje" style="primary"}Mostrar mensaje::

::button{action="cambiar-tema" style="secondary"}Cambiar tema::

Estos botones disparan eventos que pueden ser procesados por la aplicación.
::

## Comunicación entre paneles

Los botones pueden utilizarse para establecer comunicación entre diferentes paneles:

::panel{layout="float-left" width="45%" id="panel-origen"}
### Panel origen

Este panel contiene botones que afectan a otro panel:

::button{action="actualizar-destino" style="primary" data-target="panel-destino" data-mensaje="¡Actualización recibida!"}Actualizar panel destino::

::button{action="restablecer-destino" style="warning" data-target="panel-destino"}Restablecer::
::

::panel{layout="float-right" width="45%" id="panel-destino"}
### Panel destino

Este panel se actualiza cuando se presionan los botones del panel origen.

<div id="mensaje-destino">Esperando actualización...</div>
::

<div style="clear:both"></div>

## Implementación de la lógica

Para implementar esta funcionalidad, necesitas agregar este script a tu aplicación:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonId, buttonText } = event.detail;
  const button = document.getElementById(buttonId);
  
  if (!button) return;
  
  // Obtener atributos de datos personalizados
  const targetPanelId = button.getAttribute('data-target');
  const mensaje = button.getAttribute('data-mensaje');
  
  // Comunicación entre paneles
  if (action === 'actualizar-destino' && targetPanelId) {
    const panelDestino = document.getElementById(targetPanelId);
    if (panelDestino) {
      const mensajeElement = panelDestino.querySelector('#mensaje-destino');
      if (mensajeElement) {
        mensajeElement.textContent = mensaje || 'Panel actualizado';
        mensajeElement.style.color = '#00aa00';
      }
    }
  }
  
  // Acción de restablecimiento
  if (action === 'restablecer-destino' && targetPanelId) {
    const panelDestino = document.getElementById(targetPanelId);
    if (panelDestino) {
      const mensajeElement = panelDestino.querySelector('#mensaje-destino');
      if (mensajeElement) {
        mensajeElement.textContent = 'Esperando actualización...';
        mensajeElement.style.color = '';
      }
    }
  }
  
  // Acción de cambio de tema
  if (action === 'cambiar-tema') {
    document.body.classList.toggle('dark-theme');
    button.textContent = document.body.classList.contains('dark-theme') 
      ? 'Tema claro' 
      : 'Tema oscuro';
  }
});
```

## Botones con confirmación

Algunos botones pueden requerir confirmación antes de ejecutar su acción:

::panel{layout="float-left" width="100%"}
### Acciones críticas

::button{action="accion-peligrosa" style="danger" data-confirm="¿Está seguro de realizar esta acción peligrosa?"}Acción peligrosa::

::button{action="accion-irreversible" style="warning" data-confirm="Esta acción no se puede deshacer. ¿Desea continuar?"}Acción irreversible::

Para implementar la confirmación, añade este código:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonId } = event.detail;
  const button = document.getElementById(buttonId);
  
  if (!button) return;
  
  // Verificar si el botón requiere confirmación
  const confirmMessage = button.getAttribute('data-confirm');
  if (confirmMessage) {
    // Prevenir la acción predeterminada
    event.preventDefault();
    
    // Mostrar diálogo de confirmación
    if (confirm(confirmMessage)) {
      // Si el usuario confirma, disparar un nuevo evento personalizado
      const confirmedEvent = new CustomEvent('panel-button-confirmed', {
        detail: { action, buttonId, originalEvent: event }
      });
      document.dispatchEvent(confirmedEvent);
    }
  }
});

// Escuchar eventos confirmados
document.addEventListener('panel-button-confirmed', (event) => {
  const { action } = event.detail;
  console.log(`Acción confirmada: ${action}`);
  // Implementar lógica específica para acciones confirmadas
});
```
::

## Estados dinámicos de botones

Los botones pueden cambiar su estado dinámicamente:

::panel{layout="float-right" width="40%"}
### Botones con estados

::button{action="toggle-loading" style="primary" id="btn-loading"}Activar carga::

::button{action="toggle-disabled" style="secondary" id="btn-disabled"}Deshabilitar::

Los estados se controlan mediante JavaScript:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonId } = event.detail;
  const button = document.getElementById(buttonId);
  
  if (action === 'toggle-loading') {
    // Alternar estado de carga
    const isLoading = button.getAttribute('data-loading') === 'true';
    button.setAttribute('data-loading', isLoading ? 'false' : 'true');
    // Restaurar después de 2 segundos si está en carga
    if (!isLoading) {
      setTimeout(() => {
        button.setAttribute('data-loading', 'false');
      }, 2000);
    }
  }
  
  if (action === 'toggle-disabled') {
    // Alternar estado deshabilitado
    const isDisabled = button.hasAttribute('disabled');
    if (isDisabled) {
      button.removeAttribute('disabled');
      button.textContent = 'Deshabilitar';
    } else {
      button.setAttribute('disabled', 'true');
      button.textContent = 'Habilitado (clic para cambiar)';
      // Habilitar después de 3 segundos
      setTimeout(() => {
        button.removeAttribute('disabled');
        button.textContent = 'Deshabilitar';
      }, 3000);
    }
  }
});
```
::

## Conclusión

Los botones en paneles flotantes pueden implementar interacciones complejas cuando se combinan con JavaScript personalizado. Esta capacidad permite crear documentos markdown verdaderamente interactivos que pueden:

1. Responder a acciones del usuario
2. Comunicarse entre diferentes secciones del documento
3. Implementar lógica de aplicación directamente desde el contenido markdown
4. Ofrecer una experiencia de usuario enriquecida con feedback visual

::panel{layout="float-left" width="100%"}
### Próximos pasos

::button{action="ver-ejemplos" style="primary"}Ver más ejemplos::
::button{action="ver-documentacion" style="secondary"}Documentación completa::
::button{action="descargar-codigo" style="success"}Descargar código::

La combinación de paneles flotantes y botones interactivos transforma la documentación estática en interfaces dinámicas.
:: 