import { readdir } from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'
import { Dirent } from 'node:fs'
import callerCallsite from 'caller-callsite'

export const getFiles = async (dir: string, ext: string): Promise<Array<string>> => {
  const callsite = callerCallsite()
  const fileName = callsite.getFileName().replace('file://', '')
  const dirName = path.dirname(fileName)
  const resolved = path.join(dirName, dir)

  const dirents = await readdir(resolved, { withFileTypes: true, encoding: 'utf-8' }).catch((err) => {
    console.error(chalk.red(`[GherkinLint] Could not read directory ${resolved}\n`), err)
    return []
  })

  const files = dirents
    .filter((dirent: Dirent) => dirent.name.endsWith(`.${ext}`))
    .map((dirent: Dirent) => `${dirent.path}/${dirent.name}`)
  return Array.prototype.concat(...files)
}
