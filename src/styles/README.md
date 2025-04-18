# Sistema de Estilos CSS - Universal Scribe V2.6

## Estructura de Archivos

La organización de los estilos CSS sigue una arquitectura modular basada en componentes, con separación clara de responsabilidades:

```
src/styles/
  ├── base/                   # Estilos fundamentales y variables
  │   ├── variables.css       # Variables CSS globales
  │   ├── reset.css           # Normalización de estilos entre navegadores
  │   ├── typography.css      # Estilos tipográficos
  │   └── animations.css      # Animaciones reutilizables
  │
  ├── components/             # Estilos específicos de componentes
  │   ├── Editor.css          # Estilos del editor de markdown
  │   ├── Preview.css         # Estilos de la vista previa
  │   ├── ResizablePanels.css # Estilos de los paneles redimensionables
  │   ├── MarkdownToolbar.css # Estilos de la barra de herramientas
  │   ├── buttons.css         # Estilos de botones
  │   ├── panels.css          # Estilos de paneles genéricos
  │   └── toolbar.css         # Estilos de la barra de herramientas principal
  │
  ├── layout/                 # Estilos de layout y estructura
  │   └── Layout.css          # Estructura principal de la aplicación
  │
  ├── utilities/              # Clases utilitarias
  │   ├── spacing.css         # Márgenes, padding y espaciado
  │   ├── colors.css          # Colores de texto, fondo, bordes
  │   └── general.css         # Utilidades generales (flexbox, posicionamiento)
  │
  ├── themes/                 # Temas de la aplicación
  │   ├── light.css           # Tema claro
  │   └── dark.css            # Tema oscuro
  │
  ├── index.css               # Archivo principal que importa todos los estilos
  └── floating-blocks.css     # Estilos específicos para paneles flotantes
```

## Sistema de Variables CSS

El sistema utiliza variables CSS para mantener consistencia en toda la aplicación:

### Variables de Tema
- `--theme-bg-primary`, `--theme-bg-secondary`, etc: Colores de fondo
- `--theme-text-primary`, `--theme-text-secondary`, etc: Colores de texto
- `--theme-border-color`, `--theme-border-light`, etc: Colores de bordes

### Variables de Componentes
- `--divider-color`, `--divider-hover-color`: Para los divisores entre paneles
- `--scrollbar-track`, `--scrollbar-thumb`: Para las barras de desplazamiento

### Variables de Espaciado
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`, etc: Valores de espaciado consistentes

## Cambio de Tema

El sistema soporta temas claro y oscuro mediante el atributo `data-theme` en el elemento `body`:

```js
// Cambiar a tema oscuro
document.body.setAttribute('data-theme', 'dark');

// Cambiar a tema claro
document.body.setAttribute('data-theme', 'light');
```

## Utilización de Clases Utilitarias

Para un desarrollo más rápido, se incluyen clases utilitarias:

```html
<!-- Flexbox -->
<div class="flex flex-col items-center justify-between">...</div>

<!-- Espaciado -->
<div class="p-3 m-2 gap-4">...</div>

<!-- Dimensiones -->
<div class="w-full h-full">...</div>

<!-- Colores -->
<div class="bg-primary text-secondary">...</div>
```

## Guía de Buenas Prácticas

1. **Priorizar variables CSS**: Usar variables en lugar de valores hardcodeados
2. **Mantener la organización**: Añadir nuevos estilos en el archivo correcto según su propósito
3. **Evitar !important**: Mantener especificidad razonable y evitar !important
4. **Componentes autocontenidos**: Cada componente debe tener sus estilos en su propio archivo
5. **Utilidades para casos específicos**: Usar clases utilitarias para pequeños ajustes, no para estilos principales

## Rendimiento y Optimización

- Los estilos están organizados para facilitar el tree-shaking y minificación
- Se utilizan propiedades como `will-change`, `transform: translateZ(0)` y `backface-visibility: hidden` para optimizar rendering
- `transition: none` se aplica temporalmente durante eventos de arrastre para evitar lag 