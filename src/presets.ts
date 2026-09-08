import recommended from './configs/recommended'

import type { GherklinPreset } from './types'

const builtInPresets: Record<string, GherklinPreset> = {
  'gherklin:recommended': recommended,
}

export const resolveBuiltInPreset = (name: string): GherklinPreset => {
  const preset = builtInPresets[name]

  if (!preset) {
    throw new Error(`Could not find Gherklin preset "${name}".`)
  }

  return preset
}