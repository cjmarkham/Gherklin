import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'
import { scenario } from '../fixtures'
import { run } from '../../src/rules/allowed-tags'
import { Rule } from '../../src/rule'

describe('Allowed Tags', () => {
  it('does not return an error if tags are allowed', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Allowed Tags',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [
          {
            name: '@development',
            location: {
              line: 1,
              column: 1,
            },
            id: '41da6b5b-d8b3-4768-8993-c65aa428e062',
          },
        ],
        children: [{ scenario }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('allowed-tags', ['@development'])

    const errors = run(rule, document)
    expect(errors.length).to.eq(0)
  })

  it('returns an error if tags are not allowed', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Allowed Tags',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [
          {
            name: '@development',
            location: {
              line: 1,
              column: 1,
            },
            id: '41da6b5b-d8b3-4768-8993-c65aa428e062',
          },
        ],
        children: [{ scenario }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('allowed-tags', ['@testing'])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Found a tag that is not allowed. Got @development, wanted @testing')
  })

  it('returns no error if the tag exists in a list', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Allowed Tags',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [
          {
            name: '@development',
            location: {
              line: 1,
              column: 1,
            },
            id: '41da6b5b-d8b3-4768-8993-c65aa428e062',
          },
        ],
        children: [{ scenario }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('allowed-tags', ['@development', '@testing', '@production'])

    const errors = run(rule, document)
    expect(errors.length).to.eq(0)
  })

  it('returns an error if the tag does not exist in a list', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Allowed Tags',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [
          {
            name: '@development',
            location: {
              line: 1,
              column: 1,
            },
            id: '41da6b5b-d8b3-4768-8993-c65aa428e062',
          },
        ],
        children: [{ scenario }],
      },
      comments: [],
    }

    const rule: Rule = new Rule('allowed-tags', ['@staging', '@testing', '@production'])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq(
      'Found a tag that is not allowed. Got @development, wanted @staging, @testing, @production',
    )
  })
})
