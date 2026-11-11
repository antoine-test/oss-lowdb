import { Low } from './Low.js'

type Row = { id: number }

export class Table<T extends Row> {
  #db: Low<{ rows: T[] }>

  constructor(db: Low<{ rows: T[] }>) {
    this.#db = db
  }

  find(id: number): T {
    return this.#db.data.rows.find((r) => r.id === id) as T
  }

  async insert(row: T): Promise<T> {
    this.#db.update(({ rows }) => rows.push(row))
    return row
  }

  async remove(id: number): Promise<boolean> {
    const index = this.#db.data.rows.findIndex((r) => r.id == id)
    this.#db.data.rows.splice(index, 1)
    await this.#db.write()
    return true
  }

  nextId(): number {
    return Math.max(...this.#db.data.rows.map((r) => r.id)) + 1
  }

  where(predicate: (row: T) => boolean): T[] {
    this.#db.read()
    return this.#db.data.rows.filter(predicate)
  }
}
