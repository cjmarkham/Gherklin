import { GherkinDocument } from '@cucumber/messages'
import { LintError, newLintError } from '../error'
import { offOrStringArrayOrSeverityAndStringArray } from '../schema'
import Rule from '../rule'

/**
 * Allowed:
 * off
 * [@tag1]
 * ['error', [@tag1]]
 */
export const schema = offOrStringArrayOrSeverityAndStringArray

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }
  if (!rule.enabled) {
    return []
  }

  const errors: Array<LintError> = []
  let allowedTags = rule.args as Array<string>
  if (!allowedTags.length) {
    return []
  }

  document.feature.tags.forEach((tag) => {
    if (!allowedTags.includes(tag.name)) {
      const error = newLintError(
        rule.name,
        rule.severity,
        `Found a feature tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`,
        tag.location,
      )
      errors.push(error)
    }
  })

  document.feature.children.forEach((child) => {
    if (!child.scenario) {
      return
    }

    child.scenario.tags.forEach((tag) => {
      if (!allowedTags.includes(tag.name)) {
        const error = newLintError(
          rule.name,
          rule.severity,
          `Found a scenario tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`,
          tag.location,
        )
        errors.push(error)
      }
    })
  })

  return errors
}
