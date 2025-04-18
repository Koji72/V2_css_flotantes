# Implementación de Botones en Paneles Flotantes

:::panel{style="primary" layout="float-right" width="40%"}
## Puntos clave

- Se ha corregido la detección de botones en markdown
- Se ha mejorado los estilos CSS para compatibilidad
- Se ha agregado soporte para atributos adicionales
- Los botones ahora detectan correctamente eventos 

::button{action="ver-ejemplo" style="primary"}Ver Ejemplo::
:::

## Mejoras realizadas

Se han realizado las siguientes correcciones y mejoras en la implementación de botones en paneles flotantes:

1. **Corrección de Regex**: Se ha corregido la expresión regular que detecta la sintaxis de botones en markdown, mejorando la compatibilidad con diferentes formatos.

2. **Unificación de Estilos**: Se han unificado los estilos CSS para asegurar que los botones se muestren correctamente independientemente de cómo se generen.

3. **Soporte para Atributos**: Se ha mejorado el soporte para atributos en botones como `disabled`, `data-loading` y otros atributos personalizados.

4. **Mejor Manejo de Eventos**: Se ha refinado la forma en que los botones disparan eventos, mejorando la comunicación entre el panel y la aplicación principal.

## Sintaxis de Botones

La sintaxis recomendada para crear botones es:

```markdown
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

### Atributos disponibles

| Atributo | Descripción | Ejemplo |
|----------|-------------|---------|
| `action` | Define la acción que realizará el botón | `action="guardar"` |
| `style` | Define el estilo visual del botón | `style="primary"` |
| `disabled` | Deshabilita el botón | `disabled="true"` |
| `data-*` | Atributos personalizados para usar en JavaScript | `data-confirm="¿Confirmar?"` |

### Estilos disponibles

Los siguientes estilos están disponibles para los botones:

::button{style="primary"}Primary::
::button{style="secondary"}Secondary::
::button{style="success"}Success::
::button{style="warning"}Warning::
::button{style="danger"}Danger::
::button{style="info"}Info::

## Integración con JavaScript

Los botones generan eventos personalizados que pueden ser capturados por JavaScript:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonText, buttonId } = event.detail;
  
  console.log(`Botón "${buttonText}" con acción "${action}" fue clickeado`);
  
  // Implementar lógica según la acción
  switch (action) {
    case 'guardar':
      // Lógica para guardar
      break;
    case 'cancelar':
      // Lógica para cancelar
      break;
  }
});
```

## Ejemplos de uso

### Acciones básicas

:::panel{style="glass"}
### Acciones simples

::button{action="guardar" style="success"}Guardar::
::button{action="cancelar" style="secondary"}Cancelar::

Estos botones realizan acciones simples cuando se hace clic en ellos.
:::

### Confirmaciones

:::panel{layout="float-left" width="48%"}
### Acciones con confirmación

::button{action="eliminar" style="danger" data-confirm="¿Está seguro de eliminar este elemento?"}Eliminar::

Este botón muestra una confirmación antes de realizar la acción.
:::

### Estados de botón

:::panel{layout="float-right" width="48%"}
### Estados de botón

::button{style="primary" disabled="true"}Deshabilitado::
::button{style="primary" data-loading="true"}Cargando...::

Los botones pueden mostrar diferentes estados.
:::

<div style="clear:both"></div>

## Recomendaciones de uso

1. **Nombres de acciones descriptivos**: Usa nombres de acciones que describan claramente lo que hace el botón.
   
2. **Consistencia visual**: Mantén consistencia en los estilos de botones según su función:
   - `primary`: Acción principal o positiva
   - `secondary`: Acción secundaria o neutral
   - `success`: Acción exitosa o de confirmación
   - `warning`: Acción que requiere atención
   - `danger`: Acción destructiva o irreversible
   - `info`: Acción informativa

3. **Accesibilidad**: Asegúrate de que el texto del botón sea descriptivo y claro.

4. **Feedback visual**: Proporciona feedback visual cuando un botón está siendo presionado o está realizando una acción (como mostrar un estado de carga).

## Grupos de botones

Los botones pueden agruparse utilizando un contenedor con la clase `.button-group`:

:::panel{style="secondary"}
### Grupo de botones horizontal

:div{.button-group}
::button{action="opcion1" style="secondary"}Opción 1::
::button{action="opcion2" style="secondary"}Opción 2::
::button{action="opcion3" style="primary"}Opción 3::
::/div

### Grupo de botones vertical

:div{.button-group.vertical}
::button{action="opcion1" style="secondary"}Opción 1::
::button{action="opcion2" style="secondary"}Opción 2::
::button{action="opcion3" style="primary"}Opción 3::
::/div
:::

## Conclusión

La implementación mejorada de botones en paneles flotantes permite crear interfaces interactivas más ricas y dinámicas dentro de documentos markdown. Aprovecha estas capacidades para transformar tus documentos estáticos en experiencias interactivas que guíen a los usuarios a través de flujos de trabajo y tareas complejas. 