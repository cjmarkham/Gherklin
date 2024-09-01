import { readdir } from 'node:fs/promises'
import chalk from 'chalk'
import { Dirent } from 'node:fs'

export const getFiles = async (dir: string, ext: string): Promise<Array<string>> => {
  const dirents = await readdir(dir, { withFileTypes: true, recursive: true }).catch(() => {
    console.error(chalk.red(`[GherkinLint] Could not load ".${ext}" files from ${dir}`))
    return []
  })

  const files = dirents
    .filter((dirent: Dirent) => dirent.name.endsWith(`.${ext}`))
    .map((dirent: Dirent) => `${dirent.path}/${dirent.name}`)
  return Array.prototype.concat(...files)
}
