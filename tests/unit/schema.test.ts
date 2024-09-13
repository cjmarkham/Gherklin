import { expect } from 'chai'

import Schema from '../../src/schema'
import { Severity, Switch } from '../../src'
import { RawSchema } from '../../src/types'

describe('Schema', () => {
  describe('parse', () => {
    const tests = [
      {
        rawSchema: Switch.off,
        expected: {
          severity: Severity.warn,
          args: undefined,
          enabled: false,
        },
      },
      {
        rawSchema: Switch.on,
        expected: {
          severity: Severity.warn,
          args: undefined,
          enabled: true,
        },
      },
      {
        rawSchema: Severity.error,
        expected: {
          severity: Severity.error,
          args: undefined,
          enabled: true,
        },
      },
      {
        rawSchema: Severity.warn,
        expected: {
          severity: Severity.warn,
          args: undefined,
          enabled: true,
        },
      },
      {
        rawSchema: [Severity.warn, ['@development']],
        expected: {
          severity: Severity.warn,
          args: ['@development'],
          enabled: true,
        },
      },
      {
        rawSchema: [Severity.error, { feature: 1 }],
        expected: {
          severity: Severity.error,
          args: { feature: 1 },
          enabled: true,
        },
      },
      {
        rawSchema: { feature: 1 },
        expected: {
          severity: Severity.warn,
          args: { feature: 1 },
          enabled: true,
        },
      },
      {
        rawSchema: ['@dev'],
        expected: {
          severity: Severity.warn,
          args: ['@dev'],
          enabled: true,
        },
      },
    ]

    tests.forEach((test) => {
      it(`correctly parses the raw schema ${JSON.stringify(test.rawSchema)}`, () => {
        const schema = new Schema(test.rawSchema as unknown as RawSchema)
        expect(schema.severity).to.eq(test.expected.severity)
        expect(schema.args).to.deep.eq(test.expected.args)
        expect(schema.enabled).to.eq(test.expected.enabled)
      })
    })
  })
})
