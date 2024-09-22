import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import { switchOrSeveritySchema } from '../schemas'
import Rule from '../rule'

/**
 * Allowed:
 * off | on
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

    if (child.scenario.keyword !== 'Scenario Outline') {
      return
    }

    if (!child.scenario.examples.length) {
      return
    }

    let totalExamples = 0

    child.scenario.examples.forEach((example) => {
      totalExamples += example.tableBody.length
    })

    if (totalExamples === 1) {
      errors.push({
        message: 'Scenario Outline has only one example. Consider converting to a simple Scenario.',
        location: child.scenario.location,
      } as LintError)
    }
  })

  return errors
}
