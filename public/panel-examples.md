# 📑 EJEMPLOS DE PANELES CSS FLOTANTES V2.6

Este documento contiene ejemplos prácticos de todos los tipos de paneles disponibles en la aplicación CSS Flotantes V2.6, con su sintaxis Markdown correspondiente.

## 🚀 PANELES BÁSICOS

### Panel Simple

**Markdown:**
```markdown
:::panel
## Panel Simple

Este es un panel básico sin estilos adicionales.
- Soporta Markdown completo
- Listas, enlaces, etc.
:::
```

**Resultado:**
:::panel
## Panel Simple

Este es un panel básico sin estilos adicionales.
- Soporta Markdown completo
- Listas, enlaces, etc.
:::

### Panel con Título

**Markdown:**
```markdown
:::panel{title="Panel con Título"}
Contenido del panel con título personalizado.

1. Elemento uno
2. Elemento dos
:::
```

**Resultado:**
:::panel{title="Panel con Título"}
Contenido del panel con título personalizado.

1. Elemento uno
2. Elemento dos
:::

## 🎨 ESTILOS DE PANELES

### Tech Corners

**Markdown:**
```markdown
:::panel{title="Datos del Sistema" style="tech-corners"}
| COMPONENTE | ESTADO | CAPACIDAD |
|------------|--------|-----------|
| CPU        | Activo | 78%       |
| Memoria    | Óptimo | 42%       |
| Red        | Alerta | 91%       |
:::
```

**Resultado:**
:::panel{title="Datos del Sistema" style="tech-corners"}
| COMPONENTE | ESTADO | CAPACIDAD |
|------------|--------|-----------|
| CPU        | Activo | 78%       |
| Memoria    | Óptimo | 42%       |
| Red        | Alerta | 91%       |
:::

### Holográfico

**Markdown:**
```markdown
:::panel{title="Pantalla Holográfica" style="hologram"}
## Análisis de Anomalía

Objeto no identificado detectado en sector 7G.
Recomendación: **Investigar inmediatamente**.

*Coordenadas: X-2471, Y-8935, Z-1242*
:::
```

**Resultado:**
:::panel{title="Pantalla Holográfica" style="hologram"}
## Análisis de Anomalía

Objeto no identificado detectado en sector 7G.
Recomendación: **Investigar inmediatamente**.

*Coordenadas: X-2471, Y-8935, Z-1242*
:::

### Neo-Frame

**Markdown:**
```markdown
:::panel{title="Informe de Energía" style="neo-frame"}
### Estado de Reactores

Reactor 1: `OPERATIVO` - Eficiencia: 97.3%
Reactor 2: `MANTENIMIENTO` - Eficiencia: 0%
Reactor 3: `OPERATIVO` - Eficiencia: 99.1%

> El mantenimiento del Reactor 2 finalizará en 3.5 horas
:::
```

**Resultado:**
:::panel{title="Informe de Energía" style="neo-frame"}
### Estado de Reactores

Reactor 1: `OPERATIVO` - Eficiencia: 97.3%
Reactor 2: `MANTENIMIENTO` - Eficiencia: 0%
Reactor 3: `OPERATIVO` - Eficiencia: 99.1%

> El mantenimiento del Reactor 2 finalizará en 3.5 horas
:::

### Glass Panel

**Markdown:**
```markdown
:::panel{title="Información Ambiental" style="glass-panel"}
## Condiciones Atmosféricas

- Temperatura: 22.7°C
- Humedad: 41%
- Presión: 1013 hPa
- Calidad del aire: Óptima

*Última actualización: hace 5 minutos*
:::
```

**Resultado:**
:::panel{title="Información Ambiental" style="glass-panel"}
## Condiciones Atmosféricas

- Temperatura: 22.7°C
- Humedad: 41%
- Presión: 1013 hPa
- Calidad del aire: Óptima

*Última actualización: hace 5 minutos*
:::

### Circuit Nodes

