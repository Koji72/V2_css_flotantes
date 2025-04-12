# Demostración de Bloques Flotantes en Universal Scribe V2.5

Este documento demuestra las nuevas capacidades de bloques flotantes implementadas en Universal Scribe V2.5. Los bloques flotantes permiten crear diseños más interesantes y dinámicos, colocando elementos como tablas, paneles y matrices a la izquierda o derecha del contenido principal.

## 1. Bloques Flotantes Básicos

::: panel Introducción float-left
### ¿Qué son los bloques flotantes?

Los bloques flotantes son elementos que se desplazan a la izquierda o derecha del flujo normal del documento, permitiendo que el contenido fluya a su alrededor.

Esta funcionalidad es útil para crear diseños más ricos visualmente y mejorar la organización del contenido.
:::

La implementación de bloques flotantes en Universal Scribe V2.5 representa un avance significativo en las capacidades de diseño de página. Esta característica permite crear documentos más dinámicos y visualmente atractivos, sin necesidad de recurrir a HTML o CSS personalizados.

Los bloques flotantes funcionan con todos los tipos de bloques personalizados, como paneles, matrices de datos y bloques de estado. Para usar esta característica, simplemente añade `float-left` o `float-right` al final del título del bloque.

::: panel-info-box Nota Técnica float-right
### Implementación

Los bloques flotantes se implementan mediante:

1. Detección de parámetros `float-left`/`float-right` en el título
2. Extracción de estos parámetros del título visible
3. Aplicación de clases CSS correspondientes
4. Estilos específicos en las plantillas CSS
:::

## 2. Combinación con Diferentes Tipos de Bloques

### 2.1 Matrices de Datos Flotantes

::: datamatrix Recursos del Sistema float-left
| Recurso | Utilización | Estado |
|---------|-------------|--------|
| CPU | 47% | Normal |
| Memoria | 62% | Normal |
| Almacenamiento | 83% | Alto |
| Red | 28% | Bajo |
| GPU | 91% | Crítico |
:::

Las matrices de datos flotantes son ideales para presentar información tabular junto con explicaciones textuales detalladas. En el ejemplo a la izquierda, podemos ver una matriz que muestra el estado de recursos del sistema.

Esta disposición permite explicar los datos de la tabla mientras se mantiene visible para referencia. La tabla flota a la izquierda, y este texto fluye naturalmente a su derecha.

Los estilos de la tabla se mantienen consistentes con el tema visual seleccionado, mientras que su posición se controla mediante las clases de flotación.

### 2.2 Paneles Informativos Flotantes

Los paneles informativos pueden flotar a la izquierda o derecha, dependiendo de las necesidades de diseño. Este enfoque es especialmente útil para notas, advertencias o contenido complementario.

::: note Advertencia float-right
### ¡Precaución!

Los elementos flotantes deben usarse con moderación para evitar diseños desordenados o confusos.

Asegúrate de que haya suficiente espacio para que el texto fluya de manera natural alrededor del elemento flotante.
:::

Como se puede ver en este ejemplo, el panel de advertencia flota a la derecha, permitiendo que el texto principal continúe fluyendo a su izquierda. Esta disposición es ideal para contenido complementario o información de apoyo que no interrumpe la lectura principal.

Los paneles flotantes mantienen todas sus características estilísticas según el tema seleccionado, solo cambia su posicionamiento en la página.

## 3. Múltiples Bloques Flotantes

Es posible combinar múltiples bloques flotantes en un mismo documento, alternando entre `float-left` y `float-right` para crear diseños más complejos.

::: statblock Estadísticas de Personaje float-left
| Atributo | Valor | Modificador |
|----------|-------|-------------|
| Fuerza | 16 | +3 |
| Destreza | 14 | +2 |
| Constitución | 15 | +2 |
| Inteligencia | 18 | +4 |
| Sabiduría | 12 | +1 |
| Carisma | 10 | +0 |
:::

::: panel-objectives Habilidades Especiales float-right
### Capacidades Únicas

- **Erudición Arcana**: +5 a pruebas de conocimiento arcano
- **Visión en la Oscuridad**: Puede ver en oscuridad total hasta 60 pies
- **Resistencia Elemental**: Mitad de daño por fuego y frío
- **Concentración Mejorada**: Ventaja en tiradas para mantener concentración
:::

Cuando se utilizan múltiples bloques flotantes, es importante considerar el orden y el flujo del contenido. En este caso, tenemos una tabla de estadísticas flotando a la izquierda y un panel de habilidades flotando a la derecha.

El contenido principal fluye entre ambos bloques, creando una disposición de tres columnas. Esta técnica puede ser muy efectiva para crear fichas de personaje, informes técnicos o cualquier documento que requiera múltiples secciones de información relacionada pero distinta.

## 4. Consideraciones de Diseño

Al utilizar bloques flotantes, es importante tener en cuenta algunas consideraciones de diseño:

1. **Espacio suficiente**: Asegúrate de que haya suficiente espacio para que el texto fluya naturalmente alrededor de los bloques flotantes.

2. **Contraste visual**: Mantén un buen contraste entre los bloques flotantes y el contenido principal para facilitar la lectura.

3. **Consistencia**: Utiliza un enfoque consistente para los bloques flotantes en todo el documento.

4. **Responsividad**: Ten en cuenta que en pantallas pequeñas, los bloques flotantes pueden reorganizarse para ocupar el ancho completo.

::: panel-log Resumen float-left
### Puntos Clave

- Los bloques flotantes mejoran el diseño visual
- Compatibles con todos los tipos de bloques
- Se implementan con `float-left` o `float-right`
- Mantienen los estilos del tema seleccionado
- Responsivos en diferentes tamaños de pantalla
:::

## 5. Conclusión

Los bloques flotantes son una adición poderosa a Universal Scribe V2.5, que amplía significativamente las capacidades de diseño de página. Con esta característica, los usuarios pueden crear documentos más dinámicos y visualmente atractivos sin necesidad de conocimientos de HTML o CSS.

Esta implementación mantiene la simplicidad y elegancia de la sintaxis Markdown, añadiendo solo un parámetro adicional a los bloques existentes. La consistencia visual se mantiene gracias a que los bloques flotantes heredan todos los estilos del tema seleccionado.

En futuros desarrollos, se podrían considerar capacidades adicionales como el control del ancho de los bloques flotantes o la posibilidad de agrupar varios bloques en un mismo lado. 