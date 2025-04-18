# 🔘 Índice de Ejemplos de Botones en Paneles

:::panel{layout="float-right" width="35%" style="primary"}
## Recursos rápidos

::button{action="abrir-guia" style="primary" data-url="guia-botones.md"}Guía completa::

::button{action="abrir-ejemplos" style="secondary" data-url="boton-ejemplo.md"}Ejemplos básicos::

::button{action="abrir-eventos" style="success" data-url="botones-eventos.md"}Eventos avanzados::

Este panel contiene accesos directos a los principales recursos sobre botones en paneles.
:::

## Documentación de Botones Interactivos

Esta sección contiene todos los recursos disponibles para implementar y personalizar botones interactivos en paneles markdown. Utiliza esta página como punto de partida para explorar las diferentes funcionalidades y ejemplos.

## Ejemplos disponibles

| Documento | Descripción | Enlace |
|-----------|-------------|--------|
| **Guía de botones** | Documentación completa sobre la implementación y uso de botones en paneles | [Ver guía](guia-botones.md) |
| **Ejemplos básicos** | Demostración de los diferentes tipos y estilos de botones | [Ver ejemplos](boton-ejemplo.md) |
| **Botones personalizados** | Ejemplos avanzados con estilos y casos de uso personalizados | [Ver personalizados](boton-personalizado.md) |
| **Eventos e interacción** | Integración con JavaScript y manejo avanzado de eventos | [Ver eventos](botones-eventos.md) |

## Funcionalidades principales

:::panel{layout="float-left" width="100%"}
### Características de botones en paneles

1. **Sintaxis flexible**: Dos formas de crear botones adaptadas a diferentes necesidades
2. **Estilos predefinidos**: Primary, secondary, success, warning, danger e info
3. **Estados especiales**: Deshabilitado y cargando para representar diferentes condiciones
4. **Atributos de datos**: Posibilidad de incluir información adicional en atributos data-*
5. **Eventos personalizados**: Integración con JavaScript mediante eventos custom
6. **Compatibilidad con paneles flotantes**: Funcionalidad completa en cualquier tipo de panel

Cada una de estas características está documentada en detalle en la [guía completa](guia-botones.md).
:::

<div style="clear:both"></div>

## Implementación básica

Para incluir un botón en tu panel markdown, utiliza la siguiente sintaxis:

```markdown
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

Ejemplo de un panel con botones:

```markdown
:::panel{layout="float-right" width="40%"}
### Panel con botones

::button{action="guardar" style="success"}Guardar cambios::
::button{action="cancelar" style="danger"}Cancelar::
:::
```

## Implementación avanzada

:::panel{layout="float-left" width="48%"}
### Integración con JavaScript

La verdadera potencia de los botones en paneles se manifiesta al integrarlos con JavaScript:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonText, buttonId } = event.detail;
  
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

Para más detalles sobre la integración con JavaScript, consulta el [ejemplo de eventos](botones-eventos.md).
:::

:::panel{layout="float-right" width="48%"}
### Atributos personalizados

Puedes añadir cualquier atributo data-* para transportar información adicional:

```markdown
::button{
  action="filtrar"
  style="primary"
  data-categoria="productos"
  data-ordenar="precio"
}Filtrar productos::
```

Estos atributos estarán disponibles en el objeto button cuando captures el evento.
:::

<div style="clear:both"></div>

## Próximos pasos

Si estás comenzando, te recomendamos seguir esta secuencia:

1. Leer la [guía completa](guia-botones.md) para comprender todas las funcionalidades
2. Revisar los [ejemplos básicos](boton-ejemplo.md) para ver diferentes implementaciones
3. Explorar los [ejemplos de eventos](botones-eventos.md) para aprender sobre la integración con JavaScript
4. Consultar los [ejemplos personalizados](boton-personalizado.md) para casos de uso avanzados

:::panel{layout="float-left" width="100%"}
### ¿Necesitas ayuda adicional?

Si necesitas asistencia con la implementación de botones en tus propios proyectos, considera estos recursos:

::button{action="abrir-issues" style="secondary" data-url="https://github.com/tu-repo/issues"}Reportar problemas::
::button{action="abrir-docs" style="primary" data-url="https://github.com/tu-repo/docs"}Documentación completa::
::button{action="solicitar-ayuda" style="info" data-url="https://github.com/tu-repo/discussions"}Comunidad de ayuda::

Los botones en paneles son una característica en constante evolución. Tu feedback es importante para seguir mejorando.
::: 