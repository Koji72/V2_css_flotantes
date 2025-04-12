# Historial de Versiones

## V2.6.0 (Actual)
Fecha: 12/04/2025

### Cambios Principales:
- Sistema completamente renovado de procesamiento de paneles
- Pre-procesamiento de paneles antes de pasarlos a Marked
- Sistema de logs detallados para facilitar la depuración
- Mejor manejo de errores en todas las etapas del pipeline
- Eliminación de dependencias problemáticas con plugins externos
- Solución definitiva al problema "Token with panelBlock type was not found"

### Archivos Principales Afectados:
- `src/utils/markdownProcessor.ts` - Reimplementación completa del método process y nuevo método replacePanelBlocks
- `src/core/processing/pipeline.ts` - Mejora del sistema de logs y flujo de procesamiento
- `src/core/processing/02_parser.ts` - Detección proactiva de problemas de sintaxis
- `src/core/processing/03_transformer.ts` - Mejor manejo de atributos y propiedades

### Ruta de Migración desde V2.5:
- Se mantiene la misma API pública
- No requiere cambios en los documentos markdown existentes
- Funciona con todos los estilos de panel anteriores

Para detalles completos, consultar [MEJORAS-V2.6.md](./MEJORAS-V2.6.md)

---

## V2.5.0
Fecha: Anterior a 12/04/2025

### Características Principales:
- Sistema inicial de procesamiento de markdown
- Soporte para paneles con estilos personalizados
- Estructura básica de pipeline de procesamiento
- Uso de extensiones de Marked para directivas

### Limitaciones Conocidas:
- Problemas con el procesamiento de paneles con atributos complejos
- Error "Token with panelBlock type was not found" en determinadas circunstancias
- Sistema de logs limitado para la depuración 