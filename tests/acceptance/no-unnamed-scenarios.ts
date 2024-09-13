import path from 'node:path'
import { Runner, Severity } from '../../src'
import { expect } from 'chai'

describe('No Unnamed Scenarios', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/no-unnamed-scenarios')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'no-unnamed-scenarios': Severity.warn,
      },
    })

    await runner.init()
    const result = await runner.run()

    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Found scenario with no name')
  })
})
