# 🎯 Universal Scribe V2.6 - Roadmap y Objetivos

## ✨ Visión General
Crear un editor Markdown avanzado (Universal Scribe) centrado en el texto plano pero con capacidades avanzadas de estructuración visual, superando las limitaciones de herramientas existentes como Notion y Obsidian. El editor debe ofrecer una experiencia de usuario fluida, soporte offline robusto, exportación de alta calidad y extensibilidad.

## 📊 Análisis de Competencia (UI/UX)

### 🔍 Obsidian
- **UI**: 
  - Múltiples paneles flexibles (file explorer, editor, vista previa, paneles laterales)
  - Alta personalización (temas, plugins)
  - Tema oscuro por defecto
  - Interfaz densa en información
- **UX**: 
  - Curva de aprendizaje media-alta
  - Enfoque en escritura Markdown y enlaces
  - Requiere configuración para funcionalidades avanzadas
- ✅ **Fortalezas**: Flexibilidad extrema, offline, comunidad de plugins
- ❌ **Debilidades**: Puede ser abrumador, UI básica por defecto

### 📝 Notion
- **UI**:
  - Limpia y minimalista
  - Basada en bloques con comando "/"
  - Oculta el markup
  - Integración visual de bases de datos
- **UX**:
  - Intuitiva para usuarios no técnicos
  - WYSIWYG fluido
  - Organización visual efectiva
- ✅ **Fortalezas**: Facilidad de uso, bloques visuales, colaboración
- ❌ **Debilidades**: Cloud-only, formato propietario

### 📖 Typora
- **UI**:
  - Minimalista extremo
  - WYSIWYM con renderizado inline
  - Temas CSS personalizables
- **UX**:
  - Escritura fluida sin distracciones
  - Formato visual instantáneo
- ✅ **Fortalezas**: Excelente WYSIWYM, enfoque en escritura
- ❌ **Debilidades**: Limitado para organización compleja

## 🎨 Layout Principal Propuesto

### 📑 Panel Principal (Divisible)
1. **Editor de Código (Izquierda/Superior)**
   - ~50-60% del espacio por defecto
   - CodeMirror como base
   - Soporte para pestañas múltiples

2. **Vista Previa (Derecha/Inferior)**
   - ~40-50% del espacio
   - iframe con actualización en tiempo real
   - Toggle para live preview

3. **Divisor Ajustable**
   - Redimensionamiento fluido
   - Soporte para layout horizontal/vertical

### 📂 Barra Lateral Izquierda
- Explorador de Archivos
- Gestor de Plantillas
- Gestor de Assets (V3.0)
- Iconos de navegación vertical

### 🔧 Barra Lateral Derecha
- Inspector/Propiedades
- Ayuda contextual
- Panel de Análisis (V3.0)

### 🔝 Barra Superior
- Acciones esenciales
- Formato rápido
- Selector de plantillas
- Indicadores de estado

### 📊 Barra Inferior
- Estadísticas del documento
- Mensajes de estado/error
- Información contextual

## 💡 Filosofía UI/UX

### 🎯 Claridad y Consistencia
- Paleta de colores profesional
- Tema oscuro por defecto con toggle
- Tipografía optimizada
- Iconografía coherente (Lucide)

### ⌨️ Experiencia de Edición
- Autocompletado SML
- Validación en tiempo real
- Previsualización inline (V3.0)
- Decoraciones sutiles de código

### 📚 Descubribilidad
- Ayuda contextual integrada
- Plantillas de ejemplo
- Tooltips informativos
- Documentación accesible

### 💬 Feedback
- Notificaciones toast
- Mensajes de error claros
- Indicadores de estado visibles

## 🛠️ Implementación Técnica

