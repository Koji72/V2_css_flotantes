// Eliminamos la importación no utilizada
// import { ProcessedPanel } from './processLayoutElements';

interface CacheMetrics {
  hits: number;
  misses: number;
  size: number;
  lastCleanup: number;
  hitRate: number;
}

interface CacheEntry {
  value: string;
  timestamp: number;
  size: number;
}

export class CacheManager {
  private static instance: CacheManager;
  private panelCache: Map<string, CacheEntry>;
  private documentCache: Map<string, CacheEntry>;
  private metrics: CacheMetrics;
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024; // 50MB
  private readonly CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_ENTRY_AGE = 30 * 60 * 1000; // 30 minutes

  private constructor() {
    this.panelCache = new Map();
    this.documentCache = new Map();
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      lastCleanup: Date.now(),
      hitRate: 0
    };

    // Iniciar limpieza periódica
    setInterval(() => this.cleanup(), this.CLEANUP_INTERVAL);
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public getPanel(key: string): string | null {
    const entry = this.panelCache.get(key);
    if (entry && this.isValidEntry(entry)) {
      this.metrics.hits++;
      return entry.value;
    }
    this.metrics.misses++;
    return null;
  }

  public getDocument(key: string): string | null {
    const entry = this.documentCache.get(key);
    if (entry && this.isValidEntry(entry)) {
      this.metrics.hits++;
      return entry.value;
    }
    this.metrics.misses++;
    return null;
  }

  public setPanel(key: string, value: string): void {
    const size = this.calculateSize(value);
    if (this.willExceedLimit(size)) {
      this.cleanup();
    }
    
    this.panelCache.set(key, {
      value,
      timestamp: Date.now(),
      size
    });
    
    this.metrics.size += size;
  }

  public setDocument(key: string, value: string): void {
    const size = this.calculateSize(value);
    if (this.willExceedLimit(size)) {
      this.cleanup();
    }
    
    this.documentCache.set(key, {
      value,
      timestamp: Date.now(),
      size
    });
    
    this.metrics.size += size;
  }

  private isValidEntry(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp < this.MAX_ENTRY_AGE;
  }

  private willExceedLimit(newSize: number): boolean {
    return this.metrics.size + newSize > this.MAX_CACHE_SIZE;
  }

  private calculateSize(value: string): number {
    return new TextEncoder().encode(value).length;
  }

  private cleanup(): void {
    const now = Date.now();
    let removedSize = 0;

    // Limpiar caché de paneles
    Array.from(this.panelCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.MAX_ENTRY_AGE) {
        this.panelCache.delete(key);
        removedSize += entry.size;
      }
    });

    // Limpiar caché de documentos
    Array.from(this.documentCache.entries()).forEach(([key, entry]) => {
      if (now - entry.timestamp > this.MAX_ENTRY_AGE) {
        this.documentCache.delete(key);
        removedSize += entry.size;
      }
    });

    this.metrics.size -= removedSize;
    this.metrics.lastCleanup = now;
  }

  public getMetrics(): CacheMetrics {
    return {
      ...this.metrics,
      hitRate: this.metrics.hits / (this.metrics.hits + this.metrics.misses) || 0
    };
  }

  public clear(): void {
    this.panelCache.clear();
    this.documentCache.clear();
    this.metrics = {
      hits: 0,
      misses: 0,
      size: 0,
      lastCleanup: Date.now(),
      hitRate: 0
    };
  }
} 