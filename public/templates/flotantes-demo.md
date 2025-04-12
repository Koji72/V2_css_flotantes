# Demostración de Elementos Flotantes

Este documento muestra cómo usar los nuevos elementos flotantes en tus documentos. Los flotantes son cajas que pueden posicionarse a la izquierda, derecha o centro del texto, permitiendo crear diseños más dinámicos.

<div class="flotante flotante--izquierda">
  <div class="flotante__titulo">Flotante Izquierda</div>
  <p>Este es un elemento flotante básico posicionado a la izquierda. El texto fluirá alrededor de este elemento.</p>
  <p>Perfecto para notas laterales, estadísticas o información complementaria.</p>
</div>

## Flujo de texto con flotantes

El texto principal fluye naturalmente alrededor de los elementos flotantes, creando un diseño más interesante y dinámico. Esto es especialmente útil para documentos largos donde quieres mantener el interés visual del lector.

Los elementos flotantes pueden contener cualquier tipo de contenido HTML, incluyendo listas, tablas, imágenes y más.

<div class="flotante flotante--derecha flotante--tech">
  <div class="flotante__titulo">Flotante Tecnológico</div>
  <p>Este flotante usa el estilo "tech" con un borde gradiente.</p>
  <ul>
    <li>Compatible con listas</li>
    <li>Posicionado a la derecha</li>
    <li>Estilo tecnológico</li>
  </ul>
</div>

Puedes seguir escribiendo tu contenido normalmente, y el texto continuará fluyendo alrededor de los elementos flotantes. Cuando quieras que el texto empiece debajo de todos los flotantes, puedes usar un elemento con la clase `clearfix`.

<div class="clearfix"></div>

## Estilos de flotantes

Hay varios estilos disponibles para los flotantes:

<div class="flotante flotante--centro flotante--glass">
  <div class="flotante__titulo">Flotante Centrado con Efecto Cristal</div>
  <p>Este flotante está centrado y usa el estilo "glass" que crea un efecto semi-transparente con desenfoque de fondo.</p>
  <p>Ideal para destacar contenido importante en el centro del documento.</p>
</div>

### Flotante con esquinas recortadas

<div class="flotante flotante--izquierda flotante--recortado">
  <div class="flotante__titulo">Esquinas Recortadas</div>
  <p>Este flotante utiliza el estilo "recortado" que elimina las esquinas para un aspecto más técnico.</p>
</div>

El estilo recortado da un toque futurista a tus elementos flotantes, perfecto para interfaces de tipo sci-fi o informes técnicos.

<div class="clearfix"></div>

## Animaciones

<div class="flotante flotante--derecha flotante--pulse">
  <div class="flotante__titulo">Flotante con Animación</div>
  <p>Este flotante incluye una animación de pulso que lo hace resaltar sutilmente.</p>
  <p>Útil para llamar la atención sobre información crítica.</p>
</div>

Las animaciones deben usarse con moderación para no distraer al lector. El efecto de pulso es sutil pero efectivo para destacar información importante.

## Responsividad

Todos los elementos flotantes son completamente responsivos. En pantallas pequeñas (menos de 768px), los flotantes ocuparán el ancho completo y se mostrarán uno debajo del otro, en lugar de flotar a los lados.

<div class="clearfix"></div>

## Combinación de estilos

<div class="flotante flotante--centro flotante--tech flotante--recortado">
  <div class="flotante__titulo">Combinación de Estilos</div>
  <p>Puedes combinar diferentes clases para crear estilos únicos, como este ejemplo que combina el estilo tech con esquinas recortadas.</p>
</div>

## Conclusión

Los elementos flotantes son una forma sencilla pero efectiva de mejorar el diseño de tus documentos sin necesidad de conocimientos avanzados de CSS. Simplemente incluye el archivo CSS y utiliza las clases apropiadas en tus elementos div. 