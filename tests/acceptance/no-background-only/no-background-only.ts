import { expect } from 'chai'
import sinon from 'sinon'
import { Runner } from '../../../src'

after(() => {
  sinon.reset()
})

describe('No Background Only Rule Schemas', () => {
  it('returns an error when using a completely invalid value', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/invalid-value')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('no-background-only')
    expect(errors.length).to.eq(2)
    expect(errors[0]).to.eq("Invalid enum value. Expected 'off' | 'on', received 'foo'")
    expect(errors[1]).to.eq("Invalid enum value. Expected 'warn' | 'error', received 'foo'")
  })

  it('does not return an error when using just a severity', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-severity')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(0)
  })

  it('does not return an error when using "on"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-on')

    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(0)
  })

  it('returns an error when using "on" with arguments', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/on-with-args')
    const result = await Runner()

    expect(result.schemaErrors.size).to.eq(1)
    const errors = result.schemaErrors.get('no-background-only')
    expect(errors.length).to.eq(2)
    expect(errors[0]).to.eq("Expected 'off' | 'on', received array")
    expect(errors[1]).to.eq("Expected 'warn' | 'error', received array")
  })

  it('does not return an error when using "off"', async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname + '/just-off')

    const result = await Runner()
    expect(result.schemaErrors.size).to.eq(0)
  })
})

describe('No Background Only Validation', () => {
  it("returns an error if there's only a background", async () => {
    sinon.stub(process, 'cwd').value(() => import.meta.dirname)
    const result = await Runner()
    expect(result.success).to.eq(false)
    expect(result.errors.size).to.eq(1)

    const key = [...result.errors.keys()][0]
    const errors = result.errors.get(key)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('File contains only a background')
  })
})
