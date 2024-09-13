import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import sinon from 'sinon'

import Config from '../../src/config'

use(chaiAsPromised)

describe('Config', () => {
  const config = new Config()

  describe('fromFile', () => {
    it('can handle no file found', async () => {
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'could not find gherklin.config.ts')
    })

    it('can handle no default export in config file', async () => {
      sinon.stub(process, 'cwd').value(() => import.meta.dirname)
      await expect(config.fromFile()).to.be.rejectedWith(Error, 'config file did not export a default function')
    })
  })
})
