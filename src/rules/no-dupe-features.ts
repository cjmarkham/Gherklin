import { GherkinDocument } from '@cucumber/messages'
import { LintError } from '../error'
import Rule from '../rule'
import { switchOrSeveritySchema } from '../schemas'
import path from 'node:path'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

// A map of feature names => a list of files they appear in
const features: Map<string, Array<string>> = new Map()

export const run = (rule: Rule, document: GherkinDocument, fileName: string): Array<LintError> => {
  const errors: Array<LintError> = []

  const featureName = document.feature.name
  if (!features.has(featureName)) {
    features.set(featureName, [path.basename(fileName)])
  } else {
    features.set(featureName, [path.basename(fileName), ...features.get(featureName)])
    errors.push({
      message: `Found duplicate feature "${featureName}" in "${features.get(featureName).join(', ')}"`,
      location: document.feature.location,
    } as LintError)
  }

  return errors
}
