# Demostración de Columnas Separadas

Esta demostración muestra cómo crear paneles con columnas izquierda y derecha independientes, donde cada columna tiene su propio contenido y no hay flujo de texto entre ellas.

## Panel Básico con Columnas Separadas

:::panel{layout="split-columns" title="Panel con Columnas Separadas"}
<div class="column column-left">
### Columna Izquierda

Este contenido permanece completamente en la columna izquierda:

- No fluye hacia la columna derecha
- Ideal para mostrar información relacionada pero independiente
- Perfecto para comparaciones

Puedes agregar cualquier tipo de contenido Markdown:
1. Listas ordenadas
2. Listas no ordenadas  
3. Enlaces
4. Imágenes
</div>

<div class="column column-right">
### Columna Derecha

Este contenido permanece completamente en la columna derecha:

- Es independiente de la columna izquierda
- No es continuación del contenido de la izquierda
- Tiene su propio encabezado y estructura

Este diseño es perfecto para:
* Comparar opciones
* Mostrar "antes y después"
* Presentar pros y contras
* Exhibir diferentes aspectos de un tema
</div>
:::

## Columnas Separadas con Diversos Estilos

Puedes combinar el layout de columnas separadas con cualquier estilo de panel:

:::panel{layout="split-columns" style="tech-corners" title="Comparativa Técnica"}
<div class="column column-left">
### Sistema Alfa

**Especificaciones:**
- Procesador: 4.5 GHz Quad-Core
- RAM: 16 GB DDR4
- Almacenamiento: 1 TB SSD
- GPU: RTX 3080

**Rendimiento:**
| Prueba | Resultado |
|--------|-----------|
| Benchmark 1 | 12,450 pts |
| Benchmark 2 | 8,320 pts |
| Renderizado | 96 fps |
</div>

<div class="column column-right">
### Sistema Beta

**Especificaciones:**
- Procesador: 3.8 GHz Octa-Core
- RAM: 32 GB DDR4
- Almacenamiento: 2 TB SSD
- GPU: RTX 3070

**Rendimiento:**
| Prueba | Resultado |
|--------|-----------|
| Benchmark 1 | 11,980 pts |
| Benchmark 2 | 9,150 pts |
| Renderizado | 88 fps |
</div>
:::

## Pros y Contras

Este layout es ideal para mostrar pros y contras:

:::panel{layout="split-columns" style="glass" title="Análisis de Propuesta"}
<div class="column column-left">
### Ventajas

- **Implementación rápida**: Puede completarse en 2 semanas
- **Bajo costo**: Utiliza recursos existentes
- **Fácil mantenimiento**: Basado en tecnologías conocidas
- **Alta compatibilidad**: Funciona en todos los navegadores modernos
- **Soporte multiplataforma**: Disponible en móviles y escritorio
</div>

<div class="column column-right">
### Desventajas

- **Limitaciones técnicas**: No soporta algunas características avanzadas
- **Escalabilidad reducida**: Podría presentar problemas con grandes volúmenes de datos
- **Dependencias externas**: Requiere servicios de terceros
- **Curva de aprendizaje**: El equipo necesitará capacitación adicional
</div>
:::

## Columnas Separadas con Imágenes

Las columnas separadas son perfectas para mostrar imágenes con sus descripciones:

:::panel{layout="split-columns" style="corner-brackets" title="Especies Botánicas"}
<div class="column column-left">
### Quercus Robur (Roble Común)

El roble común es un árbol caducifolio de la familia Fagaceae, nativo de gran parte de Europa.

**Características:**
- Altura: 25-35 metros
- Longevidad: 500-1000 años
- Hojas: lobuladas, 7-14 cm
- Fruto: bellotas

Prefiere suelos profundos y bien drenados, con exposición solar directa.
</div>

<div class="column column-right">
### Pinus Sylvestris (Pino Silvestre)

El pino silvestre es una especie de pino nativa de Eurasia, desde Europa occidental hasta Siberia oriental.

**Características:**
- Altura: 20-40 metros
- Longevidad: 150-300 años
- Hojas: acículas en pares, 3-7 cm
- Corteza: anaranjada en la parte superior

Se adapta bien a suelos pobres y condiciones climáticas adversas.
</div>
:::

## Comparación de Habilidades

Este formato es útil para comparar habilidades o características de personajes:

:::panel{layout="split-columns" style="cut-corners" title="Comparativa de Personajes"}
<div class="column column-left">
### Mago Arcano

**Atributos Principales:**
- Inteligencia: 18 (+4)
- Sabiduría: 14 (+2)
- Carisma: 12 (+1)

**Habilidades:**
- Conjuración a distancia
- Manipulación elemental
- Rituales arcanos
- Detección mágica

**Debilidades:**
- Baja resistencia física
- Armadura limitada
- Vulnerable en combate cercano
</div>

<div class="column column-right">
### Guerrero de la Frontera

**Atributos Principales:**
- Fuerza: 16 (+3)
- Destreza: 14 (+2)
- Constitución: 16 (+3)

**Habilidades:**
- Maestría en armas
- Resistencia superior
- Tácticas de batalla
- Supervivencia en territorio hostil

**Debilidades:**
- Resistencia mágica limitada
- Poca versatilidad a distancia
- Movilidad reducida con armadura pesada
</div>
:::

## Conclusión

Las columnas separadas ofrecen una forma elegante de presentar información relacionada pero independiente, permitiendo al lector comparar fácilmente dos conjuntos de datos. A diferencia de las columnas de estilo libro donde el texto fluye de una columna a otra, este formato mantiene cada columna como una unidad autónoma.

Esto es particularmente útil para:

1. Comparaciones directas
2. Presentación de pros y contras
3. Exhibición de "antes y después"
4. Mostrar características de diferentes opciones o elementos

El diseño se adapta automáticamente a dispositivos móviles, apilando las columnas verticalmente para mantener la legibilidad en pantallas pequeñas. 