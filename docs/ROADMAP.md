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

### 🎯 V2.6 (Actual - Base y Bloques Semánticos)
- [x] Layout base con editor/preview (`react-resizable-panels`).
- [x] Integración de `react-codemirror`.
- [x] Soporte inicial para plantillas CSS.
- [x] Funcionalidades markdown básicas (GFM via `remark-gfm`).
- [x] Resaltado de sintaxis (`react-syntax-highlighter`).
- [x] Soporte HTML básico (`rehype-raw` para `<sup>`, `<sub>`, `<mark>`, `<details>`).
- [x] Bloques semánticos:
    - [x] Admoniciones (via `remark-github-beta-blockquote-admonitions` o similar).
    - [x] Secciones colapsables (via `<details>`/`<summary>`).
    - [x] Paneles configurables (via `remark-directive` y `remarkCustomPanels`).
- [x] Barra de herramientas mejorada (interacción, botones de formato).
- [x] Sistema de notificaciones (feedback usuario).
- [x] Mejoras UI/UX generales y estabilidad del redimensionado.
- [x] Persistencia básica (`localStorage`).

### 🚀 V3.0 (Futuro - Expansión y Profesionalización)
- [ ] **Exportación Avanzada**: PDF y HTML de alta fidelidad.
- [ ] **Modo Offline Completo**: Evaluar IndexedDB para gestión avanzada de documentos.
- [ ] **Extensibilidad y Bloques Personalizados**: Desarrollar más plugins `remark`/`rehype` para sintaxis únicas y bloques interactivos.
- [ ] **Gestor de Assets**: Manejo integrado de imágenes y otros archivos.
- [ ] **Panel de Análisis**: Información sobre estructura y contenido del documento.
- [ ] **Previsualización Inline**: Mejoras WYSIWYM.
- [ ] **Mejoras de Editor Avanzadas**: Considerar alternativas si `CodeMirror` no es suficiente (ej. Slate.js).
- [ ] **Gestión de Imágenes Avanzada**: Opciones de almacenamiento en nube.
- [ ] **Prácticas de Desarrollo Robustas**: Testing (Jest, RTL), linting (ESLint, Prettier), Storybook.
- [ ] **Colaboración en tiempo real** (Opcional, muy largo plazo).

## 🎯 Objetivos Clave

1. **Eficiencia**
   - Reducir fricción en el flujo de trabajo
   - Optimizar rendimiento
   - Minimizar distracciones

2. **Flexibilidad**
   - Personalización extensa
   - Soporte para múltiples flujos de trabajo
   - Extensibilidad (plugins, bloques personalizados)

3. **Profesionalidad**
   - UI/UX de alta calidad
   - Estabilidad y confiabilidad
   - Documentación completa

4. **Escalabilidad**
   - Arquitectura modular
   - Base para futuras características
   - Soporte para plugins

### ✨ Diferenciación Clave
*   **Offline First:** Superar la dependencia online de Notion mediante un robusto almacenamiento local.
*   **Exportación Profesional:** Ofrecer más control y calidad en las exportaciones que Obsidian.
*   **Extensibilidad Semántica:** Proveer un sistema de bloques más flexible y personalizable que las alternativas generalistas.

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