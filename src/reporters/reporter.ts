import { LintError } from '../error'
import chalk from 'chalk'
import logger from '../logger'
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

  public write = (): void => {
    chalk.level = 2

    if (!this.errors.size) {
      return
    }

    let totalErrors = 0
    let totalWarns = 0

    this.errors.forEach((lintErrors: Array<LintError>, file: string): void => {
      let output = `\n${chalk.underline(file)}`

      lintErrors.forEach((err: LintError) => {
        let color = chalk.yellow
        if (err.severity === 'error') {
          color = chalk.redBright
          totalErrors += 1
        }
        if (err.severity === 'warn') {
          totalWarns += 1
        }

        const errorWithLongestMessage = lintErrors.reduce((a, b) => (a.message.length < b.message.length ? b : a))
        const errorWithLongestLocation = lintErrors.reduce((a, b) =>
          a.location.column.toString().length + a.location.line.toString().length <
          b.location.column.toString().length + b.location.line.toString().length
            ? b
            : a,
        )
        const maxMessageLength = errorWithLongestMessage.message.length
        const maxLocationLength =
          errorWithLongestLocation.location.column.toString().length +
          errorWithLongestLocation.location.line.toString().length

        const location = (err.location.line + ':' + (err.location.column || 0)).toString().padEnd(maxLocationLength + 1)
        output += [
          '\n',
          `${location} ${color(err.severity).padEnd(5)} `,
          err.message.padEnd(maxMessageLength + 1),
          chalk.gray(err.rule),
        ].join('')
      })

      logger.error(output)
    })

    if (totalErrors + totalWarns > 0) {
      let color = chalk.bold.redBright
      if (!totalErrors) {
        color = chalk.bold.yellow
      }
      logger.info(
        color(
          `\nx ${totalErrors + totalWarns} problems (${totalErrors} error${totalErrors ? 's' : ''}, ${totalWarns} warning${totalWarns ? 's' : ''})`,
        ),
      )
    }
  }
}
