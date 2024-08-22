import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'

import allowedTags from '../src/rules/allowed-tags'
import { scenario } from './fixtures'

describe('Allowed Tags', () => {
  it('should not return an error if the feature contains no tags', async () => {
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
        tags: [],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const errors = allowedTags(
      {
        allowedTags: ['@development'],
      },
      document,
    )
    expect(errors.length).to.eq(0)
  })

  it('should not return an error if the config has no tags', async () => {
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
              line: 0,
              column: 0,
            },
            id: '51c4f530-3daa-4923-932b-c7b03cd69cf5',
          },
        ],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const errors = allowedTags(
      {
        allowedTags: [],
      },
      document,
    )
    expect(errors.length).to.eq(0)
  })

  it('should not return an error if the feature contains tags in the allow list', async () => {
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
              line: 0,
              column: 0,
            },
            id: '51c4f530-3daa-4923-932b-c7b03cd69cf5',
          },
        ],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const errors = allowedTags(
      {
        allowedTags: ['@development'],
      },
      document,
    )
    expect(errors.length).to.eq(0)
  })

  it('should return an error if the feature contains tags not in the allow list', async () => {
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
            name: '@tag1',
            location: {
              line: 0,
              column: 0,
            },
            id: '51c4f530-3daa-4923-932b-c7b03cd69cf5',
          },
        ],
        children: [{ scenario }, { scenario }],
      },
      comments: [],
    }

    const errors = allowedTags(
      {
        allowedTags: ['@development'],
      },
      document,
    )
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Found a tag that is not allwed. Got @tag1, wanted @development')
  })
})
