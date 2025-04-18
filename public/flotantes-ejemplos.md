# 🌊 EJEMPLOS DE PANELES FLOTANTES

Este documento muestra diferentes configuraciones de paneles flotantes y cómo utilizarlos de manera efectiva en tus documentos.

## 🔍 INTRODUCCIÓN A LOS PANELES FLOTANTES

Los paneles flotantes te permiten crear diseños de página dinámicos donde el texto fluye alrededor del panel. Son ideales para:

- Notas laterales
- Información complementaria
- Imágenes con descripción
- Ficha de datos junto al texto principal

## 🖼️ EJEMPLOS BÁSICOS

### Panel Flotante a la Izquierda

:::panel{title="Flotante Izquierda" style="tech-corners" layout="float-left" width="35%"}
Este panel flota a la izquierda del texto principal.

Es perfecto para proporcionar contexto o definiciones mientras el usuario sigue leyendo el flujo principal del documento.

- Ficha técnica
- Notas importantes
- Definiciones
:::

Para crear un panel flotante a la izquierda usamos el atributo `layout="float-left"`. El flujo de texto continuará a la derecha del panel, ajustándose automáticamente al espacio disponible. También podemos especificar un ancho personalizado con el atributo `width="35%"`, lo que nos da mayor control sobre la presentación.

Los paneles flotantes a la izquierda son ideales para proporcionar información complementaria sin interrumpir el flujo principal de lectura. El lector puede referenciar el panel mientras continúa con el contenido principal.

<div style="clear:both"></div>

### Panel Flotante a la Derecha

:::panel{title="Flotante Derecha" style="glass-panel" layout="float-right" width="40%"}
Los paneles flotantes a la derecha son excelentes para:

1. Notas complementarias
2. Datos adicionales
3. Ejemplos relacionados al texto principal

La transparencia del estilo "glass-panel" los hace sutiles pero efectivos.
:::

Los paneles flotantes a la derecha se crean con el atributo `layout="float-right"`. Este tipo de disposición es excelente cuando quieres que el flujo principal de lectura comience en el lado izquierdo, que es donde el ojo del lector naturalmente empieza a leer en culturas occidentales.

El ancho personalizado del 40% permite que el panel sea lo suficientemente grande para contener información relevante sin quitar demasiado espacio al contenido principal. El estilo "glass-panel" añade un toque moderno con sus efectos de transparencia.

<div style="clear:both"></div>

## 🧠 CASOS DE USO PRÁCTICOS

### Explicaciones Técnicas

:::panel{title="¿Qué es CSS?" style="neo-frame" layout="float-left" width="30%"}
**CSS** (Cascading Style Sheets) es un lenguaje usado para describir la presentación de documentos HTML.

Es la tecnología responsable de:
- Colores
- Layouts
- Tipografías
- Animaciones
- Responsividad

*Sin CSS, la web sería solo texto plano.*
:::

Cuando explicamos conceptos técnicos, los paneles flotantes son extremadamente útiles. Como puedes ver a la izquierda, hemos colocado una definición concisa de CSS mientras el texto principal puede elaborar con más detalle o continuar con el flujo de la explicación.

Esta técnica permite al lector tener siempre a mano la referencia básica mientras profundiza en temas más complejos. El estilo "neo-frame" aporta un toque tecnológico que es especialmente apropiado para temas relacionados con programación y desarrollo.

La combinación de paneles flotantes con diferentes estilos visuales también ayuda a categorizar visualmente distintos tipos de información. Por ejemplo, podríamos usar consistentemente este estilo para todas las definiciones técnicas a lo largo del documento.

<div style="clear:both"></div>

### Narrativa Inmersiva

:::panel{title="Mensaje Interceptado" style="hologram" layout="float-right" width="35%" animation="pulse"}
**PRIORIDAD: ALTA**
**EMISOR:** Comando Estelar
**DESTINATARIO:** Agente Nova

La nave colonial Artemis ha perdido contacto en el sector 7. Última transmisión reporta anomalías cuánticas.

*Coordenadas adjuntas. Proceder con precaución.*
:::

La capitana Elara observó las estrellas a través de la escotilla principal mientras consideraba sus opciones. La Artemis llevaba tres días sin reportar y el mensaje que acababa de recibir no auguraba nada bueno. Las anomalías cuánticas eran extremadamente raras y potencialmente catastróficas.

"Teniente Kim, establezca curso hacia las coordenadas del sector 7," ordenó finalmente. "Y prepare los escudos de partículas. No sabemos qué encontraremos allí."

"Sí, capitana," respondió Kim, sus dedos ya danzando sobre la consola de navegación. "Tiempo estimado de llegada: 18 horas estándar."

Elara asintió y volvió a mirar el vacío del espacio. Algo en su instinto le decía que esta misión podría cambiar el rumbo de la guerra. O tal vez, de la historia misma.

<div style="clear:both"></div>

### Referencia Rápida

:::panel{title="Referencia de Comandos Git" style="circuit-nodes" layout="float-left" width="38%"}
| Comando | Descripción |
|---------|-------------|
| `git init` | Inicializa un repositorio |
| `git clone` | Clona un repositorio remoto |
| `git add` | Añade archivos al staging |
| `git commit` | Confirma los cambios |
| `git push` | Envía cambios al remoto |
| `git pull` | Obtiene cambios del remoto |
| `git branch` | Gestiona ramas |
| `git merge` | Combina ramas |
:::

Cuando trabajamos con Git, es importante recordar que cada comando sirve para un propósito específico en el flujo de trabajo. El uso adecuado de estos comandos nos permite mantener un historial de cambios limpio y funcional.

Por ejemplo, antes de realizar un commit, siempre debemos revisar los cambios que hemos añadido al área de staging con `git diff --staged`. Esto nos ayuda a asegurarnos de que solo estamos confirmando los cambios que realmente queremos incluir.

