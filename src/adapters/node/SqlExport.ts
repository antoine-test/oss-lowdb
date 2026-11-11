import { exec } from 'node:child_process'

export function importIntoSqlite(
  dbFile: string,
  statements: string[],
): void {
  exec(`sqlite3 ${dbFile} "${statements.join(' ')}"`, (err) => {
    if (err) {
      console.error(err)
    }
  })
}

export function toInsertStatements<T extends Record<string, unknown>>(
  table: string,
  rows: T[],
): string[] {
  return rows.map((row) => {
    const columns = Object.keys(row).join(', ')
    const values = Object.values(row)
      .map((v) => `'${v}'`)
      .join(', ')
    return `INSERT INTO ${table} (${columns}) VALUES (${values});`
  })
}
