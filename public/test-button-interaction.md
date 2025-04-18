# Prueba de Interacción de Botones en Paneles Markdown

Este documento sirve como prueba para validar la correcta implementación y funcionamiento de botones interactivos dentro de paneles markdown.

## Panel Básico con Botones

::: panel
### Panel con Botones Estándar

Este panel contiene botones con diferentes acciones y estilos para probar la funcionalidad básica.

::button{action="alert" style="primary"}Mostrar Alerta::

::button{action="confirm" style="secondary"}Confirmar Acción::

::button{action="navigate" style="info"}Navegar::
:::

## Panel Flotante con Botones de Acción

::: panel{.floating .right .w-40 .glass}
### Acciones del Sistema

Panel flotante con botones que ejecutan acciones del sistema.

::button{action="save" style="success"}Guardar Documento::

::button{action="delete" style="danger"}Eliminar Documento::

::button{action="export" style="warning"}Exportar Contenido::
:::

## Prueba de Estados de Botón

::: panel
### Estados de Botones

Esta sección prueba los diferentes estados que pueden tener los botones.

::button{action="normal" style="primary"}Botón Normal::

::button{action="disabled" style="primary" disabled="true"}Botón Deshabilitado::

::button{action="loading" style="primary" loading="true"}Botón Cargando::
:::

## Estilos de Botones

::: panel
### Variantes de Estilo

Prueba de todas las variantes de estilo disponibles para los botones.

::button{action="style-default"}Estilo Default::

::button{action="style-primary" style="primary"}Estilo Primary::

::button{action="style-secondary" style="secondary"}Estilo Secondary::

::button{action="style-success" style="success"}Estilo Success::

::button{action="style-danger" style="danger"}Estilo Danger::

::button{action="style-warning" style="warning"}Estilo Warning::

::button{action="style-info" style="info"}Estilo Info::
:::

## Botones con Parámetros

::: panel
### Botones con Parámetros Adicionales

Estos botones incluyen parámetros adicionales para probar la capacidad de transmitir datos.

::button{action="edit" style="primary" data-id="doc-123" data-type="markdown"}Editar Documento::

::button{action="share" style="info" data-url="https://example.com/doc" data-title="Documento Compartido"}Compartir::
:::

## Prueba de Interacción Compleja

::: panel{.glass}
### Interacción con Panel Dinámico

Este panel prueba la interacción con contenido dinámico.

::button{action="toggle-content" style="primary"}Mostrar/Ocultar Contenido::

<div id="dynamic-content" style="display:none;">
  <p>Este contenido se muestra/oculta dinámicamente.</p>
  
  ::button{action="nested-action" style="secondary"}Acción Anidada::
</div>
:::

## Prueba de Botones en Paneles Anidados

::: panel
### Panel Principal
Contenido del panel principal

::button{action="main-action" style="primary"}Acción Principal::

::: panel{.nested}
#### Panel Anidado
Contenido del panel anidado

::button{action="nested-action" style="secondary"}Acción en Panel Anidado::
:::
:::

## Detección de Eventos

::: panel{.event-monitor}
### Monitor de Eventos

Este panel mostrará los eventos capturados al hacer clic en los botones de esta página.

<div id="event-log" style="height: 150px; overflow-y: auto; border: 1px solid #ccc; padding: 8px; background: #f5f5f5;">
  <p><i>Los eventos aparecerán aquí al hacer clic en botones...</i></p>
</div>
:::

## Prueba de Rendimiento

::: panel
### Prueba de Rendimiento con Múltiples Botones

Esta sección genera múltiples botones para probar el rendimiento del sistema.

<div id="performance-test">
  <!-- Los botones se generarán mediante JavaScript -->
</div>

::button{action="generate-buttons" style="primary"}Generar 50 Botones::
:::

<script>
// Código para registrar eventos y mostrarlos en el panel de monitor
document.addEventListener('button:action', function(e) {
  const eventLog = document.getElementById('event-log');
  const logEntry = document.createElement('p');
  logEntry.innerHTML = `⚡ <strong>${e.detail.action}</strong>: ${JSON.stringify(e.detail.data || {})}`;
  eventLog.appendChild(logEntry);
  eventLog.scrollTop = eventLog.scrollHeight;
});

// Lógica para el botón de mostrar/ocultar contenido
document.addEventListener('button:toggle-content', function() {
  const content = document.getElementById('dynamic-content');
  content.style.display = content.style.display === 'none' ? 'block' : 'none';
});

// Lógica para generar múltiples botones para prueba de rendimiento
document.addEventListener('button:generate-buttons', function() {
  const container = document.getElementById('performance-test');
  container.innerHTML = '';
  
  const startTime = performance.now();
  
  for (let i = 1; i <= 50; i++) {
    const buttonWrapper = document.createElement('span');
    buttonWrapper.innerHTML = `::button{action="perf-${i}" style="${i % 5 === 0 ? 'primary' : i % 4 === 0 ? 'success' : i % 3 === 0 ? 'danger' : i % 2 === 0 ? 'warning' : 'secondary'}"}Botón ${i}::`;
    container.appendChild(buttonWrapper);
    
    if (i % 10 === 0) {
      container.appendChild(document.createElement('br'));
    }
  }
  
  const endTime = performance.now();
  
  const logEntry = document.createElement('p');
  logEntry.innerHTML = `⏱️ Tiempo para generar 50 botones: ${(endTime - startTime).toFixed(2)}ms`;
  document.getElementById('event-log').appendChild(logEntry);
  
  // Reprocessar el markdown para renderizar los botones generados
  if (window.previewManager && typeof window.previewManager.reprocessCurrentContent === 'function') {
    window.previewManager.reprocessCurrentContent();
  }
});

// Simulaciones básicas para acciones comunes
document.addEventListener('button:alert', () => alert('Acción de alerta ejecutada'));
document.addEventListener('button:confirm', () => confirm('¿Estás seguro de realizar esta acción?'));
document.addEventListener('button:navigate', () => {
  const destination = prompt('Introduce la URL destino', 'https://');
  if (destination) window.open(destination, '_blank');
});
</script>

## Instrucciones para Evaluación

1. **Verificar Renderizado**: Todos los botones deben mostrarse correctamente con sus estilos aplicados.
2. **Probar Interacciones**: Hacer clic en los diferentes botones y verificar que ejecutan las acciones esperadas.
3. **Validar Estados**: Comprobar que los estados deshabilitado y cargando se visualizan correctamente.
4. **Monitorear Eventos**: Observar el panel "Monitor de Eventos" para confirmar que se emiten los eventos adecuados.
5. **Prueba de Carga**: Utilizar el botón "Generar 50 Botones" para verificar el rendimiento con muchos elementos.
6. **Prueba de Teclado**: Verificar que los botones son navegables y activables mediante teclado (Tab + Enter).

---

*Documento de prueba generado por SW-Tester* 