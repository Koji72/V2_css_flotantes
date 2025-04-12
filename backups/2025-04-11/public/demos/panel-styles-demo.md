# Demostración de Estilos de Panel y Layouts

Este archivo muestra ejemplos de los diferentes tipos de paneles, estilos y layouts que puedes usar en el editor Markdown.

## Paneles con Diferentes Estilos

### Panel con Esquinas Cortadas

:::panel Panel Importante | style=cut-corners
Este panel tiene las esquinas cortadas, lo que le da un aspecto más dinámico y futurista.

- Punto importante uno
- Punto importante dos
- Punto importante tres
:::

### Panel con Soportes de Esquina

:::panel Instrucciones | style=corner-brackets
Pasos para completar la misión:

1. Localizar el objetivo
2. Establecer perímetro de seguridad
3. Proceder según el protocolo establecido
:::

### Panel de Cristal

:::panel Transmisión Entrante | style=glass-panel
> "Aquí base central. Informe de situación requerido. Cambio."

Este panel utiliza un efecto visual de cristal/vidrio que le da una apariencia más moderna y translúcida.
:::

## Paneles con Diferentes Layouts

### Panel Flotante a la Izquierda

:::panel Notas Rápidas | layout=float-left
Información que quieres que aparezca al lado del texto principal.

- Recordatorios
- Referencias rápidas
- Datos interesantes
:::

El texto principal continúa aquí y fluye alrededor del panel flotante. Esto es útil para incluir información complementaria que no interrumpa el flujo principal de la lectura. Puedes usarlo para añadir notas, referencias, explicaciones adicionales o cualquier dato que quieras mantener visible mientras el lector sigue el texto principal.

La presentación queda mucho más dinámica y permite una mejor organización visual de la información. Es especialmente útil cuando tienes contenido que está relacionado con el texto principal pero no forma parte directa de la narrativa.

### Panel Flotante a la Derecha

:::panel Estadísticas | layout=float-right
**Personaje:** Anya Petrova
**Nivel:** 7
**Clase:** Exploradora
**HP:** 45/60
**MP:** 35/40
:::

De manera similar, este texto fluye alrededor del panel que ahora está flotando a la derecha. Esta disposición te permite alternar paneles a la izquierda y derecha para crear un diseño más equilibrado e interesante visualmente.

Puedes incluir diferentes tipos de información en estos paneles flotantes, desde estadísticas de personajes hasta notas de campaña, reglas especiales o cualquier otro dato que quieras mantener visible y accesible mientras los jugadores leen el contenido principal.

### Panel Centrado

:::panel Información Destacada | layout=center
Este panel está centrado y tiene un ancho reducido, lo que lo hace perfecto para destacar información importante que quieres que llame la atención del lector en medio del documento.
:::

## Combinando Estilos y Layouts

Puedes combinar diferentes estilos y layouts para crear efectos visuales más interesantes:

:::panel Alerta Crítica | style=glass-panel,corner-brackets | layout=float-right
**¡ATENCIÓN!**

Sistema crítico comprometido:
- Escudos al 15%
- Sistemas auxiliares fuera de línea
- Evacuación recomendada
:::

Este panel combina el efecto de cristal con los soportes de esquina y además flota a la derecha, creando un elemento visual que destaca del resto del contenido.

:::datamatrix ESTADO DE SISTEMAS | style=cut-corners
| Sistema | Estado | Notas |
|---------|--------|-------|
| Propulsión | Nominal | 89% eficiencia |
| Navegación | Comprometido | Error en giroscopio |
| Comunicaciones | Offline | Antena dañada |
| Soporte vital | Crítico | 12h restantes |
:::

## Usando la Nueva Sintaxis

La nueva sintaxis para definir paneles personalizados es:

```
:::tipo título | style=valor1,valor2 | layout=valor | class=valor1 valor2
Contenido del panel
:::
```

Por ejemplo:

```
:::panel Título del Panel | style=glass-panel,corner-brackets | layout=float-right | class=custom-panel
Este panel combina múltiples estilos y layouts.

- Efecto de cristal/vidrio
- Soportes en las esquinas
- Flotando a la derecha
:::
```

Experimenta con diferentes combinaciones para encontrar el estilo visual que mejor se adapte a tus necesidades. 