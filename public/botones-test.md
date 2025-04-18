# Test de Botones en Paneles

## Panel Básico con Botones

::panel{title="Panel con botones básicos" class="floating-block"}
Este es un panel básico que contiene botones interactivos.

::button{action="confirmar" style="primary"}Confirmar::

::button{action="cancelar" style="secondary"}Cancelar::
::

## Panel con Botones de Diferentes Estilos

::panel{title="Estilos de botones" class="floating-block glass"}
Prueba de diferentes estilos de botones:

::button{action="accion-primaria" style="primary"}Primario::
::button{action="accion-secundaria" style="secondary"}Secundario::
::button{action="accion-exito" style="success"}Éxito::
::button{action="accion-advertencia" style="warning"}Advertencia::
::button{action="accion-peligro" style="danger"}Peligro::
::button{action="accion-info" style="info"}Info::
::

## Panel Flotante con Acciones

::panel{title="Acciones Rápidas" class="floating-block floating-right glass" style="width: 30%"}
Este panel flotante contiene acciones que podrían ser útiles mientras se navega.

::button{action="guardar-cambios" style="primary"}Guardar Cambios::

::button{action="exportar-pdf" style="secondary"}Exportar a PDF::

::button{action="compartir" style="info"}Compartir::
::

## Panel de Confirmación

::panel{title="¿Estás seguro?" class="floating-block warning"}
Esta acción no se puede deshacer.

::button{action="eliminar-confirmado" style="danger"}Sí, eliminar::
::button{action="cancelar-eliminacion" style="secondary"}Cancelar::
::

## Interacción con Agentes

::panel{title="Asistente CSS" class="floating-block glass floating-left" style="width: 35%"}
¿Necesitas ayuda con los estilos CSS?

::button{action="solicitar-sw-css" style="primary"}Consultar a SW-CSS::
::button{action="mostrar-ejemplos" style="info"}Ver ejemplos::
::

## Panel con Botones Anidados

::panel{title="Configuración" class="floating-block"}
Ajustes de visualización:

::button{action="toggle-tema" style="secondary"}Cambiar Tema::

Ajustes de paneles:
::button{action="aumentar-opacidad" style="info"}+ Opacidad::
::button{action="disminuir-opacidad" style="info"}- Opacidad::
::

## Panel de Carga

::panel{title="Procesando" class="floating-block glass"}
Espera mientras procesamos tu solicitud...

::button{action="cancelar-carga" style="secondary" disabled="true"}Cancelar::
:: 