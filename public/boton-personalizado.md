# 🔘 Botones personalizados en paneles flotantes

## Introducción a botones interactivos

Los botones en paneles flotantes permiten añadir interactividad a tus documentos markdown, facilitando acciones dinámicas sin salir del contexto de lectura.

::panel{layout="float-right" width="40%" style="primary"}
### Ejemplo básico de botones

Prueba estos botones para ver su comportamiento:

::button{action="saludar" style="primary"}Saludar::

::button{action="despedir" style="secondary"}Despedir::

Estos botones disparan eventos que pueden ser capturados por la aplicación.
::

## Estilos de botones disponibles

Los botones pueden tener diferentes estilos para indicar su función o importancia:

::panel{layout="float-left" width="100%"}
### Catálogo de estilos

::button{action="accion-primaria" style="primary"}Primario::
::button{action="accion-secundaria" style="secondary"}Secundario::
::button{action="accion-exito" style="success"}Éxito::
::button{action="accion-advertencia" style="warning"}Advertencia::
::button{action="accion-peligro" style="danger"}Peligro::

Cada estilo comunica visualmente un nivel diferente de importancia o tipo de acción.
::

<div style="clear:both"></div>

## Casos de uso prácticos

::panel{layout="float-left" width="48%"}
### Panel de confirmación

Este panel muestra un escenario de confirmación común:

#### ¿Desea guardar los cambios?

::button{action="guardar-cambios" style="success"}Guardar::
::button{action="descartar-cambios" style="danger"}Descartar::
::button{action="revisar-cambios" style="secondary"}Revisar::

Ideal para flujos de trabajo que requieren decisiones del usuario.
::

::panel{layout="float-right" width="48%"}
### Asistente paso a paso

Este panel simula un asistente interactivo:

#### Paso 1 de 3: Seleccione una opción

::button{action="opcion-1" style="primary"}Opción A::
::button{action="opcion-2" style="primary"}Opción B::
::button{action="opcion-3" style="primary"}Opción C::

::button{action="siguiente-paso" style="success"}Siguiente::
::button{action="cancelar-asistente" style="secondary"}Cancelar::
::

<div style="clear:both"></div>

## Integración con eventos JavaScript

Los botones en paneles disparan eventos personalizados que pueden ser capturados por JavaScript:

::panel{layout="float-left" width="100%"}
### Ejemplo de integración

```javascript
// Capturar eventos de botones en paneles
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonText, buttonId, panelId } = event.detail;
  
  console.log(`Botón "${buttonText}" con acción "${action}" fue clickeado`);
  
  // Manejar diferentes acciones
  switch (action) {
    case 'saludar':
      alert('¡Hola! Gracias por usar botones en paneles.');
      break;
    case 'despedir':
      alert('¡Hasta pronto! Vuelve cuando quieras.');
      break;
    case 'guardar-cambios':
      // Lógica para guardar cambios
      console.log('Guardando cambios...');
      // Actualizar UI...
      break;
    // Otros casos...
  }
});
```

Esta integración permite crear documentación interactiva con respuestas dinámicas a las acciones del usuario.
::

<div style="clear:both"></div>

## Botones con estados

::panel{layout="float-right" width="40%"}
### Estados de botones

Los botones pueden reflejar diferentes estados:

::button{action="toggle-estado" style="primary"}Toggle estado::

::button{action="boton-desactivado" style="secondary" disabled="true"}Desactivado::

::button{action="boton-cargando" style="primary" loading="true"}Cargando...::

Los estados visuales ayudan a los usuarios a entender el comportamiento esperado.
::

## Botones en paneles flotantes avanzados

::panel{layout="float-left" width="100%" class="glass-panel"}
### Panel flotante con efecto vidrio

Este panel utiliza una clase personalizada para un efecto visual distintivo.

::button{action="aceptar-condiciones" style="success"}Aceptar términos::
::button{action="rechazar-condiciones" style="danger"}Rechazar::

La combinación de efectos visuales y botones interactivos crea una experiencia rica para el usuario.
::

<div style="clear:both"></div>

## Sintaxis y referencia

La sintaxis para añadir botones a tus paneles es:

```markdown
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

Parámetros disponibles:
- `action`: Identificador único para la acción (requerido)
- `style`: Estilo visual del botón (primary, secondary, success, warning, danger)
- `disabled`: Establece el botón como desactivado (true/false)
- `loading`: Muestra el botón en estado de carga (true/false)

## Accesibilidad

::panel{layout="float-left" width="100%"}
### Consideraciones de accesibilidad

Al diseñar interfaces con botones en paneles, asegúrate de:

1. Usar texto descriptivo que explique claramente la acción
2. Mantener suficiente contraste entre el texto y el fondo del botón
3. Proporcionar alternativas de teclado para todas las interacciones
4. Incluir estados visuales distinguibles (hover, focus, active)

::button{action="mas-info-accesibilidad" style="info"}Más información sobre accesibilidad::
::

<div style="clear:both"></div>

## Conclusión

Los botones en paneles flotantes transforman la documentación estática en interfaces interactivas, mejorando significativamente la experiencia del usuario y permitiendo crear flujos de trabajo guiados dentro de tus documentos markdown.

::panel{layout="float-right" width="40%"}
### ¿Te ha resultado útil?

::button{action="util-si" style="success"}Sí, muy útil::
::button{action="util-no" style="warning"}Necesito más ejemplos::

¡Gracias por tu feedback!
:: 