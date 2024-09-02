import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'
import { run } from '../../src/rules/max-scenarios'
import Rule from '../../src/rule'
import { scenario } from '../fixtures'

describe('Max Scenarios', () => {
  it('returns an error if more scenarios than allowed', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Max Scenarios',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 1,
        },
        tags: [],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('max-scenarios', ['error', 1])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Expected max 1 scenarios per file. Found 2.')
  })

  it('does not return an error if more scenarios than allowed', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Max Scenarios',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 1,
        },
        tags: [],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('max-scenarios', ['error', 3])

    const errors = run(rule, document)
    expect(errors.length).to.eq(0)
  })
})
