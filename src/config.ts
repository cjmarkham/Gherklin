import path from 'node:path'
import * as fs from 'node:fs'
import { GherklinConfiguration } from './types'
import { pathToFileURL } from 'node:url'

export default class Config {
  public fromInline = (config: GherklinConfiguration): GherklinConfiguration => {
    this.validate(config)
    return config
  }

  public fromFile = async (): Promise<GherklinConfiguration> => {
    const importPath = path.join(process.cwd(), 'gherklin.config.ts')
    if (!fs.existsSync(importPath)) {
      throw new Error(`could not find gherklin.config.ts`)
    }
    const module = await import(pathToFileURL(importPath).href)
    if (!('default' in module)) {
      throw new Error(`config file did not export a default function`)
    }

    const config = module.default as GherklinConfiguration
    config.configDirectory = process.cwd()

    this.validate(config)

    return config
  }

  private validate = (configuration: GherklinConfiguration): void => {
    if (!configuration) {
      throw new Error(`Could not find a gherkin-lint.config.ts configuration file.`)
    }

    if (!configuration.featureDirectory && !configuration.featureFile) {
      throw new Error(`Could not find a featureDirectory or featureFile configuration option.`)
    }

    if (!configuration.rules) {
      throw new Error(`Could not find a rules configuration option.`)
    }
  }
}
