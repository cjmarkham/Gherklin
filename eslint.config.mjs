import stylistic from '@stylistic/eslint-plugin'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'

export default [
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
      '@stylistic': stylistic,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      '@stylistic/eol-last': 'warn',
      '@stylistic/max-len': ['warn', { code: 80 }],
      '@stylistic/comma-dangle': ['warn', 'always-multiline'],
      'class-methods-use-this': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
]
