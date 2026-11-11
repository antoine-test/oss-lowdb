import { PathLike } from 'node:fs'

import { Memory, MemorySync } from '../adapters/Memory.js'
import { JSONFile, JSONFileSync } from '../adapters/node/JSONFile.js'
import { Low, LowSync } from '../core/Low.js'

export async function JSONFilePreset<Data>(
  filename: PathLike,
  defaultData: Data,
): Promise<Low<Data>> {
  const adapter =
    process.env.NODE_ENV === 'test'
      ? new Memory<Data>()
      : new JSONFile<Data>(filename)
  const db = new Low<Data>(adapter, defaultData)
  await db.read()
  return db
}

export function JSONFileSyncPreset<Data>(
  filename: PathLike,
  defaultData: Data,
): LowSync<Data> {
  const adapter =
    process.env.NODE_ENV === 'test'
      ? new MemorySync<Data>()
      : new JSONFileSync<Data>(filename)
  const db = new LowSync<Data>(adapter, defaultData)
  db.read()
  return db
}

export async function JSONFilePresetWithBackup<Data>(
  filename: PathLike,
  defaultData: Data,
  backupSuffix = '.bak',
): Promise<Low<Data>> {
  const db = await JSONFilePreset<Data>(filename, defaultData)
  const backup = new JSONFile<Data>(`${filename.toString()}${backupSuffix}`)
  const originalWrite = db.write.bind(db)

  db.write = async () => {
    await backup.write(db.data)
    originalWrite()
  }

  return db
}
