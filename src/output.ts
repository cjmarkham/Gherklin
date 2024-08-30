import { ConfigError, LintError } from './error'
import chalk from 'chalk'
import { Logger } from 'winston'

export interface Results {
  success: boolean
  errors?: Map<string, Array<LintError>>
  schemaErrors?: Map<string, Array<ConfigError>>
}

export const outputSchemaErrors = (schemaErrors: Map<string, Array<ConfigError>>, logger: Logger): void => {
  if (!schemaErrors.size) {
    return
  }

  logger.error(chalk.redBright('Invalid configuration options specified!\n'))
  schemaErrors.forEach((errs, key) => {
    logger.info(chalk.underline(key))
    errs.forEach((e, idx) => {
      logger.info(chalk.gray(`${idx}) `) + e)
    })
  })
}

export const outputErrors = (errors: Map<string, Array<LintError>>, logger: Logger): void => {
  if (!errors.size) {
    return
  }

  let totalErrors = 0
  let totalWarns = 0

  errors.forEach((lintErrors: Array<LintError>, file: string): void => {
    let output = `\n${chalk.underline(file)}`
    let maxMessageLength = lintErrors.reduce((a, b) => (a.message.length < b.message.length ? b : a)).message.length

    lintErrors.forEach((err: LintError) => {
      let color = chalk.yellow
      if (err.severity === 'error') {
        color = chalk.redBright
        totalErrors += 1
      }
      if (err.severity === 'warn') {
        totalWarns += 1
      }

      output += [
        '\n',
        `${(err.location.line + ':' + ((err.location.column || 0) - 1)).toString()} ${color(err.severity)}`,
        // TODO: Fix this padStart mess
        err.message.padEnd(maxMessageLength + 4).padStart(70),
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
    logger.info(color(`\nx ${totalErrors + totalWarns} problems (${totalErrors} error(s), ${totalWarns} warning(s))`))
  }
}
