import { expect } from 'chai'
import { Runner } from '../../../src/index'
import sinon from 'sinon'

after(() => {
  sinon.reset()
})

describe('Allowed Tags Rule Schemas', () => {
  it('returns an error when using a completely invalid value', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/invalid-value')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected array, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using just a severity', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-severity')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected array, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-on')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected array, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on" with arguments', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/on-with-args')
    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('allowed-tags')
    expect(errors.length).to.eq(1)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
  })

  it('does not return an error when using "off"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-off')

    const result = await Runner()
    expect(result.schemaErrors.size).to.eq(0)
  })

  it('does not return an error when using a severity and arguments', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/severity-and-args')

    const result = await Runner()
    expect(result.schemaErrors.size).to.eq(0)
  })

  it('does not return an error when using only arguments', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-args')
    const result = await Runner()
    expect(result.schemaErrors.size).to.eq(0)
  })
})

describe('Allowed Tags Validation', () => {
  it('returns an error if the tag is not allowed', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-args')

    const result = await Runner()

    expect(result.errors.size).to.eq(2)
    const errors = [...result.errors.values()]
    expect(errors[0][0].message).to.eq('Found a feature tag that is not allowed. Got @testing, wanted @development')
    expect(errors[1][0].message).to.eq('Found a scenario tag that is not allowed. Got @testing, wanted @development')
  })

  it('does not return an error if the tag is allowed', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/severity-and-args')
    const result = await Runner()

    expect(result.errors.size).to.eq(0)
  })
})
