import path from 'node:path'
import { expect } from 'chai'

import { Runner, Severity } from '../../src/index'

describe('Keywords in Logical Order', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/keywords-in-logical-order')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'keywords-in-logical-order': Severity.error,
      },
    })

    await runner.init()
    const result = await runner.run()
    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)
    expect(result.errors.has(`${featureDirectory}/valid.feature`)).to.eq(false)

    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors.length).to.eq(3)
    expect(errors[0].message).to.eq('Expected "When " to be followed by "Then", got "Given "')
    expect(errors[1].message).to.eq('Expected "Given " to be followed by "When", got "Given "')
    expect(errors[2].message).to.eq('Expected "Then " to be followed by "And, When", got "Then "')
  })

  it('returns errors if the rule fails using a different language', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/languages')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        'keywords-in-logical-order': Severity.error,
      },
    })

    await runner.init()
    const result = await runner.run()
    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    const errors = result.errors.get(`${featureDirectory}/keywords-in-logical-order.feature`)
    expect(errors.length).to.eq(3)
    expect(errors[0].message).to.eq('Expected "Quand " to be followed by "Alors, Donc", got "Sachant "')
    expect(errors[1].message).to.eq(
      'Expected "Sachant " to be followed by "Quand, Lorsque, Lorsqu\'", got "Etant donnée "',
    )
    expect(errors[2].message).to.eq('Expected "Quand " to be followed by "Alors, Donc", got "Mais "')
  })
})
