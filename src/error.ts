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
