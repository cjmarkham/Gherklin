import { GherkinKeywordNumericals, RuleArguments, RuleDefinition, Severity, Switch } from './config'
import { GherkinDocument } from '@cucumber/messages'
import { ConfigError, LintError } from './error'
import fs from 'node:fs'
import path from 'node:path'
import { z } from 'zod'
import callerCallsite from 'caller-callsite'
import callsites from 'callsites'

export default class Rule {
  public name: string

  public enabled: boolean

  public severity: Severity

  public args: GherkinKeywordNumericals | Array<string>

  public config: RuleArguments

  private ruleDefinition: RuleDefinition

  private caller: string

  constructor(ruleName: string, config: RuleArguments, caller?: string) {
    this.name = ruleName
    this.config = config

    this.caller = caller

    this.parseRule()
  }

  public load = async (customDir?: string): Promise<Error> => {
    // If this rule doesn't appear in the defaults, we'll need to look for it in the custom rules dir
    let location = path.resolve(import.meta.dirname, `./rules/${this.name}.ts`)

    if (!fs.existsSync(location)) {
      if (customDir) {
        const fileName = this.caller.replace('file://', '')
        const dirName = path.dirname(fileName)
        const resolved = path.join(dirName, customDir, `${this.name}.ts`)

        if (!fs.existsSync(resolved)) {
          return new Error(`could not find rule ${this.name} in ${location} or ${resolved}`)
        }
        location = resolved
      } else {
        return new Error(
          `could not find rule ${this.name} in default rules.\nIf this is a custom rule, please specify a customRuleDir in the config.`,
        )
      }
    }

    this.ruleDefinition = await import(location.replace('.ts', ''))
  }

  private parseRule = (): void => {
    this.severity = Severity.warn
    this.enabled = true

    if (typeof this.config === 'string') {
      if ([Severity.error.toString(), Severity.warn.toString()].includes(this.config)) {
        this.severity = this.config as Severity
        this.enabled = true
      } else {
        this.enabled = this.config === Switch.on
      }

      return
    }

    if (Array.isArray(this.config)) {
      if ([Severity.warn, Severity.error, Switch.on, Switch.off].includes(this.config[0] as Severity | Switch)) {
        this.severity = this.config[0] as Severity
        this.args = this.config[1] as GherkinKeywordNumericals | Array<string>
      } else {
        this.args = this.config as GherkinKeywordNumericals | Array<string>
      }

      return
    }

    this.args = this.config
  }

  public validateSchema = async (): Promise<Map<string, Array<ConfigError>>> => {
    if (!this.ruleDefinition) {
      await this.load()
    }

    const errors: Map<string, Array<ConfigError>> = new Map()

    if (!this.ruleDefinition.schema) {
      errors.set(this.name, [{ rule: this.name, errors: ['rule is missing a schema'] } as ConfigError])
      return errors
    }

    const testSchema = z.instanceof(z.ZodSchema)
    const parseErr = testSchema.safeParse(this.ruleDefinition.schema)
    if (!parseErr.success) {
      errors.set(this.name, [{ rule: this.name, errors: [parseErr] } as ConfigError])
      return errors
    }

    const result = this.ruleDefinition.schema.safeParse(this.config)
    if (!result.success) {
      errors.set(this.name, result.error.format()?._errors)
    }

    if (typeof this.ruleDefinition.run !== 'function') {
      errors.set(this.name, [{ rule: this.name, errors: ['rule has no export named "run"'] } as ConfigError])
    }

    return errors
  }

  public run(document: GherkinDocument, filename: string): Array<LintError> {
    return this.ruleDefinition.run(this, document, filename)
  }
}
