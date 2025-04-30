"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unist_util_visit_1 = require("unist-util-visit");
// This regex matches lines starting with ::: followed by an identifier (like panel)
// and then immediately followed by {attributes}.
// It captures the identifier (group 1) and the attributes (group 2).
// The attribute part ({[\s\S]*?}) allows for multi-line content non-greedily.
// Example matches:
// :::panel{title="Hello"}
// :::panel{class="foo"
//          title="Bar"}
// Example non-matches: :::panel[]{title="Hello"} , ::panel{title="Hello"}
const directiveWithoutBracketsRegex = /^:::\s*([a-zA-Z0-9_-]+)\s*({[\s\S]*?})\s*$/;
/**
 * A remark plugin to automatically add empty brackets `[]` to container directives
 * that are missing them, ensuring compatibility with remark-directive.
 * It handles attributes defined across multiple lines within the curly braces.
 *
 * For example, it transforms:
 * :::panel{title="My Panel"}
 * Content
 * :::
 *
 * or
 *
 * :::panel{class="foo"
 *          title="bar"}
 * Content
 * :::
 *
 * Into:
 * :::panel[]{title="My Panel"} or :::panel[]{class="foo" title="bar"}
 * Content
 * :::
 */
const remarkEnsureDirectiveBrackets = () => {
    return (tree) => {
        (0, unist_util_visit_1.visit)(tree, 'text', (node) => {
            // Check if the text node's value matches the pattern :::name{attrs}
            const match = node.value.match(directiveWithoutBracketsRegex);
            if (match) {
                const directiveName = match[1];
                const attributes = match[2];
                // Replace the node's value with the corrected format: :::name[]{attrs}
                node.value = `:::${directiveName}[]${attributes}`;
                // Optional: Log the transformation for debugging
                // console.log(`[remarkEnsureBrackets] Transformed directive: ${node.value}`);
            }
        });
    };
};
exports.default = remarkEnsureDirectiveBrackets;
