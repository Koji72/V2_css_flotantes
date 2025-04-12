# Showcase de Paneles V2.6

Este documento muestra todos los estilos de panel mejorados disponibles en la versión 2.6.

## 1. Paneles básicos

:::panel{title="Panel Básico"}
Este es un panel sin estilo específico, utilizando el formato básico.

- Compatible con markdown completo
- Títulos, listas, tablas, etc.
:::

## 2. Paneles con esquinas tecnológicas

:::panel{title="Estado Escudo" style="tech-corners"}
| SECTOR | FRECUENCIA | POTENCIA | NOTAS |
|--------|------------|----------|-------|
| Proa   | 1.21 GHz   | 98%      | Estable |
| Popa   | 1.19 GHz   | 95%      | Fluctuación leve |
| Babor  | 1.20 GHz   | 100%     | Óptimo |
| Estribor | 1.22 GHz | 97%      | Estable |
:::

## 3. Paneles holográficos (Nuevo en V2.6)

:::panel{title="Interfaz Holográfica" style="hologram"}
| SISTEMA | ESTADO | INTEGRIDAD |
|---------|--------|------------|
| Navegación | Operativo | 100% |
| Propulsión | Operativo | 98% |
| Escudos | Alerta | 76% |
| Armas | Offline | 0% |

*Efecto de escaneo holográfico y líneas de ruido*
:::

## 4. Paneles Neo-Frame (Nuevo en V2.6)

:::panel{title="MATRIZ DE ANALÍTICA" style="neo-frame"}
## Informe de Vigilancia

Sistema detecta **anomalía dimensional** en sector 4.7.
Recomendación: Desplegar sondas de reconocimiento.

> Alerta de proximidad: Objeto no identificado en vector Z-19.
:::

## 5. Paneles de nodos de circuito

:::panel{title="Control de Sistemas" style="circuit-nodes"}
### Subsistemas críticos

1. Mantenimiento: **Programado**
2. Última revisión: *4.7.2184*
3. Próxima ventana: *12.8.2184*

```
SCAN: 847A-99FF
HASH: 0x422991ABCDEF
```
:::

## 6. Paneles con esquinas cortadas

:::panel{title="Informe Táctico" style="cut-corners"}
### Equipamiento desplegado

- Escuadra A: Sector Noroeste
- Escuadra B: Sector Este
- Escuadra C: Reserva táctica

*Todas las unidades reportan status completo.*
:::

## 7. Paneles con soporte en esquinas

:::panel{title="Comunicaciones" style="corner-brackets"}
### Mensajes recientes

| ORIGEN | PRIORIDAD | ESTADO |
|--------|-----------|--------|
| Base Centauri | Alta | Recibido |
| Nave Exploradora | Normal | Pendiente |
| Comando Central | Urgente | Leído |

*3 mensajes no leídos en cola de transmisión*
:::

## 8. Paneles de cristal

:::panel{title="Panel Transparente" style="glass-panel"}
Esta es una interfaz simulada con efecto de cristal/vidrio.

- Apariencia semitransparente
- Ideal para superposición sobre otras interfaces
- Estética futurista con bordes suaves
:::

## 9. Panel con esquinas personalizadas

:::panel{title="Diagnóstico de Sistemas" style="custom-corner"}
### Estado de Componentes

1. Núcleo de Energía: Estable (99.2%)
2. Matriz de Control: Nominal
3. Sistemas de Navegación: Optimizados
4. Comunicaciones: Señal Clara

*Todos los sistemas operan dentro de parámetros normales*
:::

## 10. Layouts y Disposiciones

:::panel{title="Panel Flotante Izquierda" style="tech-corners" layout="float-left"}
Panel que flota a la izquierda del contenido.

Permite que el texto fluya a su alrededor, creando diseños más dinámicos.
:::

Este texto fluye alrededor del panel flotante a la izquierda. Esto demuestra cómo los paneles pueden integrarse con el flujo de texto general de un documento, permitiendo diseños más complejos y visualmente atractivos. Los paneles flotantes son ideales para información complementaria, estadísticas, o notas al margen.

:::panel{title="Panel Flotante Derecha" style="hologram" layout="float-right"}
Panel que flota a la derecha del contenido.

También permite que el texto fluya a su alrededor, pero en el lado opuesto.
:::

Este texto fluye alrededor del panel holográfico flotante a la derecha. Al combinar estilos visuales con diferentes layouts, puedes crear documentos con una jerarquía visual clara y atractiva. Los paneles holográficos con su efecto de escaneo añaden un elemento dinámico a la interfaz.

<div style="clear:both"></div>

:::panel{title="Panel Centrado" style="neo-frame" layout="center"}
Este panel está centrado y tiene un ancho reducido.

Es perfecto para destacar información importante o crear puntos focales en el documento.
:::

## 11. Panel de Alerta

:::panel{title='¡ALERTA!' style="glass-panel" class="panel-warning"}
**¡ATENCIÓN!** - Sistema en estado crítico

El sistema reporta fallos múltiples:
- Sobrecalentamiento en el núcleo principal
- Fluctuaciones de energía en el sector 7
- Pérdida de presurización en cubierta 3

Tiempo estimado para fallo catastrófico: 15:00 minutos
:::

## Animaciones disponibles (V2.6)

:::panel{title="Efecto de Pulso" style="tech-corners"}
<div class="animate-pulse">
    Este contenido tiene una animación de pulso suave que cambia su opacidad rítmicamente.
</div>

Ideal para indicar elementos que requieren atención pero no son críticos.
:::

:::panel{title="Efecto de Rotación" style="neo-frame"}
<div style="display: flex; justify-content: center;">
    <div class="animate-rotate" style="width: 50px; height: 50px; border: 2px solid #00aaff; border-radius: 50%; border-top-color: transparent; margin: 20px;">
    </div>
</div>

Indicador de carga o procesamiento estilizado.
:::

## Combinación de Estilos

:::panel{title="Sistema Integrado" style="tech-corners,glass-panel" layout="float-right"}
Este panel combina múltiples estilos para efectos visuales avanzados.

**Características:**
- Esquinas tecnológicas
- Efecto de cristal
- Disposición flotante
:::

La combinación de múltiples estilos permite crear interfaces personalizadas que se adaptan perfectamente a las necesidades específicas del contenido. Esta flexibilidad es una de las principales mejoras de la versión 2.6, permitiendo un nivel de personalización sin precedentes.

<div style="clear:both"></div>

## Conclusión

Los paneles mejorados en V2.6 ofrecen:

1. Mayor impacto visual
2. Mejores animaciones y efectos
3. Más opciones de personalización
4. Experiencia de usuario mejorada
5. Compatibilidad total con versiones anteriores 