**Markdown:**
```markdown
:::panel{title="Diagnóstico de Circuitos" style="circuit-nodes"}
```
INICIO ESCANEO
  SECTOR A-7: OK
  SECTOR B-3: FALLO_PARCIAL
  SECTOR C-9: OK
FIN ESCANEO
```

Recomendación automática: Reemplazar módulo B-3-42
:::
```

**Resultado:**
:::panel{title="Diagnóstico de Circuitos" style="circuit-nodes"}
```
INICIO ESCANEO
  SECTOR A-7: OK
  SECTOR B-3: FALLO_PARCIAL
  SECTOR C-9: OK
FIN ESCANEO
```

Recomendación automática: Reemplazar módulo B-3-42
:::

### Cut Corners

**Markdown:**
```markdown
:::panel{title="Plan de Misión" style="cut-corners"}
### Objetivos Primarios

1. Infiltración en sistema principal
2. Extracción de datos objetivo
3. Eliminación de rastros digitales

Tiempo estimado: 87 segundos
:::
```

**Resultado:**
:::panel{title="Plan de Misión" style="cut-corners"}
### Objetivos Primarios

1. Infiltración en sistema principal
2. Extracción de datos objetivo
3. Eliminación de rastros digitales

Tiempo estimado: 87 segundos
:::

### Corner Brackets

**Markdown:**
```markdown
:::panel{title="Mensaje Cifrado" style="corner-brackets"}
**DE:** Agente Shadow
**PARA:** Central

Infiltración completada. Datos asegurados.
Requiero extracción en punto ALFA a las 0300.

*Este mensaje se autodestruirá*
:::
```

**Resultado:**
:::panel{title="Mensaje Cifrado" style="corner-brackets"}
**DE:** Agente Shadow
**PARA:** Central

Infiltración completada. Datos asegurados.
Requiero extracción en punto ALFA a las 0300.

*Este mensaje se autodestruirá*
:::

## 🌊 LAYOUTS FLOTANTES

### Flotante a la Izquierda

**Markdown:**
```markdown
:::panel{title="Panel a la Izquierda" style="tech-corners" layout="float-left"}
Este panel flota a la izquierda.
- Permite que el texto fluya a su derecha
- Ideal para información complementaria
- Mantiene buen flujo de lectura
:::
```

**Resultado:**
:::panel{title="Panel a la Izquierda" style="tech-corners" layout="float-left"}
Este panel flota a la izquierda.
- Permite que el texto fluya a su derecha
- Ideal para información complementaria
- Mantiene buen flujo de lectura
:::

Este es el texto principal que fluye alrededor del panel flotante a la izquierda. Los paneles flotantes son excelentes para crear diseños más dinámicos y atractivos visualmente. Permiten presentar información complementaria sin interrumpir el flujo narrativo principal del documento.

### Flotante a la Derecha

**Markdown:**
```markdown
:::panel{title="Panel a la Derecha" style="neo-frame" layout="float-right"}
Este panel flota a la derecha.
1. El texto principal fluye a su izquierda
2. Perfecto para notas, definiciones o datos
3. Mejora la presentación visual
:::
```

**Resultado:**
:::panel{title="Panel a la Derecha" style="neo-frame" layout="float-right"}
Este panel flota a la derecha.
1. El texto principal fluye a su izquierda
2. Perfecto para notas, definiciones o datos
3. Mejora la presentación visual
:::

El texto principal puede fluir cómodamente a la izquierda de un panel flotante a la derecha. Esta disposición es especialmente útil cuando el contenido principal debe destacar y el panel proporciona información adicional o de referencia que el lector puede consultar según sea necesario.

<div style="clear:both"></div>

### Centrado

**Markdown:**
```markdown
:::panel{title="Panel Centrado" style="glass-panel" layout="center"}
Este panel aparece centrado en la página con ancho reducido.

Es ideal para destacar información crítica o crear separación visual entre secciones.
:::
```

**Resultado:**
:::panel{title="Panel Centrado" style="glass-panel" layout="center"}
Este panel aparece centrado en la página con ancho reducido.

