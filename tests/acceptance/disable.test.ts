import path from 'node:path'
import { Runner, Severity } from '../../src'
import { expect } from 'chai'

describe('gherklin-disable', () => {
  describe('allowed-tags', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

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

  describe('max-scenarios', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'max-scenarios': ['error', 1],
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('indentation', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

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

  describe('new-line-at-eof', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'new-line-at-eof': Severity.error,
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('no-background-only', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'no-background-only': Severity.error,
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('no-dupe-features', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'no-dupe-features': Severity.error,
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('no-dupe-scenarios', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'no-dupe-scenarios': Severity.error,
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('no-empty-file', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

      const runner = new Runner({
        configDirectory: '.',
        featureDirectory,
        rules: {
          'no-empty-file': Severity.error,
        },
      })

      await runner.init()
      const result = await runner.run()

      expect(result.success).to.eq(true)
    })
  })

  describe('no-trailing-spaces', () => {
    it('respects disable comments', async () => {
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

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
      const featureDirectory = path.join(import.meta.dirname, './features/disable')

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
