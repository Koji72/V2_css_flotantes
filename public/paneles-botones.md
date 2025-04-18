# Ejemplos de Paneles con Botones Interactivos

## Panel Básico con Botones

:::panel{.panel-info .floating-right width="50%"}
### Panel con Botones Básicos

Este panel contiene botones interactivos que puedes utilizar para realizar acciones.

::button{style="primary" action="confirm"}Confirmar::

::button{style="secondary" action="cancel"}Cancelar::
:::

## Panel con Estilos Variados

:::panel{.panel-success .floating-left width="40%"}
### Estilos de Botones

Diferentes estilos disponibles para los botones:

::button{style="primary" action="action1"}Primario::
::button{style="secondary" action="action2"}Secundario::
::button{style="success" action="action3"}Éxito::
::button{style="warning" action="action4"}Advertencia::
::button{style="danger" action="action5"}Peligro::
::button{style="info" action="action6"}Info::
:::

## Panel con Acciones Específicas

:::panel{.panel-warning .floating-right width="45%"}
### Acciones Específicas

Los botones pueden desencadenar acciones específicas en la aplicación:

::button{style="primary" action="show-dialog"}Mostrar Diálogo::
::button{style="success" action="save-changes"}Guardar Cambios::
::button{style="danger" action="delete-item"}Eliminar Elemento::
:::

## Panel de Confirmación

:::panel{.panel-danger .floating-center width="50%"}
### Confirmación de Acción Crítica

¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.

::button{style="danger" action="confirm-delete"}Sí, Eliminar::
::button{style="secondary" action="cancel-delete"}Cancelar::
:::

## Panel Interactivo

:::panel{.panel-glass .floating-right width="40%"}
### Panel Interactivo

Este panel interactúa con la aplicación:

::button{style="primary" action="toggle-theme"}Cambiar Tema::
::button{style="info" action="refresh-data"}Actualizar Datos::

**Estado actual:** Esperando acción del usuario
:::

## Uso con Agentes

:::panel{.panel-glass .floating-left width="40%"}
### Interacción con Agentes

Puedes interactuar con los agentes a través de estos botones:

::button{style="primary" action="call-sw-css"}Consultar a SW-CSS::
::button{style="success" action="call-sw-documentation"}Ver Documentación::
::button{style="warning" action="call-sw-debug"}Depurar::
:::

## Flujo de Trabajo

:::panel{.panel-info .floating-center width="60%"}
### Flujo de Trabajo

Controla el flujo de trabajo con estos botones:

::button{style="primary" action="next-step"}Siguiente Paso::
::button{style="secondary" action="previous-step"}Paso Anterior::
::button{style="success" action="complete-workflow"}Completar::
::: 