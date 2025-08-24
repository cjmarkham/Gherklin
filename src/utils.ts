import { Dirent } from 'node:fs'
import { readdir } from 'node:fs/promises'
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

export const camelise = (str: string): string => str
  .split(' ')
  .map((e,i) => i
      ? e.charAt(0).toUpperCase() + e.slice(1).toLowerCase()
      : e.toLowerCase(),
  )
  .join('')

// https://gist.github.com/keesey/e09d0af833476385b9ee13b6d26a2b84
export function levenshtein(a: string, b: string): number {
  const an = a ? a.length : 0
  const bn = b ? b.length : 0
  if (an === 0) {
    return bn
  }
  if (bn === 0) {
    return an
  }
  const matrix = new Array<number[]>(bn + 1)
  for (let i = 0; i <= bn; ++i) {
    let row = (matrix[i] = new Array<number>(an + 1))
    row[0] = i
  }
  const firstRow = matrix[0]
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] =
          Math.min(
            matrix[i - 1][j - 1], // substitution
            matrix[i][j - 1], // insertion
            matrix[i - 1][j], // deletion
          ) + 1
      }
    }
  }
  return matrix[bn][an]
}
