import React, { useEffect } from 'react';
import FloatingElement from '../components/FloatingElement';
import SplitColumns, { ColumnBreak } from '../components/SplitColumns';
import MarkdownRenderer from '../components/MarkdownRenderer'; // Usamos nuestro renderer

// Contenido de ejemplo para la demo con nuevos estilos v2.6
const markdownContent = `
# Demostración Completa de Elementos v1.2

Incluye los estilos flotantes, columnas y los paneles especiales de v2.6.

## Estilos Flotantes Base y v1.1

:::float[left]{style=tech width=30% title="Tecnológico"}
Básico tech.
:::

:::float[right]{style=fantasy width=30% title="Fantasía"}
Estilo fantasía.
:::

Texto intermedio para separar.

<div style="clear: both;"></div>

:::float[left]{style=scroll width=30% title="Pergamino"}
Estilo pergamino.
:::

:::float[right]{style=metal width=30% title="Metálico"}
Estilo metálico.
:::

<div style="clear: both;"></div>

## Nuevos Paneles v2.6

:::float[left]{style=tech-corners width=45% title="Esquinas Tecnológicas"}
Este panel utiliza SVGs para crear esquinas con estilo tecnológico. 
- Punto 1
- Punto 2
:::

:::float[right]{style=cut-corners width=45% title="Esquinas Cortadas"}
Este panel usa \`clip-path\` para cortar las esquinas.
- Detalle A
- Detalle B
:::

<div style="clear: both;"></div>

:::float[left]{style=corner-brackets width=45% title="Soportes en Esquina"}
Este panel añade soportes visuales en las esquinas superior izquierda e inferior derecha.
- Nota X
- Nota Y
:::

:::float[right]{style=glass width=45% title="Panel de Cristal"}
Efecto translúcido con desenfoque.
- Transparencia
- Reflejos
:::

<div style="clear: both;"></div>

## Columnas Divididas

### Estilo Tecnológico (2 Columnas)

:::columns{style=tech columns=2 gap=2rem}
#### Columna A
Contenido de la primera columna tech...

:::break:::

#### Columna B
Contenido de la segunda columna tech...
:::

### Estilo Fantasía (3 Columnas)

:::columns{style=fantasy columns=3 gap=1.5rem}
#### Sección 1
Texto fantasía col 1.

:::break:::

#### Sección 2
Texto fantasía col 2.

:::break:::

#### Sección 3
Texto fantasía col 3.
:::
`;

const FloatingElementsDemo = () => {
  // Efecto para cargar fuentes de Google Fonts necesarias
  useEffect(() => {
    const fontFamilies = [
      'Merriweather:ital,wght@0,400;0,700;1,400',
      'Noto+Serif:wght@400;700',
      'Libre+Baskerville',
      'Space+Mono',
      'Orbitron:wght@400;700', // Para tech-corners
      'Rajdhani:wght@400;600', // Para cut-corners
      'Syncopate:wght@400;700' // Para otros estilos tech
    ];
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamilies.join('&family=')}&display=swap`;

    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    console.log('[FloatingElementsDemo] Added Google Fonts link.');

    // Limpieza al desmontar
    return () => {
      document.head.removeChild(link);
      console.log('[FloatingElementsDemo] Removed Google Fonts link.');
    };
  }, []);

  return (
    <div className="container mx-auto p-6 bg-gray-100 text-gray-800 min-h-screen font-sans">
      {/* Usamos nuestro MarkdownRenderer para procesar el contenido */}
      <MarkdownRenderer markdown={markdownContent} className="prose max-w-none" />
    </div>
  );
};

export default FloatingElementsDemo;