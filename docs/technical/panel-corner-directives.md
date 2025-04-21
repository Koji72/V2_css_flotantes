# Documento Técnico: Interacción Panel/Corner Directives (v1.1 - 2023-11-XX)

## 1. Objetivo

Implementar y depurar la interacción entre las directivas `:::panel` y `::corner` para añadir decoraciones visuales en las esquinas de los paneles.

## 2. Entorno de Pruebas

Se utilizó un componente dedicado (`src/components/DirectiveTester.tsx`) con `react-markdown`, los plugins relevantes (`remarkDirective`, `remarkCustomPanels`, `remarkCornerDirectives`, `rehypeRaw`, etc.) y estilos específicos en `src/index.css` para aislamiento y visibilidad.

## 3. Proceso y Hallazgos

1.  **Generación HTML:** Confirmado que `remarkCornerDirectives` generaba `<div>` con clases correctas.
2.  **Conflicto CSS Inicial:** Estilos base en `public/css/base-corners.css` (con selector `.preview .panel .panel-corner`) impedían la aplicación de estilos de depuración menos específicos.
3.  **Solución CSS (Tester):** Se usó un selector más específico (`.directive-tester-preview .panel .panel-corner`) en `src/index.css` para aplicar estilos de posicionamiento y depuración (cuadrados rojos) dentro del tester.
4.  **Problema Renderizado Múltiple/Plugin:** Se detectaron problemas donde solo se renderizaba una esquina o aparecía texto residual (`::`/`:::`), además de errores con `rehype-raw` al intentar *reemplazar* nodos.
5.  **Solución Plugin:** Se refactorizó `remarkCornerDirectives` para *modificar el nodo directiva existente in-place* (estableciendo `node.data.hName`, `node.data.hProperties`, `node.children = []`) en lugar de reemplazarlo. El orden de ejecución (`remarkCustomPanels` antes que `remarkCornerDirectives`) también se probó, aunque la modificación in-place fue la solución clave.
6.  **Solución Sintaxis:** Se descubrió que la combinación funcional es:
    *   Panel: `:::panel{title="..."} ... :::` (Contenedor)
    *   Esquina: `::corner{pos="..." type="..."}` (Hoja, sin contenido ni cierre explícito).
7.  **Implementación Estilo Visual:** Se implementó el estilo para `corner-type--stripes` (rayas diagonales) directamente en `src/index.css` usando el selector específico del tester (`.directive-tester-preview .panel .panel-corner.corner-type--stripes`) para asegurar su aplicación sobre los estilos base.

## 4. Estado Funcional (en DirectiveTester)

- **Sintaxis:** `:::panel` (contenedor) y `::corner` (hoja) funcionan.
- **Plugins:** La configuración actual (modificación in-place, orden `Panels`->`Corners`) es correcta.
- **CSS:** Los estilos de posicionamiento y visuales (`stripes`) están definidos en `src/index.css` con especificidad para el tester.
- **Resultado:** Las cuatro esquinas `stripes` se visualizan correctamente en el panel dentro del `DirectiveTester`.

## 5. Próximos Pasos

- **Refactorizar/Mover Estilos Visuales:** Decidir la ubicación final de los estilos `.corner-type--...` (¿`base-corners.css` o archivos de tema como `michael_noir.css`?) y ajustar los selectores (ej., usando `.preview` si se mueven a temas).
- **Implementar Otros Tipos:** Crear estilos para otros `corner-type` (ej., `dots`, `solid`).
- **Pruebas de Integración:** Desactivar `DirectiveTester` y probar la funcionalidad en la `App` principal usando un tema (ej., `michael_noir`).
- **Documentación Usuario:** Crear guía sobre cómo usar las directivas `::corner`.