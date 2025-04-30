"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unist_util_visit_1 = require("unist-util-visit");
const remarkMinimalLeafHandler = () => {
    console.log("[MinimalLeafHandler] PLUGIN INITIALIZED");
    return (tree) => {
        console.log("[MinimalLeafHandler] Tree processing START");
        (0, unist_util_visit_1.visit)(tree, 'leafDirective', (node) => {
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
exports.default = remarkMinimalLeafHandler;
