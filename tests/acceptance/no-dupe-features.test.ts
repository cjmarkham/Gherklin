import path from 'node:path'
import { Runner, Severity } from '../../src'
import { expect } from 'chai'

describe('No Dupe Features', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/no-dupe-features')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'no-dupe-features': Severity.error,
      },
    })

    await runner.init()
    const result = await runner.run()

    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    const errors = result.errors.get(`${featureDirectory}/invalid2.feature`)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq(
      `Found duplicate feature "No Dupe Features" in "invalid2.feature, invalid1.feature"`,
    )
  })
})
