import { visit } from 'unist-util-visit';

// This regex matches lines starting with ::: followed by an identifier (like panel)
// and then immediately followed by {attributes}.
// It captures the identifier (group 1) and the attributes (group 2).
// The attribute part ({[\s\S]*?}) allows for multi-line content non-greedily.
const directiveWithoutBracketsRegex = /^:::\s*([a-zA-Z0-9_-]+)\s*({[\s\S]*?})\s*$/;

const remarkEnsureDirectiveBrackets = () => {
  return (tree) => {
    visit(tree, 'text', (node) => {
      // Check if the text node's value matches the pattern :::name{attrs}
      const match = node.value.match(directiveWithoutBracketsRegex);
      if (match) {
        const directiveName = match[1];
        const attributes = match[2];
        // Replace the node's value with the corrected format: :::name[]{attrs}
        node.value = `:::${directiveName}[]${attributes}`;
      }
    });
  };
};

export default remarkEnsureDirectiveBrackets; 