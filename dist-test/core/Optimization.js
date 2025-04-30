"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = exports.VirtualDOM = exports.LazyLoader = void 0;
exports.memoize = memoize;
function memoize(fn) {
    const cache = new Map();
    return ((...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key))
            return cache.get(key);
        const result = fn(...args);
        cache.set(key, result);
        return result;
    });
}
class LazyLoader {
    constructor() {
        this.loaded = new Set();
        this.loading = new Map();
    }
    async load(path) {
        if (this.loaded.has(path)) {
            return this.loading.get(path);
        }
        if (this.loading.has(path)) {
            return this.loading.get(path);
        }
        const loadPromise = Promise.resolve(`${path}`).then(s => __importStar(require(s))).then(module => {
            this.loaded.add(path);
            this.loading.delete(path);
            return module.default;
        });
        this.loading.set(path, loadPromise);
        return loadPromise;
    }
    isLoaded(path) {
        return this.loaded.has(path);
    }
    isLoading(path) {
        return this.loading.has(path);
    }
    clear() {
        this.loaded.clear();
        this.loading.clear();
    }
}
exports.LazyLoader = LazyLoader;
class VirtualDOM {
    constructor() {
        this.current = new Map();
        this.next = new Map();
    }
    diff(current, next) {
        const patches = [];
        // Encontrar nodos nuevos y modificados
        for (const [id, nextNode] of next.entries()) {
            const currentNode = current.get(id);
            if (!currentNode) {
                patches.push({ type: 'CREATE', id, node: nextNode });
            }
            else if (!this.isEqual(currentNode, nextNode)) {
                patches.push({ type: 'UPDATE', id, node: nextNode });
            }
        }
        // Encontrar nodos eliminados
        for (const [id, currentNode] of current.entries()) {
            if (!next.has(id)) {
                patches.push({ type: 'DELETE', id });
            }
        }
        return patches;
    }
    isEqual(node1, node2) {
        if (node1.type !== node2.type)
            return false;
        if (JSON.stringify(node1.props) !== JSON.stringify(node2.props))
            return false;
        if (node1.children.length !== node2.children.length)
            return false;
        for (let i = 0; i < node1.children.length; i++) {
            if (!this.isEqual(node1.children[i], node2.children[i])) {
                return false;
            }
        }
        return true;
    }
    update(nextNodes) {
        this.next.clear();
        nextNodes.forEach(node => this.next.set(node.id, node));
        const patches = this.diff(this.current, this.next);
        this.current = new Map(this.next);
        return patches;
    }
}
exports.VirtualDOM = VirtualDOM;
class PerformanceMonitor {
    constructor(maxSamples = 100) {
        this.metrics = new Map();
        this.maxSamples = maxSamples;
    }
    record(metric, value) {
        if (!this.metrics.has(metric)) {
            this.metrics.set(metric, []);
        }
        const samples = this.metrics.get(metric);
        samples.push(value);
        if (samples.length > this.maxSamples) {
            samples.shift();
        }
    }
    getAverage(metric) {
        const samples = this.metrics.get(metric);
        if (!samples || samples.length === 0)
            return 0;
        const sum = samples.reduce((a, b) => a + b, 0);
        return sum / samples.length;
    }
    getMin(metric) {
        const samples = this.metrics.get(metric);
        if (!samples || samples.length === 0)
            return 0;
        return Math.min(...samples);
    }
    getMax(metric) {
        const samples = this.metrics.get(metric);
        if (!samples || samples.length === 0)
            return 0;
        return Math.max(...samples);
    }
    getReport() {
        const report = {};
        for (const [metric, samples] of this.metrics.entries()) {
            report[metric] = {
                avg: this.getAverage(metric),
                min: this.getMin(metric),
                max: this.getMax(metric)
            };
        }
        return report;
    }
    clear() {
        this.metrics.clear();
    }
}
exports.PerformanceMonitor = PerformanceMonitor;
