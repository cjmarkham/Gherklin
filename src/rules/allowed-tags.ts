import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import { offOrStringArrayOrSeverityAndStringArray } from '../schemas'
import Rule from '../rule'
import { lineDisabled } from '../utils'

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

  const errors: Array<LintError> = []
  let allowedTags = rule.schema.args as Array<string>
  if (!allowedTags.length) {
    return []
  }

  document.feature.tags.forEach((tag) => {
    if (lineDisabled(document.comments, tag.location.line)) {
      return
    }

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
      if (lineDisabled(document.comments, tag.location.line)) {
        return
      }

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
