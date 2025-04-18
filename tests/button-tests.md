# Pruebas de Botones y Paneles

## 1. Pruebas de Botones Básicos

### 1.1 Botones por Estilo
```markdown
::panel{style="glass"}
# Estilos de Botones
::button{action="test-primary" style="primary"}Botón Primario::
::button{action="test-secondary" style="secondary"}Botón Secundario::
::button{action="test-success" style="success"}Botón de Éxito::
::button{action="test-warning" style="warning"}Botón de Advertencia::
::button{action="test-danger" style="danger"}Botón de Peligro::
::button{action="test-info" style="info"}Botón de Información::
::
```

### 1.2 Botones por Tamaño
```markdown
::panel{style="glass"}
# Tamaños de Botones
::button{action="test-small" style="primary" class="small"}Botón Pequeño::
::button{action="test-normal" style="primary"}Botón Normal::
::button{action="test-large" style="primary" class="large"}Botón Grande::
::button{action="test-full" style="primary" class="full-width"}Botón Ancho Completo::
::
```

## 2. Pruebas de Estados de Botones

### 2.1 Estados Interactivos
```markdown
::panel{style="glass"}
# Estados de Botones
::button{action="test-hover" style="primary"}Hover Me::
::button{action="test-active" style="primary"}Click Me::
::button{action="test-focus" style="primary"}Focus Me::
::
```

### 2.2 Estados Especiales
```markdown
::panel{style="glass"}
# Estados Especiales
::button{action="test-disabled" style="primary" disabled="true"}Botón Deshabilitado::
::button{action="test-loading" style="primary" loading="true"}Botón en Carga::
::
```

## 3. Pruebas de Paneles

### 3.1 Estilos de Panel
```markdown
::panel{style="glass"}
# Panel con Estilo Glass
Este panel tiene un efecto de cristal.
::

::panel{style="glass" class="floating"}
# Panel Flotante
Este panel tiene sombra elevada.
::

::panel{style="glass" class="hoverable"}
# Panel Interactivo
Este panel reacciona al hover.
::
```

### 3.2 Tamaños de Panel
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

### 3.3 Posiciones de Panel
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

## 4. Pruebas de Esquinas Cortadas

### 4.1 Tamaños de Corte
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

### 4.2 Estilos de Corte
```markdown
::panel{style="glass" class="cut-corner border-accent"}
# Corte con Acento
Panel con borde acentuado.
::

::panel{style="glass" class="cut-corner border-primary"}
# Corte con Color Primario
Panel con borde primario.
::
```

## 5. Pruebas de Patrones

### 5.1 Fondos con Patrón
```markdown
::panel{style="glass" class="pattern-grid"}
# Panel con Cuadrícula
Panel con patrón de cuadrícula.
::

::panel{style="glass" class="pattern-dots"}
# Panel con Puntos
Panel con patrón de puntos.
::
```

### 5.2 Combinaciones
```markdown
::panel{style="glass" class="cut-corner pattern-grid border-accent"}
# Panel Combinado
Panel con múltiples efectos:
- Esquina cortada
- Patrón de cuadrícula
- Borde acentuado
::
```

## 6. Pruebas de Accesibilidad

### 6.1 ARIA y Roles
```markdown
::panel{style="glass"}
# Pruebas de Accesibilidad
::button{action="test-aria" style="primary" aria-label="Botón accesible" role="button"}Botón Accesible::
::button{action="test-description" style="primary" aria-describedby="desc-1"}Botón con Descripción::
<span id="desc-1" class="sr-only">Este botón realiza una acción importante</span>
::
```

### 6.2 Navegación por Teclado
```markdown
::panel{style="glass"}
# Navegación por Teclado
::button{action="test-tab" style="primary" tabindex="0"}Primer Tab::
::button{action="test-tab" style="secondary" tabindex="0"}Segundo Tab::
::button{action="test-tab" style="info" tabindex="0"}Tercer Tab::
::
```

## 7. Pruebas de Eventos

### 7.1 Eventos de Botón
```markdown
::panel{style="glass"}
# Eventos de Botón
::button{action="test-click" style="primary" on-click="console.log('Click')"}Log Click::
::button{action="test-custom" style="primary" on-custom="handleCustomEvent"}Evento Custom::
::
```

### 7.2 Eventos de Panel
```markdown
::panel{style="glass" class="hoverable"}
# Eventos de Panel
Este panel tiene eventos de hover.
::button{action="test-panel-event" style="primary"}Trigger Panel Event::
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