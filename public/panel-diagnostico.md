# Diagnóstico de Paneles con Esquinas Cortadas

## Método 1: Clase directa

:::panel{class="tech-corners" layout="float-right" width="40%"}
### Panel Test 1 - Clase directa

Este panel utiliza `class="tech-corners"` directamente como atributo.

Si esto funciona pero otros métodos no, indica que el problema está en cómo se procesan diferentes formas de especificar clases.
:::

## Método 2: Estilo definido

:::panel{style="tech-corners" layout="float-left" width="40%"}
### Panel Test 2 - Estilo definido

Este panel utiliza `style="tech-corners"` como atributo.

Si esto funciona pero el método 1 no, indica que el sistema prioriza estilos sobre clases directas.
:::

<div style="clear:both"></div>

## Método 3: Usando panel-style

:::panel{style="panel-style--tech-corners" layout="float-right" width="40%"}
### Panel Test 3 - Panel-style completo

Este panel utiliza la clase completa `style="panel-style--tech-corners"`.

Si esto funciona pero los métodos anteriores no, indica que se espera el prefijo panel-style--.
:::

## Método 4: Usando sintaxis corta

:::tech-corners{layout="float-left" width="40%"}
### Panel Test 4 - Sintaxis corta

Este panel usa la sintaxis abreviada directamente en el tipo de panel.

Si esto funciona pero otros métodos no, indica un problema en la herencia de clases.
:::

<div style="clear:both"></div>

## Método 5: Mezclando atributos

:::panel{class="tech-corners" style="primary" layout="float-right" width="40%"}
### Panel Test 5 - Clase y estilo

Este panel mezcla `class="tech-corners"` con `style="primary"`.

Si esto funciona parcialmente (muestra primary pero no tech-corners), hay un conflicto entre estilos.
:::

## Método 6: Usando cut-corners

:::panel{style="cut-corners" layout="float-left" width="40%"}
### Panel Test 6 - Estilo cut-corners

Este panel prueba otra variante de esquinas cortadas con `style="cut-corners"`.

Si este funciona pero tech-corners no, indica una falta de consistencia en las definiciones CSS.
:::

<div style="clear:both"></div>

## Método 7: Con class y atributo data

:::panel{class="tech-corners" data-debug="true" layout="float-right" width="40%"}
### Panel Test 7 - Con atributo data

Este panel agrega un atributo data-debug para verificar si afecta al procesamiento.
:::

## Método 8: Sintaxis alternativa

:::panel
class="tech-corners" 
layout="float-left" 
width="40%"
:::
### Panel Test 8 - Sintaxis multilinea

Este panel usa sintaxis multilinea con cada atributo en una línea separada.

Si este funciona pero otros no, indica un problema con el parser de atributos.
::: 