### 🥞 Stack Tecnológico Principal (V2.6)
- **Framework**: React (v18+) con TypeScript
- **Markdown Engine**: `react-markdown` con `remark-gfm` (tablas, tachado, listas tareas), `rehype-raw` (HTML básico), `remark-directive` y plugins personalizados (`remarkCustomPanels`).
- **Code Highlighting**: `react-syntax-highlighter` (Prism.js, tema vscDarkPlus)
- **Styling**: CSS estándar, Variables CSS, potencialmente Tailwind CSS para utilidades.
- **Editor Core**: `react-codemirror` (CodeMirror 6)
- **Persistencia**: `localStorage` (auto-guardado básico)
- **Imágenes Locales**: `FileReader API`

### 📦 Componentes Principales
- Editor (CodeMirror)
- Preview (iframe)
- SidebarLeft
- SidebarRight
- Toolbar
- StatusBar

### 🔄 Gestión de Estado
- Zustand para estado global
  - Estado de editor/preview
  - Estado de paneles y layout
- Configuración de usuario
- Plantilla activa

### 📐 Layout
- `react-resizable-panels` (base)
- Flexbox/Grid
- Diseño responsive
- Soporte para múltiples monitores

## 📅 Fases de Desarrollo

**Estado General Actual (Estimado):** ~75-80%

**Foco Actual:** Depuración y estabilización del sistema de directivas personalizadas (Fase 2), específicamente la interacción entre `:::panel` y `:::corner` y la correcta renderización visual.

### Fase 1: Fundación y Editor Central (Completa: ~95%) ✅

*   [x] Interfaz de Doble Panel (Editor/Preview) + Divisor Ajustable (`react-resizable-panels`)
*   [x] Integración de Editor (`react-codemirror`)
*   [x] Renderizado Markdown Básico (`react-markdown`, GFM)
*   [x] Resaltado de Sintaxis para Bloques de Código (`react-syntax-highlighter`)
*   [x] Soporte HTML básico (`rehype-raw` para `<sup>`, `<sub>`, `<mark>`, `<details>`)
*   [x] Barra de Herramientas Funcional (Iconos Lucide, acciones de formato)
*   [x] Sistema de Atajos de Teclado
*   [x] Sistema de Temas CSS (Carga dinámica desde `/public/templates`, selector)
*   [x] Modo Claro/Oscuro Básico
*   [x] Utilidades Esenciales (Autoguardado en `localStorage`, Sincronización de Scroll)
*   [x] Carga de Imágenes Locales (Base64)
*   [x] Sistema de notificaciones (feedback usuario via `react-hot-toast`).
*   [x] Mejoras UI/UX generales y estabilidad del redimensionado.

### Fase 2: Sistema de Directivas Personalizadas (En Progreso: ~60%) 🚧

*El objetivo es tener un sistema robusto y fiable para extender Markdown con sintaxis `:::`.*

*   [x] Integración Base de `remark-directive`.
*   [x] Plugin `remarkEnsureDirectiveBrackets` (Ayudante).
*   [x] Plugin `remarkGithubBetaBlockquoteAdmonitions` (Admoniciones estándar).
*   **Plugin `remarkCustomPanels` (`:::panel{...}`):**
    *   [x] Parseo de atributos básicos (`title`, `style`, `layout`, `class`).
    *   [x] Generación de `<div>` base con clases CSS correspondientes.
    *   [x] Inserción de título `<h4>` estilizado.
    *   [x] **Mecanismo de Estilos Semánticos:** Funcional (`panel-style--note`, etc.), pero requiere definiciones CSS en cada tema. *(Validado)*
    *   [ ] **BUG CRÍTICO:** Eliminación inconsistente del marcador de cierre `:::` cuando interactúa con contenido complejo o directivas anidadas. *(Necesita revisión y corrección definitiva)*.
*   **Plugin `remarkCornerDirectives` (`:::corner{...}`):**
    *   [x] Reconocimiento y procesamiento básico de la directiva `:::corner` (usando sintaxis `:::`).
    *   [x] Parseo de atributos (`pos`, `type`).
    *   [ ] **Generación HTML/CSS:** Se generan los `<div>`, pero la visualización es incorrecta/incompleta (solo 1 esquina visible, posicionamiento?). *(Necesita revisión CSS y potencialmente del HTML generado)*.