Es ideal para destacar información crítica o crear separación visual entre secciones.
:::

## 🌈 ESTADOS Y COLORES

### Panel de Alerta

**Markdown:**
```markdown
:::panel{title="¡ALERTA!" style="circuit-nodes" class="panel-warning"}
## ⚠️ SISTEMA COMPROMETIDO

- Detectada intrusión en el núcleo central
- Aislando sectores afectados
- Iniciando protocolo de defensa OMEGA-7

Tiempo estimado para contención: 3:45 minutos
:::
```

**Resultado:**
:::panel{title="¡ALERTA!" style="circuit-nodes" class="panel-warning"}
## ⚠️ SISTEMA COMPROMETIDO

- Detectada intrusión en el núcleo central
- Aislando sectores afectados
- Iniciando protocolo de defensa OMEGA-7

Tiempo estimado para contención: 3:45 minutos
:::

### Panel de Éxito

**Markdown:**
```markdown
:::panel{title="Operación Completada" style="corner-brackets" class="panel-success"}
✅ Todos los objetivos alcanzados

| Objetivo | Estado |
|----------|--------|
| Alpha | Completado |
| Beta | Completado |
| Gamma | Completado |

Recursos utilizados: 78% de lo asignado
:::
```

**Resultado:**
:::panel{title="Operación Completada" style="corner-brackets" class="panel-success"}
✅ Todos los objetivos alcanzados

| Objetivo | Estado |
|----------|--------|
| Alpha | Completado |
| Beta | Completado |
| Gamma | Completado |

Recursos utilizados: 78% de lo asignado
:::

### Panel de Error

**Markdown:**
```markdown
:::panel{title="Error Fatal" style="cut-corners" class="panel-error"}
## 🚫 FALLÓ LA INICIALIZACIÓN

```
ERROR_CODE: 0xFE372A1
STACK_TRACE: 
  - SystemInit.exe (0x8700)
  - MemoryAlloc.dll (0x9103)
```

*Contacte al administrador del sistema*
:::
```

**Resultado:**
:::panel{title="Error Fatal" style="cut-corners" class="panel-error"}
## 🚫 FALLÓ LA INICIALIZACIÓN

```
ERROR_CODE: 0xFE372A1
STACK_TRACE: 
  - SystemInit.exe (0x8700)
  - MemoryAlloc.dll (0x9103)
```

*Contacte al administrador del sistema*
:::

### Panel de Información

**Markdown:**
```markdown
:::panel{title="Nota Importante" style="tech-corners" class="panel-info"}
ℹ️ Este panel proporciona información contextual importante.

**Relevante para:** Todos los usuarios
**Acción requerida:** Ninguna, solo informativo
**Caducidad:** Esta información es válida hasta 2025-06-30
:::
```

**Resultado:**
:::panel{title="Nota Importante" style="tech-corners" class="panel-info"}
ℹ️ Este panel proporciona información contextual importante.

**Relevante para:** Todos los usuarios
**Acción requerida:** Ninguna, solo informativo
**Caducidad:** Esta información es válida hasta 2025-06-30
:::

## ✨ ANIMACIONES

### Animación de Pulso

**Markdown:**
```markdown
:::panel{title="Notificación" style="glass-panel" animation="pulse"}
Este panel tiene una animación de pulso que capta la atención.

Perfecto para notificaciones importantes o información crítica.
:::
```

**Resultado:**
:::panel{title="Notificación" style="glass-panel" animation="pulse"}
Este panel tiene una animación de pulso que capta la atención.

Perfecto para notificaciones importantes o información crítica.
:::

### Animación de Escaneo

**Markdown:**
```markdown
:::panel{title="Escaneando" style="hologram" animation="scan"}
## ESCÁNER BIOMÉTRICO ACTIVO

Realizando análisis completo...
- Retina: Verificada
- Huella: Verificada
- Voz: En progreso

*No mueva el dispositivo durante el escaneo*
:::
```

