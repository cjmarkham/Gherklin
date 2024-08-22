import GherkinLinter from '../src/index'

describe('Index', () => {
  it('should accept all manner of feature files', async () => {
    await GherkinLinter({
      directory: 'tests/features',
    })
  })
})
