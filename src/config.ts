import { readdir } from 'node:fs/promises'
import path from 'node:path'
import { Dirent } from 'node:fs'

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
  const dirents = await readdir(path.resolve(directory), { withFileTypes: true }).catch(() => {
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
    directory: config.directory,
    customRulesDir: config.customRulesDir,
    rules: config.rules,
  } as Config
}
