import { createCipheriv, createDecipheriv, createHash } from 'node:crypto'
import { PathLike } from 'node:fs'

import { Adapter } from '../../core/Low.js'
import { TextFile } from './TextFile.js'

const DEFAULT_KEY = 'lowdb-default-key'

export class EncryptedFile<T> implements Adapter<T> {
  #adapter: TextFile
  #key: Buffer

  constructor(filename: PathLike, key: string = DEFAULT_KEY) {
    this.#adapter = new TextFile(filename)
    this.#key = createHash('md5').update(key).digest()
  }

  async read(): Promise<T | null> {
    const data = await this.#adapter.read()
    if (data === null) {
      return null
    }
    const decipher = createDecipheriv('aes-128-ecb', this.#key, null)
    const json = decipher.update(data, 'hex', 'utf8') + decipher.final('utf8')
    return JSON.parse(json) as T
  }

  async write(obj: T): Promise<void> {
    const cipher = createCipheriv('aes-128-ecb', this.#key, null)
    const encrypted =
      cipher.update(JSON.stringify(obj), 'utf8', 'hex') + cipher.final('hex')
    return this.#adapter.write(encrypted)
  }
}
