# 🎮 Botones Interactivos en Paneles

:::panel
layout="float-right"
width="40%"
class="status-panel"
:::

## 🔘 Botones Básicos

Los botones básicos pueden implementarse utilizando atributos simples.

```html
<button class="panel-button">Ejemplo</button>
```

¡Prueba a hacer clic en estos botones!

[Botón primario]{.panel-button}

[Botón secundario]{.panel-button .secondary}

[Botón de advertencia]{.panel-button .warning}

:::

## Integración de Botones en Paneles

Los paneles pueden incluir elementos interactivos como botones que permitan a los usuarios realizar acciones específicas sin salir del contexto de lectura.

:::panel
layout="float-left"
width="35%"
:::

## 🔄 Botones con Estado

Los botones con estado cambian visualmente para indicar:

- Interacción
- Selección
- Disponibilidad

Estos son especialmente útiles en paneles informativos donde los usuarios necesitan realizar acciones contextuales.

[Activar Modo]{.panel-button .toggle}

[Descargar PDF]{.panel-button .download}

:::

## Implementación Técnica

Para implementar botones en paneles flotantes, podemos utilizar una combinación de HTML y CSS personalizado:

```css
.panel-button {
  display: inline-block;
  padding: 8px 16px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.panel-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.panel-button.secondary {
  background-color: var(--secondary-color);
}

.panel-button.warning {
  background-color: var(--warning-color);
}

.panel-button.toggle {
  background-color: var(--neutral-color);
}

.panel-button.download::after {
  content: " ↓";
}
```

:::panel
layout="float-right"
width="40%"
class="highlight-panel"
:::

## 🧩 Casos de Uso

Los botones interactivos en paneles flotantes son ideales para:

1. **Tutoriales guiados** donde los usuarios pueden avanzar a su propio ritmo
2. **Documentación técnica** con ejemplos ejecutables
3. **Material educativo** con ejercicios prácticos
4. **Dashboards** con acciones contextuales

Añadir interactividad a los paneles mejora significativamente la experiencia del usuario al proporcionar retroalimentación inmediata.

[Ver más ejemplos]{.panel-button}

:::

## Accesibilidad y Responsividad

Al diseñar botones interactivos para paneles, debemos considerar:

- **Contraste de color** adecuado para garantizar legibilidad
- **Tamaño del botón** suficiente para interacciones táctiles
- **Estados de foco** claramente visibles para navegación por teclado
- **Comportamiento responsivo** en diferentes tamaños de pantalla

:::panel
layout="float-left"
width="35%"
class="note-panel"
:::

## 📝 Notas Importantes

- Los botones deben tener un propósito claro
- Evita sobrecargar los paneles con demasiados elementos interactivos
- Mantén consistencia visual entre diferentes paneles
- Proporciona retroalimentación visual al interactuar con los botones

Al diseñar tus paneles interactivos, recuerda que el objetivo principal es mejorar la experiencia del usuario, no complicarla.

[Entendido]{.panel-button}

:::

## Conclusión

La incorporación de botones interactivos en paneles flotantes representa un poderoso recurso para crear documentos dinámicos que no solo informan sino que también permiten a los usuarios interactuar con el contenido. 

Esta combinación de presentación estética y funcionalidad interactiva eleva la experiencia del usuario y hace que la información sea más accesible y práctica.

# Botones en Paneles Flotantes

Este documento demuestra el uso de botones interactivos dentro de los paneles flotantes, añadiendo capacidades de interacción a tus documentos markdown.

## Botones Básicos

::panel{.float-left .panel-info style="width: 48%"}
### Botón de Acción Simple

Este panel incluye un botón básico que puede desencadenar una acción:

::button{action="mostrar-alerta" style="primary"}Mostrar Alerta::

Cuando se hace clic en el botón, se generará un evento que puede ser capturado por la aplicación.
::

::panel{.float-right .panel-warning style="width: 48%"}
### Botones de Confirmación

Este panel demuestra botones que pueden usarse para confirmar o cancelar acciones:

::button{action="confirmar" style="success"}Confirmar::
::button{action="cancelar" style="danger"}Cancelar::

Ideal para escenarios donde se requiere confirmación del usuario.
::

<div style="clear:both"></div>

## Variantes de Estilos

::panel{.glass-panel .float-left style="width: 100%"}
### Estilos de Botones