*   **Interacción Panel/Corner:**
    *   [ ] **BUG CRÍTICO:** Las directivas `:::corner` dentro de `:::panel` causan artefactos visuales (esquinas mal posicionadas o faltantes) y contribuyen al bug del `:::` residual del panel. *(Bloqueador principal actual)*.

### Fase 3: Diferenciación Avanzada (Pendiente: 0%) ⏳

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

### Fase 4: Pulido, Pruebas y Ecosistema (Pendiente: 0%) ⏳

*   [ ] Pruebas Unitarias y de Integración para Plugins y Componentes (Jest, RTL).
*   [ ] Pruebas End-to-End del Flujo de Trabajo (Cypress/Playwright).
*   [ ] Optimización del Rendimiento (Renderizado, carga de temas, plugins, Web Vitals).
*   [ ] Revisión y Mejora de la Experiencia de Usuario (UI/UX).
*   [ ] Documentación Completa (Guía de Usuario, Referencia de Directivas, API de Plugins/Temas).
*   [ ] Modo Offline Completo (Evaluar IndexedDB).
*   [ ] Gestor de Assets Básico (Manejo integrado de imágenes).
*   [ ] Testing, Linting y Formato (ESLint, Prettier, Storybook).
*   **Hub Comunitario Integrado:**
    *   [ ] Diseño de sistema para compartir/descubrir (¿Basado en GitHub/JSON manifest?).
    *   [ ] Navegador/Instalador en la App para Temas CSS.
    *   [ ] Navegador/Instalador en la App para "Packs de Componentes" (Directivas `:::` predefinidas).
    *   [ ] Navegador/Instalador en la App para "Conjuntos de Reglas Ligeras".

## 🎯 Objetivos Clave (Revisados)

1.  **Funcionalidad del Nicho:** Implementar y estabilizar el sistema de directivas personalizadas (`:::panel`, `:::corner`) como base para componentes RPG/Narrativos.
2.  **Personalización Profunda:** Potenciar el sistema de temas CSS y la integración de assets de usuario.
3.  **Experiencia de Autoría Fluida:** Mantener la eficiencia y claridad del editor/preview, minimizando bugs y fricción.
4.  **Estabilidad y Rendimiento:** Asegurar que la aplicación sea robusta y rápida, incluso con contenido complejo.
5.  **Extensibilidad Controlada:** Crear una base sólida para futuras directivas y funcionalidades (Fase 3) sin sacrificar la estabilidad.

### ✨ Diferenciación Clave (Mantenida)
*   **Offline First:** Superar la dependencia online de Notion mediante un robusto almacenamiento local.
*   **Componentes Visuales/Funcionales desde Texto:** Crear experiencias interactivas y temáticas que van más allá del estilizado Markdown estándar (superando a Obsidian/Typora en este nicho específico).
*   **Alta Personalización Estética y Temática:** Ofrecer un nivel de personalización visual más allá de los temas habituales.
*   **Enfoque en RPG/Narrativa (Futuro):** Desarrollar componentes y herramientas específicas para este dominio (Fase 3).

## 📈 Métricas de Éxito

- Tiempo de carga < 2s
- FPS > 60 en operaciones comunes
- Satisfacción de usuario > 4.5/5
- Tasa de adopción de nuevas características > 70%

## 🔄 Proceso de Mejora Continua

1. **Recolección de Feedback**
   - Encuestas de usuarios
   - Análisis de uso
   - Reporte de bugs

2. **Iteración**
   - Sprints de 2 semanas
   - Revisiones de código
   - Testing automatizado

3. **Documentación**
   - Actualización continua
   - Ejemplos prácticos
   - Guías de contribución

---

*Este documento es una guía viva y será actualizado según evolucione el proyecto.* 

:::panel{title="Plano de Seguridad" style="blueprint" animation="pulse"}
::corner{pos=top-left type=2 offset=2}
::corner{pos=bottom-right type=2 offset=2}
::B-edge{type=1 span="90%" offset=0}

- Puerta principal: Cerrada  
- Cámaras: Activas  
- Alarmas: <span style="color:#ff3030">Desactivadas</span>
::: 