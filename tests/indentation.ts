import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'

import { scenario } from './fixtures'
import indentation from '../src/rules/indentation'

describe('Indentation', () => {
  it('should not return an error if the feature contains correct indentation', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 1,
        },
        tags: [],
        children: [{ scenario }],
      },
      comments: [],
    }

    const errors = indentation({}, document)
    expect(errors.length).to.eq(0)
  })

  it('should return an error if the feature contains incorrect indentation', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 10,
        },
        tags: [],
        children: [{ scenario }],
      },
      comments: [],
    }

    const errors = indentation({}, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Indentation for "Feature" is incorrect. Got 9, want 0')
  })
})
