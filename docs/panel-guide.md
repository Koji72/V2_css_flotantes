# 🌊 Guía Completa de Paneles Configurables (Directiva :::panel)

## Introducción

Los paneles configurables, invocados mediante la directiva `:::panel`, son contenedores versátiles que permiten organizar y presentar contenido de forma elegante y funcional dentro de tus documentos Markdown. Esta guía describe la sintaxis, los atributos disponibles y muestra ejemplos prácticos de cómo utilizarlos.

## 📋 Síntesis de Atributos

La directiva `:::panel` acepta atributos clave-valor dentro de llaves `{}` para personalizar su apariencia y comportamiento.

| Atributo    | Valores posibles                                                              | Descripción                                                                 |
|-------------|-------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
| `title`     | Texto                                                                         | Define el título del panel (se mostrará en una cabecera si el estilo lo soporta) |
| `layout`    | `float-left`, `float-right`, `centered` (otros pueden ser definidos por CSS) | Define la disposición o posicionamiento del panel en la página                |
| `width`     | Porcentaje (ej: `30%`, `40%`)                                                 | Determina el ancho del panel (principalmente útil para layouts flotantes)   |
| `style`     | `tech-corners`, `hologram`, `neo-frame`, `glass-panel`, `circuit-nodes`, `cut-corners`, `corner-brackets`, `custom-corner` (otros pueden ser definidos por CSS) | Aplica un estilo visual predefinido al panel                                |
| `class`     | `panel-info`, `panel-success`, `panel-warning`, `panel-error` (u otras clases CSS) | Añade clases CSS adicionales para estados visuales o estilos personalizados |
| `animation` | `pulse`, `glow` (otros pueden ser definidos por CSS)                          | Aplica una animación predefinida al panel                                   |

*Nota: La disponibilidad y apariencia exacta de `style`, `layout`, `class` y `animation` dependen de los estilos CSS definidos en la plantilla activa (ej. `blank-template.css`).*

## 🚀 Sintaxis Básica

Para crear un panel, usa la siguiente sintaxis Markdown:

```markdown
:::panel{title="Título Opcional" layout="valor" width="valor" style="valor" class="valor" animation="valor"}
## Encabezado (Opcional)

Contenido del panel en formato Markdown...

- Listas
- **Texto**
- [Enlaces](...)
- Bloques de código
  ```javascript
  console.log('Hola');
  ```
- Etc.

:::
```

## 🧱 Paneles Básicos

### Panel Simple

Un panel sin atributos específicos hereda el estilo base definido en el CSS.

**Markdown:**
```markdown
:::panel
## Panel Simple

Este es un panel básico sin estilos adicionales.
- Soporta Markdown completo
- Listas, enlaces, etc.
:::
```

### Panel con Título

El atributo `title` añade un título visible (si el CSS lo define).

**Markdown:**
```markdown
:::panel{title="Panel con Título"}
Contenido del panel con título personalizado.

1. Elemento uno
2. Elemento dos
:::
```

## 🎨 Estilos Visuales (`style="..."`)

Estos estilos modifican la apariencia general del panel.

### Estilo `tech-corners`

**Markdown:**
```markdown
:::panel{title="Datos del Sistema" style="tech-corners"}
| COMPONENTE | ESTADO | CAPACIDAD |
|------------|--------|-----------|
| CPU        | Activo | 78%       |
| Memoria    | Óptimo | 42%       |
| Red        | Alerta | 91%       |
:::
```

### Estilo `hologram`

**Markdown:**
```markdown
:::panel{title="Pantalla Holográfica" style="hologram"}
## Análisis de Anomalía

Objeto no identificado detectado en sector 7G.
Recomendación: **Investigar inmediatamente**.

*Coordenadas: X-2471, Y-8935, Z-1242*
:::
```

### Estilo `neo-frame`

**Markdown:**
```markdown
:::panel{title="Informe de Energía" style="neo-frame"}
### Estado de Reactores

Reactor 1: `OPERATIVO` - Eficiencia: 97.3%
Reactor 2: `MANTENIMIENTO` - Eficiencia: 0%
Reactor 3: `OPERATIVO` - Eficiencia: 99.1%

> El mantenimiento del Reactor 2 finalizará en 3.5 horas
:::
```

### Estilo `glass-panel`

**Markdown:**
```markdown
:::panel{title="Información Ambiental" style="glass-panel"}
## Condiciones Atmosféricas

- Temperatura: 22.7°C
- Humedad: 41%
- Presión: 1013 hPa
- Calidad del aire: Óptima

*Última actualización: hace 5 minutos*
:::
```

### Estilo `circuit-nodes`

**Markdown:**
```markdown
:::panel{title="Diagnóstico de Circuitos" style="circuit-nodes"}
```
INICIO ESCANEO
  SECTOR A-7: OK
  SECTOR B-3: FALLO_PARCIAL
  SECTOR C-9: OK
FIN ESCANEO
```

Recomendación automática: Reemplazar módulo B-3-42
:::
```

### Estilo `cut-corners`

**Markdown:**
```markdown
:::panel{title="Plan de Misión" style="cut-corners"}
### Objetivos Primarios

1. Infiltración en sistema principal
2. Extracción de datos objetivo
3. Eliminación de rastros digitales

Tiempo estimado: 87 segundos
:::
```

### Estilo `corner-brackets`

**Markdown:**
```markdown
:::panel{title="Mensaje Cifrado" style="corner-brackets"}
**DE:** Agente Shadow
**PARA:** Central

Infiltración completada. Datos asegurados.
Requiero extracción en punto ALFA a las 0300.

*Este mensaje se autodestruirá*
:::
```

### Estilo `custom-corner` (Dependiente de plantilla)

**Markdown:**
```markdown
:::panel{title="Diagnóstico Personalizado" style="custom-corner"}
Este estilo puede tener esquinas personalizadas definidas en ciertas plantillas CSS.
:::
```

## ↔️ Opciones de Layout (`layout="..."`)

### Layout `float-left` (35% ancho)

**Markdown:**
```markdown
:::panel{layout="float-left" width="35%" style="tech-corners" title="Panel Flotante Izquierda"}
Este panel flota a la **izquierda** del texto principal.

- Ideal para notas contextuales
- Se integra con el flujo de texto
- El texto principal fluye a su derecha
:::

Este es el texto principal que fluye alrededor del panel flotante a la izquierda. Como puedes ver, el texto se ajusta automáticamente al espacio disponible, creando un diseño dinámico y agradable.
```
<div style="clear:both"></div>

### Layout `float-right` (40% ancho)

**Markdown:**
```markdown
:::panel{layout="float-right" width="40%" style="glass-panel" title="Panel Flotante Derecha"}
Este panel flota a la **derecha** del texto principal.

1. Perfecto para datos complementarios
2. Excelente para glosarios laterales
3. Ideal para destacar información importante
:::

Los paneles flotantes a la derecha se crean usando el atributo `layout="float-right"`. El panel se coloca a la derecha y el texto principal fluye alrededor de él por la izquierda.
```
<div style="clear:both"></div>

### Layout `centered` (Ancho automático o definido)

*Nota: La implementación de `centered` dependerá de las reglas CSS específicas.*
**Markdown (Ejemplo conceptual):**
```markdown
:::panel{layout="centered" width="60%" style="neo-frame" title="Panel Centrado"}
Este panel se mostraría centrado en la página, ocupando el 60% del ancho disponible. Es útil para destacar bloques importantes de contenido.
:::
```

## 🌈 Clases de Estado (`class="..."`)

Permiten aplicar estilos adicionales, a menudo para indicar el propósito o estado del contenido.

### Clase `panel-success`

**Markdown:**
```markdown
:::panel{layout="float-left" width="35%" style="tech-corners" title="Operación Exitosa" class="panel-success"}
✅ **COMPLETADO**

La operación se ha realizado correctamente.
- Todos los archivos procesados: 127
- Tiempo total: 3.5 segundos
- Estado: Finalizado

*No se requieren acciones adicionales.*
:::

Comunica éxito o una condición positiva (generalmente con color verde).
```
<div style="clear:both"></div>

