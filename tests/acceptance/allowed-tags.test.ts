import { expect } from 'chai'
import GherkinLinter from '../../src/index'

describe('Rule Schemas', () => {
  it('returns an error for an invalid schema', async () => {
    const rules = {
      'allowed-tags': 'nope',
    } as any

    const errors = await GherkinLinter({
      directory: 'tests/features',
      rules,
    })
    expect(errors.length).to.eq(1)
    expect(errors[0].rule).to.eq('allowed-tags')
    expect(errors[0].errors.length).to.eq(3)
    // TODO: These errors could be improved
    expect(errors[0].errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[0].errors[1]).to.eq('Expected array, received string')
    expect(errors[0].errors[2]).to.eq('Expected array, received string')
  })
})