Los botones pueden tener diferentes estilos para indicar su importancia o función:

::button{action="accion-primaria" style="primary"}Primario::
::button{action="accion-secundaria" style="secondary"}Secundario::
::button{action="accion-exito" style="success"}Éxito::
::button{action="accion-advertencia" style="warning"}Advertencia::
::button{action="accion-peligro" style="danger"}Peligro::
::button{action="accion-info" style="info"}Información::

Cada estilo comunica visualmente un nivel diferente de importancia o tipo de acción.
::

<div style="clear:both"></div>

## Casos de Uso

::panel{.circuit-nodes .float-left style="width: 48%"}
### Panel de Control

Este panel simula un panel de control con acciones disponibles:

::button{action="iniciar-sistema" style="success"}Iniciar Sistema::
::button{action="detener-sistema" style="danger"}Detener Sistema::
::button{action="reiniciar" style="warning"}Reiniciar::
::button{action="configurar" style="secondary"}Configurar::

Perfecto para documentación técnica que requiere demostrar acciones del sistema.
::

::panel{.neo-frame .float-right style="width: 48%"}
### Asistente Interactivo

Este panel demuestra un asistente paso a paso:

#### Paso 1: Seleccione una opción

::button{action="opcion-1" style="primary"}Opción A::
::button{action="opcion-2" style="primary"}Opción B::
::button{action="opcion-3" style="primary"}Opción C::

Al seleccionar una opción, el asistente podría mostrar el siguiente paso.
::

<div style="clear:both"></div>

## Acciones Críticas

::panel{.tech-corners .panel-danger .float-left style="width: 100%"}
### Acciones de Seguridad

Este panel muestra cómo los botones pueden ser utilizados para acciones críticas:

#### ¡Atención! Esta acción no se puede deshacer

Para eliminar permanentemente todos los datos, debe confirmar su intención:

::button{action="confirmar-eliminacion" style="danger"}Confirmar Eliminación::
::button{action="cancelar-eliminacion" style="secondary"}Cancelar::

Los botones en paneles flotantes son ideales para destacar acciones importantes y requerir confirmación explícita.
::

<div style="clear:both"></div>

## Integración con la Aplicación

Los botones en paneles flotantes se integran con la aplicación mediante eventos personalizados. Cuando un usuario hace clic en un botón, se dispara un evento `panel-button-click` con los siguientes datos:

```javascript
{
  action: "nombre-accion",    // El valor del atributo action
  buttonId: "id-unico",       // ID único generado para el botón
  buttonText: "Texto Botón",  // El texto mostrado en el botón
  panelId: "id-del-panel"     // ID del panel contenedor (si está disponible)
}
```

Esto permite que la aplicación reaccione a las interacciones del usuario de forma personalizada, creando documentos verdaderamente interactivos.

::panel{.hologram .float-left style="width: 100%"}
### Ejemplo de Captura de Eventos

Para capturar y manejar eventos de botones en tu aplicación:

```javascript
document.addEventListener('panel-button-click', (event) => {
  const { action, buttonText, panelId } = event.detail;
  
  console.log(`Botón "${buttonText}" con acción "${action}" fue clickeado`);
  
  // Manejar diferentes acciones
  switch (action) {
    case 'mostrar-alerta':
      alert('¡Esta es una alerta desencadenada por un botón en un panel!');
      break;
    case 'confirmar-eliminacion':
      // Lógica para eliminación confirmada
      console.log('Eliminación confirmada');
      break;
    // Otros casos...
  }
});
```

Esta flexibilidad permite crear documentos markdown que no sólo muestran información, sino que también pueden interactuar con el usuario y la aplicación.
::

---

## Sintaxis Markdown

Para añadir botones a tus paneles, utiliza la siguiente sintaxis:

