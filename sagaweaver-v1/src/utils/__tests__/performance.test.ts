import { processLayoutElements } from '../processLayoutElements';
import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  const simplePanel = `
:::float[left]{style=tech width=30%}
Contenido simple
:::
`;

  const complexPanel = `
:::float[right]{style=fantasy width=45% title="Panel Complejo" animation=glow}
# Título
Contenido con **formato** y [enlaces](https://example.com)

- Lista
- De
- Elementos

> Cita importante
:::
`;

  const largeDocument = Array(100).fill(simplePanel).join('\n\n');

  test('Cache hit performance', () => {
    const startTime = performance.now();
    
    // Procesar el mismo panel 1000 veces
    for (let i = 0; i < 1000; i++) {
      processLayoutElements(simplePanel);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 1000;
    
    console.log(`Cache hit performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Panels processed: 1000`);
    
    expect(averageTime).toBeLessThan(1); // Cada panel debería procesarse en menos de 1ms
  });

  test('Complex panel processing', () => {
    const startTime = performance.now();
    
    // Procesar panel complejo 100 veces
    for (let i = 0; i < 100; i++) {
      processLayoutElements(complexPanel);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Complex panel performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Panels processed: 100`);
    
    expect(averageTime).toBeLessThan(5); // Paneles complejos deberían procesarse en menos de 5ms
  });

  test('Large document processing', () => {
    const startTime = performance.now();
    
    // Procesar documento grande 10 veces
    for (let i = 0; i < 10; i++) {
      processLayoutElements(largeDocument);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 10;
    
    console.log(`Large document performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per document: ${averageTime.toFixed(2)}ms
    - Documents processed: 10
    - Panels per document: 100`);
    
    expect(averageTime).toBeLessThan(100); // Documentos grandes deberían procesarse en menos de 100ms
  });

  test('Memory usage', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Procesar 1000 paneles diferentes
    for (let i = 0; i < 1000; i++) {
      processLayoutElements(`:::float[left]{style=tech width=${i}%}\nPanel ${i}\n:::`);
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    console.log(`Memory usage:
    - Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)}MB
    - Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)}MB
    - Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB
    - Panels processed: 1000`);
    
    expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // El uso de memoria no debería aumentar más de 50MB
  });

  test('Concurrent cache access', async () => {
    const startTime = performance.now();
    const promises = [];
    
    // Procesar el mismo panel 100 veces en paralelo
    for (let i = 0; i < 100; i++) {
      promises.push(processLayoutElements(simplePanel));
    }
    
    await Promise.all(promises);
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Concurrent cache access:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Concurrent operations: 100`);
    
    expect(averageTime).toBeLessThan(2); // Cada operación concurrente debería completarse en menos de 2ms
  });

  test('Cache invalidation performance', () => {
    const startTime = performance.now();
    const results = new Set();
    
    // Procesar 1000 paneles ligeramente diferentes
    for (let i = 0; i < 1000; i++) {
      const panel = `:::float[left]{style=tech width=${i}%}\nPanel ${i}\n:::`;
      const result = processLayoutElements(panel);
      results.add(result);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 1000;
    
    console.log(`Cache invalidation performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Unique results: ${results.size}
    - Cache hit ratio: ${((1000 - results.size) / 1000 * 100).toFixed(2)}%`);
    
    expect(averageTime).toBeLessThan(2); // Cada panel único debería procesarse en menos de 2ms
  });

  test('Memory cleanup after cache invalidation', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    
    // Procesar 1000 paneles diferentes
    for (let i = 0; i < 1000; i++) {
      processLayoutElements(`:::float[left]{style=tech width=${i}%}\nPanel ${i}\n:::`);
    }
    
    // Forzar recolección de basura
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    console.log(`Memory cleanup:
    - Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)}MB
    - Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)}MB
    - Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB
    - Panels processed: 1000`);
    
    expect(memoryIncrease).toBeLessThan(20 * 1024 * 1024); // El uso de memoria debería ser menor después de la limpieza
  });

  test('Mixed workload performance', () => {
    const startTime = performance.now();
    const panels = [
      simplePanel,
      complexPanel,
      ...Array(98).fill(simplePanel) // 98 paneles simples
    ];
    
    // Procesar mezcla de paneles
    for (const panel of panels) {
      processLayoutElements(panel);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / panels.length;
    
    console.log(`Mixed workload performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Total panels: ${panels.length}
    - Simple panels: 99
    - Complex panels: 1`);
    
    expect(averageTime).toBeLessThan(3); // El tiempo promedio debería ser menor a 3ms
  });

  test('Deeply nested panels performance', () => {
    const startTime = performance.now();
    const nestedPanel = `
:::float[left]{style=tech width=30%}
Contenido exterior
:::float[right]{style=fantasy width=60%}
Contenido interior
:::float[center]{style=alert width=40%}
Contenido más interno
:::
:::
:::
`;
    
    // Procesar panel anidado 100 veces
    for (let i = 0; i < 100; i++) {
      processLayoutElements(nestedPanel);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Deeply nested panels performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Nesting levels: 3
    - Panels processed: 100`);
    
    expect(averageTime).toBeLessThan(10); // Paneles anidados deberían procesarse en menos de 10ms
  });

  test('Memory usage with nested panels', () => {
    const initialMemory = process.memoryUsage().heapUsed;
    const nestedPanels = [];
    
    // Crear 100 paneles anidados diferentes
    for (let i = 0; i < 100; i++) {
      nestedPanels.push(`
:::float[left]{style=tech width=${i}%}
Contenido exterior ${i}
:::float[right]{style=fantasy width=${100 - i}%}
Contenido interior ${i}
:::
:::
`);
    }
    
    // Procesar todos los paneles
    for (const panel of nestedPanels) {
      processLayoutElements(panel);
    }
    
    const finalMemory = process.memoryUsage().heapUsed;
    const memoryIncrease = finalMemory - initialMemory;
    
    console.log(`Memory usage with nested panels:
    - Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)}MB
    - Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)}MB
    - Memory increase: ${(memoryIncrease / 1024 / 1024).toFixed(2)}MB
    - Nested panels processed: 100`);
    
    expect(memoryIncrease).toBeLessThan(30 * 1024 * 1024); // El uso de memoria debería ser menor a 30MB
  });

  test('Cache performance with mixed nesting levels', () => {
    const startTime = performance.now();
    const results = new Set();
    
    // Crear y procesar paneles con diferentes niveles de anidamiento
    for (let i = 0; i < 100; i++) {
      const nestingLevel = (i % 3) + 1; // 1, 2 o 3 niveles
      let panel = '';
      
      for (let j = 0; j < nestingLevel; j++) {
        panel += `:::float[${j % 2 === 0 ? 'left' : 'right'}]{style=tech width=${(j + 1) * 20}%}\n`;
        panel += `Nivel ${j + 1}\n`;
      }
      
      panel += ':::'.repeat(nestingLevel);
      const result = processLayoutElements(panel);
      results.add(result);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Cache performance with mixed nesting:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Unique results: ${results.size}
    - Cache hit ratio: ${((100 - results.size) / 100 * 100).toFixed(2)}%`);
    
    expect(averageTime).toBeLessThan(5); // Cada panel debería procesarse en menos de 5ms
  });

  test('Stress test with large nested documents', () => {
    const startTime = performance.now();
    const largeNestedDocument = Array(10).fill(`
:::float[left]{style=tech width=30%}
Contenido principal
${Array(5).fill(`
:::float[right]{style=fantasy width=60%}
Contenido secundario
${Array(3).fill(`
:::float[center]{style=alert width=40%}
Contenido terciario
:::
`).join('\n')}
:::
`).join('\n')}
:::
`).join('\n\n');
    
    // Procesar documento grande 5 veces
    for (let i = 0; i < 5; i++) {
      processLayoutElements(largeNestedDocument);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 5;
    
    console.log(`Stress test with large nested documents:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per document: ${averageTime.toFixed(2)}ms
    - Documents processed: 5
    - Total panels per document: 150
    - Maximum nesting level: 3`);
    
    expect(averageTime).toBeLessThan(200); // Cada documento debería procesarse en menos de 200ms
  });

  test('Style switching performance', () => {
    const startTime = performance.now();
    const styles = ['tech', 'fantasy', 'alert', 'hologram', 'neo-frame'];
    const results = new Set();
    
    // Procesar 100 paneles con diferentes estilos
    for (let i = 0; i < 100; i++) {
      const style = styles[i % styles.length];
      const panel = `:::float[left]{style=${style} width=30%}\nPanel con estilo ${style}\n:::`;
      const result = processLayoutElements(panel);
      results.add(result);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Style switching performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Unique styles: ${styles.length}
    - Cache hit ratio: ${((100 - results.size) / 100 * 100).toFixed(2)}%`);
    
    expect(averageTime).toBeLessThan(3); // Cada cambio de estilo debería procesarse en menos de 3ms
  });

  test('Animation performance', () => {
    const startTime = performance.now();
    const animations = ['glow', 'shake', 'pulse', 'fade', 'slide'];
    const results = new Set();
    
    // Procesar 100 paneles con diferentes animaciones
    for (let i = 0; i < 100; i++) {
      const animation = animations[i % animations.length];
      const panel = `:::float[left]{style=tech animation=${animation} width=30%}\nPanel con animación ${animation}\n:::`;
      const result = processLayoutElements(panel);
      results.add(result);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Animation performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Unique animations: ${animations.length}
    - Cache hit ratio: ${((100 - results.size) / 100 * 100).toFixed(2)}%`);
    
    expect(averageTime).toBeLessThan(3); // Cada animación debería procesarse en menos de 3ms
  });

  test('Combined style and animation performance', () => {
    const startTime = performance.now();
    const styles = ['tech', 'fantasy', 'alert'];
    const animations = ['glow', 'shake', 'pulse'];
    const results = new Set();
    
    // Procesar 100 paneles con diferentes combinaciones de estilos y animaciones
    for (let i = 0; i < 100; i++) {
      const style = styles[i % styles.length];
      const animation = animations[Math.floor(i / styles.length) % animations.length];
      const panel = `:::float[left]{style=${style} animation=${animation} width=30%}\nPanel con estilo ${style} y animación ${animation}\n:::`;
      const result = processLayoutElements(panel);
      results.add(result);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Combined style and animation performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Unique combinations: ${styles.length * animations.length}
    - Cache hit ratio: ${((100 - results.size) / 100 * 100).toFixed(2)}%`);
    
    expect(averageTime).toBeLessThan(4); // Cada combinación debería procesarse en menos de 4ms
  });

  test('Real-world scenario performance', () => {
    const startTime = performance.now();
    const document = `
# Documento de ejemplo

Contenido introductorio.

:::float[left]{style=tech width=30%}
Panel informativo
:::

Más contenido.

:::float[right]{style=fantasy animation=glow width=40%}
Panel destacado
:::

Contenido adicional.

:::float[center]{style=alert width=50%}
Panel importante
:::

Conclusión.
`;
    
    // Procesar documento realista 50 veces
    for (let i = 0; i < 50; i++) {
      processLayoutElements(document);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 50;
    
    console.log(`Real-world scenario performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per document: ${averageTime.toFixed(2)}ms
    - Documents processed: 50
    - Panels per document: 3
    - Total panels processed: 150`);
    
    expect(averageTime).toBeLessThan(10); // Cada documento debería procesarse en menos de 10ms
  });

  test('Edge case: Maximum nesting depth', () => {
    const startTime = performance.now();
    const maxDepth = 10;
    let panel = '';
    
    // Crear panel con máxima profundidad de anidamiento
    for (let i = 0; i < maxDepth; i++) {
      panel += `:::float[${i % 2 === 0 ? 'left' : 'right'}]{style=tech width=${(i + 1) * 10}%}\n`;
      panel += `Nivel ${i + 1}\n`;
    }
    
    panel += ':::'.repeat(maxDepth);
    
    // Procesar panel profundamente anidado 10 veces
    for (let i = 0; i < 10; i++) {
      processLayoutElements(panel);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 10;
    
    console.log(`Maximum nesting depth performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Nesting depth: ${maxDepth}
    - Panels processed: 10`);
    
    expect(averageTime).toBeLessThan(20); // Paneles profundamente anidados deberían procesarse en menos de 20ms
  });

  test('Edge case: Large content blocks', () => {
    const startTime = performance.now();
    const largeContent = Array(1000).fill('Línea de contenido repetida ').join('\n');
    const panel = `:::float[left]{style=tech width=30%}\n${largeContent}\n:::`;
    
    // Procesar panel con contenido grande 5 veces
    for (let i = 0; i < 5; i++) {
      processLayoutElements(panel);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 5;
    
    console.log(`Large content blocks performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(2)}ms
    - Content lines: 1000
    - Panels processed: 5`);
    
    expect(averageTime).toBeLessThan(50); // Paneles con contenido grande deberían procesarse en menos de 50ms
  });

  test('Edge case: Multiple attributes', () => {
    const startTime = performance.now();
    const attributes = [
      'style=tech',
      'width=30%',
      'animation=glow',
      'title="Panel de prueba"',
      'data-id="123"',
      'class="custom-class"',
      'data-theme="dark"',
      'data-version="2.0"'
    ];
    const results = new Set();
    
    // Procesar paneles con diferentes combinaciones de atributos
    for (let i = 0; i < 100; i++) {
      const selectedAttributes = attributes.slice(0, (i % attributes.length) + 1);
      const panel = `:::float[left]{${selectedAttributes.join(' ')}}\nPanel con ${selectedAttributes.length} atributos\n:::`;
      const result = processLayoutElements(panel);
      results.add(result);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 100;
    
    console.log(`Multiple attributes performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per panel: ${averageTime.toFixed(4)}ms
    - Maximum attributes: ${attributes.length}
    - Unique results: ${results.size}
    - Cache hit ratio: ${((100 - results.size) / 100 * 100).toFixed(2)}%`);
    
    expect(averageTime).toBeLessThan(3); // Paneles con múltiples atributos deberían procesarse en menos de 3ms
  });

  test('Real-world scenario: Mixed content types', () => {
    const startTime = performance.now();
    const document = `
# Documento de ejemplo

Contenido introductorio con **formato** y [enlaces](https://example.com).

:::float[left]{style=tech width=30%}
## Panel informativo
- Lista de elementos
- Con formato
- Y enlaces

> Cita importante
:::

Más contenido con \`código\` y **formato**.

:::float[right]{style=fantasy animation=glow width=40%}
### Panel destacado
1. Lista numerada
2. Con diferentes niveles
   - Sublista
   - Con más elementos

\`\`\`javascript
// Código de ejemplo
function ejemplo() {
  return "Hola mundo";
}
\`\`\`
:::

Contenido final con **formato** y [enlaces](https://example.com).
`;
    
    // Procesar documento con contenido mixto 20 veces
    for (let i = 0; i < 20; i++) {
      processLayoutElements(document);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 20;
    
    console.log(`Mixed content types performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per document: ${averageTime.toFixed(2)}ms
    - Documents processed: 20
    - Content types: markdown, lists, code, quotes
    - Panels per document: 2`);
    
    expect(averageTime).toBeLessThan(15); // Documentos con contenido mixto deberían procesarse en menos de 15ms
  });

  test('Navigation pattern simulation', () => {
    const startTime = performance.now();
    const pages = [
      // Página 1
      `
# Página de inicio
Bienvenido a nuestra documentación.

:::float[left]{style=tech width=30%}
## Introducción
Esta documentación explica el uso de paneles flotantes.
:::

Continúe navegando para más información.
`,
      // Página 2
      `
# Estilos disponibles
Estos son los estilos que puede utilizar.

:::float[right]{style=fantasy width=45%}
## Estilo Fantasy
Ideal para temas de ficción y fantasía.
:::

:::float[left]{style=tech width=35%}
## Estilo Tech
Perfecto para documentación técnica.
:::
`,
      // Página 3
      `
# Animaciones
Puede añadir animaciones a los paneles.

:::float[center]{style=tech width=50% animation=glow}
## Animación Glow
Esta animación añade un resplandor.
:::

:::float[right]{style=fantasy width=40% animation=shake}
## Animación Shake
Esta animación hace que el panel vibre.
:::
`,
      // Página 4 (volver a la página 1 para simular una navegación cíclica)
      `
# Página de inicio
Bienvenido a nuestra documentación.

:::float[left]{style=tech width=30%}
## Introducción
Esta documentación explica el uso de paneles flotantes.
:::

Continúe navegando para más información.
`
    ];
    
    // Simular navegación entre páginas 50 veces
    for (let i = 0; i < 50; i++) {
      const pageIndex = i % pages.length;
      processLayoutElements(pages[pageIndex]);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 50;
    
    console.log(`Navigation pattern simulation:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per page: ${averageTime.toFixed(2)}ms
    - Pages in rotation: ${pages.length}
    - Navigation events: 50
    - Cache benefits visible: ${averageTime < 3 ? 'Yes' : 'No'}`);
    
    expect(averageTime).toBeLessThan(3); // Cada navegación debería beneficiarse del caché y ser menor a 3ms
  });

  test('Content update simulation', () => {
    const startTime = performance.now();
    const baseDocument = `
# Documento editable

:::float[left]{style=tech width=30%}
## Contenido inicial
Este contenido se irá actualizando.
:::

Contenido principal.
`;
    
    // Simular 50 ediciones del documento
    for (let i = 0; i < 50; i++) {
      const updatedDocument = `
# Documento editable

:::float[left]{style=tech width=30%}
## Contenido actualizado ${i + 1}
Este contenido ha sido actualizado ${i + 1} veces.
${i % 5 === 0 ? '> Nota importante añadida' : ''}
:::

Contenido principal con edición ${i + 1}.
${i % 10 === 0 ? '\nNueva sección añadida.' : ''}
`;
      
      processLayoutElements(updatedDocument);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / 50;
    
    console.log(`Content update simulation:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per update: ${averageTime.toFixed(2)}ms
    - Updates processed: 50`);
    
    expect(averageTime).toBeLessThan(5); // Cada actualización debería procesarse en menos de 5ms
  });

  test('Adaptive cache performance', () => {
    const startTime = performance.now();
    const panelVariants = [];
    
    // Crear 25 variantes similares pero con pequeños cambios
    for (let i = 0; i < 25; i++) {
      const basePanel = `:::float[left]{style=tech width=30%}\nContenido base\n:::`;
      const minorVariation = `:::float[left]{style=tech width=${30 + (i % 5)}%}\nContenido base\n:::`;
      const mediumVariation = `:::float[left]{style=tech width=30%}\nContenido base ${i % 10}\n:::`;
      const majorVariation = `:::float[${i % 2 === 0 ? 'left' : 'right'}]{style=${i % 3 === 0 ? 'tech' : 'fantasy'} width=30%}\nContenido base\n:::`;
      
      panelVariants.push(basePanel, minorVariation, mediumVariation, majorVariation);
    }
    
    // Procesar todas las variantes en orden aleatorio para simular un patrón de uso real
    const shuffledVariants = [...panelVariants].sort(() => Math.random() - 0.5);
    
    for (const variant of shuffledVariants) {
      processLayoutElements(variant);
    }
    
    const endTime = performance.now();
    const totalTime = endTime - startTime;
    const averageTime = totalTime / shuffledVariants.length;
    
    console.log(`Adaptive cache performance:
    - Total time: ${totalTime.toFixed(2)}ms
    - Average time per variant: ${averageTime.toFixed(4)}ms
    - Total variants: ${shuffledVariants.length}
    - Unique base variants: 4`);
    
    expect(averageTime).toBeLessThan(2); // Cada variante debería procesarse en menos de 2ms debido al caché adaptativo
  });

  test('Session simulation with cache warmup', () => {
    // Fase 1: Caché frío
    const coldStartTime = performance.now();
    
    // Simular primera visita a 5 páginas diferentes
    const pages = [
      `# Página 1\n\n:::float[left]{style=tech width=30%}\nPanel 1\n:::\n\nContenido 1.`,
      `# Página 2\n\n:::float[right]{style=fantasy width=40%}\nPanel 2\n:::\n\nContenido 2.`,
      `# Página 3\n\n:::float[center]{style=alert width=50%}\nPanel 3\n:::\n\nContenido 3.`,
      `# Página 4\n\n:::float[left]{style=neo-frame width=35%}\nPanel 4\n:::\n\nContenido 4.`,
      `# Página 5\n\n:::float[right]{style=hologram width=45%}\nPanel 5\n:::\n\nContenido 5.`
    ];
    
    for (const page of pages) {
      processLayoutElements(page);
    }
    
    const coldEndTime = performance.now();
    const coldTotalTime = coldEndTime - coldStartTime;
    const coldAverageTime = coldTotalTime / pages.length;
    
    // Fase 2: Caché caliente (segunda visita)
    const warmStartTime = performance.now();
    
    // Simular segunda visita a las mismas páginas
    for (const page of pages) {
      processLayoutElements(page);
    }
    
    const warmEndTime = performance.now();
    const warmTotalTime = warmEndTime - warmStartTime;
    const warmAverageTime = warmTotalTime / pages.length;
    
    // Fase 3: Navegación mezclada con caché caliente
    const mixedStartTime = performance.now();
    
    // Simular navegación aleatoria entre las páginas
    for (let i = 0; i < 20; i++) {
      const randomIndex = Math.floor(Math.random() * pages.length);
      processLayoutElements(pages[randomIndex]);
    }
    
    const mixedEndTime = performance.now();
    const mixedTotalTime = mixedEndTime - mixedStartTime;
    const mixedAverageTime = mixedTotalTime / 20;
    
    console.log(`Session simulation with cache warmup:
    - Cold cache (first visit):
      - Total time: ${coldTotalTime.toFixed(2)}ms
      - Average time per page: ${coldAverageTime.toFixed(2)}ms
    - Warm cache (second visit):
      - Total time: ${warmTotalTime.toFixed(2)}ms
      - Average time per page: ${warmAverageTime.toFixed(2)}ms
      - Improvement: ${((coldAverageTime - warmAverageTime) / coldAverageTime * 100).toFixed(2)}%
    - Mixed navigation (random access):
      - Total time: ${mixedTotalTime.toFixed(2)}ms
      - Average time per page: ${mixedAverageTime.toFixed(2)}ms
      - Pages accessed: 20`);
    
    expect(warmAverageTime).toBeLessThan(coldAverageTime / 2); // El caché caliente debería ser al menos 2 veces más rápido
    expect(mixedAverageTime).toBeLessThan(coldAverageTime); // La navegación mixta debería ser más rápida que el caché frío
  });
}); 