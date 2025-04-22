# Ejemplos de Paneles y Decoraciones (SagaWeaver V2.6)

Esta es una guía de referencia para los tipos de paneles y decoraciones predefinidos y cómo usarlos con el tema `scifi-interface-theme.css`.

## Paneles Base y Estilos

**Panel Básico (Default)**
Sin atributo `style`. Fondo oscuro, borde cyan tenue.
```markdown
:::panel{title="Título Básico"}
Contenido...
:::
```

**Panel Holográfico (`style=holographic`)**
Fondo degradado translúcido, borde cyan más fuerte. Ideal para resúmenes o información destacada.
```markdown
:::panel{style=holographic title="Resumen Holográfico"}
Datos importantes...
:::
```

**Panel Tecno-Esquinas (`style=tech-corners`)**
Esquinas cortadas con `clip-path`. Bueno para diagnósticos, datos técnicos.
```markdown
:::panel{style=tech-corners title="Diagnóstico Técnico"}
Lecturas de sensores...
:::
```

**Panel Esquina Cortada (`style=cut-corner-lg`)**
Corte diagonal grande en dos esquinas. Estilo distintivo.
```markdown
:::panel{style=cut-corner-lg title="Nota Estratégica"}
Plan de acción...
:::
```

**Panel Glass (`style=glass`)**
Fondo semitransparente con blur. Moderno y limpio.
```markdown
:::panel{style=glass title="Perfil"}
Información biográfica...
:::
```

## Layouts

*   `layout="left"`: Flota a la izquierda (ancho ~400px).
*   `layout="right"`: Flota a la derecha (ancho ~400px).
*   `layout="center"`: Centrado horizontalmente (ancho ~80%).
*   *(Sin layout)*: Ocupa el ancho disponible (definido por `.preview .panel { max-width: 800px; }`).

**Importante:** Usar `<br style="clear: both;">` después de paneles flotantes para evitar solapamientos con el contenido siguiente.

## Esquinas (`::corner`)

*   `pos`: `top-left`, `top-right`, `bottom-left`, `bottom-right`
*   `offset`: Número (píxeles de desplazamiento, default 1)
*   `type`:
    *   `1`: (No definido en tema SciFi - Hereda de Aegis si está cargado o no se muestra)
    *   `2`: Triángulo/overlay azul (`#0066ff`)
    *   `3`: Triángulo/overlay ámbar (`#ffaa00`)
    *   *(No hay `type=4` definido en SciFi)*
*   `flipH`, `flipV`: `true` (Invierte forma, útil si se definen más tipos con clip-path/mask)

**Ejemplo:** `::corner{pos=top-left type=2 offset=2}`

## Bordes (`::T-edge`, `::B-edge`, `::L-edge`, `::R-edge`)

*   `offset`: Número (píxeles de desplazamiento, default 1)
*   `span`: Número (`px`) o Porcentaje (`%`) - controla `width` (T/B) o `height` (L/R).
*   `type`:
    *   `1`: Forma trapezoidal/barra azul (`#0066ff`)
    *   `2`: Barra ámbar (`#ffaa00`) - ¡Nuevo! Ideal para alertas.

**Ejemplo:** `::T-edge{type=2 span="80%" offset=0}`

## Paneles Predefinidos (Combinaciones Útiles)

**Panel de Alerta Crítica**
Usa decoraciones ámbar (o rojas si se definen).
```markdown
:::panel{title="¡¡ALERTA!!" layout="center"}
::corner{pos=top-left type="3"} ::corner{pos=top-right type="3"}
::corner{pos=bottom-left type="3"} ::corner{pos=bottom-right type="3"}
::T-edge{type="2" span="100%"} ::B-edge{type="2" span="100%"}
Contenido urgente...
:::
```

**Panel de Lectura de Datos**
Usa `tech-corners` y bordes laterales.
```markdown
:::panel{style=tech-corners title="Lectura de Sensores"}
::L-edge{type="1" span="90%"} ::R-edge{type="1" span="90%"}
Datos tabulados o código...
:::
```

**Panel de Perfil/Bio (Flotante)**
Usa `glass` y esquinas sutiles.
```markdown
:::panel{style=glass title="Perfil Entidad" layout="left"}
::corner{pos=top-left type="2"} ::corner{pos=bottom-right type="2"}
Información...
:::
```

**Panel de Registro COMMS**
Estilo base con borde superior corto.
```markdown
:::panel{title="Registro COMMS"}
::T-edge{type="1" span="100px"}
Transcripción...
:::
``` 