import { z } from 'zod'

import { GherkinKeywordNumericals, RawSchema, RuleArguments, Severity, Switch } from './types'

export default class Schema {
  private readonly rawSchema: RawSchema

  public severity: Severity = Severity.warn

  public args: RuleArguments = undefined

  public enabled: boolean = true

  constructor(rawSchema: RawSchema) {
    this.rawSchema = rawSchema

    this.parse()
  }

  private parse(): void {
    // If it's a string, it's a severity or switch
    if (typeof this.rawSchema === 'string') {
      if ([Severity.error.toString(), Severity.warn.toString()].includes(this.rawSchema)) {
        this.severity = this.rawSchema as Severity
      } else {
        this.enabled = this.rawSchema === Switch.on
      }

      return
    }

    if (Array.isArray(this.rawSchema)) {
      if ([Severity.warn, Severity.error, Switch.on, Switch.off].includes(this.rawSchema[0] as Severity | Switch)) {
        this.severity = this.rawSchema[0] as Severity
        this.args = this.rawSchema[1] as GherkinKeywordNumericals | Array<string>
      } else {
        this.args = this.rawSchema as GherkinKeywordNumericals | Array<string>
      }

      return
    }

    // There was no severity or switch, so it's all arguments
    this.args = this.rawSchema
  }

  public validate(zodSchema: z.ZodSchema): Array<string> {
    const testSchema = z.instanceof(z.ZodSchema)
    const parseErr = testSchema.safeParse(zodSchema)
    if (!parseErr.success) {
      return parseErr.error.errors.map((e) => e.message)
    }

    const result = zodSchema.safeParse(this.rawSchema)
    if (!result.success) {
      return result.error.format()?._errors
    }

    return []
  }
}
