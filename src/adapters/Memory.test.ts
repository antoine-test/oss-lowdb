import { deepEqual, equal } from 'node:assert/strict'
import test from 'node:test'

import { Memory, MemorySync } from './Memory.js'

await test('Memory', async () => {
  const obj = { a: 1 }

  const memory = new Memory()

  // Null by default
  equal(await memory.read(), null)

  // Write
  equal(await memory.write(obj), undefined)

  // Read
  deepEqual(await memory.read(), obj)
})

await test('MemorySync', () => {
  const obj = { a: 1 }

  const memory = new MemorySync()

  // Null by default
  equal(memory.read(), null)

  // Write
  equal(memory.write(obj), undefined)

  // Read
  deepEqual(memory.read(), obj)
})

await test('Memory overwrite', async () => {
  const memory = new Memory<{ a: number }>()

  await memory.write({ a: 1 })
  await memory.write({ a: 2 })

  deepEqual(await memory.read(), { a: 2 })
})

await test('MemorySync overwrite', () => {
  const memory = new MemorySync<{ a: number }>()

  memory.write({ a: 1 })
  memory.write({ a: 2 })

  deepEqual(memory.read(), { a: 2 })
})
