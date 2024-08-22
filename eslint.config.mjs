import typescriptEslint from '@typescript-eslint/eslint-plugin'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  ...compat.extends('prettier'),
  {
    name: 'Default configuration',
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...Object.fromEntries(Object.entries(globals.browser).map(([key]) => [key, 'off'])),
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: 'module',
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.ts'],
        },
      },
    },

    rules: {
      'no-template-curly-in-string': 'off',
      'no-useless-constructor': 'off',
      'max-len': 'off',
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
      'class-methods-use-this': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
      'consistent-return': 'off',
      'prefer-destructuring': 'off',
    },
  },
]
