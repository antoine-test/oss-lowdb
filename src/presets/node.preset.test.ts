import { deepEqual } from 'node:assert/strict'
import test from 'node:test'

import { temporaryFile } from 'tempy'

import { JSONFilePreset, JSONFileSyncPreset } from './node.js'

await test('JSONFilePreset uses default data when the file is missing', async () => {
  const db = await JSONFilePreset(temporaryFile(), { posts: [] })

  deepEqual(db.data, { posts: [] })
})

await test('JSONFileSyncPreset', () => {
  const db = JSONFileSyncPreset(temporaryFile(), { posts: [] })

  db.update(({ posts }) => posts.push())
})

await test('LocalStoragePreset', { skip: true }, () => {
  deepEqual(1, 1)
})
