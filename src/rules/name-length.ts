import { GherkinDocument } from '@cucumber/messages'
import { RuleConfig } from '../config'
import { LintError, newLintError } from '../error'

const defaultConfig: RuleConfig = {
  nameLength: {
    feature: 70,
    scenario: 70,
    step: 70,
  },
}

const ruleName = 'name-length'

export default (ruleConfig: RuleConfig, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return
  }

  const errors: Array<LintError> = []

  const expectedFeatureNameLength = ruleConfig?.nameLength?.feature || defaultConfig.nameLength.feature
  const expectedScenarioNameLength = ruleConfig?.nameLength?.scenario || defaultConfig.nameLength.scenario
  const expectedStepNameLength = ruleConfig?.nameLength?.step || defaultConfig.nameLength.step

  if (document.feature.name.length > expectedFeatureNameLength) {
    errors.push(
      newLintError(
        ruleName,
        `"Feature" name is too long. Got ${document.feature.name.length}, want ${expectedFeatureNameLength}`,
        document.feature.location,
      ),
    )
  }

  document.feature.children.forEach((child) => {
    if (child.scenario.name.length > expectedScenarioNameLength) {
      errors.push(
        newLintError(
          ruleName,
          `"Scenario" name is too long. Got ${child.scenario.name.length}, want ${expectedScenarioNameLength}`,
          child.scenario.location,
        ),
      )
    }

    child.scenario.steps.forEach((step) => {
      if (step.text.length > expectedStepNameLength) {
        errors.push(
          newLintError(
            ruleName,
            `"${step.keyword}" name is too long. Got ${step.text.length}, want ${expectedStepNameLength}`,
            step.location,
          ),
        )
      }
    })
  })

  return errors
}