**Resultado:**
:::panel{title="Escaneando" style="hologram" animation="scan"}
## ESCÁNER BIOMÉTRICO ACTIVO

Realizando análisis completo...
- Retina: Verificada
- Huella: Verificada
- Voz: En progreso

*No mueva el dispositivo durante el escaneo*
:::

### Animación de Resplandor

**Markdown:**
```markdown
:::panel{title="Energía Activa" style="neo-frame" animation="glow"}
### NÚCLEO DE ENERGÍA EN LÍNEA

Nivel actual: █████████ 97%
Temperatura: Óptima
Estado: Estable

*El núcleo está operando a máxima eficiencia*
:::
```

**Resultado:**
:::panel{title="Energía Activa" style="neo-frame" animation="glow"}
### NÚCLEO DE ENERGÍA EN LÍNEA

Nivel actual: █████████ 97%
Temperatura: Óptima
Estado: Estable

*El núcleo está operando a máxima eficiencia*
:::

## 🧩 COMBINACIONES AVANZADAS

### Múltiples Estilos

**Markdown:**
```markdown
:::panel{title="Panel Multi-estilo" style="tech-corners,glass-panel" layout="float-right" animation="pulse" class="panel-info"}
Este panel combina:
- Esquinas tecnológicas
- Efecto de cristal
- Flotante a la derecha
- Animación de pulso
- Clase de información

Ideal para casos donde necesitas un diseño verdaderamente personalizado.
:::
```

**Resultado:**
:::panel{title="Panel Multi-estilo" style="tech-corners,glass-panel" layout="float-right" animation="pulse" class="panel-info"}
Este panel combina:
- Esquinas tecnológicas
- Efecto de cristal
- Flotante a la derecha
- Animación de pulso
- Clase de información

Ideal para casos donde necesitas un diseño verdaderamente personalizado.
:::

Los paneles con múltiples estilos te permiten alcanzar un nivel de personalización muy alto, combinando las mejores características de varios diseños. Esto es particularmente útil cuando necesitas crear interfaces altamente especializadas para tipos específicos de información.

<div style="clear:both"></div>

### Panel con Ancho Personalizado

**Markdown:**
```markdown
:::panel{title="Panel Ancho" style="corner-brackets" width="85%"}
Este panel tiene un ancho personalizado del 85% de su contenedor.

Los paneles con ancho personalizado son útiles para:
1. Destacar contenido importante
2. Crear diseños con proporciones específicas
3. Mejorar la legibilidad de tablas o gráficos grandes
:::
```

**Resultado:**
:::panel{title="Panel Ancho" style="corner-brackets" width="85%"}
Este panel tiene un ancho personalizado del 85% de su contenedor.

Los paneles con ancho personalizado son útiles para:
1. Destacar contenido importante
2. Crear diseños con proporciones específicas
3. Mejorar la legibilidad de tablas o gráficos grandes
:::

### Panel Flotante con Ancho

**Markdown:**
```markdown
:::panel{title="Ficha de Personaje" style="tech-corners" layout="float-left" width="30%"}
## Azura Nightwalker

**Clase:** Infiltradora Tecnomágica
**Nivel:** 17
**Especialidad:** Hackeo Neuronal

### Atributos
- Fuerza: 12
- Agilidad: 18
- Intelecto: 20
- Presencia: 15

*"La información es poder, y yo controlo ambos."*
:::
```

**Resultado:**
:::panel{title="Ficha de Personaje" style="tech-corners" layout="float-left" width="30%"}
## Azura Nightwalker

**Clase:** Infiltradora Tecnomágica
**Nivel:** 17
**Especialidad:** Hackeo Neuronal

### Atributos
- Fuerza: 12
- Agilidad: 18
- Intelecto: 20
- Presencia: 15

*"La información es poder, y yo controlo ambos."*
:::

