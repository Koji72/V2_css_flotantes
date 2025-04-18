export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

export class LazyLoader {
  private loaded: Set<string>;
  private loading: Map<string, Promise<any>>;

  constructor() {
    this.loaded = new Set();
    this.loading = new Map();
  }

  async load<T>(path: string): Promise<T> {
    if (this.loaded.has(path)) {
      return this.loading.get(path) as Promise<T>;
    }

    if (this.loading.has(path)) {
      return this.loading.get(path) as Promise<T>;
    }

    const loadPromise = import(path).then(module => {
      this.loaded.add(path);
      this.loading.delete(path);
      return module.default as T;
    });

    this.loading.set(path, loadPromise);
    return loadPromise;
  }

  isLoaded(path: string): boolean {
    return this.loaded.has(path);
  }

  isLoading(path: string): boolean {
    return this.loading.has(path);
  }

  clear(): void {
    this.loaded.clear();
    this.loading.clear();
  }
}

export class VirtualDOM {
  private current: Map<string, VNode>;
  private next: Map<string, VNode>;

  constructor() {
    this.current = new Map();
    this.next = new Map();
  }

  diff(current: Map<string, VNode>, next: Map<string, VNode>): Patch[] {
    const patches: Patch[] = [];

    // Encontrar nodos nuevos y modificados
    for (const [id, nextNode] of next.entries()) {
      const currentNode = current.get(id);
      if (!currentNode) {
        patches.push({ type: 'CREATE', id, node: nextNode });
      } else if (!this.isEqual(currentNode, nextNode)) {
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

  private isEqual(node1: VNode, node2: VNode): boolean {
    if (node1.type !== node2.type) return false;
    if (JSON.stringify(node1.props) !== JSON.stringify(node2.props)) return false;
    if (node1.children.length !== node2.children.length) return false;

    for (let i = 0; i < node1.children.length; i++) {
      if (!this.isEqual(node1.children[i], node2.children[i])) {
        return false;
      }
    }

    return true;
  }

  update(nextNodes: VNode[]): Patch[] {
    this.next.clear();
    nextNodes.forEach(node => this.next.set(node.id, node));

    const patches = this.diff(this.current, this.next);
    this.current = new Map(this.next);
    return patches;
  }
}

export interface VNode {
  id: string;
  type: string;
  props: Record<string, any>;
  children: VNode[];
}

export interface Patch {
  type: 'CREATE' | 'UPDATE' | 'DELETE';
  id: string;
  node?: VNode;
}

export class PerformanceMonitor {
  private metrics: Map<string, number[]>;
  private maxSamples: number;

  constructor(maxSamples: number = 100) {
    this.metrics = new Map();
    this.maxSamples = maxSamples;
  }

  record(metric: string, value: number): void {
    if (!this.metrics.has(metric)) {
      this.metrics.set(metric, []);
    }

    const samples = this.metrics.get(metric)!;
    samples.push(value);

    if (samples.length > this.maxSamples) {
      samples.shift();
    }
  }

  getAverage(metric: string): number {
    const samples = this.metrics.get(metric);
    if (!samples || samples.length === 0) return 0;

    const sum = samples.reduce((a, b) => a + b, 0);
    return sum / samples.length;
  }

  getMin(metric: string): number {
    const samples = this.metrics.get(metric);
    if (!samples || samples.length === 0) return 0;
    return Math.min(...samples);
  }

  getMax(metric: string): number {
    const samples = this.metrics.get(metric);
    if (!samples || samples.length === 0) return 0;
    return Math.max(...samples);
  }

  getReport(): Record<string, { avg: number; min: number; max: number }> {
    const report: Record<string, { avg: number; min: number; max: number }> = {};

    for (const [metric, samples] of this.metrics.entries()) {
      report[metric] = {
        avg: this.getAverage(metric),
        min: this.getMin(metric),
        max: this.getMax(metric)
      };
    }

    return report;
  }

  clear(): void {
    this.metrics.clear();
  }
} 