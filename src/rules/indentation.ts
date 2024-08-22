import { GherkinDocument } from '@cucumber/messages'
import { RuleConfig } from '../config'
import { LintError, newLintError } from '../error'

const defaultConfig: RuleConfig = {
  indentation: {
    feature: 0,
    background: 2,
    scenario: 2,
    examples: 4,
    example: 6,
    given: 4,
    when: 4,
    then: 4,
    and: 4,
    but: 4,
  },
}

const ruleName = 'indentation'

export default (ruleConfig: RuleConfig, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }

  const errors: Array<LintError> = []
  const featureIndent = ruleConfig?.indentation?.feature || defaultConfig.indentation.feature
  const scenarioIndent = ruleConfig?.indentation?.scenario || defaultConfig.indentation.scenario

  if (document.feature.location.column - 1 !== featureIndent) {
    errors.push(
      newLintError(
        ruleName,
        `Indentation for "Feature" is incorrect. Got ${document.feature.location.column - 1}, want ${featureIndent}`,
        document.feature.location,
      ),
    )
  }

  document.feature.children.forEach((child) => {
    if (child.scenario.location.column - 1 !== scenarioIndent) {
      errors.push(
        newLintError(
          ruleName,
          `Indentation for "Scenario" is incorrect. Got ${child.scenario.location.column - 1}, want ${scenarioIndent}`,
          child.scenario.location,
        ),
      )
    }

    child.scenario.steps.forEach((step) => {
      const name = step.keyword.trim()
      const lowerName = name.toLowerCase()
      const expectedIndent = ruleConfig?.indentation?.[lowerName] || defaultConfig.indentation[lowerName]
      if (step.location.column - 1 !== expectedIndent) {
        errors.push(
          newLintError(
            ruleName,
            `Indentation for "${name}" is incorrect. Got ${step.location.column - 1}, want ${expectedIndent}`,
            child.scenario.location,
          ),
        )
      }
    })
  })

  return errors
}
