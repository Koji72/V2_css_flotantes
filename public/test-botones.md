# Prueba de Botones en Paneles

## Botones Básicos

::button{style="primary"}Botón Primario::
::button{style="secondary"}Botón Secundario::
::button{style="success"}Botón de Éxito::
::button{style="warning"}Botón de Advertencia::
::button{style="danger"}Botón de Peligro::

## Tamaños de Botones

::button{style="primary" size="small"}Botón Pequeño::
::button{style="primary"}Botón Normal::
::button{style="primary" size="large"}Botón Grande::

## Estados de Botones

::button{style="primary" action="mostrar-mensaje" data-message="¡Mensaje personalizado!"}Mostrar Mensaje::
::button{style="primary" disabled="true"}Botón Deshabilitado::
::button{style="primary" data-loading="true"}Botón Cargando::

## Botones con Esquinas Técnicas

:::panel class="tech-corners":::
### Panel con Botones Tech
::button{style="primary"}Tech Button 1::
::button{style="secondary"}Tech Button 2::
:::panel:::

## Botones con Efecto Glass

:::panel style="glass":::
### Panel con Botones Glass
::button{style="primary"}Glass Button 1::
::button{style="secondary"}Glass Button 2::
:::panel:::

## Botones con Acciones Especiales

::button{action="cambiar-tema"}Cambiar Tema::
::button{action="toggle-loading"}Toggle Estado de Carga::
::button{action="toggle-disabled"}Toggle Deshabilitado::

## Botones con Confirmación

::button{style="danger" action="eliminar" data-confirm="¿Estás seguro de que deseas eliminar este elemento?"}Eliminar con Confirmación::

## Botones con URL

::button{style="primary" action="navegar" data-url="https://github.com"}Visitar GitHub:: 