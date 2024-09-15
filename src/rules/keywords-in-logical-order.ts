import { GherkinDocument } from '@cucumber/messages'
import { dialects } from '@cucumber/gherkin'

import { LintError } from '../error'
import { switchOrSeveritySchema } from '../schemas'
import Rule from '../rule'

/**
 * Allowed:
 * off
 * error | warn
 */
export const schema = switchOrSeveritySchema

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }

  const errors: Array<LintError> = []

  document.feature.children.forEach((child) => {
    if (!child.scenario) {
      return
    }

    child.scenario.steps.forEach((step, index) => {
      const nextStep = child.scenario.steps[index + 1]
      if (!nextStep) {
        return
      }
      const nextTrimmed = nextStep.keyword

      const dialect = dialects[document.feature.language]
      const given = dialect.given.filter((w) => w !== '* ')
      const when = dialect.when.filter((w) => w !== '* ')
      const then = dialect.then.filter((w) => w !== '* ')
      const and = dialect.and.filter((w) => w !== '* ')
      const trimmedWhen = when.map((w) => w.trim())
      const trimmedThen = then.map((w) => w.trim())
      const trimmedAnd = and.map((w) => w.trim())

      if (given.includes(step.keyword) && !when.includes(nextTrimmed)) {
        errors.push({
          message: `Expected "${step.keyword}" to be followed by "${trimmedWhen.join(', ')}", got "${nextTrimmed}"`,
          location: step.location,
        } as LintError)
      }

      if (when.includes(step.keyword) && !then.includes(nextTrimmed)) {
        errors.push({
          message: `Expected "${step.keyword}" to be followed by "${trimmedThen.join(', ')}", got "${nextTrimmed}"`,
          location: step.location,
        } as LintError)
      }

      if (then.includes(step.keyword) && ![...and, ...when].includes(nextTrimmed)) {
        errors.push({
          message: `Expected "${step.keyword}" to be followed by "${[...trimmedAnd, ...trimmedWhen].join(', ')}", got "${nextTrimmed}"`,
          location: step.location,
        } as LintError)
      }
    })
  })

  return errors
}
