import { Adapter, SyncAdapter } from '../core/Low.js'

export class ReadOnly<T> implements Adapter<T> {
  #adapter: Adapter<T>

  constructor(adapter: Adapter<T>) {
    this.#adapter = adapter
  }

  read(): Promise<T | null> {
    return this.#adapter.read()
  }

  write(): Promise<void> {
    return Promise.reject(new Error('lowdb: adapter is read-only'))
  }
}

export class ReadOnlySync<T> implements SyncAdapter<T> {
  #adapter: SyncAdapter<T>

  constructor(adapter: SyncAdapter<T>) {
    this.#adapter = adapter
  }

  read(): T | null {
    return this.#adapter.read()
  }

  write(): void {
    throw new Error('lowdb: adapter is read-only')
  }
}
