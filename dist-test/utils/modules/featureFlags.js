"use strict";
/**
 * FeatureFlags - Sistema para habilitar/deshabilitar características
 *
 * Este módulo permite gestionar feature flags para un despliegue controlado
 * de nuevas funcionalidades, pruebas A/B y modo depuración.
 *
 * @author SW-DevOps
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureFlags = exports.FeatureFlags = void 0;
/**
 * Clase FeatureFlags - Implementación del sistema de feature flags
 */
class FeatureFlags {
    /**
     * Constructor privado (singleton)
     */
    constructor(options = {}) {
        this.storageKey = options.storageKey || 'sw_feature_flags';
        this.useStorage = options.useStorage !== false;
        this.subscribers = new Map();
        // Valores predeterminados para cada flag
        this.defaultFlags = {
            astParser: false,
            cacheMarkdown: true,
            diffRendering: false,
            enhancedButtons: true,
            debugMode: false,
            visualInspector: false,
            newButtonSyntax: true,
            newPanelSyntax: false
        };
        // Inicializar con valores predeterminados
        this.flags = { ...this.defaultFlags };
        // Sobrescribir con opciones iniciales proporcionadas
        if (options.initialFlags) {
            Object.keys(options.initialFlags).forEach(key => {
                const flagKey = key;
                if (this.isValidFlag(flagKey) && options.initialFlags) {
                    this.flags[flagKey] = !!options.initialFlags[flagKey];
                }
            });
        }
        // Cargar desde localStorage si está disponible
        this.loadFromStorage();
        console.log('[FeatureFlags] Inicializado con flags:', this.flags);
    }
    /**
     * Obtener la instancia única (patrón Singleton)
     */
    static getInstance(options) {
        if (!FeatureFlags.instance) {
            FeatureFlags.instance = new FeatureFlags(options);
        }
        return FeatureFlags.instance;
    }
    /**
     * Verifica si un flag es válido
     */
    isValidFlag(flag) {
        return flag in this.defaultFlags;
    }
    /**
     * Cargar configuración desde localStorage
     */
    loadFromStorage() {
        if (!this.useStorage || typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        try {
            const storedFlags = localStorage.getItem(this.storageKey);
            if (storedFlags) {
                const parsedFlags = JSON.parse(storedFlags);
                Object.keys(parsedFlags).forEach(key => {
                    if (this.isValidFlag(key)) {
                        this.flags[key] = !!parsedFlags[key];
                    }
                });
                console.log('[FeatureFlags] Cargado desde localStorage:', this.flags);
            }
        }
        catch (error) {
            console.error('[FeatureFlags] Error al cargar desde localStorage:', error);
        }
    }
    /**
     * Guardar configuración en localStorage
     */
    saveToStorage() {
        if (!this.useStorage || typeof window === 'undefined' || !window.localStorage) {
            return;
        }
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.flags));
        }
        catch (error) {
            console.error('[FeatureFlags] Error al guardar en localStorage:', error);
        }
    }
    /**
     * Verificar si un feature flag está habilitado
     */
    isEnabled(flag) {
        // Permitir override por URL para pruebas (solo en desarrollo)
        if (typeof window !== 'undefined' && this.isDevelopmentMode()) {
            const params = new URLSearchParams(window.location.search);
            const paramValue = params.get(`ff_${flag}`);
            if (paramValue !== null) {
                return paramValue === 'true' || paramValue === '1';
            }
        }
        return this.flags[flag] === true;
    }
    /**
     * Comprueba si estamos en modo desarrollo
     */
    isDevelopmentMode() {
        // Detecta el modo de desarrollo sin depender directamente de process.env
        return typeof window !== 'undefined' &&
            (window.location.hostname === 'localhost' ||
                window.location.hostname === '127.0.0.1');
    }
    /**
     * Habilitar un feature flag
     */
    enable(flag) {
        if (this.flags[flag] !== true) {
            this.flags[flag] = true;
            this.saveToStorage();
            this.notifySubscribers();
            console.log(`[FeatureFlags] Flag '${flag}' habilitado`);
        }
    }
    /**
     * Deshabilitar un feature flag
     */
    disable(flag) {
        if (this.flags[flag] !== false) {
            this.flags[flag] = false;
            this.saveToStorage();
            this.notifySubscribers();
            console.log(`[FeatureFlags] Flag '${flag}' deshabilitado`);
        }
    }
    /**
     * Alternar el estado de un feature flag
     */
    toggle(flag) {
        this.flags[flag] = !this.flags[flag];
        this.saveToStorage();
        this.notifySubscribers();
        console.log(`[FeatureFlags] Flag '${flag}' cambiado a ${this.flags[flag]}`);
        return this.flags[flag];
    }
    /**
     * Restablecer un flag a su valor predeterminado
     */
    reset(flag) {
        this.flags[flag] = this.defaultFlags[flag];
        this.saveToStorage();
        this.notifySubscribers();
        console.log(`[FeatureFlags] Flag '${flag}' restablecido a ${this.flags[flag]}`);
    }
    /**
     * Restablecer todos los flags a sus valores predeterminados
     */
    resetAll() {
        this.flags = { ...this.defaultFlags };
        this.saveToStorage();
        this.notifySubscribers();
        console.log('[FeatureFlags] Todos los flags restablecidos a valores predeterminados');
    }
    /**
     * Obtener el estado actual de todos los flags
     */
    getAllFlags() {
        return { ...this.flags };
    }
    /**
     * Suscribirse a cambios en los feature flags
     */
    subscribe(id, callback) {
        this.subscribers.set(id, callback);
        // Devolver función para cancelar suscripción
        return () => {
            this.subscribers.delete(id);
        };
    }
    /**
     * Notificar a los suscriptores sobre cambios
     */
    notifySubscribers() {
        const currentFlags = this.getAllFlags();
        this.subscribers.forEach(callback => {
            try {
                callback(currentFlags);
            }
            catch (error) {
                console.error('[FeatureFlags] Error al notificar a suscriptor:', error);
            }
        });
    }
    /**
     * Configurar múltiples flags a la vez
     */
    setFlags(flagsConfig) {
        let changed = false;
        Object.entries(flagsConfig).forEach(([key, value]) => {
            if (this.isValidFlag(key) && this.flags[key] !== value) {
                this.flags[key] = !!value;
                changed = true;
            }
        });
        if (changed) {
            this.saveToStorage();
            this.notifySubscribers();
            console.log('[FeatureFlags] Múltiples flags actualizados:', flagsConfig);
        }
    }
}
exports.FeatureFlags = FeatureFlags;
// Exportar una instancia única global
exports.featureFlags = FeatureFlags.getInstance();
// Agregar al objeto window para acceso en consola (solo en desarrollo)
if (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1')) {
    window.featureFlags = exports.featureFlags;
}
exports.default = exports.featureFlags;
