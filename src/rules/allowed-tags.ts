import { GherkinDocument } from '@cucumber/messages'
import { RuleConfig } from '../config'
import { LintError, newLintError } from '../error'

const defaultConfig: RuleConfig = {
  allowedTags: [],
}

const ruleName = 'allowed-tags'

export default (ruleConfig: RuleConfig, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }

  const errors: Array<LintError> = []
  const allowedTags = ruleConfig?.allowedTags || defaultConfig.allowedTags
  if (!allowedTags.length) {
    return []
  }

  document.feature.tags.forEach((tag) => {
    if (!allowedTags.includes(tag.name)) {
      const error = newLintError(
        ruleName,
        `Found a tag that is not allwed. Got ${tag.name}, wanted ${allowedTags.join(',')}`,
        tag.location,
      )
      errors.push(error)
    }
  })
  return errors
}
