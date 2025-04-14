import React, { useEffect } from 'react';
import FloatingElement from '../components/FloatingElement';
import SplitColumns, { ColumnBreak } from '../components/SplitColumns';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { icons } from 'lucide-react'; // Importamos iconos para la lista
import { CacheMetrics } from '../components/CacheMetrics';
import { PanelValidationWarnings } from '../components/PanelValidationWarnings';
import { PanelDocumentation } from '../components/PanelDocumentation';
import NavigationBar from '../components/NavigationBar';
import Head from 'next/head';

// Lista de nombres de iconos disponibles
const iconNames = Object.keys(icons) as (keyof typeof icons)[];

// Contenido de ejemplo para la demo con nuevos estilos v2.6
const markdownContent = `
# Demostración Completa de Elementos v1.3

Incluye estilos flotantes, columnas, paneles v2.6, nuevas animaciones.
*Nota: Los iconos solo se muestran si se usa el componente FloatingElement directamente en JSX.*

## Estilos Flotantes y Paneles v2.6

:::float[left]{style=tech width=30% title="Tecnológico" animation=glow}
Básico tech con animación *glow*.
:::

:::float[right]{style=fantasy width=30% title="Fantasía" animation=shake}
Estilo fantasía con animación *shake*.
:::

<div style="clear: both;"></div>

:::float[left]{style=tech-corners width=45% title="Esquinas Tecnológicas"}
Panel con esquinas SVG.
:::

:::float[right]{style=cut-corners width=45% title="Esquinas Cortadas"}
Panel con clip-path.
:::

<div style="clear: both;"></div>

:::float[left]{style=corner-brackets width=45% title="Soportes en Esquina"}
Panel con soportes visuales.
:::

:::float[right]{style=glass width=45% title="Panel de Cristal"}
Efecto translúcido.
:::

<div style="clear: both;"></div> 

## Catálogo Completo de Estilos

### Estilos Básicos

:::float[left]{style=default width=30% title="Default"}
Estilo por defecto simple.
:::

:::float[right]{style=tech width=30% title="Tech"}
Estilo tecnológico con bordes de gradiente.
:::

<div style="clear: both;"></div>

:::float[left]{style=hologram width=30% title="Hologram"}
Estilo holográfico translúcido.
:::

:::float[right]{style=neo width=30% title="Neo"}
Estilo neón cyberpunk.
:::

<div style="clear: both;"></div>

:::float[left]{style=circuit width=30% title="Circuit"}
Estilo de circuito con patrón.
:::

:::float[right]{style=metal width=30% title="Metal"}
Estilo metálico con efecto plateado.
:::

<div style="clear: both;"></div>

:::float[left]{style=scroll width=30% title="Scroll"}
Estilo pergamino clásico.
:::

<div style="clear: both;"></div>

### Animaciones Disponibles

:::float[left]{style=tech width=22% title="Pulse" animation=pulse}
Animación de pulso.
:::

:::float[center]{style=tech width=22% title="Rotate" animation=rotate}
Animación de rotación.
:::

:::float[right]{style=tech width=22% title="Fade" animation=fade}
Animación de fundido.
:::

<div style="clear: both;"></div>

:::float[left]{style=tech width=22% title="Glow" animation=glow}
Animación de brillo pulsante.
:::

:::float[right]{style=tech width=22% title="Shake" animation=shake}
Animación de temblor.
:::

<div style="clear: both;"></div>

## Columnas Divididas

### Estilo Tecnológico (2 Columnas)

:::columns{style=tech columns=2 gap=2rem}
#### Columna A
Contenido tech A...

:::break:::

#### Columna B
Contenido tech B...
:::

### Estilo Fantasía (3 Columnas)

:::columns{style=fantasy columns=3 gap=1.5rem}
#### Sección 1
Texto fantasía 1.

:::break:::

#### Sección 2
Texto fantasía 2.

:::break:::

#### Sección 3
Texto fantasía 3.
:::

### Otros Estilos de Columnas

:::columns{style=parchment columns=2 gap=2rem}
#### Estilo Pergamino
Contenido con aspecto antiguo.

:::break:::

#### Segunda Columna
Más texto antiguo.
:::

:::columns{style=modern columns=2 gap=2rem}
#### Estilo Moderno
Diseño limpio y minimalista.

:::break:::

#### Diseño Actual
Ideal para texto formal.
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
      'Orbitron:wght@400;700', 
      'Rajdhani:wght@400;600',
      'Syncopate:wght@400;700' 
    ];
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamilies.join('&family=')}&display=swap`;

    const link = document.createElement('link');
    link.href = fontUrl;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    console.log('[FloatingElementsDemo] Added Google Fonts link.');

    return () => {
      document.head.removeChild(link);
      console.log('[FloatingElementsDemo] Removed Google Fonts link.');
    };
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Head>
        <title>Elementos Flotantes - SagaWeaver</title>
        <meta name="description" content="Demostración de elementos flotantes y columnas para SagaWeaver" />
      </Head>

      <NavigationBar />
      
      <div className="container mx-auto p-6 bg-gray-100 text-gray-800 min-h-screen font-sans">
        <CacheMetrics />
        <div className="content">
          {/* Documentación */}
          <PanelDocumentation />
          
          {/* Renderizamos el markdown principal */}
          <MarkdownRenderer 
            markdown={markdownContent} 
            className="prose max-w-none"
            onPanelRender={(html) => <PanelValidationWarnings html={html} />}
          />
          
          {/* Sección adicional para demostrar iconos directamente con el componente */}
          <h2 className="text-2xl font-semibold mt-10 mb-4">Demostración de Iconos (JSX)</h2>
          <div className="prose max-w-none">
             <FloatingElement 
                position="left" 
                style="metal" 
                title="Panel con Icono" 
                width="45%" 
                icon="ShieldCheck" // Nombre del icono Lucide
             >
                <p>Este panel usa la prop <code>icon</code> para mostrar un icono <code className="text-xs">ShieldCheck</code> de Lucide React en la cabecera.</p>
             </FloatingElement>
             
             <p>Texto que fluye alrededor del panel con icono. Los iconos añaden un elemento visual extra a los paneles.</p>
             
             <FloatingElement 
                position="right" 
                style="default" 
                title="Otro Icono" 
                width="45%" 
                icon="Settings" 
                iconProps={{ size: 20, className: 'text-blue-500' }} // Props personalizadas
             >
                <p>Aquí usamos el icono <code className="text-xs">Settings</code> y personalizamos su tamaño y color usando <code>iconProps</code>.</p>
             </FloatingElement>
             
             <p>El soporte de iconos directamente en el componente permite más flexibilidad cuando se construye la UI con React en lugar de solo con Markdown.</p>
             
             <div style={{ clear: 'both' }}></div>
             
             {/* Ejemplo de icono sin título */}
             <FloatingElement 
                position="left" 
                style="glass" 
                width="20%" 
                icon="Info"
             >
                <p className="text-xs">Panel solo con icono.</p>
             </FloatingElement>
             <p>Un panel pequeño que solo muestra un icono en la cabecera, útil para notas rápidas o indicadores visuales.</p>
             
             <div style={{ clear: 'both' }}></div>
             
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingElementsDemo;