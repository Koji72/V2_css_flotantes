# 🌊 Guía Completa de Paneles Flotantes

## 📋 Síntesis de Atributos para Paneles Flotantes

| Atributo | Valores posibles | Descripción |
|----------|------------------|-------------|
| `layout` | `float-left`, `float-right`, `floating-left`, `floating-right` | Define la posición flotante del panel |
| `width` | Porcentaje (ej: `30%`, `40%`) | Determina el ancho del panel flotante |
| `style` | Diversos estilos (ej: `glass-panel`, `tech-corners`) | Aplica un estilo visual al panel |
| `class` | `panel-info`, `panel-success`, `panel-warning`, `panel-error` | Define un estado visual para el panel |
| `animation` | `pulse`, `fade`, `slide`, `glow` | Aplica una animación al panel |
| `title` | Texto para el título | Define el título del panel |

## 🚀 Sintaxis Básica

Para crear un panel flotante, usa la siguiente sintaxis:

```markdown
:::panel{layout="float-left" width="35%" style="tech-corners" title="Título del Panel"}
Contenido del panel flotante...
:::
```

## ↔️ Opciones de Layout Flotante

### Layout Float-Left (35% ancho)

:::panel{layout="float-left" width="35%" style="tech-corners" title="Panel Flotante Izquierda"}
Este panel flota a la **izquierda** del texto principal.

- Ideal para notas contextuales
- Se integra con el flujo de texto
- El texto principal fluye a su derecha
:::

Este es el texto principal que fluye alrededor del panel flotante a la izquierda. Como puedes ver, el texto se ajusta automáticamente al espacio disponible, creando un diseño dinámico y agradable. Los paneles flotantes izquierdos son perfectos para proporcionar definiciones, contexto o información adicional que complementa el texto principal.

Para crear este efecto, simplemente utilizamos el atributo `layout="float-left"` junto con un ancho específico `width="35%"`. El sistema automáticamente gestiona el flujo del texto principal alrededor del panel.

<div style="clear:both"></div>

### Layout Float-Right (40% ancho)

:::panel{layout="float-right" width="40%" style="glass-panel" title="Panel Flotante Derecha"}
Este panel flota a la **derecha** del texto principal.

1. Perfecto para datos complementarios
2. Excelente para glosarios laterales
3. Ideal para destacar información importante

El estilo "glass-panel" añade un efecto visual atractivo.
:::

Los paneles flotantes a la derecha se crean usando el atributo `layout="float-right"`. En este caso, el panel se coloca a la derecha y el texto principal fluye alrededor de él por la izquierda. Esta disposición es especialmente útil cuando quieres que el lector comience leyendo el texto principal y luego consulte la información complementaria en el panel.

El ancho de este panel es del 40%, lo que permite incluir más contenido sin comprometer demasiado el espacio del texto principal. Puedes ajustar el ancho según tus necesidades específicas, encontrando el equilibrio ideal entre el panel flotante y el contenido principal.

<div style="clear:both"></div>

## 🎨 Combinación con Diferentes Estilos

### Estilo Tech-Corners con Flotante Izquierdo

:::panel{layout="float-left" width="35%" style="tech-corners" title="Estilo Tech-Corners"}
El estilo "tech-corners" proporciona un aspecto tecnológico con esquinas distintivas.

Ideal para:
- Documentación técnica
- Tutoriales de programación
- Notas sobre tecnología
:::

La combinación de layouts flotantes con diferentes estilos visuales te permite crear documentos visualmente atractivos y coherentes. El estilo "tech-corners" utilizado en este panel flotante izquierdo es perfecto para contenido relacionado con tecnología, programación o ciencia.

El sistema de estilos es completamente personalizable, y puedes elegir el que mejor se adapte al tono y temática de tu documento. Los estilos no solo mejoran la apariencia visual, sino que también pueden ayudar a categorizar diferentes tipos de información.

<div style="clear:both"></div>

### Estilo Glass-Panel con Flotante Derecho

:::panel{layout="float-right" width="38%" style="glass-panel" title="Estilo Glass-Panel"}
El estilo "glass-panel" crea un efecto de transparencia moderna.

Perfecto para:
- Interfaces elegantes
- Diseños minimalistas
- Contenido contemporáneo

La sensación de "cristal" añade profundidad al diseño.
:::

El estilo "glass-panel" aplicado a un panel flotante derecho crea un efecto visual moderno y elegante. La combinación del efecto de transparencia con la disposición flotante genera un diseño que parece más ligero y menos intrusivo en el flujo de lectura.

Este tipo de estilo es particularmente efectivo para diseños minimalistas o cuando quieres que tu contenido tenga una apariencia contemporánea. La sensación de "cristal" añade una dimensión de profundidad que puede hacer que tu documento se destaque visualmente.

<div style="clear:both"></div>

## 🌈 Uso de Clases de Estado

### Panel de Éxito (Success)

:::panel{layout="float-left" width="35%" style="tech-corners" title="Operación Exitosa" class="panel-success"}
✅ **COMPLETADO**

La operación se ha realizado correctamente.
- Todos los archivos procesados: 127
- Tiempo total: 3.5 segundos
- Estado: Finalizado

*No se requieren acciones adicionales.*
:::

Las clases de estado te permiten comunicar visualmente la naturaleza o importancia de la información contenida en el panel. La clase `panel-success` aplica un esquema de color verde que universalmente comunica éxito o una condición positiva.

Este tipo de panel es perfecto para notificaciones de operaciones exitosas, confirmaciones o cualquier tipo de mensaje positivo que quieras destacar. La combinación del color verde con el layout flotante izquierdo crea un punto focal positivo que atrae la atención del lector.

<div style="clear:both"></div>

### Panel de Advertencia (Warning)

:::panel{layout="float-right" width="40%" style="glass-panel" title="¡Atención Requerida!" class="panel-warning"}
⚠️ **ADVERTENCIA**

Se requiere intervención del usuario:
1. Espacio en disco bajo (15% disponible)
2. Algunas funciones pueden verse afectadas
3. Se recomienda liberar espacio

*Revise la sección de almacenamiento para más detalles.*
:::

La clase `panel-warning` aplica un esquema de color amarillo/ámbar que universalmente comunica precaución o la necesidad de atención. Este tipo de panel es ideal para alertas no críticas pero importantes que requieren la atención del usuario.

Colocado a la derecha, este panel de advertencia permite que el flujo principal de lectura continúe mientras se destaca visualmente la información importante. La combinación del estilo "glass-panel" con la clase de advertencia crea un contraste visual efectivo.

<div style="clear:both"></div>

### Panel de Error (Error)

:::panel{layout="float-left" width="35%" style="tech-corners" title="Error Crítico" class="panel-error" animation="pulse"}
❌ **ERROR DETECTADO**

Sistema: Autenticación
Código: AUTH_501
Severidad: ALTA

*Contacte al administrador del sistema inmediatamente.*
:::

Para comunicar problemas críticos o errores, puedes utilizar la clase `panel-error` que aplica un esquema de color rojo. Este tipo de panel inmediatamente comunica la gravedad de la situación y atrae la atención del lector.

En este ejemplo, hemos combinado la clase de error con una animación de pulso (`animation="pulse"`) para aumentar aún más la visibilidad del mensaje. Esta combinación es especialmente efectiva para alertas críticas que requieren atención inmediata.

<div style="clear:both"></div>

### Panel Informativo (Info)

:::panel{layout="float-right" width="40%" style="glass-panel" title="Información Adicional" class="panel-info"}
ℹ️ **NOTA INFORMATIVA**

Este documento utiliza paneles flotantes para mejorar la experiencia de lectura.

**Compatibilidad:**
- Navegadores modernos: Completa
- Dispositivos móviles: Adaptativa
- Lectores de pantalla: Accesible

*Los paneles se convierten a formato vertical en pantallas pequeñas.*
:::

La clase `panel-info` aplica un esquema de color azul que universalmente comunica información complementaria o contextual. Este tipo de panel es ideal para notas, información adicional o contexto que no es crítico pero que enriquece el contenido principal.

El color azul es menos llamativo que el rojo o amarillo, lo que lo hace perfecto para información que complementa pero no interrumpe el flujo principal de lectura. La combinación con un panel flotante derecho crea un espacio natural para incluir detalles adicionales.

<div style="clear:both"></div>

## 🎭 Animaciones Disponibles

### Animación Pulse

:::panel{layout="float-left" width="35%" style="tech-corners" title="Animación Pulse" animation="pulse"}
Esta animación hace que el panel **pulse** sutilmente, atrayendo la atención del usuario sin ser demasiado intrusiva.

Ideal para:
- Notificaciones importantes
- Alertas que requieren atención
- Información destacada
:::

Las animaciones pueden hacer que tus paneles sean más dinámicos y llamativos. La animación `pulse` crea un efecto de latido suave que atrae la atención del lector sin resultar molesto. Es particularmente útil para contenido que quieres destacar.

Para aplicar esta animación, simplemente añade `animation="pulse"` a los atributos del panel. Puedes combinar las animaciones con diferentes layouts, estilos y clases para crear efectos visuales personalizados.

