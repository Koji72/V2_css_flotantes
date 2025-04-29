import { StateManager } from './StateManager';
import { SceneGraph } from './SceneGraph';

// Stub temporal para WebGLObject si no está definido
// Elimina esto si tienes el tipo real
// @ts-ignore
// eslint-disable-next-line
type WebGLObject = any;

export interface PluginManifest {
  name: string;
  version: string;
  author: string;
  permissions: string[];
  dependencies?: string[];
}

export interface PluginContext {
  registerComponent(type: string, factory: ComponentFactory): void;
  registerAction(name: string, handler: ActionHandler): void;
  getState(): StateManager;
  getSceneGraph(): SceneGraph;
}

export interface ComponentFactory {
  create(props: Record<string, any>): HTMLElement | WebGLObject;
}

export interface ActionHandler {
  (context: PluginContext, ...args: any[]): Promise<any>;
}

export abstract class Plugin {
  protected manifest: PluginManifest;
  protected context?: PluginContext;

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
  }

  abstract register(context: PluginContext): void;
  abstract unregister(): void;
}

export class PluginManager {
  private plugins: Map<string, Plugin>;
  private context: PluginContext;

  constructor(sceneGraph: SceneGraph, stateManager: StateManager) {
    this.plugins = new Map();
    this.context = this.createContext(sceneGraph, stateManager);
  }

  private createContext(sceneGraph: SceneGraph, stateManager: StateManager): PluginContext {
    return {
      registerComponent: (type: string, factory: ComponentFactory) => {
        // Implementar registro de componentes
      },
      registerAction: (name: string, handler: ActionHandler) => {
        // Implementar registro de acciones
      },
      getState: () => stateManager,
      getSceneGraph: () => sceneGraph
    };
  }

  async loadPlugin(plugin: Plugin): Promise<void> {
    if (this.plugins.has(plugin.manifest.name)) {
      throw new Error(`Plugin ${plugin.manifest.name} already loaded`);
    }

    // Validar permisos y dependencias
    await this.validatePlugin(plugin);

    // Registrar el plugin
    plugin.register(this.context);
    this.plugins.set(plugin.manifest.name, plugin);
  }

  async unloadPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (plugin) {
      plugin.unregister();
      this.plugins.delete(name);
    }
  }

  private async validatePlugin(plugin: Plugin): Promise<void> {
    // Validar manifiesto
    if (!plugin.manifest.name || !plugin.manifest.version) {
      throw new Error('Invalid plugin manifest');
    }

    // Validar permisos
    if (plugin.manifest.permissions.some(permission => !this.isValidPermission(permission))) {
      throw new Error('Invalid permissions in plugin manifest');
    }

    // Validar dependencias
    if (plugin.manifest.dependencies) {
      for (const dependency of plugin.manifest.dependencies) {
        if (!this.plugins.has(dependency)) {
          throw new Error(`Missing dependency: ${dependency}`);
        }
      }
    }
  }

  private isValidPermission(permission: string): boolean {
    // Lista de permisos válidos
    const validPermissions = [
      'read:state',
      'write:state',
      'create:node',
      'delete:node',
      'update:node',
      'register:component',
      'register:action'
    ];
    return validPermissions.includes(permission);
  }

  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  getLoadedPlugins(): string[] {
    return Array.from(this.plugins.keys());
  }
} 