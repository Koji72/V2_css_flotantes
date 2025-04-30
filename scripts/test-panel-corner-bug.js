// Script para ejecutar la prueba del bug panel-corner
import { register } from 'ts-node';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Registrar ts-node
register();

// Importar el archivo de prueba
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
await import(resolve(__dirname, '../src/utils/test-panel-corner-bug.ts')); 