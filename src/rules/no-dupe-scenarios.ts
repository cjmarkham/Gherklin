import path from 'node:path'
import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import Rule from '../rule'
import { switchOrSeveritySchema } from '../schemas'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

// A map of scenario names => a list of files they appear in
const scenarios: Map<string, Array<string>> = new Map()

export const run = (rule: Rule, document: GherkinDocument, fileName: string): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }

  const errors: Array<LintError> = []

  document.feature.children.forEach((child) => {
    if (!child.scenario) {
      return
    }

    const scenarioName = child.scenario.name
    if (!scenarios.has(scenarioName)) {
      scenarios.set(scenarioName, [path.basename(fileName)])
    } else {
      const existing = scenarios.get(scenarioName)
      // Prevent duplicates
      if (existing.indexOf(path.basename(fileName)) === -1) {
        scenarios.set(scenarioName, [path.basename(fileName), ...scenarios.get(scenarioName)])
      }
      errors.push({
        message: `Found duplicate scenario "${scenarioName}" in "${scenarios.get(scenarioName).join(', ')}".`,
        location: child.scenario.location,
      } as LintError)
    }
  })

  return errors
}
