import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { LeafDirective } from 'mdast-util-directive';
import type { Plugin } from 'unified';

const remarkMinimalLeafHandler: Plugin<[], Root> = () => {
  console.log("[MinimalLeafHandler] PLUGIN INITIALIZED");
  return (tree) => {
    console.log("[MinimalLeafHandler] Tree processing START");
    visit(tree, 'leafDirective', (node: LeafDirective) => {
      // ¡¡IMPORTANTE!! Log para ver si encuentra algo
      console.log('[MinimalLeafHandler] Found leafDirective:', node);

      // Intento mínimo de transformación (solo para ver si afecta el output)
      const data = node.data || (node.data = {});
      data.hName = 'span'; // Transformar a <span>
      data.hProperties = { 'data-leaf-handled': 'true' };
      // No modificamos node.children aquí
    });
    console.log("[MinimalLeafHandler] Tree processing END");
  };
};

export default remarkMinimalLeafHandler; 