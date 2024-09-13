import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import { offOrNumberOrSeverityAndNumber } from '../schemas'
import Rule from '../rule'

/**
 * Allowed:
 * off
 * number
 * ['error', number]
 */
export const schema = offOrNumberOrSeverityAndNumber

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }

  const errors: Array<LintError> = []

  let scenarioCount = 0
  document.feature.children.forEach((child) => {
    if (child.scenario) {
      scenarioCount += 1
    }
  })

  const expected = rule.schema.args as number
  if (scenarioCount > expected) {
    errors.push({
      message: `Expected max ${expected} scenarios per file. Found ${scenarioCount}.`,
      location: document.feature.location,
    } as LintError)
  }

  return errors
}
