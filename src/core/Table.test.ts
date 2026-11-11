import { deepEqual, equal } from 'node:assert/strict'
import test from 'node:test'

import { Memory } from '../adapters/Memory.js'
import { Low } from './Low.js'
import { Table } from './Table.js'

type User = { id: number; name: string }

function createTable(rows: User[] = []): Table<User> {
  return new Table(new Low(new Memory<{ rows: User[] }>(), { rows }))
}

await test('Table insert and find', async () => {
  const table = createTable()

  await table.insert({ id: 1, name: 'foo' })

  deepEqual(table.find(1), { id: 1, name: 'foo' })
})

await test('Table remove', async () => {
  const table = createTable([
    { id: 1, name: 'foo' },
    { id: 2, name: 'bar' },
  ])

  equal(await table.remove(1), true)

  equal(table.find(1), undefined)
  deepEqual(table.find(2), { id: 2, name: 'bar' })
})

await test('Table remove unknown id', async () => {
  const table = createTable([{ id: 1, name: 'foo' }])

  await table.remove(42)
})

await test('Table nextId', () => {
  const table = createTable([{ id: 3, name: 'foo' }])

  equal(table.nextId(), 4)
})

await test('Table nextId on empty table', { skip: true }, () => {
  equal(createTable().nextId(), 1)
})
