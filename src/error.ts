import { Severity } from './config'

interface Location {
  line: number
  column?: number
}

export interface LintError {
  rule: string
  severity: Severity
  message: string
  location: Location
}

export const newLintError = (rule: string, severity: Severity, message: string, location: Location): LintError => {
  return {
    rule,
    severity,
    message,
    location,
  } as LintError
}

export interface configError {
  rule: string
  errors: Array<any>
}
