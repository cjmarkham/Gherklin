import { GherkinDocument } from '@cucumber/messages'
import { LintError, newLintError } from '../error'
import Rule from '../rule'
import { switchOrSeveritySchema } from '../schema'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }
  if (!rule.enabled) {
    return []
  }

  const errors: Array<LintError> = []

  document.feature.children.forEach((child) => {
    if (!child.background) {
      return
    }

    if (document.feature.children.length < 2) {
      const error = newLintError(rule.name, rule.severity, `File contains only a background`, document.feature.location)
      errors.push(error)
    }
  })

  return errors
}
