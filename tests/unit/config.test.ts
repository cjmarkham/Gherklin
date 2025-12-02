import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'

import { Switch } from '../../src'
import Config from '../../src/config'

use(chaiAsPromised)

describe('Config', () => {
  describe('fromFile', () => {
    const config = new Config()

    afterEach(() => {
      delete process.env.GHERKLIN_CONFIG_FILE
    })

    it('can handle no file found', async () => {
      process.cwd = () => './invalid/path'
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'could not find gherklin.config.ts or GHERKLIN_CONFIG_FILE environment variable')
    })

    it('can handle no default export in config file', async () => {
      process.cwd = () => import.meta.dirname
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'config file did not export a default function')
    })

    it('uses GHERKLIN_CONFIG_FILE when default file not found', async () => {
      process.cwd = () => './invalid/path'
      process.env.GHERKLIN_CONFIG_FILE = './invalid/config.ts'
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'could not find gherklin.config.ts or GHERKLIN_CONFIG_FILE environment variable')
    })

    it('throws when GHERKLIN_CONFIG_FILE points to non-existent file', async () => {
      process.cwd = () => './invalid/path'
      process.env.GHERKLIN_CONFIG_FILE = '/non/existent/path/config.ts'
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'could not find gherklin.config.ts or GHERKLIN_CONFIG_FILE environment variable')
    })
  })

  describe('validate', () => {
    afterEach(() => {
      delete process.env.GHERKLIN_FEATURE_FILES
      delete process.env.GHERKLIN_FEATURE_DIR
    })

    it('throws if theres no featureDirectory and featureFile', () => {
      expect(() => new Config({})).to.throw(
        Error,
        'Please specify either a featureDirectory or featureFile configuration option, or set GHERKLIN_FEATURE_DIR or GHERKLIN_FEATURE_FILES environment variable.',
      )
    })

    it('accepts GHERKLIN_FEATURE_FILES env var', () => {
      process.env.GHERKLIN_FEATURE_FILES = 'test.feature'
      expect(() => new Config({ rules: { 'no-empty-file': Switch.on } })).to.not.throw()
    })

    it('accepts GHERKLIN_FEATURE_DIR env var', () => {
      process.env.GHERKLIN_FEATURE_DIR = './features'
      expect(() => new Config({ rules: { 'no-empty-file': Switch.on } })).to.not.throw()
    })

    it('throws if theres no rules', () => {
      expect(
        () =>
          new Config({
            featureFile: 'test.feature',
          }),
      ).to.throw(Error, 'Please specify a list of rules in your configuration.')
    })

    it('throws if theres rules but the object is empty', () => {
      expect(
        () =>
          new Config({
            featureFile: 'test.feature',
            rules: {},
          }),
      ).to.throw(Error, 'Please specify a list of rules in your configuration.')
    })

    it('throws if featureFile and featureDirectory are passed', () => {
      expect(
        () =>
          new Config({
            featureFile: 'test.feature',
            featureDirectory: '.',
            rules: {
              'allowed-tags': Switch.on,
            },
          }),
      ).to.throw(Error, 'Please only specify either a feature file or feature directory.')
    })
  })
})
