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

## 4. Corrección de Estilos Internos y Especificidad (Debug)

*   **Problema:** Se detectó que al aplicar estilos de panel complejos (ej. `panel-style--scanline-terminal`) combinados con clases de estado (ej. `state--error`), los elementos internos del panel (como `pre`, `blockquote`, admonitions `[!WARNING]`) no heredaban correctamente los colores definidos por el estado. En su lugar, mantenían los colores del estilo base del panel (ej. texto verde en `scanline-terminal` en lugar de rojo en `state--error`) o mostraban fondos claros inesperados (ej. fondo blanco en admonitions).
*   **Diagnóstico:**
    1.  Se identificó mediante la inspección de elementos que reglas CSS con alta especificidad o el uso de `!important` en los estilos base del panel (ej. `.panel-style--scanline-terminal * { color: green !important; }`) estaban sobreescribiendo los estilos que se intentaban aplicar para el estado específico.
    2.  Los estilos predeterminados de los admonitions (posiblemente de la librería `remark-github-beta-blockquote-admonitions` o CSS base) aplicaban fondos y colores que no eran sobreescritos por las reglas iniciales para la combinación de panel + estado.
*   **Solución Implementada:**
    1.  Se crearon reglas CSS **altamente específicas** para la combinación exacta de estilo y estado (ej. `.panel.panel-style--scanline-terminal.state--error`).
    2.  Dentro de estas reglas específicas, se **forzaron** los estilos deseados (color de texto, sombra de texto, color de borde, color de fondo para elementos internos específicos) usando `!important` para garantizar que sobreescriban cualquier regla conflictiva.
    3.  Se utilizó un selector genérico con `!important` (`.panel.panel-style--scanline-terminal.state--error *`) para establecer un estado base (color de error, fondo transparente) para todos los elementos internos, y luego se reaplicaron estilos más específicos (también con `!important`) para elementos particulares como `pre`, `code`, `.markdown-alert-warning`, etc., para darles su apariencia final deseada dentro de ese estado.
    4.  Se definieron variables CSS específicas para los colores y sombras del estado de error (`--panel-text-error-base`, `--panel-border-error`, etc.) para mejorar la mantenibilidad.

## 5. Entendiendo la Cascada de Estilos y la Especificidad (Lecciones Aprendidas)

La depuración de los problemas de contraste y aplicación de estados en paneles complejos (como `scanline-terminal` con `state--error`) reveló puntos cruciales sobre cómo interactúan las diferentes capas de CSS en SagaWeaver.

### a. Proceso General (Markdown a Estilos Aplicados)

1.  **Markdown a HTML:** Las directivas (`:::panel`, `::corner`, etc.) son transformadas por plugins `remark` en una estructura HTML con clases CSS específicas (`.panel`, `.panel-style--*`, `.state--*`, `.panel-corner`, etc.).
2.  **Carga de CSS:** La aplicación carga múltiples archivos CSS. Aunque el orden exacto puede variar según la importación en React/Vite, conceptualmente se aplican en capas:
    *   **Navegador/User Agent:** Estilos predeterminados del navegador.
    *   **Base/Reset CSS:** Estilos globales que normalizan o definen elementos básicos (probablemente en `src/styles/base` o `index.css`).
    *   **Componente Base CSS:** Estilos generales para `.panel`, `.panel-header-container`, etc. (probablemente en `src/styles/components/panels.css`).
    *   **Estilo Específico del Panel (Tema):** Reglas para `.panel.panel-style--data-stream`, `.panel.panel-style--blueprint`, etc. (definidas en `src/styles/components/all-panel-styles.css`). Estas definen la apariencia temática principal.
    *   **Clases de Utilidad/Estado:** Reglas para `.state--error`, `.animation--glow`, etc. (también en `all-panel-styles.css` o archivos dedicados). Estas *intentan modificar* los estilos anteriores.
    *   **Estilos de Elementos Internos:** Estilos específicos para `p`, `pre`, `blockquote`, `.markdown-alert`, etc., que pueden venir de CSS base, de la librería de admonitions, o de otras fuentes.
    *   **Estilos Inline:** Cualquier estilo aplicado directamente en el atributo `style` del HTML (generalmente evitado).

