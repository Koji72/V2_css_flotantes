# 🎨 GUÍA DE ESTILOS Y COMBINACIONES AVANZADAS

Este documento ilustra combinaciones avanzadas de estilos, paneles y layouts para crear documentos visualmente impactantes.

## 🧩 COMBINACIONES DE ESTILOS Y ANIMACIONES

### Estilo Tech + Animación Scan

:::panel{title="SISTEMA DE DIAGNÓSTICO" style="tech-corners" animation="scan"}
### Análisis de Componentes

| Componente | Estado | Rendimiento |
|------------|--------|-------------|
| CPU        | ✅ Operativo | 97.8% |
| Memoria    | ✅ Operativa | 82.3% |
| Disco      | ⚠️ Advertencia | 68.5% |
| Red        | ✅ Operativa | 91.2% |

*Recomendación: Optimizar uso de disco*
:::

La combinación de `style="tech-corners"` con `animation="scan"` crea un efecto futurista ideal para paneles de control, monitores de sistema o interfaces técnicas. La animación de escaneo refuerza visualmente la idea de que el sistema está realizando un análisis en tiempo real.

### Estilo Holográfico + Animación Pulse

:::panel{title="TRANSMISIÓN ENTRANTE" style="hologram" animation="pulse" class="panel-info"}
**ORIGEN:** Estación Orbital Gamma-7
**FECHA:** 2186.03.17
**DESTINATARIO:** Comandante de Flota

Se han detectado anomalías gravitacionales en el cuadrante Delta. 
Recomendamos desviar todas las naves de la ruta comercial principal.

*[Mensaje autodestruible en T-10]*
:::

El estilo `hologram` combinado con la animación `pulse` y la clase `panel-info` crea un componente perfecto para notificaciones importantes o mensajes especiales. El efecto pulsante atrae la atención del usuario de forma efectiva, mientras que el estilo holográfico le da un aspecto inmersivo.

## 🧪 LAYOUTS MIXTOS

### Columnas Desiguales

:::panel{title="Conceptos Básicos" style="neo-frame" layout="float-left" width="25%"}
- Puntos clave
- Definiciones
- Conceptos fundamentales
- Referencias rápidas
:::

:::panel{title="Explicación Detallada" style="glass-panel" layout="float-right" width="65%"}
Cuando trabajamos con columnas desiguales, debemos considerar la jerarquía visual y la distribución del peso en la página. 

La columna más estrecha suele servir como guía o referencia, mientras que la columna principal contiene el desarrollo completo del tema.

Esta técnica es particularmente útil en:
1. Documentación técnica
2. Manuales de usuario
3. Libros de texto
4. Presentaciones detalladas
:::

Utilizando paneles flotantes con anchos diferentes podemos crear un layout de columnas desiguales que ayuda a distinguir visualmente entre diferentes niveles de información. Este patrón es común en publicaciones académicas y documentación técnica avanzada.

<div style="clear:both"></div>

### Layout en Z

:::panel{title="Primer Punto" style="tech-corners" layout="float-left" width="40%"}
El primer punto de atención se sitúa arriba a la izquierda, siguiendo el patrón natural de lectura occidental.
:::

<div style="clear:both"></div>

:::panel{title="Segundo Punto" style="circuit-nodes" layout="float-right" width="40%"}
El segundo punto se sitúa en la parte central-derecha, creando una diagonal visual que guía el ojo del lector.
:::

<div style="clear:both"></div>

:::panel{title="Tercer Punto" style="neo-frame" layout="float-left" width="40%"}
El tercer punto vuelve a la izquierda, completando el patrón en Z que facilita la absorción secuencial de la información.
:::

<div style="clear:both"></div>

El layout en Z aprovecha el patrón natural de movimiento del ojo durante la lectura para crear una narrativa visual que guía al lector a través de los puntos clave de forma intuitiva. Cada panel puede tener un estilo diferente para reforzar su identidad única dentro de la secuencia.

## 🎭 ESTILOS SEGÚN CONTENIDO

### Panel de Código

:::panel{title="Ejemplo JavaScript" style="circuit-nodes"}
```javascript
function calcularFactorial(n) {
  if (n <= 1) return 1;
  return n * calcularFactorial(n - 1);
}

// Uso
const resultado = calcularFactorial(5);
console.log(`El factorial de 5 es: ${resultado}`);
```
:::

El estilo `circuit-nodes` es perfecto para mostrar bloques de código, ya que su diseño técnico refuerza visualmente la naturaleza programática del contenido.

### Panel de Cita

:::panel{title="Inspiración" style="cut-corners" width="80%"}
> "La simplicidad es la máxima sofisticación."
> 
> — Leonardo da Vinci
:::

El estilo `cut-corners` con un ancho personalizado funciona muy bien para destacar citas o fragmentos inspiradores, dándoles un tratamiento visual distintivo que las separa del flujo principal del texto.

### Panel de Advertencia

:::panel{title="¡ATENCIÓN!" style="neo-frame" class="panel-warning"}
⚠️ **NO CONTINUAR SIN LEER**

Este procedimiento puede causar pérdida permanente de datos si no se siguen exactamente los pasos descritos.

Asegúrese de realizar una copia de seguridad completa antes de proceder.
:::

