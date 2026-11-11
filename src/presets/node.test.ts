import { deepEqual } from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

import { temporaryFile } from 'tempy'

import {
  JSONFilePresetWithBackup,
  JSONFileSyncPresetWithBackup,
} from './node.js'

await test('JSONFilePresetWithBackup', async () => {
  const file = temporaryFile()
  const db = await JSONFilePresetWithBackup(file, { a: 1 })

  db.data.a = 2
  await db.write()

  deepEqual(JSON.parse(fs.readFileSync(file, 'utf-8')), { a: 2 })
  deepEqual(JSON.parse(fs.readFileSync(`${file}.bak`, 'utf-8')), { a: 2 })
})

await test('JSONFileSyncPresetWithBackup', () => {
  const file = temporaryFile()
  const db = JSONFileSyncPresetWithBackup(file, { a: 1 })

  db.data.a = 2
  db.write()

  deepEqual(JSON.parse(fs.readFileSync(file, 'utf-8')), { a: 2 })
  deepEqual(JSON.parse(fs.readFileSync(`${file}.bak`, 'utf-8')), { a: 2 })
})
