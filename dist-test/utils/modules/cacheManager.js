"use strict";
/**
 * CacheManager - Sistema de caché selectiva para markdown y HTML renderizado
 *
 * Implementa un sistema LRU (Least Recently Used) para cachear el resultado
 * del procesamiento de markdown, evitando reprocesamiento innecesario.
 *
 * @author SW-Architect
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManager = exports.CacheManager = void 0;
/**
 * Clase para gestionar la caché de resultados de markdown procesado
 */
class CacheManager {
    /**
     * Constructor privado (singleton)
     */
    constructor(options = {}) {
        this.hits = 0;
        this.misses = 0;
        this.totalProcessingTime = 0;
        this.entryCount = 0;
        this.totalSize = 0;
        this.cache = new Map();
        this.maxSize = options.maxSize || 100;
        this.ttl = options.ttl || 5 * 60 * 1000; // 5 minutos por defecto
        this.enabled = options.enabled !== false;
        this.debugMode = options.debugMode || false;
        this.log('[CacheManager] Inicializado con opciones:', {
            maxSize: this.maxSize,
            ttl: this.ttl,
            enabled: this.enabled,
            debugMode: this.debugMode
        });
    }
    /**
     * Obtener la instancia única (patrón Singleton)
     */
    static getInstance(options) {
        if (!CacheManager.instance) {
            CacheManager.instance = new CacheManager(options);
        }
        return CacheManager.instance;
    }
    /**
     * Función auxiliar para logging condicional
     */
    log(...args) {
        if (this.debugMode) {
            console.log(...args);
        }
    }
    /**
     * Genera una clave hash para el contenido markdown
     */
    generateKey(content) {
        // Implementación simple de hash basada en FNV-1a
        let hash = 2166136261; // FNV offset basis
        for (let i = 0; i < content.length; i++) {
            hash ^= content.charCodeAt(i);
            hash *= 16777619; // FNV prime
        }
        return hash.toString(16);
    }
    /**
     * Estima el tamaño en bytes de una entrada de caché
     */
    estimateSize(entry) {
        // Estimación básica: 2 bytes por carácter + overhead
        return entry.html.length * 2 + 100;
    }
    /**
     * Añade o actualiza una entrada en la caché
     */
    set(content, html, processingTime) {
        if (!this.enabled)
            return;
        const key = this.generateKey(content);
        const timestamp = Date.now();
        const entry = {
            html,
            timestamp,
            processingTime
        };
        // Si la caché está llena, eliminar la entrada más antigua
        if (this.cache.size >= this.maxSize) {
            this.removeOldestEntry();
        }
        const entrySize = this.estimateSize(entry);
        this.totalSize += entrySize;
        this.cache.set(key, entry);
        this.totalProcessingTime += processingTime;
        this.entryCount++;
        this.log(`[CacheManager] Nueva entrada: ${key} (${entrySize} bytes, ${processingTime}ms)`);
    }
    /**
     * Obtiene un resultado previamente cacheado si está disponible
     */
    get(content) {
        if (!this.enabled)
            return null;
        const key = this.generateKey(content);
        const entry = this.cache.get(key);
        if (!entry) {
            this.misses++;
            this.log(`[CacheManager] Miss: ${key}`);
            return null;
        }
        // Verificar TTL
        const now = Date.now();
        if (now - entry.timestamp > this.ttl) {
            this.log(`[CacheManager] Expirado: ${key}`);
            this.cache.delete(key);
            this.totalSize -= this.estimateSize(entry);
            this.misses++;
            return null;
        }
        // Actualizar timestamp (LRU)
        entry.timestamp = now;
        this.cache.set(key, entry);
        this.hits++;
        this.log(`[CacheManager] Hit: ${key}`);
        return entry.html;
    }
    /**
     * Elimina la entrada más antigua de la caché
     */
    removeOldestEntry() {
        if (this.cache.size === 0)
            return;
        let oldestKey = null;
        let oldestTimestamp = Date.now();
        // Encontrar la entrada más antigua
        this.cache.forEach((entry, key) => {
            if (entry.timestamp < oldestTimestamp) {
                oldestTimestamp = entry.timestamp;
                oldestKey = key;
            }
        });
        if (oldestKey) {
            const oldEntry = this.cache.get(oldestKey);
            if (oldEntry) {
                this.totalSize -= this.estimateSize(oldEntry);
                this.log(`[CacheManager] Eliminando entrada antigua: ${oldestKey}`);
            }
            this.cache.delete(oldestKey);
        }
    }
    /**
     * Limpia todas las entradas de la caché
     */
    clear() {
        this.log(`[CacheManager] Limpiando caché (${this.cache.size} entradas)`);
        this.cache.clear();
        this.totalSize = 0;
    }
    /**
     * Habilita o deshabilita la caché
     */
    setEnabled(enabled) {
        this.enabled = enabled;
        this.log(`[CacheManager] Caché ${enabled ? 'habilitada' : 'deshabilitada'}`);
    }
    /**
     * Establece el modo de depuración
     */
    setDebugMode(debug) {
        this.debugMode = debug;
        console.log(`[CacheManager] Modo debug ${debug ? 'habilitado' : 'deshabilitado'}`);
    }
    /**
     * Limpia entradas expiradas
     */
    clearExpired() {
        if (!this.enabled)
            return 0;
        const now = Date.now();
        let count = 0;
        this.cache.forEach((entry, key) => {
            if (now - entry.timestamp > this.ttl) {
                this.totalSize -= this.estimateSize(entry);
                this.cache.delete(key);
                count++;
            }
        });
        this.log(`[CacheManager] ${count} entradas expiradas eliminadas`);
        return count;
    }
    /**
     * Obtiene estadísticas de la caché
     */
    getStats() {
        let oldestEntry = null;
        let newestEntry = null;
        if (this.cache.size > 0) {
            oldestEntry = Date.now();
            newestEntry = 0;
            this.cache.forEach(entry => {
                if (entry.timestamp < oldestEntry) {
                    oldestEntry = entry.timestamp;
                }
                if (entry.timestamp > newestEntry) {
                    newestEntry = entry.timestamp;
                }
            });
        }
        return {
            hits: this.hits,
            misses: this.misses,
            size: this.cache.size,
            maxSize: this.maxSize,
            oldestEntry,
            newestEntry,
            avgProcessingTime: this.entryCount > 0 ? this.totalProcessingTime / this.entryCount : 0,
            totalSize: this.totalSize
        };
    }
    /**
     * Ejecuta una función con caché
     * Si el resultado está en caché, lo devuelve sin ejecutar la función
     */
    async executeWithCache(content, fn) {
        // Si la caché está deshabilitada o el contenido es demasiado corto, ejecutar sin caché
        if (!this.enabled || content.length < 20) {
            this.misses++;
            const startTime = performance.now();
            const result = await fn();
            const processingTime = performance.now() - startTime;
            // Guardar en caché para uso futuro
            this.set(content, result.html, processingTime);
            return { ...result, fromCache: false };
        }
        // Intentar obtener de la caché
        const cachedHtml = this.get(content);
        if (cachedHtml) {
            return { html: cachedHtml, fromCache: true };
        }
        // No está en caché, ejecutar función
        const startTime = performance.now();
        const result = await fn();
        const processingTime = performance.now() - startTime;
        // Guardar en caché para uso futuro
        this.set(content, result.html, processingTime);
        return { ...result, fromCache: false };
    }
}
exports.CacheManager = CacheManager;
// Exportar instancia única
exports.cacheManager = CacheManager.getInstance();
exports.default = exports.cacheManager;