Para advertencias importantes, la combinación del estilo `neo-frame` con la clase `panel-warning` crea un componente visualmente distintivo que comunica claramente la necesidad de precaución.

## 🖌️ APLICACIONES PRÁCTICAS

### Ficha de Producto

:::panel{title="MacBook Pro" style="glass-panel" layout="float-left" width="30%"}
![MacBook](https://placeholder.com/350x200)

**Especificaciones:**
- Chip M2 Pro/Max
- Hasta 32GB RAM
- SSD hasta 8TB
- Pantalla Liquid Retina XDR
- Autonomía hasta 22h
:::

El nuevo MacBook Pro representa la culminación de años de innovación en Apple. Diseñado para profesionales creativos y desarrolladores, este portátil ofrece un rendimiento sin precedentes gracias a los nuevos chips M2 Pro y M2 Max.

La pantalla Liquid Retina XDR proporciona una precisión de color excepcional, con una relación de contraste de 1,000,000:1 y un brillo sostenido de 1000 nits. Esto la convierte en la opción ideal para edición de video HDR, fotografía profesional y desarrollo de aplicaciones.

El sistema de refrigeración rediseñado permite mantener el rendimiento máximo durante periodos prolongados, incluso en tareas intensivas como la renderización 3D o la compilación de código.

<div style="clear:both"></div>

### Tutorial Paso a Paso

:::panel{title="PASO 1" style="tech-corners" layout="float-left" width="45%" class="panel-info"}
### Configuración Inicial

1. Descarga la aplicación desde [example.com/download](https://example.com)
2. Instala el programa siguiendo las instrucciones del asistente
3. Abre la aplicación y navega a Configuración > Preferencias
4. Activa la opción de "Sincronización Automática"

![Configuración](https://placeholder.com/300x200)
:::

:::panel{title="PASO 2" style="tech-corners" layout="float-right" width="45%" class="panel-info"}
### Creación del Primer Proyecto

1. Haz clic en "Nuevo Proyecto" en la pantalla principal
2. Selecciona la plantilla "Básica" para comenzar
3. Asigna un nombre descriptivo a tu proyecto
4. Configura las dimensiones según tus necesidades

![Nuevo Proyecto](https://placeholder.com/300x200)
:::

<div style="clear:both"></div>

Para tutoriales paso a paso, el uso de paneles flotantes con estilos consistentes ayuda a segmentar la información de manera clara, permitiendo al usuario seguir la secuencia de acciones de forma intuitiva.

### Comparativa Visual

:::panel{title="Plan Básico" style="corner-brackets" layout="float-left" width="30%" class="panel-info"}
### $9.99/mes

- ✅ 5GB almacenamiento
- ✅ 1 usuario
- ✅ Soporte por email
- ❌ Características avanzadas
- ❌ Análisis de datos
- ❌ API acceso

**Ideal para:** Uso personal
:::

:::panel{title="Plan Profesional" style="corner-brackets" layout="float-left" width="30%" class="panel-success"}
### $29.99/mes

- ✅ 50GB almacenamiento
- ✅ 5 usuarios
- ✅ Soporte prioritario
- ✅ Características avanzadas
- ✅ Análisis básico
- ❌ API acceso

**Ideal para:** Pequeños equipos
:::

:::panel{title="Plan Empresarial" style="corner-brackets" layout="float-left" width="30%" class="panel-warning"}
### $99.99/mes

- ✅ 500GB almacenamiento
- ✅ Usuarios ilimitados
- ✅ Soporte 24/7
- ✅ Todas las características
- ✅ Análisis avanzado
- ✅ API acceso completo

**Ideal para:** Grandes organizaciones
:::

<div style="clear:both"></div>

Las tablas comparativas se benefician enormemente del uso de paneles flotantes con estilos y clases de color que ayudan a diferenciar visualmente las opciones. Mantener la consistencia en el estilo (`corner-brackets`) pero variando la clase de color según la categoría del plan ayuda al usuario a comparar rápidamente las opciones.

## 📱 RESPONSIVIDAD Y ADAPTACIÓN

:::panel{title="Diseño Adaptativo" style="neo-frame" class="panel-info"}
### Comportamiento Responsivo

Los paneles flotantes se adaptan automáticamente a diferentes tamaños de pantalla:

- **Escritorio:** Funcionan como columnas flotantes
- **Tablet:** Se ajustan proporcionalmente
- **Móvil:** Se convierten en bloques de ancho completo

Esto garantiza que tu contenido sea siempre legible y mantenga su jerarquía visual independientemente del dispositivo.
:::

El sistema de paneles está diseñado para ser completamente responsivo, adaptándose automáticamente a diferentes tamaños de pantalla. No necesitas preocuparte por cómo se verán tus diseños en dispositivos móviles, ya que el sistema se encargará de reorganizar el contenido de forma óptima.

## 🔮 CONCLUSIÓN

La combinación de diferentes estilos, layouts y clases te permite crear documentos visualmente ricos que comunican información de manera efectiva y atractiva. Experimentar con estas combinaciones te ayudará a desarrollar tu propio lenguaje visual para diferentes tipos de contenido.

Al dominar estas técnicas de diseño, podrás crear documentos que no solo transmiten información, sino que también guían al lector a través de ella de manera intuitiva y agradable. 