import { GherkinKeywordNumericals, RuleArguments, RuleDefinition, Severity, Switch } from './config'
import { GherkinDocument } from '@cucumber/messages'
import { ConfigError, LintError } from './error'
import logger from './logger'
import fs from 'node:fs'
import path from 'node:path'

export default class Rule {
  public name: string

  public enabled: boolean

  public severity: Severity

  public args: GherkinKeywordNumericals | Array<string>

  public config: RuleArguments

  private ruleDefinition: RuleDefinition

  constructor(ruleName: string, config: RuleArguments) {
    this.name = ruleName
    this.config = config

    this.parseRule()
  }

  public load = async (customDir?: string): Promise<Error> => {
    const defaultDirectory = 'src/rules/'

    // If this rule doesn't appear in the defaults, we'll need to look for it in the custom rules dir
    let location = `${defaultDirectory}${this.name}.ts`

    if (!fs.existsSync(location)) {
      if (customDir) {
        const customLocation = path.join(customDir, `${this.name}.ts`)
        if (!fs.existsSync(customLocation)) {
          return new Error(`could not find rule ${this.name} in ${location} or ${customLocation}`)
        }
        location = path.relative(import.meta.dirname, customLocation)
      } else {
        return new Error(`could not find rule ${this.name} in ${location}`)
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

    const result = this.ruleDefinition.schema.safeParse(this.config)
    if (!result.success) {
      errors.set(this.name, result.error.format()?._errors)
    }

    return errors
  }

  public run(document: GherkinDocument, filename: string): Array<LintError> {
    return this.ruleDefinition.run(this, document, filename)
  }
}