Los paneles flotantes con ancho personalizado permiten un control aún mayor sobre la presentación del contenido. En este caso, la ficha de personaje ocupa solo el 30% del ancho, dejando mucho espacio para que el texto principal fluya a su alrededor. Este tipo de diseño es ideal para fichas de referencia, resúmenes de personajes, o cualquier información compacta que deba estar visible mientras se lee el contenido principal.

El sistema de juego "Cyberdimension X" utiliza un enfoque basado en atributos para determinar las capacidades de los personajes. Cada atributo tiene un valor base entre 3 y 20, con 10 siendo el promedio humano. Azura claramente destaca en Intelecto y Agilidad, lo que la convierte en una especialista ideal para misiones de infiltración digital y espionaje de alta tecnología.

Su especialidad en Hackeo Neuronal le permite conectarse directamente a sistemas neurales artificiales e incluso interfases cerebrales humanas mejoradas, una habilidad extremadamente valorada en el mundo distópico de CyberNexus 2099.

<div style="clear:both"></div>

## 📊 PANELES DE DATOS

### Panel de Matriz de Datos

**Markdown:**
```markdown
:::datamatrix Rendimiento del Sistema
| Componente | Estado | Carga | Temperatura |
|------------|--------|-------|------------|
| CPU        | Óptimo | 42%   | 58°C       |
| GPU        | Óptimo | 27%   | 62°C       |
| RAM        | Alerta | 89%   | 45°C       |
| SSD        | Óptimo | 51%   | 38°C       |
:::
```

**Resultado:**
:::datamatrix Rendimiento del Sistema
| Componente | Estado | Carga | Temperatura |
|------------|--------|-------|------------|
| CPU        | Óptimo | 42%   | 58°C       |
| GPU        | Óptimo | 27%   | 62°C       |
| RAM        | Alerta | 89%   | 45°C       |
| SSD        | Óptimo | 51%   | 38°C       |
:::

### Panel de Bloc de Estadísticas

**Markdown:**
```markdown
:::statblock Unidad de Combate MK-7
| Característica | Valor |
|---------------|-------|
| Nombre | Destructor Táctico MK-7 |
| Clase | Unidad de Asalto Pesado |
| Blindaje | 85/100 |
| Armamento | Cañón de Plasma, Lanzamisiles |
| Movilidad | 35/100 |
| Autonomía | 72 horas |
:::
```

**Resultado:**
:::statblock Unidad de Combate MK-7
| Característica | Valor |
|---------------|-------|
| Nombre | Destructor Táctico MK-7 |
| Clase | Unidad de Asalto Pesado |
| Blindaje | 85/100 |
| Armamento | Cañón de Plasma, Lanzamisiles |
| Movilidad | 35/100 |
| Autonomía | 72 horas |
:::

## 📝 NOTAS Y BLOQUES ESPECIALES

### Bloque de Nota

**Markdown:**
```markdown
:::note
Esta es una nota importante que merece atención especial.

Puede contener múltiples párrafos y elementos de formato como **negrita** o *cursiva*.
:::
```

**Resultado:**
:::note
Esta es una nota importante que merece atención especial.

Puede contener múltiples párrafos y elementos de formato como **negrita** o *cursiva*.
:::

### Cita Destacada

**Markdown:**
```markdown
:::quote
"En la era digital, la información es más valiosa que cualquier recurso físico. Quien controla los datos, controla el futuro."

— Dr. Alexei Kurzweil, Director de Investigación Cuántica
:::
```

**Resultado:**
:::quote
"En la era digital, la información es más valiosa que cualquier recurso físico. Quien controla los datos, controla el futuro."

— Dr. Alexei Kurzweil, Director de Investigación Cuántica
:::

## 🎬 CONCLUSIÓN

Estos ejemplos muestran la versatilidad y potencia del sistema de paneles en CSS Flotantes V2.6. Experimenta combinando diferentes estilos, layouts y animaciones para crear documentos visualmente impactantes y bien organizados.

Recuerda que puedes consultar este documento como referencia mientras trabajas en tus propios proyectos. 