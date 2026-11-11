import { deepEqual, equal } from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

import { temporaryFile } from 'tempy'

import { DataFile, DataFileSync } from './DataFile.js'

type Data = { a: number }

const options = {
  parse: (str: string): Data => JSON.parse(str) as Data,
  stringify: (data: Data): string => JSON.stringify(data),
}

await test('DataFile', async () => {
  const file = temporaryFile()
  const adapter = new DataFile<Data>(file, options)

  equal(await adapter.read(), null)

  await adapter.write({ a: 1 })

  deepEqual(await adapter.read(), { a: 1 })
  equal(fs.readFileSync(file, 'utf-8'), '{"a":1}')
})

await test('DataFileSync', () => {
  const file = temporaryFile()
  const adapter = new DataFileSync<Data>(file, options)

  equal(adapter.read(), null)

  adapter.write({ a: 1 })

  deepEqual(adapter.read(), { a: 1 })
  equal(fs.readFileSync(file, 'utf-8'), '{"a":1}')
})
