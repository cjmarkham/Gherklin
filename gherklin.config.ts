export default {
  reporter: {
    type: 'stdout',
  },
  featureDirectory: './tests/acceptance/features',
  rules: {
    indentation: [
      'warn',
      {
        feature: 1,
        background: 3,
        scenario: 3,
        step: 5,
        examples: 5,
        given: 5,
        when: 5,
        then: 5,
        and: 5,
        but: 5,
        exampleTableHeader: 7,
        exampleTableBody: 7,
        scenarioOutline: 3,
      },
    ],
    'new-line-at-eof': 'warn',
    'no-background-only': 'warn',
    'no-empty-file': 'warn',
    'no-trailing-spaces': 'warn',
    'no-unnamed-scenarios': 'warn',
  },
}
