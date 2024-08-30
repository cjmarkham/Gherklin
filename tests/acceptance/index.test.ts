import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import GherkinLint from '../../src/index'

use(chaiAsPromised)

describe('Gherkin Linter', () => {
  it('throws an error if it cant find the specified config file', async () => {
    const result = GherkinLint({ configDirectory: './some-invalid-directory' })
    await expect(result).to.be.rejectedWith(Error, 'Could not find a gherkin-lint.config.ts configuration file')
  })

  it('throws an error if it cant find a config file in the current directory', async () => {
    const result = GherkinLint()
    await expect(result).to.be.rejectedWith(Error, 'Could not find a gherkin-lint.config.ts configuration file')
  })

  it('does not throw an error if it can find the specified config file', async () => {
    const result = GherkinLint({ configDirectory: 'tests/acceptance' })
    expect(result).to.eventually.eq({
      success: true,
    })
  })
})
