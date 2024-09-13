import { expect } from 'chai'
import { Runner } from '../../src/index'
import path from 'node:path'

describe('Indentation', () => {
  it('returns errors if the rule fails', async () => {
    const featureDirectory = path.join(import.meta.dirname, './features/indentation')

    const runner = new Runner({
      configDirectory: '.',
      featureDirectory,
      rules: {
        indentation: {
          feature: 1,
          background: 3,
          scenario: 3,
          step: 5,
          examples: 5,
          given: 5,
          when: 5,
          then: 5,
          and: 5,
          but: 5,
          exampleTableHeader: 7,
          exampleTableBody: 7,
        },
      },
    })

    await runner.init()
    const result = await runner.run()

    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)
    expect(result.errors.has(`${featureDirectory}/valid.feature`)).to.eq(false)

    const errors = result.errors.get(`${featureDirectory}/invalid.feature`)
    expect(errors.length).to.eq(14)
    expect(errors[0].message).to.eq('Invalid indentation for feature. Got 3, wanted 1')
    expect(errors[1].message).to.eq('Invalid indentation for scenario. Got 2, wanted 3')
    expect(errors[2].message).to.eq('Invalid indentation for "given". Got 7, wanted 5')
    expect(errors[3].message).to.eq('Invalid indentation for "when". Got 8, wanted 5')
    expect(errors[4].message).to.eq('Invalid indentation for "then". Got 14, wanted 5')
    expect(errors[5].message).to.eq('Invalid indentation for "and". Got 7, wanted 5')
    expect(errors[6].message).to.eq('Invalid indentation for "but". Got 10, wanted 5')
    expect(errors[7].message).to.eq('Invalid indentation for scenario. Got 4, wanted 3')
    expect(errors[8].message).to.eq('Invalid indentation for "when". Got 9, wanted 5')
    expect(errors[9].message).to.eq('Invalid indentation for "then". Got 7, wanted 5')
    expect(errors[10].message).to.eq('Invalid indentation for "examples". Got 13, wanted 5')
    expect(errors[11].message).to.eq('Invalid indentation for "example table header". Got 3, wanted 7')
    expect(errors[12].message).to.eq('Invalid indentation for "example table row". Got 11, wanted 7')
    expect(errors[13].message).to.eq('Invalid indentation for "example table row". Got 14, wanted 7')
  })
})
