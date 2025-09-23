export interface IComponent {
  render(): void;
  destroy(): void;
}

export interface IEventEmitter {
  on(event: string, handler: Function): void;
  off(event: string, handler: Function): void;
  emit(event: string, ...args: any[]): void;
}

export interface IDisposable {
  dispose(): void;
}

export interface ILifecycle {
  initialize(): Promise<void>;
  destroy(): Promise<void>;
}