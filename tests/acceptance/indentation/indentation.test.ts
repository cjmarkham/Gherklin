import { expect } from 'chai'
import sinon from 'sinon'
import { Runner } from '../../../src'

after(() => {
  sinon.reset()
})

describe('Indentation Rule Schemas', () => {
  it('returns an error when using a completely invalid value', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/invalid-value')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('indentation')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected object, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using just a severity', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-severity')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('indentation')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected object, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-on')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('indentation')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected object, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on" with arguments', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/on-with-args')
    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('indentation')
    expect(errors.length).to.eq(2)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected object, received array')
  })

  it('does not return an error when using "off"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-off')

    const result = await Runner()
    expect(result.schemaErrors.size).to.eq(0)
  })
})

describe('Indentation Validation', () => {
  it('returns an error for invalid indentation', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname)
    const result = await Runner()
    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    const key = [...result.errors.keys()][0]
    const errors = result.errors.get(key)
    expect(errors.length).to.eq(10)
    expect(errors[0].message).to.eq('Invalid indentation for feature. Got 3, wanted 1')
    expect(errors[1].message).to.eq('Invalid indentation for scenario. Got 7, wanted 3')
    expect(errors[2].message).to.eq('Invalid indentation for "given". Got 11, wanted 5')
    expect(errors[3].message).to.eq('Invalid indentation for "when". Got 8, wanted 5')
    expect(errors[4].message).to.eq('Invalid indentation for "then". Got 9, wanted 5')
    expect(errors[5].message).to.eq('Invalid indentation for "and". Got 17, wanted 5')
    expect(errors[6].message).to.eq('Invalid indentation for "but". Got 12, wanted 5')
    expect(errors[7].message).to.eq('Invalid indentation for "examples". Got 1, wanted 5')
    expect(errors[8].message).to.eq('Invalid indentation for "example table header". Got 2, wanted 7')
    expect(errors[9].message).to.eq('Invalid indentation for "example table row". Got 4, wanted 7')
  })
})
