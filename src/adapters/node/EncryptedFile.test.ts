import { deepEqual, equal } from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

import { temporaryFile } from 'tempy'

import { EncryptedFile } from './EncryptedFile.js'

await test('EncryptedFile', async () => {
  const file = temporaryFile()
  const adapter = new EncryptedFile<{ a: number }>(file, 'secret')

  equal(await adapter.read(), null)

  await adapter.write({ a: 1 })

  deepEqual(await adapter.read(), { a: 1 })
  equal(fs.readFileSync(file, 'utf-8').includes('"a"'), false)
})
