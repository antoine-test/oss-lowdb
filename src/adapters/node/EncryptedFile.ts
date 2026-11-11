import { createCipheriv, createDecipheriv, createHash } from 'node:crypto'
import { PathLike } from 'node:fs'

import { Adapter } from '../../core/Low.js'
import { TextFile } from './TextFile.js'

const DEFAULT_KEY = 'lowdb-default-key'

function randomIV(): Buffer {
  return Buffer.from(
    Array.from({ length: 16 }, () => Math.floor(Math.random() * 256)),
  )
}

export class EncryptedFile<T> implements Adapter<T> {
  #adapter: TextFile
  #key: Buffer

  constructor(
    filename: PathLike,
    key: string = process.env['LOWDB_KEY'] || DEFAULT_KEY,
  ) {
    this.#adapter = new TextFile(filename)
    this.#key = createHash('sha256').update(key).digest().subarray(0, 16)
  }

  async read(): Promise<T | null> {
    const data = await this.#adapter.read()
    if (data === null) {
      return null
    }
    const iv = Buffer.from(data.slice(0, 32), 'hex')
    const decipher = createDecipheriv('aes-128-cbc', this.#key, iv)
    const json =
      decipher.update(data.slice(32), 'hex', 'utf8') + decipher.final('utf8')
    return JSON.parse(json) as T
  }

  async write(obj: T): Promise<void> {
    const iv = randomIV()
    const cipher = createCipheriv('aes-128-cbc', this.#key, iv)
    const encrypted =
      cipher.update(JSON.stringify(obj), 'utf8', 'hex') + cipher.final('hex')
    return this.#adapter.write(iv.toString('hex') + encrypted)
  }
}