<div style="clear:both"></div>

### Animación Glow

:::panel{layout="float-right" width="40%" style="glass-panel" title="Animación Glow" animation="glow"}
La animación **glow** crea un suave resplandor alrededor del panel que varía en intensidad.

Perfecta para:
- Contenido destacado
- Elementos especiales
- Crear puntos focales sutiles

Este efecto funciona especialmente bien con el estilo glass-panel.
:::

La animación `glow` crea un efecto de resplandor que varía en intensidad, creando un punto focal visualmente atractivo. Esta animación es más sutil que la de pulso y funciona especialmente bien con estilos como "glass-panel" que ya tienen elementos de transparencia.

Este tipo de animación es ideal para destacar contenido importante sin ser demasiado intrusivo en la experiencia de lectura general. La combinación del resplandor con un panel flotante derecho crea un punto de interés visual que guía la atención del lector.

<div style="clear:both"></div>

## 📱 Comportamiento Responsivo

:::panel{title="Nota sobre Responsividad" style="corner-brackets" class="panel-info"}
En **dispositivos móviles** y pantallas pequeñas, los paneles flotantes automáticamente se convierten en bloques de ancho completo.

Esto garantiza que:
1. El contenido siga siendo legible
2. No se comprima el texto en espacios demasiado estrechos
3. La experiencia de usuario sea óptima en cualquier dispositivo
:::

Una característica importante de los paneles flotantes es su comportamiento responsivo. Mientras que en pantallas grandes y medianas los paneles mantienen su disposición flotante, en dispositivos móviles y pantallas pequeñas automáticamente se convierten en bloques de ancho completo.

Esta adaptación responsiva garantiza que tu contenido siga siendo legible y bien estructurado independientemente del dispositivo que utilice el lector. No es necesario crear versiones separadas de tu documento para diferentes tamaños de pantalla.

## 🔄 Borrar los Flotantes

Para evitar que los elementos flotantes afecten a los elementos siguientes, puedes usar un divisor de limpieza:

```html
<div style="clear:both"></div>
```

Este elemento asegura que cualquier contenido posterior comience debajo de todos los elementos flotantes, restableciendo el flujo normal de la página. Es especialmente útil cuando tienes secciones claramente definidas en tu documento.

## 🎯 Ejemplos de Uso Práctico

### Documentación Técnica

:::panel{layout="float-left" width="35%" style="tech-corners" title="Conceptos Clave" class="panel-info"}
**API REST**

Una API REST es una interfaz de programación que utiliza solicitudes HTTP para operaciones CRUD:
- GET: Recuperar datos
- POST: Crear nuevos datos
- PUT/PATCH: Actualizar datos
- DELETE: Eliminar datos

*Respeta los principios de arquitectura Representational State Transfer.*
:::

Las API REST (Representational State Transfer) son un estándar arquitectónico para la comunicación entre sistemas distribuidos. Este enfoque se basa en el protocolo HTTP y sus métodos nativos para proporcionar una interfaz coherente y predecible.

Al implementar una API REST, es fundamental comprender los conceptos de recursos, representaciones y operaciones. Los recursos son las entidades manipuladas por la API (por ejemplo, usuarios, productos, pedidos), mientras que las representaciones son las diferentes formas de presentar esos recursos (JSON, XML, HTML).

La estructura de URLs de una API REST debería reflejar claramente los recursos que se están manipulando. Por ejemplo, `/users` para acceder a la colección de usuarios, y `/users/123` para acceder a un usuario específico con ID 123.

<div style="clear:both"></div>

### Tutoriales Educativos

:::panel{layout="float-right" width="40%" style="glass-panel" title="Historia de la Fotografía" class="panel-info"}
**Línea de Tiempo:**

- **1826**: Primera fotografía permanente (Niépce)
- **1837**: Daguerrotipo (Daguerre)
- **1888**: Primera cámara Kodak
- **1975**: Primera cámara digital (Kodak)
- **2007**: iPhone revoluciona la fotografía móvil

*La evolución de la fotografía ha transformado nuestra forma de documentar el mundo.*
:::

La fotografía, como forma de arte y documentación, ha experimentado una evolución extraordinaria desde sus inicios. Lo que comenzó como un proceso complejo, costoso y limitado a expertos, se ha convertido en una práctica cotidiana accesible para prácticamente cualquier persona con un teléfono inteligente.

El proceso fotográfico inicial requería largos tiempos de exposición y sustancias químicas peligrosas. La primera fotografía permanente, tomada por Joseph Nicéphore Niépce en 1826, requirió una exposición de aproximadamente ocho horas. Comparemos esto con la fotografía instantánea de hoy, donde capturamos momentos en fracciones de segundo.

