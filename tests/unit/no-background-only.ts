import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'
import { background, scenario } from '../fixtures'
import { run } from '../../src/rules/no-background-only'
import { Rule } from '../../src/rule'
import { Severity, Switch } from '../../src/config'

describe('No Background Only', () => {
  it('does not return an error if there are scenarios', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'No Background Only',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ background }, { scenario }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('no-background-only', Switch.on)

    const errors = run(rule, document)
    expect(errors.length).to.eq(0)
  })

  it('returns an error if there is only a background', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'No Background Only',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ background }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('no-background-only', Severity.error)

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('File contains only a background')
  })
})
