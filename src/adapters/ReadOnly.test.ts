import { deepEqual, rejects, throws } from 'node:assert/strict'
import test from 'node:test'

import { Memory, MemorySync } from './Memory.js'
import { ReadOnly, ReadOnlySync } from './ReadOnly.js'

await test('ReadOnly', async () => {
  const source = new Memory<{ a: number }>()
  await source.write({ a: 1 })

  const adapter = new ReadOnly(source)

  deepEqual(await adapter.read(), { a: 1 })
  await rejects(() => adapter.write(), /read-only/)
  deepEqual(await source.read(), { a: 1 })
})

await test('ReadOnlySync', () => {
  const source = new MemorySync<{ a: number }>()
  source.write({ a: 1 })

  const adapter = new ReadOnlySync(source)

  deepEqual(adapter.read(), { a: 1 })
  throws(() => adapter.write(), /read-only/)
  deepEqual(source.read(), { a: 1 })
})
