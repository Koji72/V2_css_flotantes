# Prueba de Corrección de Botones

Este archivo sirve para probar si la corrección del regex en `previewManager.ts` y `panelManager.ts` ha resuelto el problema con los botones en los paneles.

## Ejemplos de botones básicos

::button{style="primary"}Botón Primario::
::button{style="secondary"}Botón Secundario::
::button{style="success"}Botón Éxito::
::button{style="warning"}Botón Advertencia::
::button{style="danger"}Botón Peligro::

## Botones con acciones

::button{action="test-action" style="primary"}Botón con Acción::
::button{action="verificar-correccion" style="success"}Verificar Corrección::

## Botones en paneles

:::panel{style="glass" layout="float-right" width="40%"}
### Panel con botones

Estos botones están dentro de un panel flotante:

::button{action="panel-action" style="primary"}Acción en Panel::
::button{style="secondary"}Botón en Panel::
:::

## Botones con atributos adicionales

::button{style="primary" disabled="true"}Botón Deshabilitado::
::button{style="primary" data-loading="true"}Botón Cargando::
::button{style="primary" data-confirm="¿Está seguro?"}Botón con Confirmación::

## Conclusión

Si todos los botones se muestran correctamente, significa que las correcciones en los regex han sido exitosas. 