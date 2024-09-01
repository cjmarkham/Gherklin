import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { Dirent } from 'node:fs'
import callerCallsite from 'caller-callsite'
import callsites from 'callsites'
import { getCallSite } from './utils'

export interface GlobalConfiguration {
  config?: Config
  configDirectory?: string
}

export interface GherkinKeywordNumericals {
  feature?: number
  background?: number
  scenario?: number
  step?: number
  examples?: number
  given?: number
  when?: number
  then?: number
  and?: number
  but?: number
  exampleTableHeader?: number
  exampleTableBody?: number
}

export enum Switch {
  off = 'off',
  on = 'on',
}

export enum Severity {
  warn = 'warn',
  error = 'error',
}

export type RuleArguments =
  | Severity
  | Switch
  | GherkinKeywordNumericals
  | Array<string>
  | [string, GherkinKeywordNumericals | Array<string>]

export interface RuleConfiguration {
  [ruleName: string]: RuleArguments
}

export interface Config {
  configLocation: string
  customRulesDir?: string
  directory: string
  rules: RuleConfiguration
}

export interface RuleDefinition {
  schema: any
  run: Function
}

// Look for a configuration file in the root, or using the directory passed in
export const getConfigurationFromFile = async (directory?: string): Promise<Config> => {
  if (!directory) {
    directory = '.'
  }

  const callingFile = getCallSite()
  const dirName = path.dirname(callingFile)
  const resolved = path.join(dirName, directory)

  const dirents = await readdir(resolved, { withFileTypes: true }).catch(() => {
    return []
  })

  const configFile = dirents.find((dirent: Dirent) => {
    return dirent.name === 'gherkin-lint.config.ts'
  })
  if (!configFile) {
    return
  }

  const config = (await import(`${configFile.path}/${configFile.name}`)).default
  return {
    configLocation: configFile.path,
    directory: config.directory,
    customRulesDir: config.customRulesDir,
    rules: config.rules,
  } as Config
}
