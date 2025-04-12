# V2 CSS Flotantes

Una aplicación moderna para la visualización de documentos Markdown con plantillas CSS personalizables, construida con React, TypeScript y Vite.

## Versión Actual: 2.6.1

Esta versión incluye mejoras significativas en el procesamiento de markdown, con especial énfasis en la estabilidad y el correcto funcionamiento de los paneles con la sintaxis `:::panel{title="..."}`, así como la incorporación del sistema de paneles flotantes.

### Mejoras Destacadas en v2.6.1:
- **¡NUEVO!** Sistema de paneles flotantes para diseños avanzados
- **¡NUEVO!** Animaciones mejoradas para elementos visuales
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

:::panel{title="Panel Flotante Izquierda" style="tech-corners" layout="floating-left"}
Este panel flota a la izquierda del documento permitiendo que el texto fluya a su alrededor.
:::

:::panel{title="Panel Flotante Derecha" style="hologram" layout="floating-right"}
Este panel flota a la derecha del documento.
:::

:::panel{title="Panel Centrado" layout="centered" style="neo-frame"}
Este panel aparece centrado con ancho limitado.
:::

:::panel{title="Panel con Animación" style="tech-corners" animation="pulse"}
Este panel tiene una animación de pulso.
:::
```

## Sistema de Paneles Flotantes (Nuevo en v2.6.1)

El nuevo sistema de paneles flotantes permite crear diseños más dinámicos y atractivos:

- **Paneles Flotantes**: Usando `layout="floating-left"` o `layout="floating-right"` para que el texto fluya alrededor
- **Paneles Centrados**: Con `layout="centered"` para enfatizar contenido importante
- **Combinaciones de Estilos**: Todos los estilos de panel pueden combinarse con los layouts flotantes
- **Animaciones**: Añade `animation="pulse"`, `animation="glow"` o `animation="scan"` para efectos visuales

Los paneles flotantes son totalmente responsivos y se adaptan automáticamente a dispositivos móviles.

## Características

- **V2.6.1: Paneles Flotantes + Animaciones** - La última versión incluye un avanzado sistema de paneles flotantes y animaciones mejoradas
- **V2.6: Procesamiento Robusto de Markdown** - Corrección de errores y mejoras en el procesamiento de paneles
- Desarrollo rápido con Vite
- Tipado estático con TypeScript
- Estilos CSS modernos y personalizables
- Diseño responsivo

## Arquitectura V2.6

La versión V2.6 proporciona una experiencia visual mejorada mediante:

1. **Pre-procesamiento de Paneles**: Los paneles son extraídos y procesados antes de pasarlos al procesador de markdown.
2. **Sistema de Estilos Modernos**: Nuevos estilos para paneles con mayor impacto visual y opciones de personalización.
3. **Soporte para Animaciones**: Animaciones CSS para elementos interactivos.
4. **Diseño Responsivo**: Adaptación a diferentes tamaños de pantalla.

### Componentes Principales

- **markdownProcessor.ts**: Procesador de markdown simplificado que se enfoca en renderizar el contenido estándar.
- **previewManager.ts**: Pre-procesa los paneles, aplica CSS y gestiona la visualización del contenido en el iframe.
- **templateManager.ts**: Gestiona la carga y aplicación de plantillas CSS.

### Cómo Funciona

1. El usuario selecciona una plantilla o carga un archivo CSS personalizado
2. `previewManager` pre-procesa el markdown para extraer y convertir los paneles a HTML
3. `markdownProcessor` procesa el resto del markdown estándar
4. El HTML final se renderiza en el iframe con todas las mejoras visuales aplicadas

## Plantillas Disponibles

- **Default**: Tema base simple
- **Purple Neon Grid**: Tema cyberpunk con efectos neón
- **Michael Noir**: Tema noir con estilo retro
- **Aegis Tactical V2.6**: Interfaz táctica futurista con paneles mejorados
- **Aetherium Codex**: Tema místico con elementos arcanos
- **RPG Fantasy**: Tema para juegos de rol con estilo pergamino
- **Infinity Command**: Interfaz de comando futurista

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