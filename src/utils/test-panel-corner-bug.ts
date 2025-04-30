import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkCustomPanels from './remarkCustomPanels';
import remarkCornerDirectives from './remarkCornerDirectives';
import remarkEnsureDirectiveBrackets from './remarkEnsureDirectiveBrackets';

// Caso de prueba mínimo
const testMarkdown = `# Test Panel-Corner Bug

:::panel{title="Panel con Esquinas"}
Contenido del panel.

::corner{pos=top-left type=1}
::corner{pos=top-right type=1}
::corner{pos=bottom-left type=1}
::corner{pos=bottom-right type=1}

Más contenido.
:::
`;

// Función para procesar y mostrar el resultado
async function testPanelCornerBug() {
  try {
    // Configuración del procesador
    const processor = unified()
      .use(remarkParse)
      .use(remarkEnsureDirectiveBrackets)
      .use(remarkDirective)
      .use(remarkCornerDirectives) // Primero procesamos las esquinas
      .use(remarkCustomPanels)     // Luego procesamos el panel
      .use(remarkRehype)
      .use(rehypeStringify);

    // 1. Procesar el Markdown
    const result = await processor.process(testMarkdown);
    
    // 2. Mostrar el resultado
    console.log('=== HTML Resultante ===');
    console.log(result.toString());
    
    // 3. Mostrar el AST intermedio (opcional, para debugging)
    const ast = processor.parse(testMarkdown);
    console.log('\n=== AST Intermedio ===');
    console.log(JSON.stringify(ast, null, 2));
    
  } catch (error) {
    console.error('Error procesando el Markdown:', error);
  }
}

// Ejecutar la prueba
testPanelCornerBug(); 