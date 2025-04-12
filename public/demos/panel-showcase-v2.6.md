# Demostración de Paneles V2.6

Este documento muestra los diferentes estilos de panel disponibles en la versión 2.6.

## Paneles Básicos

:::panel{title="Panel Básico"}
Este es un panel básico con soporte para **markdown** dentro del contenido.

- Lista de elementos
- Otro elemento
- Un tercer elemento
:::

## Estilos de Panel 

### Tech-Corners

:::panel{title="Estado del Sistema" | style=tech-corners}
| Sector | Frecuencia | Potencia | Notas |
|--------|------------|----------|-------|
| Alfa   | 1.21 GHz   | 98%      | Estable |
| Beta   | 1.19 GHz   | 95%      | Fluctuación leve |
| Gamma  | 1.20 GHz   | 100%     | Óptimo |
| Delta  | 1.22 GHz   | 97%      | Estable |
:::

### Holográfico

:::panel{title="Análisis del Sistema" | style=holographic}
## Escáner Activo
Iniciando secuencia de diagnóstico...
* Subsistema de navegación: **ONLINE**
* Sensores de proximidad: **ONLINE**
* Sistema de defensa: **PARCIAL**

> Efecto holográfico con sutil brillo y transparencia.
:::

### Flotante

:::panel{title="Informe Táctico" | style=floating}
La información táctica se presenta con un efecto de elevación sobre el resto del contenido.

Este diseño mejora la visibilidad de la información crítica.
:::

## Layouts de Panel

### Izquierda y Derecha

:::panel{title="Panel Izquierdo" | style=tech-corners | layout=left}
Este panel flotará a la izquierda del documento.

El texto fluirá alrededor de este panel.
:::

El texto principal del documento fluye alrededor de los paneles flotantes, creando una presentación dinámica y visualmente atractiva. Esto permite una mejor organización de la información y una experiencia de lectura más fluida.

:::panel{title="Panel Derecho" | style=holographic | layout=right}
Este panel flotará a la derecha del documento.

El texto también fluirá alrededor de este panel.
:::

Los paneles con posicionamiento flexible permiten crear diseños avanzados con distribución de información en varias columnas, mejorando significativamente la experiencia del usuario y la densidad de información presentada.

<div class="clearfix"></div>

### Centrado

:::panel{title="Información Importante" | layout=center}
Este panel está centrado y ocupa solo una parte del ancho disponible.

Ideal para destacar información crítica o mensajes importantes.
:::

## Animaciones

:::panel{title="Alerta del Sistema" | style=tech-corners | animation=pulse}
⚠️ **CRÍTICO**: Fallos detectados en múltiples subsistemas

Requiere atención inmediata del operador.
:::

## Combinación de Estilos

:::panel{title="Centro de Comando" | style=holographic | layout=center | animation=pulse}
# Estado de la Misión: EN PROGRESO

## Objetivos Completados: 2/5
- ✅ Establecer perímetro defensivo
- ✅ Inicializar sistemas principales
- ❌ Sincronizar bases de datos externas
- ❌ Activar protocolos de comunicación segura
- ❌ Verificar integridad de la red

> *La combinación de estilos crea paneles visualmente impactantes*
:::

## Mejoras en V2.6

La versión 2.6 incluye:

1. **Mayor impacto visual** - Mejores efectos visuales y contraste
2. **Animaciones mejoradas** - Más suaves y con mejor rendimiento
3. **Más opciones de personalización** - Nuevos estilos y atributos
4. **Mejor experiencia de usuario** - Diseño más intuitivo y responsive
5. **Compatible con versiones anteriores** - Funciona con documentos antiguos 