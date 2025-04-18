# Botones Interactivos en Paneles

Este documento muestra cómo implementar y usar botones interactivos en paneles markdown con la nueva sintaxis.

## Sintaxis Básica

Puedes añadir botones interactivos a cualquier panel usando la siguiente sintaxis:

```
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

Los valores disponibles para `style` son: `primary`, `secondary`, `success`, `warning` y `danger`.

## Ejemplos de Botones

:::panel
class="panel-demo"
:::

### Botones por Estilo

::button{style="primary"}Botón Primario::

::button{style="secondary"}Botón Secundario::

::button{style="success"}Botón Éxito::

::button{style="warning"}Botón Advertencia::

::button{style="danger"}Botón Peligro::

### Botones con Acciones

::button{action="abrir-modal" style="primary"}Abrir Modal::

::button{action="guardar-datos" style="success"}Guardar Datos::

::button{action="eliminar" style="danger"}Eliminar::

:::

## Botones en Paneles Flotantes

Los botones funcionan perfectamente en paneles flotantes, permitiendo acciones contextuales.

:::panel
layout="float-right"
width="40%"
style="tech-corners"
:::

## Panel de Control

Este panel flotante contiene controles que pueden activar diferentes funciones en la aplicación.

::button{action="activar-modo" style="primary"}Activar Modo::

::button{action="recargar" style="secondary"}Recargar Datos::

::button{action="exportar" style="success"}Exportar Resultados::

:::

## Casos de Uso

:::panel
layout="float-left"
width="35%"
style="neo-frame"
:::

### Asistentes Interactivos

Los botones son ideales para crear asistentes paso a paso que guíen al usuario.

::button{action="siguiente-paso" style="primary"}Siguiente Paso::

::button{action="paso-anterior" style="secondary"}Paso Anterior::

::button{action="cancelar" style="warning"}Cancelar::

:::

## Modalidades de Implementación

Hay dos formas de implementar botones en tus paneles:

1. **Sintaxis Moderna** (recomendada):
   
   ```
   ::button{action="accion" style="estilo"}Texto::
   ```

2. **Sintaxis Alternativa** (compatible con versiones anteriores):
   
   ```
   [Texto del botón]{.panel-button .estilo}
   ```

## Botones para Acciones Críticas

:::panel
style="hologram"
class="warning-panel"
:::

### Confirmación Requerida

Esta acción no se puede deshacer. ¿Estás seguro de querer continuar?

::button{action="confirmar-eliminacion" style="danger"}Confirmar Eliminación::

::button{action="cancelar-eliminacion" style="secondary"}Cancelar::

:::

## Integración con la Aplicación

Los botones disparan eventos que pueden ser capturados por la aplicación principal mediante el evento `panel-button-action`. Cada botón incluye información sobre:

- **action**: El identificador de la acción a realizar
- **buttonText**: El texto visible del botón
- **buttonId**: Un identificador único para el botón
- **buttonStyle**: El estilo visual aplicado

Esto permite crear interfaces ricas e interactivas que respondan a las acciones del usuario sin abandonar el contexto de documento. 