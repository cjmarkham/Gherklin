import { LintError, ReporterConfig } from '../types'

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

  /**
   * Since errors are grouped under their file name, this is a helper function
   * to return the total number of errors across all files
   */
  public errorCount(): number {
    let count = 0
    this.errors.forEach((err) => {
      count += err.length
    })

    return count
  }

  public write = (): void => {}
}
