"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const unified_1 = require("unified");
const remark_parse_1 = __importDefault(require("remark-parse"));
const remark_directive_1 = __importDefault(require("remark-directive"));
const remark_rehype_1 = __importDefault(require("remark-rehype"));
const rehype_stringify_1 = __importDefault(require("rehype-stringify"));
const remarkCustomPanels_1 = __importDefault(require("./remarkCustomPanels"));
const remarkCornerDirectives_1 = __importDefault(require("./remarkCornerDirectives"));
const remarkEnsureDirectiveBrackets_1 = __importDefault(require("./remarkEnsureDirectiveBrackets"));
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
        const processor = (0, unified_1.unified)()
            .use(remark_parse_1.default)
            .use(remarkEnsureDirectiveBrackets_1.default)
            .use(remark_directive_1.default)
            .use(remarkCornerDirectives_1.default) // Primero procesamos las esquinas
            .use(remarkCustomPanels_1.default) // Luego procesamos el panel
            .use(remark_rehype_1.default)
            .use(rehype_stringify_1.default);
        // 1. Procesar el Markdown
        const result = await processor.process(testMarkdown);
        // 2. Mostrar el resultado
        console.log('=== HTML Resultante ===');
        console.log(result.toString());
        // 3. Mostrar el AST intermedio (opcional, para debugging)
        const ast = processor.parse(testMarkdown);
        console.log('\n=== AST Intermedio ===');
        console.log(JSON.stringify(ast, null, 2));
    }
    catch (error) {
        console.error('Error procesando el Markdown:', error);
    }
}
// Ejecutar la prueba
testPanelCornerBug();
