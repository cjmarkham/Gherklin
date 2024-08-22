interface Location {
  line: number
  column?: number
}

export interface LintError {
  rule: string
  message: string
  location: Location
}

export const newLintError = (rule: string, message: string, location: Location): LintError => {
  return {
    rule,
    message,
    location,
  } as LintError
}
