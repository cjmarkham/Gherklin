import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import { switchOrSeveritySchema } from '../schemas'
import Rule from '../rule'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  const errors: Array<LintError> = []

  if (!document) {
    errors.push({
      message: 'Feature file is empty',
      location: {
        line: 0,
        column: 0,
      },
    } as LintError)
  }

  return errors
}
