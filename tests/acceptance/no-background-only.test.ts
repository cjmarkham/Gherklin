import { expect } from 'chai'
import { Runner } from '../../src/index'

describe('No Background Only Rule Schemas', () => {
  it('returns an error when using a completely invalid value', async () => {
    const rules = {
      'no-background-only': 'nope',
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('no-background-only')
    expect(errors.length).to.eq(2)
    // TODO: These errors could be improved
    expect(errors[0]).to.eq("Invalid enum value. Expected 'off' | 'on', received 'nope'")
    expect(errors[1]).to.eq("Invalid enum value. Expected 'warn' | 'error', received 'nope'")
  })

  it('does not return an error when using just a severity', async () => {
    const rules = {
      'no-background-only': 'error',
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(0)
  })

  it('does not return an error when using a switch', async () => {
    const rules = {
      'no-background-only': 'on',
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(0)
  })

  it('returns an error when using with arguments', async () => {
    const rules = {
      'no-background-only': ['on', ['some-argument']],
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('no-background-only')
    expect(errors.length).to.eq(2)
    // TODO: These errors could be improved
    expect(errors[0]).to.eq("Expected 'off' | 'on', received array")
    expect(errors[1]).to.eq("Expected 'warn' | 'error', received array")
  })
})

describe('No Background Only Validation', () => {
  it('returns an error if the feature only has a background', async () => {
    const rules = {
      'no-background-only': 'warn',
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/acceptance/features/no-background-only/invalid',
        rules,
      },
    })

    expect(result.errors.size).to.eq(1)
    const errors = [...result.errors.values()]
    expect(errors.length).to.eq(1)
    expect(errors[0][0].message).to.eq('File contains only a background')
  })

  it('does not return an error if the file has scenarios', async () => {
    const rules = {
      'no-background-only': 'error',
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/acceptance/features/no-background-only/valid',
        rules,
      },
    })

    expect(result.errors.size).to.eq(0)
  })
})
