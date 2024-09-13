import fs from 'node:fs'
import path from 'node:path'
import { GherkinDocument } from '@cucumber/messages'

import { LintError } from './error'
import Schema from './schema'
import { RawSchema, RuleDefinition } from './types'

export default class Rule {
  public schema: Schema

  public readonly name: string

  public ruleDefinition: RuleDefinition

  constructor(ruleName: string, ruleSchema: RawSchema) {
    this.name = ruleName
    this.schema = new Schema(ruleSchema)
  }

  public load = async (configLocation: string, customDir?: string): Promise<Error> => {
    // If this rule doesn't appear in the defaults, we'll need to look for it in the custom rules dir
    let location = path.resolve(import.meta.dirname, `./rules/${this.name}.ts`)

    if (!fs.existsSync(location)) {
      if (customDir) {
        // Import files relative to the location of the config file
        const resolved = path.join(configLocation, customDir, `${this.name}.ts`)

        if (!fs.existsSync(resolved)) {
          return new Error(`could not find rule "${this.name}" in "${location}" or "${resolved}"`)
        }
        location = resolved
      } else {
        return new Error(
          `could not find rule "${this.name}" in default rules.\nIf this is a custom rule, please specify a customRuleDir in the config.`,
        )
      }
    }

    this.ruleDefinition = await import(location.replace('.ts', ''))
  }

  public validate(): Map<string, Array<string>> {
    if (!this.ruleDefinition) {
      throw new Error('rule definition has not been loaded yet')
    }

    const errors: Map<string, Array<string>> = new Map()

    if (!this.ruleDefinition.schema) {
      errors.set(this.name, ['rule is missing a schema'])
    }

    if (typeof this.ruleDefinition.run !== 'function') {
      errors.set(this.name, ['rule has no export named "run"', ...errors.get(this.name)])
    }

    const schemaErrors = this.schema.validate(this.ruleDefinition.schema)
    if (schemaErrors.length) {
      errors.set(this.name, [...schemaErrors, ...errors.get(this.name)])
    }

    return errors
  }

  public async run(document: GherkinDocument, filename: string): Promise<Array<LintError>> {
    return await this.ruleDefinition.run(this, document, filename)
  }
}
