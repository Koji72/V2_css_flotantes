# SagaWeaver - Roadmap de Desarrollo

**Visión:** Convertir a SagaWeaver en una plataforma de autoría líder para experiencias narrativas e interactivas, especialmente potente para el nicho RPG, combinando la flexibilidad de Markdown extendido con componentes visuales y funcionales profundos y una alta personalización estética.

**Estado General Actual (Estimado):** ~75-80%

**Foco Actual:** Depuración y estabilización del sistema de directivas personalizadas (Fase 2), específicamente la interacción entre `:::panel` y `:::corner` y la correcta renderización visual.

---

## Fase 1: Fundación y Editor Central (Completa: ~95%) ✅

*   [x] Interfaz de Doble Panel (Editor/Preview) + Divisor Ajustable
*   [x] Renderizado Markdown Básico (`react-markdown`, GFM)
*   [x] Resaltado de Sintaxis para Bloques de Código (`react-syntax-highlighter`)
*   [x] Barra de Herramientas Funcional (Iconos Lucide, acciones de formato)
*   [x] Sistema de Atajos de Teclado
*   [x] Sistema de Temas CSS (Carga dinámica desde `/public/templates`, selector)
*   [x] Modo Claro/Oscuro Básico
*   [x] Utilidades Esenciales (Autoguardado en `localStorage`, Sincronización de Scroll)
*   [x] Carga de Imágenes Locales (Base64)

---

## Fase 2: Sistema de Directivas Personalizadas (En Progreso: ~60%) 🚧

*El objetivo es tener un sistema robusto y fiable para extender Markdown con sintaxis `:::`.*

*   [x] Integración Base de `remark-directive`.
*   [x] Plugin `remarkEnsureDirectiveBrackets` (Ayudante).
*   [x] Plugin `remarkGithubBetaBlockquoteAdmonitions` (Admoniciones estándar).
*   **Plugin `remarkCustomPanels` (`:::panel{...}`):**
    *   [x] Parseo de atributos básicos (`title`, `style`, `layout`, `class`).
    *   [x] Generación de `<div>` base con clases CSS correspondientes.
    *   [x] Inserción de título `<h4>` estilizado.
    *   [x] **Mecanismo de Estilos Semánticos:** Funcional (`panel-style--note`, etc.), pero requiere definiciones CSS en cada tema.
    *   [ ] **BUG CRÍTICO:** Eliminación inconsistente del marcador de cierre `:::` cuando interactúa con contenido complejo o directivas anidadas. *(Trabajo en progreso con heurística de limpieza)*.
*   **Plugin `remarkCornerDirectives` (`:::corner{...}`):**
    *   [x] Reconocimiento y procesamiento básico de la directiva `:::corner`.
    *   [x] Parseo de atributos (`pos`, `type`).
    *   [ ] **Generación HTML/CSS:** Se generan los `<div>`, pero la visualización es incorrecta/incompleta. *(Necesita revisión CSS y potencialmente del HTML generado)*.
*   **Interacción Panel/Corner:**
    *   [ ] **BUG CRÍTICO:** Las directivas `:::corner` dentro de `:::panel` causan artefactos visuales (esquinas mal posicionadas o faltantes) y contribuyen al bug del `:::` residual del panel. *(Bloqueador principal actual)*.

---

## Fase 3: Diferenciación Avanzada (Pendiente: 0%) ⏳

*Objetivo: Implementar las características únicas que posicionarán a SagaWeaver.*

*   **Sistema de "Componentes Inteligentes":**
    *   [ ] Definir Arquitectura y API (Cómo las directivas acceden a datos/estado, interactúan, usan plantillas JS/CSS).
    *   [ ] Componente `:::character-sheet`: Vinculación a datos externos/estado, renderizado basado en plantillas.
    *   [ ] Componente `:::encounter-tracker`: Interactividad en preview, gestión de estado simple (HP, turnos).
    *   [ ] Componente `:::loot-generator`: Conexión a tablas de datos (Markdown/JSON), lógica de aleatoriedad (ej. `1d4`).
    *   [ ] Componente `:::dialogue-tree`: Parseo de sintaxis anidada, renderizado interactivo.
*   **Integración Visual Profunda con Assets:**
    *   [ ] Extracción de Paleta de Colores desde imagen para temas dinámicos.
    *   [ ] Soporte para `border-image` en estilos de panel vía directiva.
    *   [ ] Componente `:::map`: Renderizado de imagen, pines interactivos (datos en atributos/hijos), estado básico (revelar/ocultar pines).
*   **Motor de "Reglas Ligeras" Incorporado:**
    *   [ ] Definición de Sintaxis (`:::ruleset`, `[[rule]]`, `[[variable]]`, `[[choice]]`, funciones `mod()`, `getVar()`).
    *   [ ] Motor de Parseo y Ejecución simple (intérprete básico dentro del entorno de preview).
    *   [ ] Integración con Componentes Inteligentes (ej. `[[choice]]` en `:::dialogue-tree`).
*   **Exportación Optimizada:**
    *   [ ] Diseño de Arquitectura de Exportación Modular.
    *   [ ] Módulo de Exportación a Formato VTT (JSON genérico o específico para Foundry/Roll20).
    *   [ ] Módulo de Exportación a Lector Offline (Paquete autocontenido, ¿ePub3+JS?).
    *   [ ] Módulo de Exportación a Web Component.

---

## Fase 4: Pulido, Pruebas y Ecosistema (Pendiente: 0%) ⏳

*   [ ] Pruebas Unitarias y de Integración para Plugins y Componentes.
*   [ ] Pruebas End-to-End del Flujo de Trabajo.
*   [ ] Optimización del Rendimiento (Renderizado, carga de temas, plugins).
*   [ ] Revisión y Mejora de la Experiencia de Usuario (UI/UX).
*   [ ] Documentación Completa (Guía de Usuario, Referencia de Directivas, API de Plugins/Temas).
*   **Hub Comunitario Integrado:**
    *   [ ] Diseño de sistema para compartir/descubrir (¿Basado en GitHub/JSON manifest?).
    *   [ ] Navegador/Instalador en la App para Temas CSS.
    *   [ ] Navegador/Instalador en la App para "Packs de Componentes" (Directivas `:::` predefinidas).
    *   [ ] Navegador/Instalador en la App para "Conjuntos de Reglas Ligeras".

--- 