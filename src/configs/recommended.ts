import { Severity } from '../types'
import type { GherklinPreset } from '../types'

export default {
  rules: {
    'no-empty-file': Severity.error,
    'no-unnamed-scenarios': Severity.error,
    'no-dupe-features': Severity.error,
    'no-dupe-scenarios': Severity.error,
    'new-line-at-eof': Severity.error,
    'no-trailing-spaces': Severity.error,

    'scenario-action': Severity.warn,
    'scenario-verification': Severity.warn,
  },
} satisfies GherklinPreset
