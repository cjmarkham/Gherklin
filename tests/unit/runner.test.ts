import { expect } from 'chai'
import path from 'node:path'

import { Runner } from '../../src'
import { Switch } from '../../src/types'

describe('Runner', () => {
  afterEach(() => {
    delete process.env.GHERKLIN_FEATURE_FILES
    delete process.env.GHERKLIN_FEATURE_DIR
  })

  describe('init with environment variables', () => {
    it('uses GHERKLIN_FEATURE_FILES for single file', async () => {
      process.env.GHERKLIN_FEATURE_FILES = path.resolve(
        import.meta.dirname,
        '../acceptance/features/no-empty-file.feature',
      )
      const runner = new Runner({
        rules: { 'no-empty-file': Switch.on },
      })
      await runner.init()
      expect(runner.gherkinFiles).to.have.lengthOf(1)
      expect(runner.gherkinFiles[0]).to.include('no-empty-file.feature')
    })

    it('uses GHERKLIN_FEATURE_FILES for multiple files', async () => {
      const file1 = path.resolve(import.meta.dirname, '../acceptance/features/no-empty-file.feature')
      const file2 = path.resolve(import.meta.dirname, '../acceptance/features/max-errors.feature')
      process.env.GHERKLIN_FEATURE_FILES = `${file1}, ${file2}`
      const runner = new Runner({
        rules: { 'no-empty-file': Switch.on },
      })
      await runner.init()
      expect(runner.gherkinFiles).to.have.lengthOf(2)
      expect(runner.gherkinFiles[0]).to.include('no-empty-file.feature')
      expect(runner.gherkinFiles[1]).to.include('max-errors.feature')
    })

    it('uses GHERKLIN_FEATURE_DIR for directory', async () => {
      process.env.GHERKLIN_FEATURE_DIR = path.resolve(import.meta.dirname, '../acceptance/features')
      const runner = new Runner({
        rules: { 'no-empty-file': Switch.on },
      })
      await runner.init()
      expect(runner.gherkinFiles.length).to.be.greaterThan(0)
      expect(runner.gherkinFiles[0]).to.include('.feature')
    })

    it('throws when GHERKLIN_FEATURE_DIR points to non-existent directory', async () => {
      process.env.GHERKLIN_FEATURE_DIR = '/non/existent/directory'
      const runner = new Runner({
        rules: { 'no-empty-file': Switch.on },
      })
      await expect(runner.init()).to.be.rejected
    })

    it('throws when GHERKLIN_FEATURE_FILES points to non-existent file', async () => {
      process.env.GHERKLIN_FEATURE_FILES = '/non/existent/file.feature'
      const runner = new Runner({
        rules: { 'no-empty-file': Switch.on },
      })
      const result = await runner.init()
      await expect(runner.run()).to.be.rejected
    })
  })
})
