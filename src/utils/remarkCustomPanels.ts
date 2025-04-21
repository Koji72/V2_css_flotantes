import { visit } from 'unist-util-visit';
// Importar tipos correctos de mdast y mdast-util-directive
import type { Root, Parent, Content, Text, Paragraph } from 'mdast';
import type { ContainerDirective } from 'mdast-util-directive';
import type { Plugin } from 'unified';
import { h } from 'hastscript';

// Ya no necesitamos nuestras interfaces Node/DirectiveNode

const remarkCustomPanels: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      if (node.name === 'panel') {
        const attributes = node.attributes || {};
        const layout = attributes.layout;
        const style = attributes.style;
        const title = attributes.title;
        const directiveClass = attributes.class;

        const data = node.data || (node.data = {});
        const hProperties = data.hProperties || (data.hProperties = {});

        let finalClasses: Set<string> = new Set();
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

        if (title && typeof title === 'string') {
          if (!node.children) {
            node.children = [];
          } else if (!Array.isArray(node.children)) {
            console.warn("[remarkCustomPanels] Panel directive children was not an array, converting...");
            node.children = [node.children];
          }
          const titleMdastNode: Content = {
            type: 'heading',
            depth: 4,
            data: {
              hName: 'h4',
              hProperties: { className: 'panel-title' },
            },
            children: [{ type: 'text', value: title }]
          };
          node.children.unshift(titleMdastNode);
        } else if (attributes.hasOwnProperty('title')) {
            // Podríamos querer manejar el caso de title="" explícitamente si es necesario
            // console.log("[remarkCustomPanels] Panel has empty title attribute.");
        }

        if (node.children && node.children.length > 0) {
          const numChildren = node.children.length;
          const startIndex = Math.max(0, numChildren - 3);
          for (let i = numChildren - 1; i >= startIndex; i--) {
            const childNode = node.children[i];
            if (childNode.type === 'paragraph' && childNode.children) {
              for (let j = childNode.children.length - 1; j >= 0; j--) {
                const inlineNode = childNode.children[j];
                if (inlineNode.type === 'text') {
                  const textNode = inlineNode as Text;
                  if (typeof textNode.value === 'string') {
                    const trimmedText = textNode.value.trimEnd();
                    if (trimmedText === ':::' || trimmedText.endsWith('\n:::') || trimmedText.endsWith(' :::')) {
                      childNode.children.splice(j, 1);
                      if (childNode.children.length === 0) {
                        node.children.splice(i, 1);
                      }
                      break;
                    } else if (trimmedText.endsWith(':::')) {
                      textNode.value = textNode.value.slice(0, textNode.value.lastIndexOf(':::'));
                      if (!textNode.value.trim()) {
                        childNode.children.splice(j, 1);
                        if (childNode.children.length === 0) {
                          node.children.splice(i, 1);
                        }
                      }
                      break;
                    }
                  }
                }
              }
            }
          }
        }

        data.hName = 'div';
      }
    });
  };
};

export default remarkCustomPanels; 