La democratización de la fotografía ha cambiado fundamentalmente nuestra relación con las imágenes. Ya no son objetos preciosos y escasos, sino un medio de comunicación cotidiano. Se estima que cada día se toman más de 1.000 millones de fotografías en todo el mundo, la mayoría con teléfonos móviles.

<div style="clear:both"></div>

## 💪 Ejemplos Avanzados

### Combinación de Múltiples Paneles

:::panel{layout="float-left" width="30%" style="tech-corners" title="Datos del Proyecto" class="panel-info"}
**Proyecto Horizonte**

- **Inicio**: Marzo 2023
- **Duración**: 18 meses
- **Presupuesto**: $1.2M
- **Equipo**: 12 personas
- **Tecnologías**: React, Node.js, PostgreSQL
- **Metodología**: Agile/Scrum
:::

:::panel{layout="float-right" width="25%" style="glass-panel" title="Estado Actual" class="panel-success"}
**Sprint 7 de 12**

✅ Funcionalidades completadas: 65%
✅ Tests automatizados: 89%
✅ Documentación: 72%
⏳ Performance: Optimización en curso
⏳ Seguridad: Auditoría programada

*El proyecto avanza según lo planificado.*
:::

El Proyecto Horizonte representa nuestra iniciativa más ambiciosa hasta la fecha, combinando innovación tecnológica con un enfoque centrado en el usuario. Estamos desarrollando una plataforma completamente nueva que permitirá a nuestros clientes gestionar sus operaciones de manera más eficiente y con una experiencia de usuario superior.

La arquitectura del sistema se ha diseñado pensando en la escalabilidad y el rendimiento. Utilizamos un enfoque de microservicios con React para el frontend, respaldado por una robusta API Node.js y una base de datos PostgreSQL para el almacenamiento persistente. Este enfoque nos permite escalar componentes individuales según sea necesario y mantener un alto nivel de disponibilidad.

Hasta ahora, hemos completado siete sprints con resultados consistentemente positivos. El equipo ha mantenido una velocidad estable y ha abordado eficazmente la deuda técnica desde las primeras etapas, lo que nos permite avanzar sin acumular problemas para fases posteriores.

<div style="clear:both"></div>

### Panel con Tabla de Datos

:::panel{layout="float-left" width="50%" style="neo-frame" title="Comparativa de Frameworks" class="panel-info"}
| Framework | Estrellas GitHub | Tamaño (KB) | Curva Aprendizaje | Rendimiento |
|-----------|------------------|-------------|-------------------|-------------|
| React     | 192k             | 42.2        | Moderada          | Alto        |
| Vue       | 198k             | 33.8        | Baja              | Alto        |
| Angular   | 85k              | 142.6       | Alta              | Medio-Alto  |
| Svelte    | 64k              | 4.0         | Baja              | Muy Alto    |
| Preact    | 33k              | 4.3         | Moderada          | Muy Alto    |

*Datos actualizados a junio 2023. El rendimiento puede variar según el caso de uso.*
:::

La elección de un framework frontend es una decisión importante que puede tener un impacto significativo en el desarrollo y mantenimiento de tu aplicación. Cada framework tiene sus propias fortalezas y debilidades, y la elección óptima depende de varios factores como el tipo de proyecto, el tamaño del equipo y los requisitos específicos.

React, desarrollado y mantenido por Facebook, ofrece un enfoque basado en componentes con un ecosistema maduro y una comunidad activa. Su modelo mental basado en el Virtual DOM y el flujo unidireccional de datos proporciona una experiencia de desarrollo predecible.

Vue, por otro lado, se destaca por su baja curva de aprendizaje y su API intuitiva. Combina elementos de React y Angular, ofreciendo un sistema de reactividad eficiente y una excelente documentación. Es particularmente adecuado para equipos pequeños o desarrolladores que se están iniciando en los frameworks modernos.

<div style="clear:both"></div>

## 📝 Conclusión

Los paneles flotantes ofrecen una forma versátil y visualmente atractiva de organizar la información en tus documentos markdown. Al dominar los diferentes atributos, layouts y combinaciones, puedes crear diseños profesionales que mejoran significativamente la experiencia de lectura y la comprensión del contenido.

Recuerda siempre considerar el equilibrio visual, la accesibilidad y el comportamiento responsivo al diseñar documentos con paneles flotantes. Un buen diseño no solo es estéticamente agradable, sino también funcional y accesible para todos los usuarios.

¡Experimenta con las diferentes opciones que ofrecen los paneles flotantes y lleva tus documentos al siguiente nivel! 