```
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

Donde:
- `nombre-accion` es un identificador único para la acción del botón
- `estilo-boton` puede ser: primary, secondary, success, warning, danger, info
- `Texto del botón` es el texto que se mostrará en el botón

Esta característica amplía considerablemente las posibilidades de tus documentos markdown, permitiendo crear contenido interactivo y dinámico.

# Guía de Botones Interactivos en Paneles

Esta documentación muestra cómo implementar y utilizar botones interactivos dentro de paneles markdown.

## Botones Básicos

:::panel{class="tech-corners"}
### Botones con Estilos Predefinidos

Los botones pueden tener diferentes estilos visuales:

::button{style="primary"}Botón Principal::
::button{style="secondary"}Botón Secundario::
::button{style="success"}Botón Éxito::
::button{style="warning"}Botón Advertencia::
::button{style="danger"}Botón Peligro::
::button{style="info"}Botón Información::
:::

## Botones con Acciones

:::panel{class="cut-corners" style="secondary"}
### Botones con Acciones Definidas

Los botones pueden ejecutar acciones específicas:

::button{action="mostrar-mensaje" style="primary"}Mostrar Mensaje::
::button{action="cambiar-tema" style="secondary"}Cambiar Tema::
::button{action="toggle-loading" style="info"}Alternar Estado de Carga::
::button{action="toggle-disabled" style="warning"}Alternar Habilitado/Deshabilitado::
:::

## Casos de Uso: Paneles Flotantes

:::panel{layout="float-right" width="45%" class="tech-corners"}
### Panel con Confirmación

Este panel muestra un diálogo de confirmación antes de realizar una acción crítica.

::button{action="mostrar-mensaje" data-confirm="¿Está seguro de continuar con esta acción?" style="warning"}Acción con Confirmación::
:::

:::panel{layout="float-left" width="45%" class="tech-corners"}
### Panel con Navegación

Este panel contiene botones que pueden navegar a otras secciones o URLs.

::button{action="default" data-url="#seccion-avanzada" style="primary"}Ir a Sección Avanzada::
::button{action="default" data-url="https://example.com" style="secondary"}Visitar Sitio Externo::
:::

<div style="clear:both;"></div>

## Acciones Críticas

:::panel{style="danger"}
### Acciones Destructivas

Los botones para acciones destructivas deben tener estilo "danger" y solicitar confirmación:

::button{action="default" data-confirm="¡ATENCIÓN! Esta acción eliminará permanentemente los datos. ¿Está seguro?" style="danger"}Eliminar Datos::
:::

## Secuencia de Acciones

:::panel{class="tech-corners"}
### Asistente por Pasos

Los botones pueden formar parte de un flujo de asistente:

::button{action="mostrar-mensaje" data-message="Paso 1 completado" style="primary"}Paso 1: Configuración::
::button{action="mostrar-mensaje" data-message="Paso 2 completado" style="primary"}Paso 2: Verificación::
::button{action="mostrar-mensaje" data-message="Proceso completado" style="success"}Paso 3: Finalizar::
:::

## Integración con la Aplicación

:::panel{id="seccion-avanzada" class="panel-style--glass"}
### Interacción con la Aplicación

Los botones pueden comunicarse con la aplicación principal a través de eventos personalizados:

1. Definir un manejador en la aplicación:
```javascript
buttonHandler.register('accion-personalizada', (event) => {
  console.log('Acción personalizada ejecutada', event);
  // Lógica específica de la aplicación
});
```

2. Usar el botón en el markdown:
```
::button{action="accion-personalizada" style="primary"}Ejecutar Acción::
```

::button{action="mostrar-mensaje" style="primary" data-message="Esta acción podría integrarse con funcionalidades de la aplicación"}Demostración::
:::

## Estados de Botones

:::panel{style="info"}
### Estados Interactivos

Los botones pueden tener diferentes estados:

::button{style="primary"}Estado Normal::
::button{style="primary" disabled="true"}Estado Deshabilitado::
::button{style="primary" loading="true"}Estado de Carga::
:::

## Múltiples Botones en un Panel

:::panel{class="tech-corners" style="primary"}
### Panel de Control

::button{action="mostrar-mensaje" style="success"}Aprobar::
::button{action="mostrar-mensaje" style="warning"}Revisar::
::button{action="mostrar-mensaje" style="danger"}Rechazar::

La disposición de múltiples botones en un panel permite crear interfaces de control compactas.
:::

---

## Sintaxis de Botones

Para añadir un botón en markdown, utilice la siguiente sintaxis:

```
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

Atributos disponibles:
- `action`: Identificador de la acción (ej: "mostrar-mensaje", "cambiar-tema")
- `style`: Estilo visual del botón (primary, secondary, success, warning, danger, info)
- `disabled`: "true" para deshabilitar el botón
- `loading`: "true" para mostrar estado de carga
- `data-*`: Atributos personalizados para pasar información adicional
