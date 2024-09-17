import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import { offOrNumberOrSeverityAndNumber, offOrNumberOrSeverityOrSeverityAndNumber } from '../schemas'
import Rule from '../rule'
import { levenshtein } from '../utils'

/**
 * Allowed:
 * off
 * error | warn
 * [error | warn, number]
 */
export const schema = offOrNumberOrSeverityOrSeverityAndNumber

const defaultThreshold = 80

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }

  const errors: Array<LintError> = []

  document.feature.children.forEach((child, index) => {
    if (!child.scenario) {
      return
    }
    const nextChild = document.feature.children[index + 1]
    if (!nextChild) {
      return
    }

    const { steps: thisSteps } = child.scenario
    const { steps: nextSteps } = nextChild.scenario
    let totalLev = 0
    let maxPossibleLev = 0

    totalLev += thisSteps
      .map((step, i): number => {
        const nextStep = nextSteps[i]
        if (!nextStep) {
          return 0
        }

        const comparison = [`${step.keyword}${step.text}`, `${nextStep.keyword}${nextStep.text}`]
        maxPossibleLev += comparison[0].length + comparison[1].length
        return levenshtein(comparison[0], comparison[1])
      })
      .reduce((a, b) => a + b)

    const percentage = 100 - (totalLev / maxPossibleLev) * 100

    let threshold = defaultThreshold
    if (rule.schema.args) {
      threshold = rule.schema.args as number
    }

    if (percentage > threshold) {
      errors.push({
        message: `Scenario "${child.scenario.name}" is too similar (> ${percentage.toFixed(2)}%) to scenario "${nextChild.scenario.name}"`,
        location: child.scenario.location,
      } as LintError)
    }
  })

  return errors
}
