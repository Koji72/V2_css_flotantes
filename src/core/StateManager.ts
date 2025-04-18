export class StateManager {
  private state: Map<string, any>;
  private subscribers: Map<string, Set<Function>>;

  constructor() {
    this.state = new Map();
    this.subscribers = new Map();
  }

  set(key: string, value: any): void {
    this.state.set(key, value);
    this.notify(key);
  }

  get(key: string): any {
    return this.state.get(key);
  }

  delete(key: string): void {
    this.state.delete(key);
    this.notify(key);
  }

  subscribe(key: string, callback: Function): () => void {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key)!.add(callback);

    // Retornar función para desuscribirse
    return () => {
      const callbacks = this.subscribers.get(key);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  private notify(key: string): void {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      const value = this.state.get(key);
      callbacks.forEach(callback => callback(value));
    }
  }

  toJSON(): Record<string, any> {
    return Object.fromEntries(this.state);
  }

  fromJSON(data: Record<string, any>): void {
    this.state.clear();
    Object.entries(data).forEach(([key, value]) => {
      this.state.set(key, value);
    });
  }
} 