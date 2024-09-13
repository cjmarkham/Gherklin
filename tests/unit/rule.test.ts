import { expect } from 'chai'

import Rule from '../../src/rule'
import { Switch } from '../../src'
import { RuleDefinition } from '../../src/types'

describe('Rule', () => {
  const rule = new Rule('allowed-tags', Switch.off)

  describe('validate', () => {
    it("throws if the rule definition hasn't been loaded yet", () => {
      expect(() => rule.validate()).to.throw(Error, 'rule definition has not been loaded yet')
    })

    it('returns validation errors', () => {
      rule.ruleDefinition = {} as unknown as RuleDefinition
      const errors = rule.validate()
      expect(errors.size).to.eq(1)

      const ruleErrors = errors.get('allowed-tags')
      expect(ruleErrors.length).to.eq(3)
      expect(ruleErrors[0]).to.eq('Input not instance of ZodType')
      expect(ruleErrors[1]).to.eq('rule has no export named "run"')
      expect(ruleErrors[2]).to.eq('rule is missing a schema')
    })
  })
})
