import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'

import maxScenariosPerFile from '../src/rules/max-scenarios-per-file'
import { scenario } from './fixtures'

describe('Too Many Scenarios', () => {
  it('should not return an error if scenarios dont exceed max allowed', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Too many scenarios',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const errors = maxScenariosPerFile(
      {
        maxScenariosPerFile: 2,
      },
      document,
    )
    expect(errors.length).to.eq(0)
  })

  it('should return an error if scenarios exceed max allowed', async () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Too many scenarios',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 0,
          column: 0,
        },
        tags: [],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const errors = maxScenariosPerFile(
      {
        maxScenariosPerFile: 1,
      },
      document,
    )
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Number of scenarios exceeds allowed. Got 2, want 1')
    expect(errors[0].rule).to.eq('max-scenarios-per-file')
  })
})
