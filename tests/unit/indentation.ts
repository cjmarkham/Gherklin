import { expect } from 'chai'
import { GherkinDocument } from '@cucumber/messages'
import { run } from '../../src/rules/indentation'
import Rule from '../../src/rule'

describe('Indentation', () => {
  it('returns an error for an invalid feature indentation', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 1,
        },
        tags: [],
        children: [],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { feature: 0 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for feature. Got 1, wanted 0')
  })

  it('returns an error for an invalid background indentation', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            background: {
              id: '',
              steps: [],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { feature: 0, background: 2 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for background. Got 3, wanted 2')
  })

  it('returns an error for an invalid scenario indentation', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            scenario: {
              id: '',
              steps: [],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
              tags: [],
              examples: [],
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { feature: 0, background: 2, scenario: 2 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for scenario. Got 3, wanted 2')
  })

  it('returns an error for an invalid "given" indentation in background', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            background: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'Given',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { given: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "given". Got 21, wanted 4')
  })

  it('returns an error for an invalid "when" indentation in background', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            background: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'When',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { when: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "when". Got 21, wanted 4')
  })

  it('returns an error for an invalid "then" indentation in background', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            background: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'Then',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { then: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "then". Got 21, wanted 4')
  })

  it('returns an error for an invalid "and" indentation in background', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            background: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'And',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { and: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "and". Got 21, wanted 4')
  })

  it('returns an error for an invalid "but" indentation in background', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            background: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'But',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { but: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "but". Got 21, wanted 4')
  })

  it('returns an error for an invalid "given" indentation in scenario', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            scenario: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'Given',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
              examples: [],
              tags: [],
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { given: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "given". Got 21, wanted 4')
  })

  it('returns an error for an invalid "when" indentation in scenario', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            scenario: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'When',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
              examples: [],
              tags: [],
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { when: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "when". Got 21, wanted 4')
  })

  it('returns an error for an invalid "then" indentation in scenario', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            scenario: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'Then',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
              examples: [],
              tags: [],
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { then: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "then". Got 21, wanted 4')
  })

  it('returns an error for an invalid "and" indentation in scenario', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            scenario: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'And',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
              examples: [],
              tags: [],
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { and: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "and". Got 21, wanted 4')
  })

  it('returns an error for an invalid "but" indentation in scenario', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            scenario: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'But',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
              examples: [],
              tags: [],
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { but: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "but". Got 21, wanted 4')
  })

  it('returns an error for an invalid "examples" indentation', () => {
    const document: GherkinDocument = {
      feature: {
        name: 'Indentation',
        description: '',
        language: '',
        keyword: '',
        location: {
          line: 1,
          column: 0,
        },
        tags: [],
        children: [
          {
            scenario: {
              id: '',
              steps: [
                {
                  id: '',
                  text: '',
                  keyword: 'But',
                  location: {
                    line: 3,
                    column: 21,
                  },
                },
              ],
              keyword: '',
              name: '',
              description: '',
              location: {
                line: 2,
                column: 3,
              },
              examples: [
                {
                  id: '',
                  description: '',
                  keyword: '',
                  name: '',
                  location: {
                    line: 4,
                    column: 56,
                  },
                  tableBody: undefined,
                  tags: [],
                },
              ],
              tags: [],
            },
          },
        ],
      },
      comments: [],
    }

    const rule: Rule = new Rule('indentation', ['error', { examples: 4 }])

    const errors = run(rule, document)
    expect(errors.length).to.eq(1)
    expect(errors[0].message).to.eq('Invalid indentation for "examples". Got 56, wanted 4')
  })
})
