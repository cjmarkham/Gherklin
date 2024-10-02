import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'

import { Switch } from '../../src'
import Config from '../../src/config'

use(chaiAsPromised)

describe('Config', () => {
  describe('fromFile', () => {
    const config = new Config()

    it('can handle no file found', async () => {
      sinon.stub(process, 'cwd').value(() => './invalid/path')
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'could not find gherklin.config.ts')
    })

    it('can handle no default export in config file', async () => {
      sinon.stub(process, 'cwd').value(() => import.meta.dirname)
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'config file did not export a default function')
    })
  })

  describe('validate', () => {
    it('throws if theres no featureDirectory and featureFile', () => {
      expect(() => new Config({})).to.throw(
        Error,
        'Please specify either a featureDirectory or featureFile configuration option.',
      )
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
