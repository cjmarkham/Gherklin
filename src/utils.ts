import { Dirent } from 'node:fs'
import { readdir } from 'node:fs/promises'
import { Comment } from '@cucumber/messages'
import chalk from 'chalk'

export const getFiles = async (dir: string, ext: string): Promise<Array<string>> => {
  const dirents = await readdir(dir, { withFileTypes: true, recursive: true }).catch((): never => {
    throw new Error(chalk.red(`[GherkinLint] Could not load ".${ext}" files from ${dir}`))
  })

  const files = dirents
    .filter((dirent: Dirent) => dirent.name.endsWith(`.${ext}`))
    .map((dirent: Dirent) => `${dirent.path}/${dirent.name}`)
  return Array.prototype.concat(...files)
}

export const lineDisabled = (comments: readonly Comment[], lineNumber: number): boolean => {
  return (
    comments.filter((comment) => {
      return comment.text.match(/#\s?gherklin-disable-next-line/) && comment.location.line === lineNumber - 1
    }).length > 0
  )
}
