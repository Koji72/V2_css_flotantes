# SagaWeaver v1 - Sistema de Elementos Flotantes y Columnas

Este proyecto implementa componentes avanzados para la gestión de layouts en documentos markdown, permitiendo crear diseños más dinámicos y visualmente atractivos.

## Características Principales

### Elementos Flotantes
- Paneles que flotan a la izquierda o derecha del texto
- Elementos centrados para destacar información importante
- Múltiples estilos visuales predefinidos
- Efectos de animación opcional
- Completamente responsivos

### Columnas Divididas
- Organización del contenido en 2 o 3 columnas
- Control sobre el espaciado entre columnas
- Varios estilos visuales adaptados a diferentes contextos
- Compatibilidad con saltos de columna manuales
- Adaptación automática a dispositivos móviles

## Estructura del Proyecto

```
sagaweaver-v1/
├── src/
│   ├── components/
│   │   ├── FloatingElement.tsx    # Componente para elementos flotantes
│   │   ├── SplitColumns.tsx       # Componente para columnas
│   │   └── MarkdownRenderer.tsx   # Renderizador de markdown con soporte personalizado
│   ├── hooks/
│   │   └── useLayoutElements.ts   # Hook para gestionar los elementos de diseño
│   ├── utils/
│   │   └── markdownLayoutProcessor.ts  # Procesador de markdown para elementos personalizados
│   ├── styles/
│   │   └── floating-elements.css  # Estilos CSS para los elementos de diseño
│   └── pages/
│       └── floating-elements-demo.tsx  # Página de demostración
├── content/
│   └── documentation/
│       └── floating-elements-guide.md  # Guía de uso en markdown
└── public/
    └── assets/
        └── textures/              # Texturas para fondos de elementos
```

## Sintaxis Markdown

### Elementos Flotantes

```markdown
:::float[posición]{atributos}
Contenido del elemento flotante...
:::
```

- **posición**: `left`, `right` o `center`
- **atributos**: combinaciones de `title`, `style`, `width`, `animation` y `class`

### Columnas

```markdown
:::columns{atributos}
Contenido en columnas...

:::break:::

Contenido en la siguiente columna...
:::
```

- **atributos**: combinaciones de `columns`, `gap`, `style` y `class`

## Instalación y Uso

1. Clona el repositorio
2. Instala las dependencias con `npm install`
3. Ejecuta en desarrollo con `npm run dev`
4. Visita `http://localhost:3000/floating-elements-demo` para ver la demostración

## Estilos Disponibles

### Elementos Flotantes
- `tech`: Estilo tecnológico con bordes de neón
- `hologram`: Efecto holográfico con fondo semitransparente
- `neo`: Estilo neón con efectos de resplandor
- `circuit`: Patrón de circuito con puntos de conexión
- `glass`: Efecto de vidrio con desenfoque
- `default`: Estilo básico neutral

### Columnas
- `parchment`: Estilo de pergamino para contenido tipo RPG
- `modern`: Diseño limpio y moderno
- `tech`: Estilo tecnológico con líneas de cuadrícula
- `default`: Estilo básico para uso general

## Consideraciones de Diseño

- Los elementos flotantes funcionan mejor con anchos del 25-40%
- Para textos largos, las columnas mejoran significativamente la legibilidad
- En elementos centrados, usa animaciones para destacar información crítica
- Combina diferentes estilos para crear jerarquías visuales

## Dependencias Principales

- Next.js para el framework de aplicación
- React para los componentes
- Marked para el procesamiento de markdown
- TailwindCSS para estilos utilitarios

## Licencia

MIT 