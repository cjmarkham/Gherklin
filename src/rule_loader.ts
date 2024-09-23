import fs from 'node:fs'
import path from 'node:path'

import Schema from './schema'
import { Rule } from './rule'
import { LintError } from './error'
import Document from './document'
import { RawSchema } from './types'

export default class RuleLoader {
  public schema: Schema

  private rules: Array<Rule> = []

  public load = async (
    configLocation: string,
    ruleName: string,
    rawSchema: RawSchema,
    customDir?: string,
  ): Promise<Error> => {
    // If this rule doesn't appear in the defaults, we'll need to look for it in the custom rules dir
    let location = path.resolve(import.meta.dirname, `./rules/${ruleName}.ts`)

    if (!fs.existsSync(location)) {
      if (customDir) {
        // Import files relative to the location of the config file
        const resolved = path.join(configLocation, customDir, `${ruleName}.ts`)

        if (!fs.existsSync(resolved)) {
          return new Error(`could not find rule "${ruleName}" in "${location}" or "${resolved}"`)
        }
        location = resolved
      } else {
        return new Error(
          `could not find rule "${ruleName}" in default rules.\nIf this is a custom rule, please specify a customRuleDir in the config.`,
        )
      }
    }

    const klass = await import(location.replace('.ts', ''))
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
    const errors: Array<LintError> = []

    for (const rule of this.rules) {
      if (!rule.schema.enabled) {
        continue
      }

      await rule.run(document)
      if (document.errors.length) {
        document.errors.forEach((_, index) => {
          document.errors[index].severity = rule.schema.severity
          document.errors[index].rule = rule.name
        })

        errors.push(...document.errors)
      }
    }

    return errors
  }
}
