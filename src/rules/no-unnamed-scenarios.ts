import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import { switchOrSeveritySchema } from '../schemas'
import Rule from '../rule'
import { lineDisabled } from '../utils'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }
  const errors: Array<LintError> = []

  document.feature.children.forEach((child) => {
    if (!child.scenario) {
      return
    }

    if (lineDisabled(document.comments, child.scenario.location.line)) {
      return
    }

    if (child.scenario.name.length === 0) {
      errors.push({
        message: 'Found scenario with no name',
        location: child.scenario.location,
      } as LintError)
    }
  })

  return errors
}
