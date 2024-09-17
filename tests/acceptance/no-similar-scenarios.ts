import { expect } from 'chai'
import { Runner, Severity } from '../../src/index'
import path from 'node:path'

describe('No Similar Scenarios', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/no-similar-scenarios')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'no-similar-scenarios': [Severity.error, 59],
      },
    })

    await runner.init()
    const result = await runner.run()
    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)
    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors.length).to.eq(2)
    expect(errors[0].message).to.eq(
      'Scenario "This scenario is exactly the same as the below" is too similar (> 99.32%) to scenario "This scenario is exactly the same as the above"',
    )
    expect(errors[1].message).to.eq(
      'Scenario "This scenario is exactly the same as the above" is too similar (> 84.39%) to scenario "This is another scenario which is exactly the same"',
    )
  })
})
