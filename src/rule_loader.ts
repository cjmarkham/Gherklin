import path from 'node:path'
import { existsSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

import Rule from './rule'
import Document from './document'
import { LintError, RawSchema } from './types'
import Config from './config'

export default class RuleLoader {
  private config: Config

  private rules: Array<Rule> = []

  public constructor(config: Config) {
    this.config = config
  }

  public load = async (
    ruleName: string,
    rawSchema: RawSchema,
    customDir?: string,
  ): Promise<void> => {
    let location = path.resolve(import.meta.dirname, `./rules/${ruleName}.ts`)

    // If this rule doesn't appear in the defaults,
    // we'll need to look for it in the custom rules dir
    if (!existsSync(location)) {
      if (customDir) {
        // Import files relative to the location of the config file
        const customLocation = path.join(this.config.configDirectory, customDir, `${ruleName}.ts`)

        if (!existsSync(customLocation)) {
          throw new Error(`could not find rule "${ruleName}" in default rules or "${customDir}".`)
        }
        location = customLocation
      } else {
        throw new Error(
          `could not find rule "${ruleName}" in default rules.\nIf this is a custom rule, please specify "customRulesDirectory" in the config.`,
        )
      }
    }

    const klass = await import(pathToFileURL(location.replace('.ts', '')).href)
    this.rules.push(new klass.default(rawSchema))
  }

  public validateRules = (): Map<string, Array<string>> => {
    const errors: Map<string, Array<string>> = new Map()

    this.rules.forEach((rule): void => {
      const schemaErrors = rule.schema.validate(rule.acceptedSchema)
      if (schemaErrors.length) {
        errors.set(rule.name, schemaErrors)
      }
    })

    return errors
  }

  public runRules = async (document: Document): Promise<Array<LintError>> => {
    for (const rule of this.rules) {
      if (!rule.schema.enabled || document.disabled) {
        continue
      }

      // Attempt to fix the original document
      if (this.config.fix === true && rule.fix !== undefined) {
        await rule.fix(document)
      }

      await rule.run(document)
    }

    return document.errors
  }
}