Para crear una nueva rama y cambiarse a ella en un solo paso, podemos usar `git checkout -b nombre-rama`. Este comando es equivalente a ejecutar `git branch nombre-rama` seguido de `git checkout nombre-rama`.

<div style="clear:both"></div>

## 💡 TÉCNICAS AVANZADAS

### Combinación de Múltiples Paneles

:::panel{title="Panel Principal" style="tech-corners" layout="float-left" width="30%"}
Este panel contiene la información principal y flota a la izquierda.

Es el primer punto de referencia para el lector cuando escanea la página.
:::

:::panel{title="Información Secundaria" style="neo-frame" layout="float-right" width="25%"}
Este panel complementa al principal, flotando a la derecha.

Ofrece detalles adicionales o contexto para el tema central.
:::

Cuando usamos múltiples paneles flotantes en una misma sección, podemos crear diseños complejos que guían la atención del lector de manera efectiva. En este ejemplo, tenemos un panel principal a la izquierda y otro secundario a la derecha, dejando el centro para el flujo de texto principal.

Esta técnica es especialmente útil cuando necesitamos presentar datos relacionados pero distintivos, como podría ser una comparación entre dos productos, tecnologías o conceptos.

La clave para usar múltiples paneles flotantes es mantener un equilibrio visual y asegurarse de que haya suficiente espacio para el contenido principal. También es importante usar estilos visuales diferentes para ayudar al lector a distinguir rápidamente entre los distintos tipos de información.

<div style="clear:both"></div>

### Paneles Anidados

:::panel{title="Sistema Solar" style="glass-panel" layout="float-right" width="45%"}
El sistema solar contiene ocho planetas principales.

:::panel{title="Planetas Rocosos" style="corner-brackets" width="90%"}
Los cuatro planetas más cercanos al Sol son rocosos:
- Mercurio
- Venus
- Tierra
- Marte
:::

:::panel{title="Planetas Gaseosos" style="corner-brackets" width="90%"}
Los cuatro planetas exteriores son gigantes gaseosos:
- Júpiter
- Saturno
- Urano
- Neptuno
:::
:::

También es posible anidar paneles dentro de otros paneles para crear jerarquías de información. En este ejemplo, tenemos un panel principal sobre el sistema solar que contiene dos subpaneles con información específica sobre los tipos de planetas.

Esta técnica es excelente para organizar información en categorías y subcategorías de manera visualmente clara y lógica. El diseño ayuda al lector a comprender la relación entre los diferentes conjuntos de datos.

Al anidar paneles, es importante mantener un diseño coherente y usar estilos visuales que indiquen claramente la jerarquía. También debemos asegurarnos de que los paneles internos tengan un ancho adecuado para no romper el layout del panel contenedor.

<div style="clear:both"></div>

## 🎭 VARIACIONES DE ESTILO Y CLASE

### Paneles de Estado

:::panel{title="Sistema Estable" style="tech-corners" layout="float-left" width="30%" class="panel-success"}
✅ **TODOS LOS SISTEMAS OPERATIVOS**

Rendimiento: 97.8%
Latencia: 12ms
Disponibilidad: 99.99%

*No se requieren acciones.*
:::

:::panel{title="¡ALERTA CRÍTICA!" style="tech-corners" layout="float-right" width="30%" class="panel-error"}
❌ **FALLO DE SEGURIDAD**

Brecha detectada: Firewall principal
Tiempo de detección: 23:45:12
Nivel de amenaza: CRÍTICO

*Intervención manual requerida inmediatamente.*
:::

Los paneles flotantes pueden combinarse con clases de estado para comunicar visualmente la naturaleza de la información que contienen. En este ejemplo, usamos `class="panel-success"` para indicar un estado positivo y `class="panel-error"` para señalar un problema crítico.

Estas variaciones de estilo son extremadamente útiles en aplicaciones de monitoreo, dashboards o cualquier situación donde necesitamos comunicar rápidamente el estado de un sistema o proceso.

Las clases disponibles incluyen:
- `panel-info`: Para información general (azul)
- `panel-success`: Para resultados positivos (verde)
- `panel-warning`: Para advertencias (amarillo)
- `panel-error`: Para alertas críticas (rojo)

<div style="clear:both"></div>

## 🔄 CONSIDERACIONES RESPONSIVAS

:::panel{title="Nota sobre Dispositivos Móviles" style="cut-corners" animation="glow" class="panel-info"}
En pantallas pequeñas como teléfonos móviles, los paneles flotantes suelen convertirse automáticamente en paneles de ancho completo para preservar la legibilidad del contenido.

Esto garantiza que tu diseño siga siendo funcional en cualquier dispositivo.
:::

Es importante considerar cómo se comportarán los paneles flotantes en diferentes tamaños de pantalla. Mientras que en dispositivos de escritorio los paneles flotantes crean diseños de columnas múltiples, en dispositivos móviles esto podría hacer que el texto fuera demasiado pequeño para leer cómodamente.

Por eso, el sistema de paneles flotantes está diseñado para adaptarse automáticamente: en pantallas pequeñas, los paneles flotantes se convierten en bloques de ancho completo dispuestos verticalmente, preservando la legibilidad y la experiencia de usuario.

## 🎬 CONCLUSIÓN

Los paneles flotantes ofrecen una forma versátil y visualmente atractiva de organizar la información en tus documentos. Al dominar las diferentes opciones de layout, estilo y ancho, puedes crear diseños avanzados que mejoran significativamente la experiencia de lectura y la comprensión del contenido.

Experimenta con las diferentes combinaciones mostradas en este documento para encontrar las que mejor se adapten a tus necesidades específicas. 