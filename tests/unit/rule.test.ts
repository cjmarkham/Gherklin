import { expect } from 'chai'
import { GherkinKeywordNumericals, RuleConfiguration, Severity, Switch } from '../../src/config'
import { Rule } from '../../src/rule'

describe('parseRule', () => {
  it('returns a valid rule when using only severity', async () => {
    const raw: RuleConfiguration = {
      'allowed-tags': Severity.error,
    }
    const rule = new Rule('allowed-tags', raw['allowed-tags'])

    expect(rule.name).to.eq('allowed-tags')
    expect(rule.severity).to.eq(Severity.error)
    expect(rule.enabled).to.eq(true)
  })

  it('returns a valid rule when using only a switch', () => {
    const raw: RuleConfiguration = {
      'allowed-tags': Switch.on,
    }
    const rule = new Rule('allowed-tags', raw['allowed-tags'])

    expect(rule.name).to.eq('allowed-tags')
    expect(rule.severity).to.eq(Severity.warn)
    expect(rule.enabled).to.eq(true)
  })

  it('returns a valid rule when using only gherkin keyword numericals', () => {
    const raw: RuleConfiguration = {
      indentation: {
        feature: 1,
      } as GherkinKeywordNumericals,
    }
    const rule = new Rule('indentation', raw['indentation'])

    expect(rule.name).to.eq('indentation')
    expect(rule.severity).to.eq(Severity.warn)
    expect(rule.enabled).to.eq(true)
    expect(rule.args).to.deep.eq({ feature: 1 })
  })

  it('returns a valid rule when using only an array of strings', () => {
    const raw: RuleConfiguration = {
      'allowed-tags': ['@development'],
    }
    const rule = new Rule('allowed-tags', raw['allowed-tags'])

    expect(rule.name).to.eq('allowed-tags')
    expect(rule.severity).to.eq(Severity.warn)
    expect(rule.enabled).to.eq(true)
    expect(rule.args).to.deep.eq(['@development'])
  })

  it('returns a valid rule when using severity and gherkin keyword numericals', () => {
    const raw: RuleConfiguration = {
      indentation: [
        'error',
        {
          feature: 1,
        } as GherkinKeywordNumericals,
      ],
    }
    const rule = new Rule('indentation', raw['indentation'])

    expect(rule.name).to.eq('indentation')
    expect(rule.severity).to.eq(Severity.error)
    expect(rule.enabled).to.eq(true)
    expect(rule.args).to.deep.eq({ feature: 1 })
  })

  it('returns a valid rule when using a severity and an array of strings', () => {
    const raw: RuleConfiguration = {
      'allowed-tags': ['error', ['@development']],
    }
    const rule = new Rule('allowed-tags', raw['allowed-tags'])

    expect(rule.name).to.eq('allowed-tags')
    expect(rule.severity).to.eq(Severity.error)
    expect(rule.enabled).to.eq(true)
    expect(rule.args).to.deep.eq(['@development'])
  })
})
