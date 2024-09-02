import { GherkinDocument } from '@cucumber/messages'
import { LintError } from '../error'
import Rule from '../rule'
import { switchOrSeveritySchema } from '../schema'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  const errors: Array<LintError> = []

  document.feature.children.forEach((child) => {
    if (!child.background) {
      return
    }

    if (document.feature.children.length < 2) {
      errors.push({
        message: `File contains only a background`,
        location: document.feature.location,
      } as LintError)
    }
  })

  return errors
}
