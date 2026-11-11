import { deepEqual, equal } from 'node:assert/strict'
import test from 'node:test'

import { Adapter } from '../core/Low.js'
import { CachedAdapter } from './CachedAdapter.js'
import { Memory } from './Memory.js'

function countReads<T>(adapter: Adapter<T>): { adapter: Adapter<T>; reads: () => number } {
  let reads = 0
  return {
    adapter: {
      read: () => {
        reads++
        return adapter.read()
      },
      write: (data: T) => adapter.write(data),
    },
    reads: () => reads,
  }
}

await test('CachedAdapter serves reads from the cache', async () => {
  const memory = new Memory<{ a: number }>()
  await memory.write({ a: 1 })
  const { adapter, reads } = countReads(memory)
  const cached = new CachedAdapter(adapter, 1000)

  await cached.read()
  await cached.read()

  equal(reads(), 1)
  deepEqual(cached.stats, { hits: 1, misses: 1 })
})

await test('CachedAdapter writes through', async () => {
  const memory = new Memory<{ a: number }>()
  const cached = new CachedAdapter(memory)

  await cached.write({ a: 2 })

  deepEqual(await memory.read(), { a: 2 })
  deepEqual(await cached.read(), { a: 2 })
})

await test('CachedAdapter invalidate', async () => {
  const memory = new Memory<{ a: number }>()
  await memory.write({ a: 1 })
  const { adapter, reads } = countReads(memory)
  const cached = new CachedAdapter(adapter, 1000)

  await cached.read()
  cached.invalidate()
  await cached.read()

  equal(reads(), 2)
})
