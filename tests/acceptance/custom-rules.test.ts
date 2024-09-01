import Runner from '../../src/runner'
import { Severity } from '../../src'
import { expect } from 'chai'

describe('Custom Rules', () => {
  it('loads the custom rules', async () => {
    const result = await Runner({
      config: {
        directory: './features/allowed-tags',
        customRulesDir: './custom-rules',
        rules: {
          'no-empty-files': Severity.error,
        },
      },
    })
    expect(result.success).to.eq(true)
  })

  it('returns an error if there is no run export', async () => {
    const result = await Runner({
      config: {
        directory: './features/allowed-tags',
        customRulesDir: './custom-rules',
        rules: {
          'no-run-func': Severity.error,
        },
      },
    })
    expect(result.success).to.eq(false)
    const errors = result.schemaErrors.get('no-run-func')
    expect(errors[0].errors[0]).to.eq('rule has no export named "run"')
  })

  it('returns an error if there is no schema export', async () => {
    const result = await Runner({
      config: {
        directory: './features',
        customRulesDir: './custom-rules',
        rules: {
          'no-schema': Severity.error,
        },
      },
    })
    expect(result.success).to.eq(false)
    const errors = result.schemaErrors.get('no-schema')
    expect(errors[0].errors[0]).to.eq('rule is missing a schema')
  })
})
