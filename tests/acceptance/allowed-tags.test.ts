import { expect } from 'chai'
import { Runner } from '../../src/index'
import path from 'node:path'

describe('Allowed Tags', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/allowed-tags')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'allowed-tags': ['@development'],
      },
    })

    await runner.init()
    const result = await runner.run()
    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)
    expect(result.errors.has(`${featureDirectory}/valid.feature`)).to.eq(false)
    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors[0].message).to.eq('Found a feature tag that is not allowed. Got @invalid-tag, wanted @development')
  })
})
