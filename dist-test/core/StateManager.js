"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateManager = void 0;
class StateManager {
    constructor() {
        this.state = new Map();
        this.subscribers = new Map();
    }
    set(key, value) {
        this.state.set(key, value);
        this.notify(key);
    }
    get(key) {
        return this.state.get(key);
    }
    delete(key) {
        this.state.delete(key);
        this.notify(key);
    }
    subscribe(key, callback) {
        if (!this.subscribers.has(key)) {
            this.subscribers.set(key, new Set());
        }
        this.subscribers.get(key).add(callback);
        // Retornar función para desuscribirse
        return () => {
            const callbacks = this.subscribers.get(key);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }
    notify(key) {
        const callbacks = this.subscribers.get(key);
        if (callbacks) {
            const value = this.state.get(key);
            callbacks.forEach(callback => callback(value));
        }
    }
    toJSON() {
        return Object.fromEntries(this.state);
    }
    fromJSON(data) {
        this.state.clear();
        Object.entries(data).forEach(([key, value]) => {
            this.state.set(key, value);
        });
    }
}
exports.StateManager = StateManager;
