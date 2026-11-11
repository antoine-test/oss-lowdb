import { Adapter } from '../core/Low.js'

export class CachedAdapter<T> implements Adapter<T> {
  #adapter: Adapter<T>
  #ttl: number
  #cache: T | null = null
  #readAt = 0

  constructor(adapter: Adapter<T>, ttl = 5000) {
    this.#adapter = adapter
    this.#ttl = ttl
  }

  async read(): Promise<T | null> {
    if (this.#cache && Date.now() - this.#readAt < this.#ttl) {
      return this.#cache
    }
    this.#cache = await this.#adapter.read()
    this.#readAt = Date.now()
    return this.#cache
  }

  async write(data: T): Promise<void> {
    this.#cache = data
    this.#adapter.write(data)
  }
}
