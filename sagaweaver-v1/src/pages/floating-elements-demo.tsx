import React from 'react';
import FloatingElement from '../components/FloatingElement';
import SplitColumns, { ColumnBreak } from '../components/SplitColumns';
import '../styles/floating-elements.css';

const FloatingElementsDemo = () => {
  return (
    <div className="container mx-auto p-6 bg-gray-900 text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Demostración de Elementos Flotantes y Columnas</h1>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Elementos Flotantes</h2>
        
        <div className="prose prose-invert max-w-none mb-8">
          <FloatingElement 
            position="left" 
            style="tech" 
            title="Panel Tecnológico" 
            width="35%"
          >
            <p>Este panel flotante utiliza un estilo tecnológico con bordes de neón y efectos de fondo sutiles.</p>
            <ul>
              <li>Indicador de sistemas: Operativo</li>
              <li>Estado de la red: Online</li>
              <li>Firewall: Activo</li>
            </ul>
          </FloatingElement>
          
          <p>Los elementos flotantes permiten crear diseños más dinámicos donde el texto fluye alrededor del contenido. Esto es especialmente útil para presentar información complementaria sin interrumpir el flujo principal de lectura.</p>
          
          <p>La capacidad de crear estos elementos con diferentes estilos y posiciones nos permite adaptar la interfaz a distintos contextos y necesidades narrativas. Por ejemplo, una interfaz futurista podría usar paneles tecnológicos, mientras que un tema más místico podría utilizar elementos con estilo de pergamino.</p>
          
          <p>Además, cada elemento puede tener su propio encabezado, lo que facilita la identificación del contenido y mejora la estructura visual del documento.</p>
          
          <FloatingElement 
            position="right" 
            style="hologram" 
            title="Proyección Holográfica" 
            width="40%" 
            animation="pulse"
          >
            <p>Los paneles holográficos simulan una proyección tridimensional con un efecto de pulso sutil que da sensación de vida.</p>
            <div className="text-center my-2">
              <div className="inline-block p-2 bg-blue-900/30 rounded">
                HOLOPROYECCIÓN ESTABLE
              </div>
            </div>
          </FloatingElement>
          
          <p>Otra ventaja importante es la capacidad de ajustar el ancho de estos elementos según las necesidades del diseño. Los elementos más estrechos pueden usarse para notas al margen, mientras que los más anchos pueden servir para destacar información importante.</p>
          
          <p>La implementación responsiva garantiza que en dispositivos móviles, donde el espacio es limitado, los elementos se reorganicen para mantener la legibilidad del contenido sin sacrificar el diseño.</p>
          
          <p>También podemos aplicar diferentes animaciones a estos elementos para llamar la atención del usuario o indicar diferentes estados de la información mostrada.</p>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Elementos Centrados</h2>
        
        <div className="prose prose-invert max-w-none mb-8">
          <p>Los elementos centrados son perfectos para destacar información crítica que merece atención especial. A diferencia de los elementos flotantes laterales, estos rompen el flujo del texto para crear un punto focal.</p>
          
          <FloatingElement 
            position="center" 
            style="circuit" 
            title="Alerta de Sistema" 
            width="70%" 
            animation="fade"
          >
            <div className="text-center">
              <p className="font-bold text-red-400">⚠️ ADVERTENCIA ⚠️</p>
              <p>Se ha detectado una intrusión en el sector 7-G.</p>
              <p>Nivel de amenaza: Alto</p>
            </div>
          </FloatingElement>
          
          <p>Después de un elemento centrado, el texto continúa su flujo normal. Esto permite crear pausas intencionales en la narrativa para enfatizar ciertos puntos.</p>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Columnas Divididas</h2>
        
        <SplitColumns style="tech" columns={2} gap="2.5rem">
          <h3 className="text-xl font-bold mb-3">Ventajas del sistema de columnas</h3>
          
          <p>El sistema de columnas permite organizar grandes cantidades de texto de manera más eficiente, mejorando la legibilidad y aprovechando mejor el espacio disponible en pantalla.</p>
          
          <p>Este formato es ideal para:</p>
          <ul>
            <li>Manuales de referencia</li>
            <li>Libros de reglas</li>
            <li>Catálogos de contenido</li>
            <li>Descripciones extensas</li>
          </ul>
          
          <p>Además, las columnas pueden contener todo tipo de elementos como listas, tablas e imágenes, manteniendo un formato coherente.</p>
          
          <ColumnBreak />
          
          <h3 className="text-xl font-bold mb-3">Configuración de columnas</h3>
          
          <p>El componente de columnas es altamente personalizable:</p>
          
          <ul>
            <li><strong>Número de columnas:</strong> 2 o 3 columnas según el contenido</li>
            <li><strong>Espaciado:</strong> Ajustable para diferentes densidades de información</li>
            <li><strong>Estilos temáticos:</strong> Diversos temas visuales que se adaptan al contexto</li>
          </ul>
          
          <p>En dispositivos móviles, las columnas se convierten automáticamente en una sola para mantener la legibilidad en pantallas pequeñas.</p>
          
          <p>El componente también incluye un elemento <code>ColumnBreak</code> que permite forzar saltos de columna en puntos específicos, dando control completo sobre la distribución del contenido.</p>
        </SplitColumns>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Combinando Elementos</h2>
        
        <div className="prose prose-invert max-w-none">
          <p>Para crear diseños realmente dinámicos, podemos combinar elementos flotantes con texto normal y otros componentes.</p>
          
          <FloatingElement 
            position="left" 
            style="glass" 
            title="Nota del Autor" 
            width="30%"
          >
            <p className="italic">Este sistema de elementos flotantes fue diseñado para ofrecer flexibilidad sin sacrificar la coherencia visual.</p>
          </FloatingElement>
          
          <p>El objetivo principal de estos componentes es proporcionar herramientas flexibles para crear documentos interactivos que sean tanto funcionales como estéticamente agradables.</p>
          
          <p>Cada estilo está diseñado para ser coherente con el resto, pero al mismo tiempo ofrecer suficiente variedad para adaptarse a diferentes contextos narrativos y funcionales.</p>
          
          <p>La implementación técnica prioriza la simplicidad y la reutilización, siguiendo las mejores prácticas de desarrollo de componentes React y NextJS.</p>
          
          <FloatingElement 
            position="right" 
            style="neo" 
            title="Próximas Mejoras" 
            width="35%"
          >
            <ul>
              <li>Más opciones de animación</li>
              <li>Integración con temas personalizados</li>
              <li>Opciones avanzadas de posicionamiento</li>
              <li>Interactividad mejorada</li>
            </ul>
          </FloatingElement>
          
          <p>Con estos componentes, buscamos facilitar la creación de interfaces de usuario que no solo comuniquen información de manera efectiva, sino que también proporcionen una experiencia visualmente atractiva y coherente.</p>
          
          <p>La flexibilidad del sistema permite adaptarse a diferentes contextos y necesidades, desde interfaces de usuario futuristas hasta documentos con estilo más tradicional.</p>
        </div>
      </div>
    </div>
  );
};

export default FloatingElementsDemo; 