### Clase `panel-warning`

**Markdown:**
```markdown
:::panel{layout="float-right" width="40%" style="glass-panel" title="¡Atención Requerida!" class="panel-warning"}
⚠️ **ADVERTENCIA**

Se requiere intervención del usuario:
1. Espacio en disco bajo (15% disponible)
2. Algunas funciones pueden verse afectadas
3. Se recomienda liberar espacio

*Revise la sección de almacenamiento para más detalles.*
:::

Comunica precaución o necesidad de atención (generalmente con color amarillo/ámbar).
```
<div style="clear:both"></div>

### Clase `panel-error`

**Markdown:**
```markdown
:::panel{layout="float-left" width="35%" style="tech-corners" title="Error Crítico" class="panel-error" animation="pulse"}
❌ **ERROR DETECTADO**

Sistema: Autenticación
Código: AUTH_501
Severidad: ALTA

*Contacte al administrador del sistema inmediatamente.*
:::

Comunica problemas críticos o errores (generalmente con color rojo). Se puede combinar con animaciones.
```
<div style="clear:both"></div>

### Clase `panel-info`

**Markdown:**
```markdown
:::panel{layout="float-right" width="40%" style="glass-panel" title="Información Adicional" class="panel-info"}
ℹ️ **NOTA INFORMATIVA**

Este documento utiliza paneles configurables para mejorar la experiencia de lectura.

**Compatibilidad:**
- Navegadores modernos: Completa
- Dispositivos móviles: Adaptativa
- Lectores de pantalla: Accesible

*Los paneles se convierten a formato vertical en pantallas pequeñas.*
:::

Comunica información complementaria o contextual (generalmente con color azul).
```
<div style="clear:both"></div>

## 🎭 Animaciones (`animation="..."`)

Añaden dinamismo a los paneles.

### Animación `pulse`

**Markdown:**
```markdown
:::panel{layout="float-left" width="35%" style="tech-corners" title="Animación Pulse" animation="pulse"}
Esta animación hace que el panel **pulse** sutilmente, atrayendo la atención del usuario sin ser demasiado intrusiva. Ideal para notificaciones importantes.
:::

```
<div style="clear:both"></div>

### Animación `glow`

**Markdown:**
```markdown
:::panel{layout="float-right" width="40%" style="glass-panel" title="Animación Glow" animation="glow"}
La animación **glow** crea un suave resplandor alrededor del panel. Perfecta para contenido destacado o crear puntos focales sutiles.
:::

```
<div style="clear:both"></div>

## 📱 Comportamiento Responsivo

:::panel{title="Nota sobre Responsividad" style="corner-brackets" class="panel-info"}
En **dispositivos móviles** y pantallas pequeñas, los paneles con layout flotante (`float-left`, `float-right`) automáticamente se convierten en bloques de ancho completo para garantizar la legibilidad.
:::

Esta adaptación asegura una buena experiencia de usuario en cualquier dispositivo sin necesidad de crear contenido específico.

## 🔄 Borrar los Flotantes (`clear:both`)

Para evitar que los paneles flotantes afecten la disposición de los elementos que les siguen, especialmente al final de una sección, puedes usar un `div` HTML con `clear:both`:

```html
<div style="clear:both"></div>
```

Este elemento asegura que cualquier contenido posterior comience debajo de todos los paneles flotantes activos en ese momento.

## 🎯 Mejores Prácticas

1.  **Propósito Claro:** Usa paneles para agrupar contenido relacionado o destacar información específica.
2.  **Moderación:** Evita sobrecargar la página con demasiados paneles, especialmente los flotantes o animados.
3.  **Contenido Conciso:** Mantén el contenido dentro de los paneles relativamente breve, especialmente en los flotantes.
4.  **Consistencia:** Utiliza estilos y clases de estado de forma consistente en todo el documento.
5.  **Accesibilidad:** Asegúrate de que los colores tengan suficiente contraste y considera cómo se leerá el contenido con lectores de pantalla (el orden puede verse afectado por los flotantes).
6.  **Pruebas:** Revisa cómo se ven tus paneles en diferentes tamaños de pantalla. 