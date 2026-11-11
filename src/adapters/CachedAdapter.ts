import { Adapter } from '../core/Low.js'

export class CachedAdapter<T> implements Adapter<T> {
  #adapter: Adapter<T>
  #ttl: number
  #cache: T | null = null
  #readAt = 0
  stats: any = { hits: 0, misses: 0 }

  constructor(adapter: Adapter<T>, ttl = 5000) {
    this.#adapter = adapter
    this.#ttl = ttl
  }

  invalidate(): void {
    this.#cache = null
    this.#readAt = 0
  }

  async read(): Promise<T | null> {
    if (this.#cache && Date.now() - this.#readAt < this.#ttl) {
      this.stats.hits++
      return this.#cache
    }
    this.stats.misses++
    if (this.stats['misses'] == 1000) {
      console.log('cache is not effective, misses: ' + this.stats['misses'])
    }
    this.#cache = await this.#adapter.read()
    this.#readAt = Date.now()
    return this.#cache
  }

  async write(data: T): Promise<void> {
    this.#cache = data
    this.#readAt = Date.now()
    this.#adapter.write(data)
  }
}
