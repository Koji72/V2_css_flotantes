export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: number;
  level: LogLevel;
  message: string;
  data?: any;
  context?: Record<string, any>;
}

export class Logger {
  private static instance: Logger;
  private entries: LogEntry[];
  private maxEntries: number;
  private subscribers: Set<(entry: LogEntry) => void>;

  private constructor(maxEntries: number = 1000) {
    this.entries = [];
    this.maxEntries = maxEntries;
    this.subscribers = new Set();
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(level: LogLevel, message: string, data?: any, context?: Record<string, any>): void {
    const entry: LogEntry = {
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

  debug(message: string, data?: any, context?: Record<string, any>): void {
    this.log('debug', message, data, context);
  }

  info(message: string, data?: any, context?: Record<string, any>): void {
    this.log('info', message, data, context);
  }

  warn(message: string, data?: any, context?: Record<string, any>): void {
    this.log('warn', message, data, context);
  }

  error(message: string, data?: any, context?: Record<string, any>): void {
    this.log('error', message, data, context);
  }

  subscribe(callback: (entry: LogEntry) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(entry: LogEntry): void {
    this.subscribers.forEach(callback => callback(entry));
  }

  private consoleLog(level: LogLevel, message: string, data?: any): void {
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

  getEntries(level?: LogLevel, startTime?: number, endTime?: number): LogEntry[] {
    return this.entries.filter(entry => {
      if (level && entry.level !== level) return false;
      if (startTime && entry.timestamp < startTime) return false;
      if (endTime && entry.timestamp > endTime) return false;
      return true;
    });
  }

  clear(): void {
    this.entries = [];
  }

  toJSON(): LogEntry[] {
    return this.entries;
  }

  fromJSON(entries: LogEntry[]): void {
    this.entries = entries;
  }
}

export class MetricsCollector {
  private metrics: Map<string, number[]>;
  private maxSamples: number;
  private subscribers: Set<(metric: string, value: number) => void>;

  constructor(maxSamples: number = 100) {
    this.metrics = new Map();
    this.maxSamples = maxSamples;
    this.subscribers = new Set();
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

    this.notifySubscribers(metric, value);
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

  getPercentile(metric: string, percentile: number): number {
    const samples = this.metrics.get(metric);
    if (!samples || samples.length === 0) return 0;

    const sorted = [...samples].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  subscribe(callback: (metric: string, value: number) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(metric: string, value: number): void {
    this.subscribers.forEach(callback => callback(metric, value));
  }

  getReport(): Record<string, { avg: number; min: number; max: number; p95: number }> {
    const report: Record<string, { avg: number; min: number; max: number; p95: number }> = {};

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

  clear(): void {
    this.metrics.clear();
  }

  toJSON(): Record<string, number[]> {
    return Object.fromEntries(this.metrics);
  }

  fromJSON(data: Record<string, number[]>): void {
    this.metrics.clear();
    Object.entries(data).forEach(([metric, samples]) => {
      this.metrics.set(metric, samples);
    });
  }
} 