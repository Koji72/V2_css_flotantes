# Guía de Uso de Paneles y Botones

## Introducción

Los paneles son componentes versátiles que permiten mostrar contenido de manera estructurada y estilizada. Esta guía cubre todas las funcionalidades disponibles para paneles y botones.

## Sintaxis Básica

```markdown
::panel{style="glass"}
# Título del Panel
Contenido del panel
::
```

## Estilos de Panel

### Estilos Base

- `glass`: Efecto de cristal con desenfoque
- `floating`: Panel con sombra elevada
- `hoverable`: Panel con efectos al pasar el cursor

### Tamaños

- `small`: Panel compacto
- `large`: Panel espacioso

### Posicionamiento

- `float-left`: Flota a la izquierda
- `float-right`: Flota a la derecha

### Esquinas Cortadas

- `cut-corner-sm`: Corte pequeño
- `cut-corner-md`: Corte mediano
- `cut-corner-lg`: Corte grande

### Bordes Personalizados

- `border-accent`: Borde acentuado
- `border-primary`: Borde primario
- `border-success`: Borde de éxito
- `border-warning`: Borde de advertencia
- `border-danger`: Borde de peligro

### Sombras

- `shadow-sm`: Sombra suave
- `shadow-md`: Sombra media
- `shadow-lg`: Sombra pronunciada

### Patrones de Fondo

- `pattern-grid`: Patrón de cuadrícula
- `pattern-dots`: Patrón de puntos

## Botones

### Sintaxis

```markdown
::button{action="nombre-accion" style="estilo-boton"}Texto del botón::
```

### Estilos de Botón

- `primary`: Botón primario
- `secondary`: Botón secundario
- `success`: Botón de éxito
- `warning`: Botón de advertencia
- `danger`: Botón de peligro
- `info`: Botón informativo

### Estados de Botón

- `disabled="true"`: Botón deshabilitado
- `loading="true"`: Botón en estado de carga

### Tamaños de Botón

- `small`: Botón pequeño
- `large`: Botón grande
- `full-width`: Botón de ancho completo

### Accesibilidad

- `aria-label`: Etiqueta para lectores de pantalla
- `role`: Rol del botón
- `tabindex`: Orden de tabulación

## Ejemplos

### Panel Básico con Botón

```markdown
::panel{style="glass"}
# Panel de Ejemplo
Contenido del panel
::button{action="save" style="primary"}Guardar::
::
```

### Panel con Esquinas Cortadas

```markdown
::panel{style="glass" class="cut-corner cut-corner-md"}
# Panel con Esquinas Cortadas
Contenido del panel
::
```

### Panel con Patrón y Sombra

```markdown
::panel{style="glass" class="pattern-grid shadow-lg"}
# Panel con Patrón
Contenido del panel
::
```

### Panel con Múltiples Clases

```markdown
::panel{style="glass" class="floating hoverable shadow-lg"}
# Panel Complejo
Contenido del panel
::
```

## Mejores Prácticas

1. **Accesibilidad**
   - Siempre incluye un título descriptivo
   - Usa atributos ARIA cuando sea necesario
   - Mantén un buen contraste de colores

2. **Rendimiento**
   - Evita combinar demasiados efectos
   - Usa clases de tamaño apropiadas
   - Limita el uso de animaciones complejas

3. **Diseño Responsivo**
   - Los paneles se adaptan automáticamente
   - Usa tamaños relativos cuando sea posible
   - Prueba en diferentes dispositivos

4. **Compatibilidad**
   - Funciona en navegadores modernos
   - Tiene fallbacks para navegadores antiguos
   - Soporta modo claro/oscuro

## Limitaciones Conocidas

1. **Efectos de Cristal**
   - No soportado en algunos navegadores antiguos
   - Puede afectar el rendimiento en dispositivos lentos

2. **Esquinas Cortadas**
   - Requiere soporte de clip-path
   - Fallback a esquinas redondeadas en navegadores antiguos

3. **Patrones de Fondo**
   - Pueden afectar el rendimiento en paneles grandes
   - Mejor usar en paneles pequeños o medianos

## Solución de Problemas

### Problemas Comunes

1. **Panel no se muestra**
   - Verifica la sintaxis del panel
   - Comprueba que las clases CSS estén definidas
   - Revisa la consola del navegador

2. **Botones no funcionan**
   - Verifica el atributo action
   - Comprueba los listeners de eventos
   - Revisa la consola del navegador

3. **Problemas de estilo**
   - Verifica las variables CSS
   - Comprueba las combinaciones de clases
   - Revisa los estilos específicos del navegador

### Depuración

```javascript
// Ejemplo de código para depuración
const panelDebugger = PanelDebugger.getInstance();
await panelDebugger.debugPanelRendering(markdown);
```

## Recursos Adicionales

- [Guía de Estilos CSS](docs/css-styles.md)
- [Referencia de API](docs/api-reference.md)
- [Ejemplos Avanzados](docs/advanced-examples.md) 