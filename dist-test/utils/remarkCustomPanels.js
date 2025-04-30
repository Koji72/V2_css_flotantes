"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unist_util_visit_1 = require("unist-util-visit");
const remarkCustomPanels = () => {
    return (tree) => {
        (0, unist_util_visit_1.visit)(tree, 'containerDirective', (node) => {
            if (node.name === 'panel') {
                const attributes = node.attributes || {};
                const layout = attributes.layout;
                const style = attributes.style;
                const title = attributes.title;
                const directiveClass = attributes.class;
                const data = node.data || (node.data = {});
                const hProperties = data.hProperties || (data.hProperties = {});
                let finalClasses = new Set();
                if (directiveClass && typeof directiveClass === 'string') {
                    directiveClass.split(' ').forEach(cls => cls.trim() && finalClasses.add(cls));
                }
                finalClasses.add('panel');
                if (layout && typeof layout === 'string') {
                    finalClasses.add(`layout--${layout.trim()}`);
                }
                if (style && typeof style === 'string') {
                    finalClasses.add(`panel-style--${style.trim()}`);
                }
                hProperties.className = Array.from(finalClasses);
                // Insertar título como primer hijo si existe
                if (title && typeof title === 'string') {
                    const titleMdastNode = {
                        type: 'heading',
                        depth: 4,
                        data: {
                            hName: 'h4',
                            hProperties: { className: 'panel-title' },
                        },
                        children: [{ type: 'text', value: title }]
                    };
                    const currentChildren = node.children || [];
                    node.children = [titleMdastNode, ...currentChildren];
                }
                // Limpieza del ::: final (Versión mejorada)
                if (node.children && node.children.length > 0) {
                    const numChildren = node.children.length;
                    const startIndex = Math.max(0, numChildren - 3);
                    // Función auxiliar para limpiar el marcador ::: de un nodo de texto
                    const cleanClosingMarker = (textNode) => {
                        if (typeof textNode.value === 'string') {
                            const originalValue = textNode.value;
                            const trimmedEndValue = originalValue.trimEnd();
                            if (trimmedEndValue.endsWith(':::')) {
                                const lastIndex = originalValue.lastIndexOf(':::');
                                textNode.value = originalValue.slice(0, lastIndex);
                                return true;
                            }
                            else if (trimmedEndValue === ':::') {
                                textNode.value = '';
                                return true;
                            }
                        }
                        return false;
                    };
                    // Recorrer los hijos desde el final
                    for (let i = numChildren - 1; i >= startIndex; i--) {
                        const childNode = node.children[i];
                        if (childNode.type === 'paragraph' && childNode.children) {
                            let markerFound = false;
                            // Recorrer los hijos del párrafo desde el final
                            for (let j = childNode.children.length - 1; j >= 0; j--) {
                                const inlineNode = childNode.children[j];
                                if (inlineNode.type === 'text') {
                                    markerFound = cleanClosingMarker(inlineNode);
                                    // Si el nodo quedó vacío, eliminarlo
                                    if (markerFound && !inlineNode.value.trim()) {
                                        childNode.children.splice(j, 1);
                                    }
                                    if (markerFound)
                                        break;
                                }
                            }
                            // Si el párrafo quedó vacío, eliminarlo
                            if (markerFound && childNode.children.length === 0) {
                                node.children.splice(i, 1);
                                i--;
                            }
                            if (markerFound)
                                break;
                        }
                    }
                }
                data.hName = 'div'; // Siempre es div en esta versión
            }
        });
    };
};
exports.default = remarkCustomPanels;
