import { StateManager } from './StateManager';

export interface SceneNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children: SceneNode[];
  parent?: SceneNode;
}

export class SceneGraph {
  private nodes: Map<string, SceneNode>;
  private stateManager: StateManager;

  constructor() {
    this.nodes = new Map();
    this.stateManager = new StateManager();
  }

  addNode(node: SceneNode): void {
    this.nodes.set(node.id, node);
    this.stateManager.set(`node:${node.id}`, node);
  }

  removeNode(id: string): void {
    const node = this.nodes.get(id);
    if (node) {
      this.nodes.delete(id);
      this.stateManager.delete(`node:${id}`);
    }
  }

  getNode(id: string): SceneNode | undefined {
    return this.nodes.get(id);
  }

  updateNode(id: string, props: Partial<SceneNode>): void {
    const node = this.nodes.get(id);
    if (node) {
      const updatedNode = { ...node, ...props };
      this.nodes.set(id, updatedNode);
      this.stateManager.set(`node:${id}`, updatedNode);
    }
  }

  getStateManager(): StateManager {
    return this.stateManager;
  }

  toJSON(): SceneNode[] {
    return Array.from(this.nodes.values());
  }

  fromJSON(nodes: SceneNode[]): void {
    this.nodes.clear();
    nodes.forEach(node => this.addNode(node));
  }
} 