### b. El Rol de la Especificidad y `!important`

El orden de carga no es el único factor. El navegador decide qué estilo aplicar basándose en:

1.  **Especificidad del Selector:** Selectores más específicos ganan (ej. `#id .clase` es más específico que `.clase p`).
2.  **`!important`:** Esta declaración fuerza a que una regla tenga máxima prioridad (casi siempre), ignorando la especificidad normal y el orden de carga.
3.  **Orden en el Código:** Si dos reglas tienen la misma especificidad, la que aparece *más tarde* en el CSS (o en el último archivo cargado) generalmente gana.

### c. El Conflicto Específico que Encontramos

*   **Causa Raíz:** Una regla en `all-panel-styles.css` para el tema base, como `.panel-style--scanline-terminal *`, usaba `!important` para aplicar un color (ej. verde `#c0d080`).
*   **Consecuencia:** Debido al `!important`, esta regla base tenía una prioridad altísima.
*   **Fallo:** Cuando se añadía la clase `.state--error`, las reglas CSS para ese estado (ej. `.panel.panel-style--scanline-terminal.state--error * { color: red !important; }`) **no podían sobreescribir** el color verde aplicado por la regla base a *todos* los elementos internos (`*`), aunque también usaran `!important` y fueran más específicas (porque la regla base con `!important` ya había ganado).
*   **Problema Adicional:** Elementos internos como los admonitions (`.markdown-alert-warning`) tenían sus propios estilos predeterminados (ej. `background-color: white;`) que tampoco eran afectados correctamente por las reglas del panel o del estado.

### d. La Solución Aplicada (Estrategia de Especificidad)

1.  **Reducir Fuerza Base:** Se modificó la regla base conflictiva (ej. `.panel-style--scanline-terminal *`) para **eliminar `!important`** de las propiedades que necesitaban ser sobreescritas (como `color`). Ahora solo aplica estilos base sin forzarlos.
2.  **Aumentar Especificidad del Override:** Se usaron selectores muy específicos para la combinación de estilo y estado (ej. `.panel.panel-style--scanline-terminal.state--error`).
3.  **Forzar Override con `!important`:** Se aplicó `!important` a las propiedades *dentro* de las reglas de combinación (ej. `.panel.panel-style--scanline-terminal.state--error * { color: red !important; text-shadow: red !important; background: transparent !important; }`). Esto asegura que el estado de error **sí** pueda sobreescribir los estilos base (que ya no usan `!important`) y los estilos predeterminados de los elementos internos.
4.  **Manejar Excepciones Internas:** Se añadieron reglas **aún más específicas** (ej. `.panel.panel-style--scanline-terminal.state--error .markdown-alert-warning`) para aplicar estilos particulares (como un fondo rojo sutil) a elementos específicos *dentro* del estado de error, sobreescribiendo la regla general `*` del estado de error que los había puesto transparentes.

**Conclusión:** Para estilos complejos y combinables como estos paneles, es vital gestionar la especificidad con cuidado. Usar `!important` debe ser estratégico y, preferiblemente, limitado a las reglas que *deben* sobreescribir otras (como los estados). Una estructura clara con variables CSS y selectores bien definidos es esencial para la mantenibilidad.

## Estado Actual

El sistema actual permite definir tipos de esquina numéricos, controlar su posición, añadir un offset para empujarlas fuera del borde, invertir su estilo visual (ej: gradiente) e invertir su forma geométrica (`clip-path`) horizontal y/o verticalmente mediante atributos en la directiva Markdown.

---

# 🌀 PROCESO DE CREACIÓN E INTEGRACIÓN: PANEL "NEXUS GATE (MANIFESTACIÓN AETHELRED)"

