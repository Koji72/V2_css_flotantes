# Guía de Elementos Flotantes y Columnas en SagaWeaver

Esta guía explica cómo utilizar los elementos de diseño avanzado en tus documentos y aventuras.

## Elementos Flotantes

Los elementos flotantes permiten crear paneles que flotan a la izquierda o derecha del texto principal, permitiendo que el contenido fluya alrededor de ellos. También se pueden crear elementos centrados que ocupan todo el ancho disponible.

### Sintaxis Básica

```markdown
:::float[posición]{atributos}
Contenido del elemento flotante...
:::
```

- `posición`: puede ser `left`, `right` o `center`
- `atributos`: lista de opciones separadas por `|`

### Ejemplos

#### Elemento flotante a la izquierda

:::float[left]{title="Panel Tecnológico" | style=tech | width=35%}
Este panel flotante utiliza un estilo tecnológico con bordes de neón y efectos de fondo sutiles.

- Indicador de sistemas: Operativo
- Estado de la red: Online
- Firewall: Activo
:::

Los elementos flotantes permiten crear diseños más dinámicos donde el texto fluye alrededor del contenido. Esto es especialmente útil para presentar información complementaria sin interrumpir el flujo principal de lectura.

La capacidad de crear estos elementos con diferentes estilos y posiciones nos permite adaptar la interfaz a distintos contextos y necesidades narrativas. Por ejemplo, una interfaz futurista podría usar paneles tecnológicos, mientras que un tema más místico podría utilizar elementos con estilo de pergamino.

#### Elemento flotante a la derecha con animación

:::float[right]{title="Proyección Holográfica" | style=hologram | width=40% | animation=pulse}
Los paneles holográficos simulan una proyección tridimensional con un efecto de pulso sutil que da sensación de vida.

<div style="text-align: center; margin: 0.5rem 0;">
  <div style="display: inline-block; padding: 0.5rem; background-color: rgba(0, 0, 255, 0.3); border-radius: 0.25rem;">
    HOLOPROYECCIÓN ESTABLE
  </div>
</div>
:::

Otra ventaja importante es la capacidad de ajustar el ancho de estos elementos según las necesidades del diseño. Los elementos más estrechos pueden usarse para notas al margen, mientras que los más anchos pueden servir para destacar información importante.

La implementación responsiva garantiza que en dispositivos móviles, donde el espacio es limitado, los elementos se reorganicen para mantener la legibilidad del contenido sin sacrificar el diseño.

#### Elemento centrado

:::float[center]{title="Alerta de Sistema" | style=circuit | width=70% | animation=fade}
<div style="text-align: center;">
  <p style="font-weight: bold; color: #ff6b6b;">⚠️ ADVERTENCIA ⚠️</p>
  <p>Se ha detectado una intrusión en el sector 7-G.</p>
  <p>Nivel de amenaza: Alto</p>
</div>
:::

Los elementos centrados son perfectos para destacar información crítica que merece atención especial. A diferencia de los elementos flotantes laterales, estos rompen el flujo del texto para crear un punto focal.

### Atributos disponibles

| Atributo | Opciones | Descripción |
|----------|----------|-------------|
| `style` | `tech`, `hologram`, `neo`, `circuit`, `glass`, `default` | Estilo visual del elemento |
| `title` | Cualquier texto | Título mostrado en la cabecera |
| `width` | CSS válido (%, px, rem) | Ancho del elemento |
| `animation` | `pulse`, `rotate`, `fade`, `none` | Efecto animado |
| `class` | Nombres de clase CSS | Clases personalizadas adicionales |

## Columnas Divididas

Las columnas permiten organizar grandes cantidades de texto de manera más eficiente, dividiendo el contenido en múltiples columnas.

### Sintaxis Básica

```markdown
:::columns{atributos}
Contenido en columnas...

:::break:::

Contenido en la siguiente columna...
:::
```

### Ejemplo

:::columns{columns=2 | style=tech | gap=2.5rem}
### Ventajas del sistema de columnas

El sistema de columnas permite organizar grandes cantidades de texto de manera más eficiente, mejorando la legibilidad y aprovechando mejor el espacio disponible en pantalla.

Este formato es ideal para:
- Manuales de referencia
- Libros de reglas
- Catálogos de contenido
- Descripciones extensas

Además, las columnas pueden contener todo tipo de elementos como listas, tablas e imágenes, manteniendo un formato coherente.

:::break:::

### Configuración de columnas

El componente de columnas es altamente personalizable:

- **Número de columnas:** 2 o 3 columnas según el contenido
- **Espaciado:** Ajustable para diferentes densidades de información
- **Estilos temáticos:** Diversos temas visuales que se adaptan al contexto

En dispositivos móviles, las columnas se convierten automáticamente en una sola para mantener la legibilidad en pantallas pequeñas.

El componente también incluye un elemento `:::break:::` que permite forzar saltos de columna en puntos específicos, dando control completo sobre la distribución del contenido.
:::

### Atributos disponibles

| Atributo | Opciones | Descripción |
|----------|----------|-------------|
| `columns` | `2`, `3` | Número de columnas |
| `gap` | CSS válido (rem, em, px) | Espacio entre columnas |
| `style` | `parchment`, `modern`, `tech`, `default` | Estilo visual |
| `class` | Nombres de clase CSS | Clases personalizadas adicionales |

## Combinando Elementos

Para crear diseños realmente dinámicos, podemos combinar elementos flotantes con texto normal y otros componentes.

:::float[left]{title="Nota del Autor" | style=glass | width=30%}
*Este sistema de elementos flotantes fue diseñado para ofrecer flexibilidad sin sacrificar la coherencia visual.*
:::

El objetivo principal de estos componentes es proporcionar herramientas flexibles para crear documentos interactivos que sean tanto funcionales como estéticamente agradables.

Cada estilo está diseñado para ser coherente con el resto, pero al mismo tiempo ofrecer suficiente variedad para adaptarse a diferentes contextos narrativos y funcionales.

La implementación técnica prioriza la simplicidad y la reutilización, siguiendo las mejores prácticas de desarrollo.

:::float[right]{title="Próximas Mejoras" | style=neo | width=35%}
- Más opciones de animación
- Integración con temas personalizados
- Opciones avanzadas de posicionamiento
- Interactividad mejorada
:::

Con estos componentes, buscamos facilitar la creación de interfaces de usuario que no solo comuniquen información de manera efectiva, sino que también proporcionen una experiencia visualmente atractiva y coherente.

La flexibilidad del sistema permite adaptarse a diferentes contextos y necesidades, desde interfaces de usuario futuristas hasta documentos con estilo más tradicional. 