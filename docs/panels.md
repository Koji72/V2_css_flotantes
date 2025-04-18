# Documentación de Paneles Flotantes

## Introducción

Los paneles flotantes son contenedores versátiles que permiten organizar y presentar contenido de forma elegante y funcional. Esta documentación describe los diferentes tipos de paneles disponibles, sus estilos y cómo utilizarlos.

## Sintaxis Básica

Para crear un panel, use la siguiente sintaxis:

```markdown
::panel{style="estilo" class="clases"}
# Título del Panel
Contenido del panel
::
```

## Estilos Disponibles

### Estilos Base
- `glass`: Panel con efecto de cristal y desenfoque
- `floating`: Panel con sombra elevada
- `hoverable`: Panel que reacciona al hover

Ejemplo:
```markdown
::panel{style="glass"}
# Panel con Efecto Glass
Este panel tiene un efecto de cristal.
::
```

### Tamaños
- `small`: Panel con padding reducido
- `large`: Panel con padding amplio

Ejemplo:
```markdown
::panel{style="glass" class="small"}
# Panel Pequeño
Contenido compacto
::
```

## Posicionamiento

### Flotación
- `float-left`: Flota el panel a la izquierda
- `float-right`: Flota el panel a la derecha

Ejemplo:
```markdown
::panel{style="glass" class="float-right"}
# Panel Flotante
Este panel flota a la derecha
::
```

### Esquinas Cortadas
- `cut-corner`: Activa el efecto de esquina cortada
- `cut-corner-sm`: Esquina cortada pequeña
- `cut-corner-md`: Esquina cortada mediana
- `cut-corner-lg`: Esquina cortada grande

Ejemplo:
```markdown
::panel{style="glass" class="cut-corner cut-corner-md"}
# Panel con Esquina Cortada
Panel con esquina cortada mediana
::
```

## Bordes y Sombras

### Bordes Personalizados
- `border-accent`: Borde con color de acento
- `border-primary`: Borde con color primario
- `border-success`: Borde con color de éxito
- `border-warning`: Borde con color de advertencia
- `border-danger`: Borde con color de peligro

Ejemplo:
```markdown
::panel{style="glass" class="border-accent"}
# Panel con Borde Acentuado
Panel con borde de color acento
::
```

### Sombras
- `shadow-sm`: Sombra suave
- `shadow-md`: Sombra media
- `shadow-lg`: Sombra pronunciada

Ejemplo:
```markdown
::panel{style="glass" class="shadow-lg"}
# Panel con Sombra
Panel con sombra pronunciada
::
```

## Patrones de Fondo

### Patrones Disponibles
- `pattern-grid`: Patrón de cuadrícula
- `pattern-dots`: Patrón de puntos

Ejemplo:
```markdown
::panel{style="glass" class="pattern-grid"}
# Panel con Patrón
Panel con patrón de cuadrícula
::
```

## Estructura Interna

### Cabecera
```markdown
::panel{style="glass"}
# Título del Panel
## Subtítulo
Contenido
::
```

### Contenido
- Soporta Markdown completo
- Permite HTML inline
- Acepta componentes anidados

### Pie
```markdown
::panel{style="glass"}
# Panel con Pie
Contenido principal
---
Pie del panel
::
```

## Interactividad

### Eventos del Panel
- Hover
- Click
- Focus

Ejemplo:
```markdown
::panel{style="glass" class="hoverable"}
# Panel Interactivo
Este panel reacciona al hover
::
```

### Integración con Botones
```markdown
::panel{style="glass"}
# Panel con Botones
::button{action="accion" style="primary"}Botón::
::
```

## Mejores Prácticas

1. **Estructura**
   - Use títulos descriptivos
   - Mantenga el contenido conciso
   - Organice la información jerárquicamente

2. **Estilos**
   - Combine estilos con propósito
   - Evite sobrecargar de efectos
   - Mantenga la consistencia visual

3. **Responsividad**
   - Use clases responsive cuando sea necesario
   - Considere el comportamiento en móviles
   - Adapte el contenido al tamaño

4. **Accesibilidad**
   - Use estructura semántica
   - Incluya atributos ARIA cuando sea necesario
   - Asegure contraste suficiente

5. **Rendimiento**
   - Evite anidación excesiva
   - Optimice imágenes y media
   - Limite efectos pesados

## Ejemplos Comunes

### Panel Informativo
```markdown
::panel{style="glass" class="border-info"}
# Información Importante
Este panel contiene información relevante para el usuario.
::
```

### Panel de Alerta
```markdown
::panel{style="glass" class="border-warning pattern-grid"}
# ⚠️ Atención
Mensaje de advertencia importante.
::
```

### Panel de Acción
```markdown
::panel{style="glass" class="hoverable"}
# Acciones Disponibles
::button{action="save" style="primary"}Guardar::
::button{action="cancel" style="secondary"}Cancelar::
::
```

### Panel con Esquinas
```markdown
::panel{style="glass" class="cut-corner border-accent"}
# Panel Estilizado
Panel con esquina cortada y borde acentuado.
::
```

## Solución de Problemas

### Problemas Comunes

1. **Estilos no se aplican**
   - Verifique la sintaxis de las clases
   - Compruebe la carga de CSS
   - Revise conflictos de estilos

2. **Esquinas cortadas no funcionan**
   - Verifique soporte de clip-path
   - Compruebe las variables CSS
   - Use fallbacks cuando sea necesario

3. **Efectos glass no funcionan**
   - Verifique soporte de backdrop-filter
   - Compruebe la opacidad
   - Use alternativas para navegadores antiguos

### Compatibilidad

- Soporte completo en navegadores modernos
- Degradación elegante en navegadores antiguos
- Alternativas para efectos no soportados

### Rendimiento

- Monitoree el rendimiento de efectos
- Optimice para dispositivos móviles
- Use efectos con moderación 