## Resumen Técnico y Pasos Clave

### 1. Recepción del Concepto y Directrices
- Se recibió una especificación avanzada para un panel interactivo y animado, con uso de variables CSS, pseudo-elementos, animaciones y estados visuales.

### 2. Adaptación y Organización del CSS
- Se definieron variables globales y animables (`@property`).
- Se estructuró el CSS en capas visuales (borde animado, fondo, contenido, decoraciones).
- Se implementaron animaciones (`@keyframes`) para bordes, scanline, pulsación y glitch.
- Se añadieron reglas para estados `.state--loading` y `.state--error`.
- Se corrigió la sintaxis para asegurar compatibilidad con CSS estándar (sin anidamiento SCSS).

### 3. Integración en el Proyecto
- El bloque CSS se añadió a `src/styles/components/all-panel-styles.css`.
- Se verificó la no colisión de variables y la especificidad de los selectores.

### 4. Pruebas y Ajustes
- Se generaron ejemplos Markdown usando la sintaxis correcta de directivas:

```markdown
:::panel{title="Portal Nexus Activo" style=nexus-gate animation=glow}
::corner{pos=top-left type=1}
::corner{pos=bottom-right type=1}
::T-edge{type=1 span="80%"}
Estabilizando conexión interdimensional...
- **Sector:** Alpha-7
- **Energía:** 98.7%
- **Estado:** Nominal
:::
```

- Se probaron variantes con `class="state--loading"` y `class="state--error"`.
- Se verificó la correcta renderización de decoraciones.

### 5. Depuración y Diagnóstico
- Se inspeccionó el HTML generado para asegurar la estructura y clases esperadas.
- Se detectó y corrigió un problema de sintaxis Markdown (uso de `|` en vez de `{}` para atributos de directiva).
- Se confirmó la correcta configuración y orden de los plugins de remark.

### 6. Resultado Final
- El panel se renderiza con animaciones, decoraciones y reactividad a estados.
- El sistema es flexible y permite personalización avanzada.

---

## 🧩 Ejemplo de Código Markdown para Nexus Gate

```markdown
:::panel{title="¡FALLO EN EL VÓRTICE!" style=nexus-gate class="state--error"}
::corner{pos=top-left type=1}
::corner{pos=bottom-right type=1}
::T-edge{type=1 span="80%"}
Sobrecarga detectada. Imposible mantener la conexión.
Reiniciando protocolos de seguridad...
:::
```

---

**Referencia rápida:** Busca este bloque con el emoji 🌀 o el título "NEXUS GATE (MANIFESTACIÓN AETHELRED)" para encontrar la documentación y ejemplos de este panel avanzado.

## 🟩 **Barras de carga avanzadas y creativas**

---

### 1. **Barra con icono y texto superpuesto**

```markdown
**Salud:**  
<div class="rig-bar" style="position:relative;">
  <div class="rig-bar__fill" style="width:85%;background:linear-gradient(90deg,#4caf50,#baffc9 80%);"></div>
  <span style="position:absolute;left:10px;top:0;color:#fff;font-size:0.9em;line-height:14px;display:flex;align-items:center;">
    <svg width="14" height="14" style="margin-right:4px;" viewBox="0 0 24 24" fill="#baffc9"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
    85%
  </span>
</div>
```

---

### 2. **Barra animada (brillo pulsante)**

```markdown
**Energía:**  
<div class="rig-bar rig-bar--pulse" style="position:relative;">
  <div class="rig-bar__fill" style="width:70%;background:linear-gradient(90deg,#ffe066,#fffbe6 80%);animation:pulse-bar 1.2s infinite alternate;"></div>
  <span style="position:absolute;right:10px;top:0;color:#222;font-size:0.9em;line-height:14px;">70%</span>
</div>
```
Y en tu CSS:
```css
@keyframes pulse-bar {
  0% { filter: brightness(1); }
  100% { filter: brightness(1.4); }
}
```

