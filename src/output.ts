import chalk from 'chalk'

import logger from './logger'
import { LintError } from './types'

export interface Results {
  success: boolean
  errors?: Map<string, Array<LintError>>
  errorCount: number
  schemaErrors?: Map<string, Array<string>>
}

export const outputSchemaErrors = (schemaErrors: Map<string, Array<string>>): void => {
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
