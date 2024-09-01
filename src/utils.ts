import { readdir } from 'node:fs/promises'
import path from 'node:path'
import chalk from 'chalk'
import { Dirent } from 'node:fs'
import callsites from 'callsites'

export const getCallSite = () => {
  const allSites = callsites()
  const sites = allSites.filter(
    (site) => site.getFileName().indexOf('gherklin') === -1 && site.getFileName().indexOf('node:') === -1,
  )

  return sites[0].getFileName().replace('file://', '')
}

export const getFiles = async (dir: string, ext: string): Promise<Array<string>> => {
  const callingFile = getCallSite()
  const dirName = path.dirname(callingFile)
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
