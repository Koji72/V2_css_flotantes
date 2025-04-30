"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = exports.Plugin = void 0;
class Plugin {
    constructor(manifest) {
        this.manifest = manifest;
    }
}
exports.Plugin = Plugin;
class PluginManager {
    constructor(sceneGraph, stateManager) {
        this.plugins = new Map();
        this.context = this.createContext(sceneGraph, stateManager);
    }
    createContext(sceneGraph, stateManager) {
        return {
            registerComponent: (type, factory) => {
                // Implementar registro de componentes
            },
            registerAction: (name, handler) => {
                // Implementar registro de acciones
            },
            getState: () => stateManager,
            getSceneGraph: () => sceneGraph
        };
    }
    async loadPlugin(plugin) {
        if (this.plugins.has(plugin.manifest.name)) {
            throw new Error(`Plugin ${plugin.manifest.name} already loaded`);
        }
        // Validar permisos y dependencias
        await this.validatePlugin(plugin);
        // Registrar el plugin
        plugin.register(this.context);
        this.plugins.set(plugin.manifest.name, plugin);
    }
    async unloadPlugin(name) {
        const plugin = this.plugins.get(name);
        if (plugin) {
            plugin.unregister();
            this.plugins.delete(name);
        }
    }
    async validatePlugin(plugin) {
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
    isValidPermission(permission) {
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
    getPlugin(name) {
        return this.plugins.get(name);
    }
    getLoadedPlugins() {
        return Array.from(this.plugins.keys());
    }
}
exports.PluginManager = PluginManager;