---

### 3. **Barra con degradado multicolor (tipo "rainbow power")**

```markdown
**Poder especial:**  
<div class="rig-bar">
  <div class="rig-bar__fill" style="width:95%;background:linear-gradient(90deg,#ff3333,#ffe066,#4caf50,#3af0ff,#bafffc 90%);"></div>
</div>
```

---

### 4. **Barra con "marcadores" de umbral**

```markdown
**Escudo:**  
<div class="rig-bar" style="position:relative;">
  <div class="rig-bar__fill" style="width:60%"></div>
  <span style="position:absolute;left:33%;top:0;color:#fff;font-size:0.7em;line-height:14px;">⅓</span>
  <span style="position:absolute;left:66%;top:0;color:#fff;font-size:0.7em;line-height:14px;">⅔</span>
</div>
```

---

### 5. **Barra "crítica" con animación de parpadeo**

```markdown
**Oxígeno:**  
<div class="rig-bar rig-bar--blink" style="border-color:#ff3333;">
  <div class="rig-bar__fill" style="width:8%;background:linear-gradient(90deg,#ff3333,#ffd6d6 80%);animation:blink-bar 0.7s infinite alternate;"></div>
</div>
```
Y en tu CSS:
```css
@keyframes blink-bar {
  0% { opacity: 1; }
  100% { opacity: 0.4; }
}
```

---

### 6. **Barra con icono de rayo y color cian**

```markdown
**Carga eléctrica:**  
<div class="rig-bar" style="border-color:#3af0ff;">
  <div class="rig-bar__fill" style="width:50%;background:linear-gradient(90deg,#3af0ff,#bafffc 80%);"></div>
  <span style="position:absolute;left:10px;top:0;color:#3af0ff;font-size:1em;line-height:14px;">
    ⚡
  </span>
</div>
```

---

### 7. **Barra "vacía" con mensaje personalizado**

```markdown
**Batería agotada:**  
<div class="rig-bar" style="border-color:#888;">
  <div class="rig-bar__fill" style="width:0%;background:linear-gradient(90deg,#888,#ccc 80%);"></div>
  <span style="position:absolute;left:50%;top:0;color:#888;font-size:0.9em;line-height:14px;transform:translateX(-50%);">¡Sin energía!</span>
</div>
```

---

### 8. **Barra con gradiente "ácido" (verde neón)**

```markdown
**Veneno:**  
<div class="rig-bar" style="border-color:#39ff14;">
  <div class="rig-bar__fill" style="width:35%;background:linear-gradient(90deg,#39ff14,#baffc9 80%);"></div>
</div>
```

---

### 9. **Barra con fondo "holográfico" (efecto glass)**

```markdown
**Campo holográfico:**  
<div class="rig-bar" style="background:rgba(60,255,255,0.08);border-color:#3af0ff;">
  <div class="rig-bar__fill" style="width:90%;background:linear-gradient(90deg,#3af0ff,#fff 80%);"></div>
</div>
```

---

### 10. **Barra con icono SVG personalizado (escudo, corazón, etc.)**

```markdown
**Corazón:**  
<div class="rig-bar" style="position:relative;">
  <div class="rig-bar__fill" style="width:75%;background:linear-gradient(90deg,#ff5e5e,#ffd6d6 80%);"></div>
  <span style="position:absolute;left:10px;top:0;">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#ff5e5e"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
  </span>
</div>
```

---

## **Tips para el cliente**
- Puedes combinar iconos, texto y animaciones.
- Usa `animation` en el `style` para efectos visuales.
- Cambia el color del borde y el gradiente para personalizar el estado.
- Puedes poner varios `<span>` para mostrar valores, iconos o mensajes.

---

¿Quieres que agregue esta colección como bloque documentado en tu CSS/documentación? ¿O necesitas algún ejemplo aún más "loco" (barras apiladas, doble color, etc.)?