#!/bin/node

import { readdirSync, readFileSync } from 'node:fs'

const fileLocation = './src/rules/README.md'
const rules = readdirSync('./src/rules')
  .filter((f) => f !== 'README.md' && f !== 'index.ts')
  .map((r) => r.replace('.ts', ''))

const content = readFileSync(fileLocation, { encoding: 'utf-8' })
const errors: Array<string> = []

rules.forEach((rule) => {
  // Look for the rule in the index
  const indexIndex = content.indexOf(`[${rule}](#${rule})`)
  if (indexIndex === -1) {
    errors.push(`\u001b[91mCould not find rule ${rule} in README index\u001b[0m`)
  }

  const smallWords = ['at', 'in']
  const largeWords = ['eof']

  const ruleTitlized = rule
    .split('-')
    .map((p) => {
      if (smallWords.includes(p)) {
        return p.toLowerCase()
      }
      if (largeWords.includes(p)) {
        return p.toUpperCase()
      }
      return `${p.charAt(0).toUpperCase()}${p.slice(1, p.length)}`
    })
    .join(' ')

  const index = content.indexOf(`### ${ruleTitlized}`)
  if (index === -1) {
    errors.push(`\u001b[91mCould not find entry for ${ruleTitlized} in README\u001b[0m`)
  }
})

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

process.exit(0)
