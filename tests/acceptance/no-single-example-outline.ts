import path from 'node:path'
import { Runner, Severity } from '../../src'
import { expect } from 'chai'

describe('No Single Example Outline', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/no-single-example-outline')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'no-single-example-outline': Severity.error,
      },
    })

    await runner.init()
    const result = await runner.run()

    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    expect(result.errors.has(`${featureDirectory}/valid.feature`)).to.eq(false)
    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Scenario Outline has only one example. Consider converting to a simple Scenario.')
  })
})
