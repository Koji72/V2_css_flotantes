# V2 CSS Flotantes

Una aplicación moderna para la visualización de documentos Markdown con plantillas CSS personalizables, construida con React, TypeScript y Vite.

## Versión Actual: 2.6.0

Esta versión incluye mejoras significativas en el procesamiento de markdown, con especial énfasis en la estabilidad y el correcto funcionamiento de los paneles con la sintaxis `:::panel{title="..."}`.

### Mejoras Destacadas en v2.6:
- Procesamiento robusto de paneles de markdown
- Sistema mejorado de logs para facilitar la depuración
- Mayor estabilidad y resistencia a errores
- Mejor rendimiento en el procesamiento de documentos complejos

Para detalles completos de los cambios, consultar los archivos:
- [VERSION.md](./VERSION.md) - Historial de versiones
- [MEJORAS-V2.6.md](./MEJORAS-V2.6.md) - Documentación técnica detallada

## Ejemplos de Sintaxis de Paneles (Ahora Funcionando Correctamente)

```markdown
:::panel{title="Título del Panel"}
Contenido del panel...
:::

:::panel{title="Panel con Estilo" style="tech-corners"}
| Columna 1 | Columna 2 |
|-----------|-----------|
| Valor 1   | Valor 2   |
:::

:::panel{title="Panel Flotante" layout="float-right"}
Este panel flota a la derecha del documento.
:::
```

## Características

- **V2.5: Plantillas CSS Adaptadas + Mejoras JS** - La última versión combina la flexibilidad de las plantillas CSS con mejoras visuales dinámicas mediante JavaScript
- Desarrollo rápido con Vite
- Tipado estático con TypeScript
- Estilos CSS modernos y personalizables
- Diseño responsivo

## Arquitectura V2.5

La versión V2.5 proporciona una experiencia visual mejorada mediante la combinación de:

1. **Plantillas CSS Adaptadas**: Carga diferentes estilos CSS para cambiar completamente la apariencia de la aplicación.
2. **Mejoras JS**: Añade dinámicamente elementos visuales (como barras de progreso) y clases CSS para efectos hover.

### Componentes Principales

- **markdownProcessor.ts**: Convierte Markdown en HTML estructurado y añade atributos data-* y clases semánticas.
- **previewManager.ts**: Aplica CSS y añade elementos visuales dinámicos después de renderizar el contenido.
- **templateManager.ts**: Gestiona la carga y aplicación de plantillas CSS.

### Cómo Funciona

1. El usuario selecciona una plantilla o carga un archivo CSS personalizado
2. `markdownProcessor` genera HTML con atributos data-* para elementos como estadísticas (ej: `data-value`, `data-max`)
3. `previewManager` renderiza el HTML y luego añade elementos visuales como barras de progreso
4. La plantilla CSS define cómo se ven tanto los elementos base como los añadidos dinámicamente

## Plantillas Disponibles

- **Default**: Tema base simple
- **Minimalist**: Diseño limpio con espacios en blanco
- **Modern**: Tema contemporáneo con efectos sutiles
- **Cyberpunk**: Estilo futurista con neones
- **Corporate**: Diseño empresarial profesional
- **Aegis Overdrive**: Tema V2.5 con barras de progreso y efectos avanzados

## Características de Markdown

- Soporte para bloques personalizados con sintaxis `:::tipo Título`
- Detección automática de estados (OK, Warning, Error)
- Sintaxis para dados `[[d20+5]]`
- Procesamiento de tablas y matrices de datos
- Atributos semánticos automáticos para estadísticas `Energía: 75/100`

## Prerrequisitos

- Node.js (versión 16 o superior)
- npm o yarn

## Instalación

1. Clona este repositorio
   ```
   git clone https://github.com/tu-usuario/V2_css_flotantes.git
   cd V2_css_flotantes
   ```

2. Instala las dependencias
   ```
   npm install
   ```

3. Inicia el servidor de desarrollo
   ```
   npm run dev
   ```

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Compila la aplicación para producción
- `npm run preview` - Previsualiza la aplicación compilada
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

- `/src` - Código fuente
- `/public` - Archivos estáticos y plantillas CSS
- `/dist` - Build de producción (generado)
- `/node_modules` - Dependencias (generado)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. 