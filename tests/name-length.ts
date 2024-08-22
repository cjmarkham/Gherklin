import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'

import allowedTags from '../src/rules/allowed-tags'
import { scenario } from './fixtures'
import nameLength from '../src/rules/name-length'

describe('Name Length', () => {
  it('should not return an error if the feature name is the correct length', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Name Length',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ scenario }],
      },
      comments: [],
    }

    const errors = nameLength({}, document)
    expect(errors.length).to.eq(0)
  })

  it('should return an error if the feature name is an incorrect length', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Name Length',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ scenario }],
      },
      comments: [],
    }

    const errors = nameLength(
      {
        nameLength: {
          feature: 10,
        },
      },
      document,
    )
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('"Feature" name is too long. Got 11, want 10')
  })

  it('should return an error if the scenario name is an incorrect length', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Name Length',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ scenario }],
      },
      comments: [],
    }

    const errors = nameLength(
      {
        nameLength: {
          scenario: 1,
        },
      },
      document,
    )
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('"Scenario" name is too long. Got 10, want 1')
  })

  it('should return an error if the step name is an incorrect length', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Name Length',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ scenario }],
      },
      comments: [],
    }

    const errors = nameLength(
      {
        nameLength: {
          step: 2,
        },
      },
      document,
    )
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('"Given" name is too long. Got 6, want 2')
  })
})
