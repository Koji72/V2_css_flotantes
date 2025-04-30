"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SceneGraph = void 0;
const StateManager_1 = require("./StateManager");
class SceneGraph {
    constructor() {
        this.nodes = new Map();
        this.stateManager = new StateManager_1.StateManager();
    }
    addNode(node) {
        this.nodes.set(node.id, node);
        this.stateManager.set(`node:${node.id}`, node);
    }
    removeNode(id) {
        const node = this.nodes.get(id);
        if (node) {
            this.nodes.delete(id);
            this.stateManager.delete(`node:${id}`);
        }
    }
    getNode(id) {
        return this.nodes.get(id);
    }
    updateNode(id, props) {
        const node = this.nodes.get(id);
        if (node) {
            const updatedNode = { ...node, ...props };
            this.nodes.set(id, updatedNode);
            this.stateManager.set(`node:${id}`, updatedNode);
        }
    }
    getStateManager() {
        return this.stateManager;
    }
    toJSON() {
        return Array.from(this.nodes.values());
    }
    fromJSON(nodes) {
        this.nodes.clear();
        nodes.forEach(node => this.addNode(node));
    }
}
exports.SceneGraph = SceneGraph;
