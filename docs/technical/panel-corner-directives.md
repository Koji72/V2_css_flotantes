# Notas Técnicas: Implementación de Directivas Panel/Corner

Este documento detalla el proceso de desarrollo, los desafíos encontrados y las soluciones implementadas para el sistema de directivas `::panel` y `::corner` en Universal Scribe V2.6, específicamente en lo referente a las decoraciones de esquina.

## Objetivo Inicial

El objetivo era permitir a los usuarios añadir decoraciones visuales (esquinas) a los paneles (`::panel`) mediante una sintaxis Markdown simple (`::corner`), permitiendo configurar la posición y el tipo de decoración.

## Desarrollo y Desafíos

### 1. Procesamiento Básico de Directivas

*   Se crearon plugins de `remark` (`remarkCustomPanels.ts`, `remarkCornerDirectives.ts`) para transformar las directivas Markdown en elementos HTML (`<div>`) con clases CSS apropiadas.
*   Se usó `unist-util-visit` para recorrer el AST y `hastscript` (implícitamente a través de `data.hName` y `data.hProperties`) para definir las propiedades del HTML resultante.

### 2. Problemas de Posicionamiento (`position: absolute`)

*   **Problema:** Las esquinas generadas (`.panel-corner`) con `position: absolute` aparecían fuera de lugar o apiladas.
*   **Diagnóstico:** El elemento padre (`.panel`) no tenía establecido `position: relative`, por lo que las esquinas se posicionaban relativas a un ancestro superior.
*   **Solución:** Se aseguró que la regla CSS `.preview .panel` incluyera `position: relative;`.

### 3. Desalineación con Bordes (`offset`)

*   **Problema:** Incluso con el posicionamiento absoluto correcto, las esquinas (`top: 0`, `left: 0`, etc.) se alineaban con el borde *interior* del padding del panel, quedando visualmente *dentro* del borde del panel (ej: `border: 1px solid ...`).
*   **Solución:**
    1.  Se intentó ajustar manually con valores fijos (`top: -1px`).
    2.  Se implementó un atributo `offset` en la directiva `::corner{offset=N}`.
    3.  El plugin `remarkCornerDirectives` lee `offset`, calcula el valor negativo (`-Npx` o `-1px` por defecto) y lo pasa al elemento HTML como una variable CSS (`style="--corner-offset: -Npx;"`).
    4.  El CSS utiliza `var(--corner-offset, -1px)` para las propiedades `top`, `left`, `bottom`, `right`, empujando la esquina hacia afuera.

### 4. Problemas de Orientación (`clip-path` y Gradientes)

*   **Problema:** Al definir formas con `clip-path` para las esquinas (ej: `type=stripes`), las esquinas izquierdas no eran un espejo visual correcto de las derechas. Las rayas diagonales del `background` (gradiente) aparecían invertidas.
*   **Soluciones Iterativas:**
    1.  Se intentó usar `transform: scaleX(-1)` en el CSS, pero no dio el resultado esperado con `clip-path`.
    2.  Se intentó ajustar manualmente los polígonos `clip-path` para crear espejos, lo cual resultó complejo y propenso a errores visuales.
    3.  **Solución Final:** Se introdujeron controles explícitos en la directiva:
        *   `flip=true`: Controla la inversión del *estilo visual* (ej: la dirección del gradiente). El plugin añade la clase `.corner-flipped`. El CSS define una regla `.corner-type-N.corner-flipped` que sobreescribe solo las propiedades visuales (ej: `background`).
        *   `flipH=true`: Controla la inversión *horizontal* de la *forma*. El plugin añade `.corner-shape-flipped-h`. El CSS define reglas `.corner-pos-....corner-type-N.corner-shape-flipped-h` con el `clip-path` invertido horizontalmente.
        *   `flipV=true`: Controla la inversión *vertical* de la *forma*. El plugin añade `.corner-shape-flipped-v`. El CSS define reglas `.corner-pos-....corner-type-N.corner-shape-flipped-v` con el `clip-path` invertido verticalmente.

### 5. Especificidad CSS (`!important`)

*   **Problema:** Las reglas CSS para las formas invertidas (`.corner-shape-flipped-h`, `.corner-shape-flipped-v`) no sobreescribían la regla base del `clip-path` debido a insuficiente especificidad.
*   **Solución:** Se añadió `!important` a las declaraciones `clip-path` dentro de las reglas de inversión de forma (`.corner-shape-flipped-h`, `.corner-shape-flipped-v`, y la combinación H+V) para asegurar que tuvieran prioridad. También se usó `!important` en el posicionamiento (`top`, `left`, etc.) para asegurar la consistencia del offset.

### 6. Tipos Numéricos

*   Se refactorizó el atributo `type` para aceptar números (`type=1`, `type=2`...) en lugar de strings (`type=stripes`). El plugin añade la clase `corner-type-N`. El CSS define los estilos para cada `.corner-type-N`.

### 7. Depuración Aislada

*   Se creó el componente `DirectiveTester.tsx` para probar las directivas y plugins en un entorno aislado, evitando romper la aplicación principal durante la experimentación con la lógica compleja de AST y CSS.

## Estado Actual

El sistema actual permite definir tipos de esquina numéricos, controlar su posición, añadir un offset para empujarlas fuera del borde, invertir su estilo visual (ej: gradiente) e invertir su forma geométrica (`clip-path`) horizontal y/o verticalmente mediante atributos en la directiva Markdown.