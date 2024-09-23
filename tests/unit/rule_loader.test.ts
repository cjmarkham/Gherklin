import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import RuleLoader from '../../src/rule_loader'
import { Switch } from '../../src'

use(chaiAsPromised)

describe('RuleLoader', () => {
  const loader = new RuleLoader()

  describe('load', () => {
    context('no custom directory specified', () => {
      it('handles no rule in default rules', async () => {
        const load = loader.load('.', 'a-rule', Switch.on)
        await expect(load).to.be.rejectedWith(
          Error,
          'could not find rule "a-rule" in default rules.\nIf this is a custom rule, please specify a customRuleDir in the config.',
        )
      })
    })

    context('custom directory specified', () => {
      it('handles no rule in default rules or custom rules', async () => {
        const load = loader.load('.', 'a-rule', Switch.on, '.')
        await expect(load).to.be.rejectedWith(Error, 'could not find rule "a-rule" in default rules or ".".')
      })
    })
  })
})
