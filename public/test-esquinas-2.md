# Prueba de Paneles con Esquinas Cortadas

## Prueba 1: Clase Tech Corners (Conversión automática)
:::panel class="tech-corners":::
### Panel con clase tech-corners
Este panel debería tener esquinas cortadas porque la clase se convierte automáticamente a panel-style--tech-corners.
:::panel:::

## Prueba 2: Estilo Tech Corners (Conversión automática)
:::panel style="tech-corners":::
### Panel con estilo tech-corners
Este panel debería tener esquinas cortadas porque el estilo se convierte automáticamente a panel-style--tech-corners.
:::panel:::

## Prueba 3: Clase Cut Corners (Conversión automática)
:::panel class="cut-corners":::
### Panel con clase cut-corners
Este panel debería tener esquinas cortadas porque la clase se convierte automáticamente a panel-style--cut-corners.
:::panel:::

## Prueba 4: Clase Cut Corner (Singular - Conversión automática)
:::panel class="cut-corner":::
### Panel con clase cut-corner (singular)
Este panel debería tener esquinas cortadas porque la clase singular también se convierte.
:::panel:::

## Prueba 5: Clase Panel-style ya definida
:::panel class="panel-style--tech-corners":::
### Panel con clase directa panel-style--tech-corners
Este panel debería funcionar porque la clase ya tiene el prefijo correcto.
:::panel:::

## Prueba 6: Múltiples clases, mezclando estilos y clases regulares
:::panel class="text-center tech-corners bg-dark":::
### Panel con múltiples clases
Este panel debería tener esquinas cortadas y además estar centrado y con fondo oscuro.
:::panel:::

## Prueba 7: Glass style (Otro estilo para comparar)
:::panel style="glass":::
### Panel con estilo glass
Este panel debería tener estilo vidrio para comparar si todos los estilos funcionan.
:::panel:::

## Prueba 8: Panel con Botones
:::panel style="tech-corners":::
### Panel con Botones
Este panel incluye botones en diferentes estilos:

::button{style="primary"}Botón Primario::
::button{style="secondary"}Botón Secundario::
::button{style="success"}Botón de Éxito::
:::panel:::

<div style="clear: both;"></div> 