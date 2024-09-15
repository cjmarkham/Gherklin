import path from 'node:path'
import { Runner, Severity } from '../../src'
import { expect } from 'chai'

describe('gherklin-disable-next-line', () => {
  describe('allowed-tags', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable-next-line')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'allowed-tags': ['error', ['@development']],
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('indentation', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable-next-line')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
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
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('no-trailing-spaces', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable-next-line')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'no-trailing-spaces': Severity.error,
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('no-unnamed-scenarios', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable-next-line')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'no-unnamed-scenarios': Severity.error,
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })
})
