# Prueba Integral de Paneles y Botones

## 1. Pruebas de Paneles Básicos

### 1.1 Estilos Base
```markdown
::panel{style="glass"}
# Panel Glass
Panel con efecto de cristal y desenfoque.
::

::panel{style="glass" class="floating"}
# Panel Flotante
Panel con sombra elevada.
::

::panel{style="glass" class="hoverable"}
# Panel Interactivo
Panel que reacciona al hover.
::
```

### 1.2 Tamaños
```markdown
::panel{style="glass" class="small"}
# Panel Pequeño
Contenido compacto.
::

::panel{style="glass" class="large"}
# Panel Grande
Contenido espacioso.
::
```

## 2. Pruebas de Posicionamiento

### 2.1 Flotación
```markdown
::panel{style="glass" class="float-left"}
# Panel Izquierdo
Flota a la izquierda.
::

::panel{style="glass" class="float-right"}
# Panel Derecho
Flota a la derecha.
::
```

### 2.2 Esquinas Cortadas
```markdown
::panel{style="glass" class="cut-corner cut-corner-sm"}
# Corte Pequeño
Panel con esquina cortada pequeña.
::

::panel{style="glass" class="cut-corner cut-corner-md"}
# Corte Mediano
Panel con esquina cortada mediana.
::

::panel{style="glass" class="cut-corner cut-corner-lg"}
# Corte Grande
Panel con esquina cortada grande.
::
```

## 3. Pruebas de Bordes y Sombras

### 3.1 Bordes Personalizados
```markdown
::panel{style="glass" class="border-accent"}
# Borde Acento
Panel con borde acentuado.
::

::panel{style="glass" class="border-primary"}
# Borde Primario
Panel con borde primario.
::

::panel{style="glass" class="border-success"}
# Borde Éxito
Panel con borde de éxito.
::

::panel{style="glass" class="border-warning"}
# Borde Advertencia
Panel con borde de advertencia.
::

::panel{style="glass" class="border-danger"}
# Borde Peligro
Panel con borde de peligro.
::
```

### 3.2 Sombras
```markdown
::panel{style="glass" class="shadow-sm"}
# Sombra Suave
Panel con sombra suave.
::

::panel{style="glass" class="shadow-md"}
# Sombra Media
Panel con sombra media.
::

::panel{style="glass" class="shadow-lg"}
# Sombra Pronunciada
Panel con sombra pronunciada.
::
```

## 4. Pruebas de Patrones

### 4.1 Patrones de Fondo
```markdown
::panel{style="glass" class="pattern-grid"}
# Patrón Cuadrícula
Panel con patrón de cuadrícula.
::

::panel{style="glass" class="pattern-dots"}
# Patrón Puntos
Panel con patrón de puntos.
::
```

## 5. Pruebas de Botones

### 5.1 Estilos de Botón
```markdown
::panel{style="glass"}
# Estilos de Botón
::button{action="test-primary" style="primary"}Botón Primario::
::button{action="test-secondary" style="secondary"}Botón Secundario::
::button{action="test-success" style="success"}Botón Éxito::
::button{action="test-warning" style="warning"}Botón Advertencia::
::button{action="test-danger" style="danger"}Botón Peligro::
::button{action="test-info" style="info"}Botón Info::
::
```

### 5.2 Estados de Botón
```markdown
::panel{style="glass"}
# Estados de Botón
::button{action="test-disabled" style="primary" disabled="true"}Deshabilitado::
::button{action="test-loading" style="primary" loading="true"}Cargando::
::
```

### 5.3 Tamaños de Botón
```markdown
::panel{style="glass"}
# Tamaños de Botón
::button{action="test-small" style="primary" class="small"}Pequeño::
::button{action="test-normal" style="primary"}Normal::
::button{action="test-large" style="primary" class="large"}Grande::
::button{action="test-full" style="primary" class="full-width"}Ancho Completo::
::
```

## 6. Pruebas de Integración

### 6.1 Paneles con Botones
```markdown
::panel{style="glass" class="cut-corner border-accent"}
# Panel con Botones
::button{action="save" style="primary"}Guardar::
::button{action="cancel" style="secondary"}Cancelar::
::
```

### 6.2 Paneles Anidados
```markdown
::panel{style="glass"}
# Panel Principal
Contenido principal.

::panel{style="glass" class="small"}
# Panel Anidado
Contenido anidado.
::
::
```

## 7. Pruebas de Accesibilidad

### 7.1 ARIA y Roles
```markdown
::panel{style="glass"}
# Accesibilidad
::button{action="test-aria" style="primary" aria-label="Botón accesible" role="button"}Botón Accesible::
::button{action="test-description" style="primary" aria-describedby="desc-1"}Botón con Descripción::
<span id="desc-1" class="sr-only">Este botón realiza una acción importante</span>
::
```

### 7.2 Navegación por Teclado
```markdown
::panel{style="glass"}
# Navegación por Teclado
::button{action="test-tab" style="primary" tabindex="0"}Primer Tab::
::button{action="test-tab" style="secondary" tabindex="0"}Segundo Tab::
::button{action="test-tab" style="info" tabindex="0"}Tercer Tab::
::
```

## 8. Pruebas de Eventos

### 8.1 Eventos de Botón
```markdown
::panel{style="glass"}
# Eventos de Botón
::button{action="test-click" style="primary" on-click="console.log('Click')"}Log Click::
::button{action="test-custom" style="primary" on-custom="handleCustomEvent"}Evento Custom::
::
```

### 8.2 Eventos de Panel
```markdown
::panel{style="glass" class="hoverable"}
# Eventos de Panel
Este panel tiene eventos de hover.
::button{action="test-panel-event" style="primary"}Trigger Panel Event::
::
```

## 9. Pruebas de Combinación

### 9.1 Combinación Compleja
```markdown
::panel{style="glass" class="cut-corner cut-corner-md pattern-grid border-accent shadow-lg float-right"}
# Panel Complejo
Panel con múltiples efectos combinados:
- Esquina cortada mediana
- Patrón de cuadrícula
- Borde acentuado
- Sombra pronunciada
- Flotación derecha

::button{action="complex-action" style="primary" class="large"}Acción Compleja::
::
```

## Notas de Prueba
- Verificar el renderizado correcto en diferentes navegadores
- Comprobar los estados hover y active
- Validar la accesibilidad con lectores de pantalla
- Medir el rendimiento de las animaciones
- Documentar cualquier problema encontrado
- Verificar el funcionamiento de las esquinas cortadas
- Comprobar el fallback en navegadores antiguos
- Validar la interacción entre botones y paneles
- Verificar la respuesta a eventos del sistema
- Comprobar la compatibilidad con temas claro/oscuro 