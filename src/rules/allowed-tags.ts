import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
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
  const errors: Array<LintError> = []
  let allowedTags = rule.args as Array<string>
  if (!allowedTags.length) {
    return []
  }

  document.feature.tags.forEach((tag) => {
    if (!allowedTags.includes(tag.name)) {
      errors.push({
        message: `Found a feature tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`,
        location: tag.location,
      } as LintError)
    }
  })

  document.feature.children.forEach((child) => {
    if (!child.scenario) {
      return
    }

    child.scenario.tags.forEach((tag) => {
      if (!allowedTags.includes(tag.name)) {
        errors.push({
          message: `Found a scenario tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`,
          location: tag.location,
        } as LintError)
      }
    })
  })

  return errors
}
