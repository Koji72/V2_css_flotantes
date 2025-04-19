# Objetivos del Proyecto: Universal Scribe

## Visión General
Crear un editor Markdown avanzado (Universal Scribe) centrado en el texto plano pero con capacidades avanzadas de estructuración visual, superando las limitaciones de herramientas existentes como Notion y Obsidian. El editor debe ofrecer una experiencia de usuario fluida, soporte offline robusto, exportación de alta calidad y extensibilidad.

## Fase Actual / Objetivos Inmediatos (Basado en trabajo reciente y análisis)

1.  **Establecer Base Tecnológica:**
    *   Utilizar **React (v18+)** y **TypeScript** para la interfaz de usuario y la robustez del código.
    *   Implementar **react-markdown** para el parseo y renderizado de Markdown.
    *   Integrar **remark-gfm** para soporte de GitHub Flavored Markdown (tablas, tachado, listas de tareas).
    *   Usar **react-syntax-highlighter** (con Prism.js y tema `vscDarkPlus`) para resaltado de sintaxis en bloques de código.
    *   Configurar **rehype-raw** para permitir el uso de HTML (`<sup>`, `<sub>`, `<mark>`, `<details>`, `<summary>`) y añadir soporte para estos elementos.
    *   Utilizar **CSS estándar** y **Variables CSS** para estilos y tematización (claro/oscuro), posiblemente complementado con **Tailwind CSS** para utilidades.
    *   Implementar persistencia básica con **localStorage** para auto-guardado (ya parcialmente hecho).
    *   Manejar imágenes locales con **FileReader API** (ya parcialmente hecho).

2.  **Implementar Bloques Semánticos Iniciales:**
    *   Integrar **remark-github-beta-blockquote-admonitions** (plugin alternativo funcional) para añadir soporte a bloques estilo GitHub (`> [!NOTE]`).
    *   Utilizar etiquetas HTML estándar `<details>` y `<summary>` (habilitadas por `rehype-raw`) para secciones colapsables, debido a incompatibilidad del plugin `remark-collapse`.
    *   Definir estilos CSS personalizados para la correcta visualización de admoniciones y secciones colapsables.

3.  **Mejorar Experiencia de Usuario (UI/UX):**
    *   Refinar la barra de herramientas y la interacción con los botones de formato.
    *   Asegurar una interfaz de dos paneles fluida con redimensionamiento estable.
    *   Optimizar el rendimiento del renderizado de Markdown.

## Objetivos a Medio/Largo Plazo (Fases Futuras)

1.  **Exportación Avanzada:**
    *   Desarrollar funcionalidades para exportar documentos a **PDF** y **HTML** con alta fidelidad y control sobre el estilo.

2.  **Modo Offline Completo:**
    *   Evaluar **IndexedDB** si `localStorage` resulta insuficiente para manejar múltiples documentos o documentos grandes.

3.  **Extensibilidad y Bloques Personalizados:**
    *   Utilizar el ecosistema **unified (remark/rehype)** para desarrollar plugins personalizados que permitan:
        *   Sintaxis únicas para bloques específicos.
        *   Bloques interactivos (cuestionarios, mapas, etc.).

4.  **Mejoras de Editor:**
    *   Evaluar la posible integración de un editor más avanzado como **Slate.js** si la necesidad de funcionalidades rich-text supera las capacidades de un `textarea` simple.

5.  **Gestión de Imágenes Avanzada:**
    *   Opcionalmente, integrar un servicio de almacenamiento en la nube (S3, Cloudinary) para el manejo de imágenes en lugar de Base64.

6.  **Prácticas de Desarrollo Robustas:**
    *   Implementar **pruebas unitarias/componentes** (Jest, React Testing Library).
    *   Configurar **linting y formateo** (ESLint, Prettier).
    *   Considerar **Storybook** para desarrollo aislado de componentes.

## Diferenciación Clave
*   **Offline First:** Superar la dependencia online de Notion mediante un robusto almacenamiento local.
*   **Exportación Profesional:** Ofrecer más control y calidad en las exportaciones que Obsidian.
*   **Extensibilidad Semántica:** Proveer un sistema de bloques más flexible y personalizable que las alternativas generalistas. 