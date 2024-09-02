import path from 'node:path'

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
  configDirectory?: string
  customRulesDirectory?: string
  featureDirectory?: string
  rules?: RuleConfiguration
}

export interface RuleDefinition {
  schema: any
  run: Function
}

const validateConfiguration = (configuration: Config): void => {
  if (!configuration) {
    throw new Error(`Could not find a gherkin-lint.config.ts configuration file.`)
  }

  if (!configuration.featureDirectory) {
    throw new Error(`Could not find a featureDirectory configuration option.`)
  }

  if (!configuration.rules) {
    throw new Error(`Could not find a rules configuration option.`)
  }
}

// Get the config file from the current directory
export const getConfigurationFromFile = async (): Promise<Config> => {
  const importPath = path.join(process.cwd(), 'gherklin.config.ts')
  const module = await import(importPath)
  if (!('default' in module)) {
    throw new Error(`config file at ${importPath} did not export a default function!`)
  }

  const config = module.default as Config
  config.configDirectory = process.cwd()

  validateConfiguration(config)

  return config
}
