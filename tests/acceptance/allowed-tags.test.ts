import { expect } from 'chai'
import GherkinLinter from '../../src/index'

describe('Allowed Tags Rule Schemas', () => {
  it('returns an error when using a completely invalid value', async () => {
    const rules = {
      'allowed-tags': 'nope',
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    // TODO: These errors could be improved
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected array, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using just a severity', async () => {
    const rules = {
      'allowed-tags': 'error',
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    // TODO: These errors could be improved
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected array, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on"', async () => {
    const rules = {
      'allowed-tags': 'on',
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    // TODO: These errors could be improved
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected array, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on" with arguments', async () => {
    const rules = {
      'allowed-tags': ['on', ['@development']],
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    // TODO: These errors could be improved
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
  })

  it('does not return an error when using "off"', async () => {
    const rules = {
      'allowed-tags': 'off',
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/features',
        rules,
      },
    })
    expect(result.schemaErrors.size).to.eq(0)
  })

  it('does not return an error when using a severity and arguments', async () => {
    const rules = {
      'allowed-tags': ['error', ['@development']],
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/features',
        rules,
      },
    })
    expect(result.schemaErrors.size).to.eq(0)
  })

  it('does not return an error when using only arguments', async () => {
    const rules = {
      'allowed-tags': ['@development'],
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/features',
        rules,
      },
    })
    expect(result.schemaErrors.size).to.eq(0)
  })
})

describe('Allowed Tags Validation', () => {
  it('returns an error if the tag is not allowed', async () => {
    const rules = {
      'allowed-tags': ['error', ['@development']],
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/acceptance/features/allowed-tags',
        rules,
      },
    })

    expect(result.errors.size).to.eq(2)
    const errors = [...result.errors.values()]
    expect(errors[0][0].message).to.eq('Found a feature tag that is not allowed. Got @testing, wanted @development')
    expect(errors[1][0].message).to.eq('Found a scenario tag that is not allowed. Got @testing, wanted @development')
  })

  it('does not return an error if the tag is allowed', async () => {
    const rules = {
      'allowed-tags': ['error', ['@testing']],
    } as any

    const result = await GherkinLinter({
      config: {
        directory: 'tests/acceptance/features/allowed-tags',
        rules,
      },
    })

    expect(result.errors.size).to.eq(0)
  })
})
