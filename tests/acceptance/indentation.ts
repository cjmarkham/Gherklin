import { expect } from 'chai'
import { Runner } from '../../src/index'

describe('Indentation Rule Schemas', () => {
  it('returns an error when using a completely invalid value', async () => {
    const rules = {
      indentation: 'nope',
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/features',
        rules,
      },
    })

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('indentation')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected object, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })
})

describe('Indentation Validation', () => {
  it('returns an error if the indentation is incorrect', async () => {
    const rules = {
      indentation: [
        'error',
        {
          feature: 1,
          background: 3,
          scenario: 3,
          step: 5,
          examples: 7,
          given: 5,
          when: 5,
          then: 5,
          and: 5,
          but: 5,
          exampleTableHeader: 7,
          exampleTableBody: 7,
        },
      ],
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/acceptance/features/indentation/invalid',
        rules,
      },
    })

    expect(result.errors.size).to.eq(1)
    const errors = [...result.errors.values()]
    expect(errors[0].length).to.eq(10)
    expect(errors[0][0].message).to.eq('Invalid indentation for feature. Got 3, wanted 1')
    expect(errors[0][1].message).to.eq('Invalid indentation for scenario. Got 7, wanted 3')
    expect(errors[0][2].message).to.eq('Invalid indentation for "given". Got 11, wanted 5')
    expect(errors[0][3].message).to.eq('Invalid indentation for "when". Got 8, wanted 5')
    expect(errors[0][4].message).to.eq('Invalid indentation for "then". Got 9, wanted 5')
    expect(errors[0][5].message).to.eq('Invalid indentation for "and". Got 17, wanted 5')
    expect(errors[0][6].message).to.eq('Invalid indentation for "but". Got 12, wanted 5')
    expect(errors[0][7].message).to.eq('Invalid indentation for "examples". Got 1, wanted 7')
    expect(errors[0][8].message).to.eq('Invalid indentation for "example table header". Got 2, wanted 7')
    expect(errors[0][9].message).to.eq('Invalid indentation for "example table row". Got 4, wanted 7')
  })

  it('does not return an error for correct indentation', async () => {
    const rules = {
      indentation: [
        'error',
        {
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
      ],
    } as any

    const result = await Runner({
      config: {
        directory: 'tests/acceptance/features/indentation/valid',
        rules,
      },
    })

    expect(result.errors.size).to.eq(0)
  })
})
