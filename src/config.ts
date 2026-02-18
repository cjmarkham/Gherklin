import path from 'node:path'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import { GherklinConfiguration, ReporterConfig, RuleConfiguration } from './types'

/**
 * The config class is responsible for loading and parsing config.
 *
 * It can accept inline config passed to its constructor.
 * It can also load configuration from a gherklin.config.ts file.
 *
 * Once loaded, the config is parsed and added to member variables for access.
 */
export default class Config {
  // The directory where the gherklin.config.ts file is located
  public configDirectory?: string

  // The directory housing custom rules
  public customRulesDirectory?: string

  // The directory where the features are located
  public featureDirectory?: string

  // The max amount of errors before the process fails
  public maxErrors?: number

  // Configuration for each rule
  public rules?: RuleConfiguration

  // Configuration for the reporter
  public reporter?: ReporterConfig

  // The feature file to test
  public featureFile?: string

  // Whether or not to attempt to fix issues
  public fix?: boolean

  public constructor(inlineConfig?: GherklinConfiguration) {
    if (inlineConfig) {
      this.parse(inlineConfig)

      this.validate()
    }
  }

  private parse = (config: GherklinConfiguration): void => {
    this.configDirectory = config.configDirectory
    this.customRulesDirectory = config.customRulesDirectory
    this.featureDirectory = config.featureDirectory
    this.rules = config.rules
    this.reporter = config.reporter
    this.featureFile = config.featureFile
    this.maxErrors = config.maxErrors
    this.fix = config.fix
  }

  /**
   * Attempts to load config from a gherklin.config.ts file
   */
  public fromFile = async (): Promise<Config> => {
    let importPath = path.join(process.cwd(), 'gherklin.config.ts')
    let configDir = process.cwd()

    if (!existsSync(importPath)) {
      const envPath = process.env.GHERKLIN_CONFIG_FILE
      if (envPath && existsSync(envPath)) {
        importPath = envPath
        configDir = path.dirname(envPath)
      } else {
        throw new Error(`could not find gherklin.config.ts or GHERKLIN_CONFIG_FILE environment variable`)
      }
    }

    const module = await import(pathToFileURL(importPath).href)
    if (!('default' in module)) {
      throw new Error(`config file did not export a default function`)
    }

    const config = module.default as GherklinConfiguration
    config.configDirectory = configDir

    this.parse(config)
    this.validate()

    return this
  }

  /**
   * Validates that the configuration contains all the neccessary
   * information for Gherklin to run.
   */
  public validate = (): void => {
    const hasEnvFiles = !!process.env.GHERKLIN_FEATURE_FILES
    const hasEnvDir = !!process.env.GHERKLIN_FEATURE_DIR

    if (!this.featureDirectory && !this.featureFile && !hasEnvFiles && !hasEnvDir) {
      throw new Error('Please specify either a featureDirectory or featureFile configuration option, or set GHERKLIN_FEATURE_DIR or GHERKLIN_FEATURE_FILES environment variable.')
    }

    if (!this.rules) {
      throw new Error('Please specify a list of rules in your configuration.')
    }

    if (!Object.keys(this.rules).length) {
      throw new Error('Please specify a list of rules in your configuration.')
    }

    if (this.featureDirectory && this.featureFile) {
      throw new Error('Please only specify either a feature file or feature directory.')
    }
  }
}
