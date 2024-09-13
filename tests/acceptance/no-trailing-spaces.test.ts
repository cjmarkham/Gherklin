import path from 'node:path'
import { Runner, Severity } from '../../src'
import { expect } from 'chai'

describe('No Trailing Spaces', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/no-trailing-spaces')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'no-trailing-spaces': Severity.error,
      },
    })

    await runner.init()
    const result = await runner.run()

    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors.length).to.eq(3)
    expect(errors[0].message).to.eq('Found trailing whitespace')
    expect(errors[0].location).to.deep.eq({ line: 4, column: 25 })
    expect(errors[1].message).to.eq('Found trailing whitespace')
    expect(errors[1].location).to.deep.eq({ line: 7, column: 43 })
    expect(errors[2].message).to.eq('Found trailing whitespace')
    expect(errors[2].location).to.deep.eq({ line: 13, column: 50 })
  })
})
