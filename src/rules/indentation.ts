import { GherkinDocument } from '@cucumber/messages'
import { LintError } from '../error'
import { offOrKeywordIntsOrSeverityAndKeywordInts } from '../schemas'
import Rule from '../rule'
import { GherkinKeywordNumericals } from '../types'
import { lineDisabled } from '../utils'
import { readFileSync, writeFileSync } from 'node:fs'

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

  const errors: Array<LintError> = []

  const args = rule.schema.args as GherkinKeywordNumericals

  if (args.feature !== undefined) {
    if (!lineDisabled(document.comments, document.feature.location.line)) {
      if (document.feature.location.column !== args.feature) {
        errors.push({
          message: `Invalid indentation for feature. Got ${document.feature.location.column}, wanted ${args.feature}`,
          location: document.feature.location,
        } as LintError)
      }
    }
  }

  document.feature.children.forEach((child) => {
    if (child.background && args.background !== undefined) {
      if (!lineDisabled(document.comments, child.background.location.line)) {
        if (child.background.location.column !== args.background) {
          errors.push({
            message: `Invalid indentation for background. Got ${child.background.location.column}, wanted ${args.background}`,
            location: child.background.location,
          } as LintError)
        }
      }
    }

    if (child.scenario && args.scenario !== undefined) {
      if (!lineDisabled(document.comments, child.scenario.location.line)) {
        if (child.scenario.location.column !== args.scenario) {
          errors.push({
            message: `Invalid indentation for scenario. Got ${child.scenario.location.column}, wanted ${args.scenario}`,
            location: child.scenario.location,
          } as LintError)
        }
      }
    }

    if (child.background) {
      child.background.steps.forEach((step) => {
        if (step.keyword.toLowerCase() in args) {
          if (!lineDisabled(document.comments, step.location.line)) {
            if (step.location.column !== args[step.keyword.toLowerCase()]) {
              errors.push({
                message: `Invalid indentation for "${step.keyword.toLowerCase()}". Got ${step.location.column}, wanted ${args[step.keyword.toLowerCase()]}`,
                location: child.background.location,
              } as LintError)
            }
          }
        }
      })
    }

    if (child.scenario) {
      child.scenario.steps.forEach((step) => {
        const stepNormalized = step.keyword.toLowerCase().trimEnd()
        if (stepNormalized in args) {
          if (!lineDisabled(document.comments, step.location.line)) {
            if (step.location.column !== args[stepNormalized]) {
              errors.push({
                message: `Invalid indentation for "${stepNormalized}". Got ${step.location.column}, wanted ${args[stepNormalized]}`,
                location: step.location,
              } as LintError)
            }
          }
        }
      })

      if (child.scenario.examples && args.examples !== undefined) {
        child.scenario.examples.forEach((example) => {
          if (!lineDisabled(document.comments, example.location.line)) {
            if (example.location.column !== args.examples) {
              errors.push({
                message: `Invalid indentation for "examples". Got ${example.location.column}, wanted ${args.examples}`,
                location: example.location,
              } as LintError)
            }
          }

          if (example.tableHeader && args.exampleTableHeader !== undefined) {
            if (!lineDisabled(document.comments, example.tableHeader.location.line)) {
              if (example.tableHeader.location.column !== args.exampleTableHeader) {
                errors.push({
                  message: `Invalid indentation for "example table header". Got ${example.tableHeader.location.column}, wanted ${args.exampleTableHeader}`,
                  location: example.location,
                } as LintError)
              }
            }
          }

          if (example.tableBody && args.exampleTableBody !== undefined) {
            example.tableBody.forEach((row) => {
              if (!lineDisabled(document.comments, row.location.line)) {
                if (row.location.column !== args.exampleTableBody) {
                  errors.push({
                    message: `Invalid indentation for "example table row". Got ${row.location.column}, wanted ${args.exampleTableBody}`,
                    location: example.location,
                  } as LintError)
                }
              }
            })
          }
        })
      }
    }
  })

  return errors
}

export const fix = async (rule: Rule, document: GherkinDocument, fileName: string): Promise<void> => {
  const fileContent = readFileSync(fileName, { encoding: 'utf-8' })
  const lines = fileContent.split('\n')
  const indentation = rule.schema.args
  const keywords = ['Feature', 'Scenario', 'Given', 'When', 'Then', 'And', 'But']
  const newContent = []

  lines.forEach((line) => {
    const keywordMatch = line.match(new RegExp(`${keywords.join('|')}`))
    if (!keywordMatch) {
      return
    }

    const keyword = keywordMatch[0]
    const padding = Array(Number(indentation[keyword?.toLowerCase()] - 1)).fill(' ')
    newContent.push(padding.join('') + line.trimStart())
  })

  writeFileSync(fileName, newContent.join('\n'))
}
