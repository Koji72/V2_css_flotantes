"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsCollector = exports.Logger = void 0;
class Logger {
    constructor(maxEntries = 1000) {
        this.entries = [];
        this.maxEntries = maxEntries;
        this.subscribers = new Set();
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    log(level, message, data, context) {
        const entry = {
            timestamp: Date.now(),
            level,
            message,
            data,
            context
        };
        this.entries.push(entry);
        // Mantener el tamaño máximo de entradas
        if (this.entries.length > this.maxEntries) {
            this.entries.shift();
        }
        // Notificar a los suscriptores
        this.notifySubscribers(entry);
        // También registrar en la consola según el nivel
        this.consoleLog(level, message, data);
    }
    debug(message, data, context) {
        this.log('debug', message, data, context);
    }
    info(message, data, context) {
        this.log('info', message, data, context);
    }
    warn(message, data, context) {
        this.log('warn', message, data, context);
    }
    error(message, data, context) {
        this.log('error', message, data, context);
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    notifySubscribers(entry) {
        this.subscribers.forEach(callback => callback(entry));
    }
    consoleLog(level, message, data) {
        const timestamp = new Date().toISOString();
        const prefix = `[${timestamp}] ${level.toUpperCase()}:`;
        switch (level) {
            case 'debug':
                console.debug(prefix, message, data);
                break;
            case 'info':
                console.info(prefix, message, data);
                break;
            case 'warn':
                console.warn(prefix, message, data);
                break;
            case 'error':
                console.error(prefix, message, data);
                break;
        }
    }
    getEntries(level, startTime, endTime) {
        return this.entries.filter(entry => {
            if (level && entry.level !== level)
                return false;
            if (startTime && entry.timestamp < startTime)
                return false;
            if (endTime && entry.timestamp > endTime)
                return false;
            return true;
        });
    }
    clear() {
        this.entries = [];
    }
    toJSON() {
        return this.entries;
    }
    fromJSON(entries) {
        this.entries = entries;
    }
}
exports.Logger = Logger;
class MetricsCollector {
    constructor(maxSamples = 100) {
        this.metrics = new Map();
        this.maxSamples = maxSamples;
        this.subscribers = new Set();
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
        this.notifySubscribers(metric, value);
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
    getPercentile(metric, percentile) {
        const samples = this.metrics.get(metric);
        if (!samples || samples.length === 0)
            return 0;
        const sorted = [...samples].sort((a, b) => a - b);
        const index = Math.ceil((percentile / 100) * sorted.length) - 1;
        return sorted[index];
    }
    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }
    notifySubscribers(metric, value) {
        this.subscribers.forEach(callback => callback(metric, value));
    }
    getReport() {
        const report = {};
        for (const [metric, samples] of this.metrics.entries()) {
            report[metric] = {
                avg: this.getAverage(metric),
                min: this.getMin(metric),
                max: this.getMax(metric),
                p95: this.getPercentile(metric, 95)
            };
        }
        return report;
    }
    clear() {
        this.metrics.clear();
    }
    toJSON() {
        return Object.fromEntries(this.metrics);
    }
    fromJSON(data) {
        this.metrics.clear();
        Object.entries(data).forEach(([metric, samples]) => {
            this.metrics.set(metric, samples);
        });
    }
}
exports.MetricsCollector = MetricsCollector;
