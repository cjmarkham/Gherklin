import { GherkinDocument } from '@cucumber/messages'
import { z } from 'zod'
import { LintError, newLintError } from '../error'
import { severitySchema } from '../schema'
import { Rule } from '../rule'
import { Severity, Switch } from '../config'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = z.union([z.nativeEnum(Switch), z.nativeEnum(Severity)])

export const run = (rule: Rule, document: GherkinDocument): Array<LintError> => {
  if (!document || (document && !document.feature)) {
    return []
  }
  if (!rule.enabled) {
    return []
  }

  const errors: Array<LintError> = []

  document.feature.children.forEach((child) => {
    if (!child.background) {
      return
    }

    if (document.feature.children.length < 2) {
      const error = newLintError(rule.name, rule.severity, `File contains only a background`, document.feature.location)
      errors.push(error)
    }
  })

  return errors
}
