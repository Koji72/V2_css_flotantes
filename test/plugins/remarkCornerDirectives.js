import { visit } from 'unist-util-visit';

const remarkCornerDirectives = () => {
  return (tree) => {
    visit(tree, (node) => {
      // Lista de directivas que procesamos
      const directiveNames = ['corner', 'T-edge', 'B-edge', 'L-edge', 'R-edge'];
      
      if (node.type === 'leafDirective' && directiveNames.includes(node.name)) {
        const attributes = node.attributes || {};

        // --- Lógica Común: Leer y Validar Atributos --- 
        let typeValue = attributes.type || '1';
        let offsetValue = 1; // Default offset for edge compensation
        const flipH = attributes.flipH === 'true';
        const flipV = attributes.flipV === 'true';
        let spanValue = null;

        // Validar typeValue
        let parsedTypeValue = parseInt(typeValue, 10);
        if (isNaN(parsedTypeValue) || parsedTypeValue <= 0) {
          console.warn(`[${node.name}] Tipo inválido '${typeValue}'. Se usará tipo '1'.`);
          typeValue = '1';
        }

        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});
        let offsetVarName = '';
        let classNames = '';

        // Default for corner
        if (node.name === 'corner') {
          const position = attributes.pos || 'top-left';
          offsetVarName = '--corner-offset'; 
          classNames = `panel-corner corner-pos--${position} corner-type-${typeValue}`;
          
          // Añadir clases de flip si están presentes
          if (flipH) classNames += ' corner-shape-flipped-h';
          if (flipV) classNames += ' corner-shape-flipped-v';
          
          // Añadir clase de offset para posicionamiento preciso
          if (offsetValue !== 0) {
            classNames += ` corner-offset-${offsetValue}`;
          }
        } else if (node.name === 'T-edge') {
          offsetVarName = '--edge-offset'; 
          classNames = `panel-edge edge-pos--top edge-type-${typeValue}`;
        } else if (node.name === 'B-edge') {
          offsetVarName = '--edge-offset';
          classNames = `panel-edge edge-pos--bottom edge-type-${typeValue}`;
        } else if (node.name === 'L-edge') {
          offsetVarName = '--edge-offset';
          classNames = `panel-edge edge-pos--left edge-type-${typeValue}`;
        } else if (node.name === 'R-edge') {
          offsetVarName = '--edge-offset';
          classNames = `panel-edge edge-pos--right edge-type-${typeValue}`;
        }

        hProperties.className = classNames;
        
        // Construir el string de estilo con variables CSS
        let styleString = `${offsetVarName}: ${-offsetValue}px;`;
        
        // Añadir span para edges si está presente
        if (spanValue !== null) {
          if (['T-edge', 'B-edge'].includes(node.name)) {
            styleString += ` --edge-span-width: ${spanValue};`;
          } else if (['L-edge', 'R-edge'].includes(node.name)) {
            styleString += ` --edge-span-height: ${spanValue};`;
          }
        }
        
        hProperties.style = styleString;
        hProperties['aria-hidden'] = 'true';
        data.hName = 'div';
      }
    });
  };
};

export default remarkCornerDirectives; 