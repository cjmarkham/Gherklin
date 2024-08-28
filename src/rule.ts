import { GherkinKeywordNumericals, RuleArguments, RuleDefinition, Severity, Switch } from './config'
import path from 'node:path'
import { GherkinDocument } from '@cucumber/messages'
import { configError, LintError } from './error'

export class Rule {
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

  public load = async (): Promise<void> => {
    this.ruleDefinition = await import(path.resolve(`./src/rules/${this.name}.ts`))
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

  public validateSchema = async (): Promise<Array<configError>> => {
    if (!this.ruleDefinition) {
      await this.load()
    }

    const errors: Array<configError> = []

    const result = this.ruleDefinition.schema.safeParse(this.config)
    if (!result.success) {
      errors.push({ rule: this.name, errors: result.error.format()?._errors })
    }

    return errors
  }

  public run(document: GherkinDocument, filename: string): Array<LintError> {
    return this.ruleDefinition.run(this, document, filename)
  }
}
