import { SceneGraph } from './SceneGraph';
import { StateManager } from './StateManager';
import { ThemeManager } from './ThemeSystem';

export abstract class Renderer {
  protected sceneGraph: SceneGraph;
  protected stateManager: StateManager;
  protected themeManager: ThemeManager;

  constructor(sceneGraph: SceneGraph, stateManager: StateManager, themeManager: ThemeManager) {
    this.sceneGraph = sceneGraph;
    this.stateManager = stateManager;
    this.themeManager = themeManager;
  }

  abstract render(): Promise<void>;
  abstract update(): Promise<void>;
  abstract dispose(): void;
}

export class HTMLRenderer extends Renderer {
  private root: HTMLElement;
  private virtualDOM: Map<string, HTMLElement>;

  constructor(
    sceneGraph: SceneGraph,
    stateManager: StateManager,
    themeManager: ThemeManager,
    root: HTMLElement
  ) {
    super(sceneGraph, stateManager, themeManager);
    this.root = root;
    this.virtualDOM = new Map();
  }

  async render(): Promise<void> {
    // Limpiar el DOM virtual
    this.virtualDOM.clear();

    // Obtener todos los nodos del Scene Graph
    const nodes = this.sceneGraph.toJSON();

    // Renderizar cada nodo
    for (const node of nodes) {
      const element = await this.renderNode(node);
      this.virtualDOM.set(node.id, element);
      this.root.appendChild(element);
    }
  }

  async update(): Promise<void> {
    // Obtener nodos actualizados
    const nodes = this.sceneGraph.toJSON();

    // Actualizar elementos existentes o crear nuevos
    for (const node of nodes) {
      const existingElement = this.virtualDOM.get(node.id);
      if (existingElement) {
        await this.updateNode(existingElement, node);
      } else {
        const newElement = await this.renderNode(node);
        this.virtualDOM.set(node.id, newElement);
        this.root.appendChild(newElement);
      }
    }

    // Eliminar elementos que ya no existen
    const currentIds = new Set(nodes.map(node => node.id));
    for (const [id, element] of this.virtualDOM.entries()) {
      if (!currentIds.has(id)) {
        element.remove();
        this.virtualDOM.delete(id);
      }
    }
  }

  private async renderNode(node: any): Promise<HTMLElement> {
    const element = document.createElement(node.type);

    // Aplicar propiedades
    Object.entries(node.props).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        // Manejar eventos
        const eventName = key.slice(2).toLowerCase();
        element.addEventListener(eventName, value as EventListener);
      } else {
        // Aplicar atributos y estilos
        if (key === 'style' && typeof value === 'object') {
          Object.entries(value as Record<string, string>).forEach(([styleKey, styleValue]) => {
            (element.style as any)[styleKey] = styleValue;
          });
        } else {
          (element as any)[key] = value;
        }
      }
    });

    // Renderizar hijos
    if (node.children) {
      for (const child of node.children) {
        const childElement = await this.renderNode(child);
        element.appendChild(childElement);
      }
    }

    return element;
  }

  private async updateNode(element: HTMLElement, node: any): Promise<void> {
    // Actualizar propiedades
    Object.entries(node.props).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        // Actualizar eventos
        const eventName = key.slice(2).toLowerCase();
        element.removeEventListener(eventName, (element as any)[`_${eventName}`]);
        element.addEventListener(eventName, value as EventListener);
        (element as any)[`_${eventName}`] = value;
      } else {
        // Actualizar atributos y estilos
        if (key === 'style' && typeof value === 'object') {
          Object.entries(value as Record<string, string>).forEach(([styleKey, styleValue]) => {
            (element.style as any)[styleKey] = styleValue;
          });
        } else {
          (element as any)[key] = value;
        }
      }
    });

    // Actualizar hijos
    if (node.children) {
      const existingChildren = Array.from(element.children);
      const newChildren = await Promise.all(node.children.map(this.renderNode.bind(this)));

      // Actualizar o reemplazar hijos
      for (let i = 0; i < Math.max(existingChildren.length, newChildren.length); i++) {
        if (i < existingChildren.length && i < newChildren.length) {
          await this.updateNode(existingChildren[i] as HTMLElement, node.children[i]);
        } else if (i < newChildren.length) {
          element.appendChild(newChildren[i]);
        } else {
          existingChildren[i].remove();
        }
      }
    }
  }

  dispose(): void {
    // Limpiar eventos y referencias
    this.virtualDOM.forEach(element => {
      Array.from(element.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          const eventName = attr.name.slice(2).toLowerCase();
          element.removeEventListener(eventName, (element as any)[`_${eventName}`]);
        }
      });
    });
    this.virtualDOM.clear();
  }
} 