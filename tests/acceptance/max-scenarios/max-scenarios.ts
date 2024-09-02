import { expect } from 'chai'
import sinon from 'sinon'
import { Runner } from '../../../src'

after(() => {
  sinon.reset()
})

describe('Max Scenarios Rule Schemas', () => {
  it('returns an error when using a completely invalid value', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/invalid-value')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('max-scenarios')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected number, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using just a severity', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-severity')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('max-scenarios')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected number, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-on')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('max-scenarios')
    expect(errors.length).to.eq(3)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected number, received string')
    expect(errors[2]).to.eq('Expected array, received string')
  })

  it('returns an error when using "on" with arguments', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/on-with-args')
    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('max-scenarios')
    expect(errors.length).to.eq(2)
    expect(errors[0]).to.eq('Invalid literal value, expected "off"')
    expect(errors[1]).to.eq('Expected number, received array')
  })

  it('does not return an error when using "off"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-off')

    const result = await Runner()
    expect(result.schemaErrors.size).to.eq(0)
  })

  it('does not return an error when using a number', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/valid')

    const result = await Runner()
    expect(result.schemaErrors.size).to.eq(0)
  })
})

describe('Max Scenarios Validation', () => {
  it("returns an error if there's more than allowed", async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname)
    const result = await Runner()
    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    const key = [...result.errors.keys()][0]
    const errors = result.errors.get(key)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Expected max 1 scenarios per file. Found 2.')
  })
})
