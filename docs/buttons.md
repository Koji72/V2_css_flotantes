# Documentación de Botones en Paneles

## Introducción

Los botones son elementos interactivos que permiten a los usuarios realizar acciones dentro de los paneles. Esta documentación describe los diferentes tipos de botones disponibles, sus estilos y cómo utilizarlos.

## Sintaxis Básica

Para agregar un botón a un panel, use la siguiente sintaxis:

```markdown
::button{action="nombre-accion" style="estilo"}Texto del Botón::
```

## Estilos Disponibles

### Estilos Base
- `primary`: Botón principal, usado para acciones importantes
- `secondary`: Botón secundario, para acciones alternativas
- `success`: Botón de éxito, para acciones positivas
- `warning`: Botón de advertencia, para acciones que requieren atención
- `danger`: Botón de peligro, para acciones destructivas
- `info`: Botón informativo, para acciones neutrales

Ejemplo:
```markdown
::button{action="guardar" style="primary"}Guardar::
::button{action="cancelar" style="secondary"}Cancelar::
```

### Tamaños
- `small`: Botón pequeño
- `large`: Botón grande
- `full-width`: Botón que ocupa todo el ancho disponible

Ejemplo:
```markdown
::button{action="accion" style="primary" class="small"}Botón Pequeño::
::button{action="accion" style="primary" class="large"}Botón Grande::
```

## Estados

### Estados Interactivos
Los botones responden automáticamente a:
- Hover: Al pasar el mouse por encima
- Active: Al hacer clic
- Focus: Al seleccionar con teclado

### Estados Especiales
- `disabled`: Botón deshabilitado
- `loading`: Botón en estado de carga

Ejemplo:
```markdown
::button{action="accion" style="primary" disabled="true"}Deshabilitado::
::button{action="accion" style="primary" loading="true"}Cargando::
```

## Accesibilidad

### Atributos ARIA
- `aria-label`: Etiqueta para lectores de pantalla
- `role`: Rol del botón
- `aria-describedby`: ID de un elemento que describe el botón

Ejemplo:
```markdown
::button{action="accion" style="primary" aria-label="Guardar cambios"}Guardar::
```

### Navegación por Teclado
- Use `tabindex="0"` para incluir el botón en el orden de tabulación
- Los botones son automáticamente focusables
- Responden a Enter y Space para activación

## Eventos

### Eventos Disponibles
- `on-click`: Ejecuta JavaScript al hacer clic
- `on-custom`: Dispara un evento personalizado

Ejemplo:
```markdown
::button{action="log" style="primary" on-click="console.log('Click')"}Log::
::button{action="custom" style="primary" on-custom="handleEvent"}Evento::
```

## Personalización

### Clases CSS Personalizadas
Use el atributo `class` para agregar clases CSS adicionales:

```markdown
::button{action="accion" style="primary" class="mi-clase-custom"}Botón::
```

### Estilos Inline
Use `custom-style` para agregar estilos CSS inline:

```markdown
::button{action="accion" style="primary" custom-style="background: purple;"}Botón::
```

## Mejores Prácticas

1. **Nombres de Acción**
   - Use nombres descriptivos para las acciones
   - Evite espacios y caracteres especiales
   - Use kebab-case para múltiples palabras

2. **Texto del Botón**
   - Sea conciso pero descriptivo
   - Use verbos para acciones
   - Evite textos muy largos

3. **Estilos**
   - Use `primary` para la acción principal
   - Use `danger` para acciones destructivas
   - Use `secondary` para acciones alternativas

4. **Accesibilidad**
   - Siempre incluya `aria-label` si el texto no es descriptivo
   - Use roles apropiados
   - Mantenga el orden de tabulación lógico

5. **Eventos**
   - Evite código JavaScript complejo en `on-click`
   - Prefiera eventos personalizados para lógica compleja
   - Maneje estados de carga apropiadamente

## Ejemplos Comunes

### Formulario Básico
```markdown
::panel{style="glass"}
# Formulario
::button{action="submit" style="primary"}Enviar::
::button{action="cancel" style="secondary"}Cancelar::
::
```

### Confirmación de Acción
```markdown
::panel{style="glass"}
# Confirmar Eliminación
::button{action="delete" style="danger" aria-label="Eliminar item"}Eliminar::
::button{action="cancel" style="secondary"}Cancelar::
::
```

### Botón de Carga
```markdown
::panel{style="glass"}
# Procesando
::button{action="process" style="primary" loading="true"}Procesando::
::
```

### Grupo de Botones
```markdown
::panel{style="glass"}
# Opciones
::button{action="option1" style="primary" class="small"}Opción 1::
::button{action="option2" style="primary" class="small"}Opción 2::
::button{action="option3" style="primary" class="small"}Opción 3::
::
```

## Solución de Problemas

### Problemas Comunes

1. **El botón no responde**
   - Verifique que la acción esté correctamente definida
   - Compruebe que no esté deshabilitado
   - Verifique los event listeners

2. **Estilos no se aplican**
   - Confirme que el estilo está correctamente escrito
   - Verifique la carga de los archivos CSS
   - Compruebe la especificidad de los selectores

3. **Eventos no se disparan**
   - Verifique la sintaxis del evento
   - Compruebe la consola para errores
   - Asegúrese de que el manejador existe

### Compatibilidad

- Los botones funcionan en todos los navegadores modernos
- El efecto glass puede no funcionar en navegadores antiguos
- Las animaciones son progresivamente mejoradas 