import { GherkinDocument } from '@cucumber/messages'
import { RuleConfig } from '../config'
import { LintError, newLintError } from '../error'

const defaultConfig: RuleConfig = {
  maxScenariosPerFile: 10,
}

const ruleName = 'max-scenarios-per-file'

export default (ruleConfig: RuleConfig, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return
  }

  const errors: Array<LintError> = []

  const scenarios = document.feature.children
  const maxAllowed = ruleConfig?.maxScenariosPerFile || defaultConfig.maxScenariosPerFile
  if (scenarios.length > maxAllowed) {
    const error = newLintError(
      ruleName,
      `Number of scenarios exceeds allowed. Got ${scenarios.length}, want ${maxAllowed}`,
      document.feature.location,
    )
    errors.push(error)
  }

  return errors
}
