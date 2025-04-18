# Guía de Botones Interactivos en Paneles Markdown

:::panel{layout="float-right" width="40%" style="warning"}
## 📋 En esta guía

- Sintaxis para crear botones
- Estilos disponibles 
- Atributos avanzados
- Integración con JavaScript
- Ejemplos prácticos

::button{action="ver-ejemplos" style="primary"}Ver ejemplos::
:::

## Introducción

Los botones interactivos en paneles markdown permiten agregar elementos de UI activos que pueden responder a las interacciones del usuario. Esta característica transforma documentos estáticos en interfaces dinámicas que pueden ejecutar acciones, cambiar el contenido e interactuar con la aplicación principal.

## Sintaxis básica

Existen dos formas de crear botones en los paneles:

### 1. Sintaxis moderna (recomendada)

```markdown
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

### 2. Sintaxis alternativa (compatibilidad)

```markdown
[Texto del botón]{.panel-button}
```

La sintaxis moderna ofrece más opciones de personalización y es la forma recomendada para crear botones en paneles.

## Propiedades de botones

Los botones pueden personalizarse con varios atributos:

| Atributo | Descripción | Valores |
|----------|-------------|---------|
| `action` | Identificador de la acción | Cualquier string (ej: "guardar") |
| `style` | Estilo visual del botón | primary, secondary, success, warning, danger, info |
| `disabled` | Deshabilita el botón | true, false |
| `loading` | Muestra indicador de carga | true, false |
| `data-*` | Atributos personalizados | Cualquier valor |

## Estilos de botones

:::panel{layout="float-left" width="100%"}
### Catálogo de estilos

::button{action="demo" style="primary"}Primario::
::button{action="demo" style="secondary"}Secundario::
::button{action="demo" style="success"}Éxito::
::button{action="demo" style="warning"}Advertencia::
::button{action="demo" style="danger"}Peligro::
::button{action="demo" style="info"}Información::

**Código:**
```markdown
::button{action="demo" style="primary"}Primario::
::button{action="demo" style="secondary"}Secundario::
::button{action="demo" style="success"}Éxito::
::button{action="demo" style="warning"}Advertencia::
::button{action="demo" style="danger"}Peligro::
::button{action="demo" style="info"}Información::
```
:::

<div style="clear:both"></div>

## Estados especiales

:::panel{layout="float-right" width="40%"}
### Estados de botones

::button{action="demo" disabled="true" style="primary"}Deshabilitado::

::button{action="demo" loading="true" style="primary"}Cargando...::

**Código:**
```markdown
::button{action="demo" disabled="true" style="primary"}Deshabilitado::

::button{action="demo" loading="true" style="primary"}Cargando...::
```
:::

Los botones pueden mostrar diferentes estados para representar su condición actual:

1. **Estado normal**: El botón está activo y responde a clics.
2. **Estado deshabilitado**: El botón aparece atenuado y no responde a interacciones.
3. **Estado de carga**: Muestra un indicador de carga, útil para acciones asíncronas.

## Integración con JavaScript

Los botones en paneles disparan eventos personalizados que pueden ser capturados por JavaScript para implementar comportamientos interactivos.

```javascript
// Escuchar eventos de clic en botones de paneles
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonText, buttonId, panelId } = event.detail;
  
  console.log(`Botón "${buttonText}" con acción "${action}" fue clickeado`);
  
  // Implementar lógica específica según la acción
  switch (action) {
    case 'guardar':
      // Lógica para guardar
      break;
    case 'cancelar':
      // Lógica para cancelar
      break;
    // Más casos...
  }
});
```

## Atributos de datos personalizados

Puedes añadir atributos `data-*` personalizados a los botones para transportar datos adicionales que luego pueden ser utilizados por JavaScript:

```markdown
::button{action="filtrar" style="primary" data-categoria="productos" data-ordenar="precio"}Filtrar productos::
```

En JavaScript, estos atributos son accesibles a través del elemento del botón:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { buttonId } = event.detail;
  const button = document.getElementById(buttonId);
  
  if (button) {
    const categoria = button.getAttribute('data-categoria');
    const ordenar = button.getAttribute('data-ordenar');
    console.log(`Filtrando ${categoria} ordenados por ${ordenar}`);
  }
});
```

## Ejemplos prácticos

:::panel{layout="float-left" width="48%"}
### Panel de formulario

Este panel simula un formulario con botones de acción:

**Datos de usuario**

Nombre: [                ]
Email: [                ]

::button{action="guardar-formulario" style="success"}Guardar::
::button{action="cancelar-formulario" style="secondary"}Cancelar::
:::

:::panel{layout="float-right" width="48%"}
### Asistente interactivo

::button{action="paso-1" style="primary"}Paso 1: Configuración::

::button{action="paso-2" style="primary"}Paso 2: Personalización::

::button{action="paso-3" style="primary"}Paso 3: Finalización::

Los botones pueden usarse para crear asistentes paso a paso guiados.
:::

<div style="clear:both"></div>

## Consideraciones de accesibilidad

Al diseñar interfaces con botones interactivos, ten en cuenta estas prácticas de accesibilidad:

1. Usa texto descriptivo que comunique claramente la acción
2. Mantén suficiente contraste entre el texto y el fondo del botón
3. Asegúrate de que los botones sean accesibles por teclado
4. Proporciona información de estado visual y textual

## Uso con paneles flotantes

Los botones interactivos son especialmente útiles en paneles flotantes:

:::panel{layout="float-right" width="35%" style="primary"}
### Panel flotante con botones

Este panel incluye botones que funcionan incluso cuando el panel está flotando en la página.

::button{action="expandir-panel" style="secondary"}Expandir panel::

::button{action="minimizar-panel" style="warning"}Minimizar::
:::

Combinar paneles flotantes con botones interactivos crea una experiencia de usuario rica y contextual que mantiene la relevancia de las acciones respecto al contenido que se está visualizando.

## Integración con otros elementos

Los botones pueden combinarse con otros elementos de panel para crear interfaces complejas:

:::panel{layout="float-left" width="100%"}
### Panel con varios elementos interactivos

<div style="display: flex; justify-content: space-between; align-items: center;">
  <select style="padding: 8px; border-radius: 4px; margin-right: 10px;">
    <option>Opción 1</option>
    <option>Opción 2</option>
    <option>Opción 3</option>
  </select>
  
  ::button{action="aplicar-seleccion" style="primary"}Aplicar::
</div>

La combinación de elementos HTML estándar con botones interactivos amplía las posibilidades de tus paneles.
:::

<div style="clear:both"></div>

## Depuración

Para depurar la interacción con botones, puedes usar la consola del navegador para ver los eventos disparados:

```javascript
// Código para depuración
document.addEventListener('panel-button-click', (event) => {
  console.log('Evento de botón:', event.detail);
});
```

## Conclusión

Los botones interactivos en paneles markdown transforman la documentación estática en interfaces dinámicas, mejorando significativamente la experiencia del usuario y permitiendo crear flujos de trabajo guiados dentro de tus documentos.

:::panel{layout="float-left" width="100%"}
### ¿Listo para comenzar?

::button{action="crear-primer-boton" style="success"}Crear mi primer botón::
::button{action="explorar-ejemplos" style="primary"}Explorar ejemplos::
::button{action="leer-documentacion" style="secondary"}Documentación avanzada::

¡Empieza a añadir interactividad a tus paneles markdown hoy mismo!
::: 