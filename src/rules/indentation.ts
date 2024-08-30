import { GherkinDocument } from '@cucumber/messages'
import { LintError, newLintError } from '../error'
import { offOrKeywordIntsOrSeverityAndKeywordInts } from '../schema'
import Rule from '../rule'
import { GherkinKeywordNumericals } from '../config'

/**
 * Allowed:
 * off
 * {feature: 0...}
 * ['error', {feature: 0...}]
 */
export const schema = offOrKeywordIntsOrSeverityAndKeywordInts

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }
  if (!rule.enabled) {
    return []
  }

  const errors: Array<LintError> = []

  const args = rule.args as GherkinKeywordNumericals

  if (args.feature !== undefined) {
    if (document.feature.location.column !== args.feature) {
      const error = newLintError(
        rule.name,
        rule.severity,
        `Invalid indentation for feature. Got ${document.feature.location.column}, wanted ${args.feature}`,
        document.feature.location,
      )
      errors.push(error)
    }
  }

  document.feature.children.forEach((child) => {
    if (child.background && args.background !== undefined) {
      if (child.background.location.column !== args.background) {
        const error = newLintError(
          rule.name,
          rule.severity,
          `Invalid indentation for background. Got ${child.background.location.column}, wanted ${args.background}`,
          child.background.location,
        )
        errors.push(error)
      }
    }

    if (child.scenario && args.scenario !== undefined) {
      if (child.scenario.location.column !== args.scenario) {
        const error = newLintError(
          rule.name,
          rule.severity,
          `Invalid indentation for scenario. Got ${child.scenario.location.column}, wanted ${args.scenario}`,
          child.scenario.location,
        )
        errors.push(error)
      }
    }

    if (child.background) {
      child.background.steps.forEach((step) => {
        if (step.keyword.toLowerCase() in args) {
          if (step.location.column !== args[step.keyword.toLowerCase()]) {
            const error = newLintError(
              rule.name,
              rule.severity,
              `Invalid indentation for "${step.keyword.toLowerCase()}". Got ${step.location.column}, wanted ${args[step.keyword.toLowerCase()]}`,
              child.background.location,
            )
            errors.push(error)
          }
        }
      })
    }

    if (child.scenario) {
      child.scenario.steps.forEach((step) => {
        const stepNormalized = step.keyword.toLowerCase().trimEnd()
        if (stepNormalized in args) {
          if (step.location.column !== args[stepNormalized]) {
            const error = newLintError(
              rule.name,
              rule.severity,
              `Invalid indentation for "${stepNormalized}". Got ${step.location.column}, wanted ${args[stepNormalized]}`,
              child.scenario.location,
            )
            errors.push(error)
          }
        }
      })

      if (child.scenario.examples && args.examples !== undefined) {
        child.scenario.examples.forEach((example) => {
          if (example.location.column !== args.examples) {
            const error = newLintError(
              rule.name,
              rule.severity,
              `Invalid indentation for "examples". Got ${example.location.column}, wanted ${args.examples}`,
              example.location,
            )
            errors.push(error)
          }

          if (example.tableHeader && args.exampleTableHeader !== undefined) {
            if (example.tableHeader.location.column !== args.exampleTableHeader) {
              const error = newLintError(
                rule.name,
                rule.severity,
                `Invalid indentation for "example table header". Got ${example.tableHeader.location.column}, wanted ${args.exampleTableHeader}`,
                example.location,
              )
              errors.push(error)
            }
          }

          if (example.tableBody && args.exampleTableBody !== undefined) {
            example.tableBody.forEach((row) => {
              if (row.location.column !== args.exampleTableBody) {
                const error = newLintError(
                  rule.name,
                  rule.severity,
                  `Invalid indentation for "example table row". Got ${row.location.column}, wanted ${args.exampleTableBody}`,
                  example.location,
                )
                errors.push(error)
              }
            })
          }
        })
      }
    }
  })

  return errors
}
