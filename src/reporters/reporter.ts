import { LintError } from '../error'
import { ReporterConfig } from '../types'

export default class Reporter {
  protected readonly config: ReporterConfig

  constructor(config?: ReporterConfig) {
    this.config = config
  }

  public errors: Map<string, Array<LintError>> = new Map()

  public addErrors(key: string, errors: Array<LintError>): void {
    if (this.errors.has(key)) {
      this.errors.set(key, [...errors, ...this.errors.get(key)])
      return
    }

    this.errors.set(key, errors)
  }

  public write = (): void => {}
}
