/**
 * CacheManager - Sistema de caché selectiva para markdown y HTML renderizado
 * 
 * Implementa un sistema LRU (Least Recently Used) para cachear el resultado
 * del procesamiento de markdown, evitando reprocesamiento innecesario.
 * 
 * @author SW-Architect
 * @version 1.0.0
 */

// Tipos de entrada y salida de caché
interface CacheEntry {
  html: string;
  timestamp: number;
  processingTime: number;
}

interface CacheOptions {
  maxSize?: number;       // Número máximo de entradas (default: 100)
  ttl?: number;           // Tiempo de vida en ms (default: 5 minutos)
  enabled?: boolean;      // Si la caché está habilitada (default: true)
  debugMode?: boolean;    // Si se debe mostrar información de debug (default: false)
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
  oldestEntry: number | null;
  newestEntry: number | null;
  avgProcessingTime: number;
  totalSize: number;      // Tamaño estimado en bytes
}

/**
 * Clase para gestionar la caché de resultados de markdown procesado
 */
export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, CacheEntry>;
  private maxSize: number;
  private ttl: number;
  private enabled: boolean;
  private debugMode: boolean;
  private hits: number = 0;
  private misses: number = 0;
  private totalProcessingTime: number = 0;
  private entryCount: number = 0;
  private totalSize: number = 0;

  /**
   * Constructor privado (singleton)
   */
  private constructor(options: CacheOptions = {}) {
    this.cache = new Map<string, CacheEntry>();
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
  public static getInstance(options?: CacheOptions): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(options);
    }
    return CacheManager.instance;
  }

  /**
   * Función auxiliar para logging condicional
   */
  private log(...args: any[]): void {
    if (this.debugMode) {
      console.log(...args);
    }
  }

  /**
   * Genera una clave hash para el contenido markdown
   */
  private generateKey(content: string): string {
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
  private estimateSize(entry: CacheEntry): number {
    // Estimación básica: 2 bytes por carácter + overhead
    return entry.html.length * 2 + 100;
  }

  /**
   * Añade o actualiza una entrada en la caché
   */
  public set(content: string, html: string, processingTime: number): void {
    if (!this.enabled) return;

    const key = this.generateKey(content);
    const timestamp = Date.now();

    const entry: CacheEntry = {
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
  public get(content: string): string | null {
    if (!this.enabled) return null;

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
  private removeOldestEntry(): void {
    if (this.cache.size === 0) return;

    let oldestKey: string | null = null;
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
  public clear(): void {
    this.log(`[CacheManager] Limpiando caché (${this.cache.size} entradas)`);
    this.cache.clear();
    this.totalSize = 0;
  }

  /**
   * Habilita o deshabilita la caché
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.log(`[CacheManager] Caché ${enabled ? 'habilitada' : 'deshabilitada'}`);
  }

  /**
   * Establece el modo de depuración
   */
  public setDebugMode(debug: boolean): void {
    this.debugMode = debug;
    console.log(`[CacheManager] Modo debug ${debug ? 'habilitado' : 'deshabilitado'}`);
  }

  /**
   * Limpia entradas expiradas
   */
  public clearExpired(): number {
    if (!this.enabled) return 0;

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
  public getStats(): CacheStats {
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;
    
    if (this.cache.size > 0) {
      oldestEntry = Date.now();
      newestEntry = 0;
      
      this.cache.forEach(entry => {
        if (entry.timestamp < oldestEntry!) {
          oldestEntry = entry.timestamp;
        }
        if (entry.timestamp > newestEntry!) {
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
  public async executeWithCache<T>(
    content: string,
    fn: () => Promise<{ html: string, data?: T }>
  ): Promise<{ html: string, data?: T, fromCache: boolean }> {
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

// Exportar instancia única
export const cacheManager = CacheManager.getInstance();

export default cacheManager; 