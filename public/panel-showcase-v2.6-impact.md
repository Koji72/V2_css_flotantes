# Showcase de Paneles V2.6 (Actualizado)

Este documento muestra todos los tipos y estilos de panel disponibles en la versión 2.6.

## 1. Tipos de Paneles Básicos

### Panel básico (tipo por defecto)
:::panel{title="Panel Estándar"}
Este es el tipo de panel predeterminado (:::panel).
- Versátil y neutro
- Base para todos los estilos
:::

### Panel de información
:::info{title="Información Importante"}
Este panel utiliza el tipo `:::info` para indicar información.
- Ideal para detalles relevantes
- Datos no críticos pero importantes
:::

### Panel de advertencia
:::warning{title="¡Atención!"}
Este panel utiliza el tipo `:::warning` para indicar una advertencia.
- Se utiliza para precauciones
- Situaciones que requieren atención
:::

### Panel de error
:::error{title="Error Crítico"}
Este panel utiliza el tipo `:::error` para indicar un problema grave.
- Errores que requieren acción inmediata
- Situaciones críticas
:::

### Panel de éxito
:::success{title="Operación Exitosa"}
Este panel utiliza el tipo `:::success` para indicar una operación completada correctamente.
- Confirmaciones positivas
- Logros y metas alcanzadas
:::

### Panel de nota
:::note{title="Nota Adicional"}
Este panel utiliza el tipo `:::note` para añadir contexto adicional.
- Notas complementarias
- Información secundaria
:::

## 2. Estilos de Paneles (Aplicables a cualquier tipo)

### Estilo Tech-Corners
:::panel{title="Esquinas Tecnológicas" style="tech-corners"}
Este panel utiliza el estilo `style="tech-corners"`.

| SECTOR | FRECUENCIA | POTENCIA | NOTAS |
|--------|------------|----------|-------|
| Proa   | 1.21 GHz   | 98%      | Estable |
| Popa   | 1.19 GHz   | 95%      | Fluctuación leve |
:::

### Estilo Holográfico
:::panel{title="Interfaz Holográfica" style="hologram"}
Este panel utiliza el estilo `style="hologram"`.

- Efecto de escaneo holográfico
- Líneas de ruido horizontal
:::

### Estilo Neo-Frame
:::panel{title="Marco Neón" style="neo-frame"}
Este panel utiliza el estilo `style="neo-frame"`.

> Diseño con bordes de neón que fluyen constantemente
:::

### Estilo Circuit-Nodes
:::panel{title="Nodos de Circuito" style="circuit-nodes"}
Este panel utiliza el estilo `style="circuit-nodes"`.

1. Diseño inspirado en placas de circuito
2. Nodos en las esquinas 
:::

### Estilo Cut-Corner
:::panel{title="Esquinas Cortadas" style="cut-corner"}
Este panel utiliza el estilo `style="cut-corner"`.

*Esquinas diagonales para un look futurista*
:::

### Estilo Corner-Bracket
:::panel{title="Soportes en Esquinas" style="corner-bracket"}
Este panel utiliza el estilo `style="corner-bracket"`.

**Soportes metálicos en las esquinas**
:::

### Estilo Glass
:::panel{title="Panel de Cristal" style="glass"}
Este panel utiliza el estilo `style="glass"`.

Efecto de cristal semitransparente
:::

## 3. Combinación de Tipos y Estilos

### Panel de advertencia con estilo Holográfico
:::warning{title="Alerta de Proximidad" style="hologram"}
Se detecta objeto no identificado en vector de aproximación.
Distancia estimada: 0.5 UAs
Status: **ALERTA AMARILLA**
:::

### Panel de error con estilo Tech-Corners
:::error{title="¡FALLO CRÍTICO!" style="tech-corners"}
| SISTEMA | ESTADO | INTEGRIDAD |
|---------|--------|------------|
| Núcleo de Energía | OFFLINE | 0% |
| Soporte Vital | CRÍTICO | 23% |
| Navegación | ERROR | 17% |
:::

### Panel de información con estilo Neo-Frame
:::info{title="Actualización de Sistema" style="neo-frame"}
Nuevas actualizaciones disponibles:
1. Kernel v4.78.2
2. Drivers navegación v2.31
3. Protocolos de seguridad v7.1

*Programación automática en: 4h 23m*
:::

## 4. Layouts en diferentes tipos de paneles

### Panel flotante izquierda
:::success{title="Misión Completada" style="corner-bracket" layout="float-left"}
- Objetivos primarios: ✓
- Objetivos secundarios: ✓
- Daños: Mínimos
:::

Este texto fluye alrededor del panel flotante a la izquierda, demostrando cómo se comportan los layouts con diferentes tipos de paneles. La combinación de tipos semánticos (success, warning, etc.) con estilos visuales (corner-bracket, tech-corners, etc.) y layouts permite crear documentos altamente informativos y visualmente atractivos.

### Panel flotante derecha
:::note{title="Mensaje del Capitán" style="cut-corner" layout="float-right"}
Recuerden mantener sus estaciones en alerta durante el próximo salto espacial.

*- Capitán Marcus*
:::

Este texto fluye alrededor del panel flotante a la derecha, mostrando cómo el texto principal puede interactuar de forma natural con los paneles laterales, independientemente del tipo o estilo aplicado al panel.

<div style="clear:both"></div>

## 5. Conclusión

Esta versión 2.6 ofrece:

1. Tipos semánticos: panel, info, warning, error, success, note
2. Estilos visuales: tech-corners, hologram, neo-frame, circuit-nodes, cut-corner, corner-bracket, glass
3. Layouts flexibles: float-left, float-right, center
4. Animaciones y efectos visuales
5. Total personalización y combinación de todas estas opciones 