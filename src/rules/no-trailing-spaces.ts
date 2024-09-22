import { createReadStream, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import readline from 'readline'

import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import Rule from '../rule'
import { switchOrSeveritySchema } from '../schemas'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

export const run = async (rule: Rule, document: GherkinDocument, fileName: string): Promise<Array<LintError>> => {
  const errors: Array<LintError> = []

  // Cucumber automatically trims the spaces when parsing the Gherkin, so we need to read the actual file
  const stream = createReadStream(fileName)
  const rl = readline.createInterface({
    input: stream,
  })

  let lineNumber = 1
  let previousLine = undefined

  for await (const line of rl) {
    if (previousLine !== undefined) {
      const disableCheck = previousLine.match(/#\s?gherklin-disable-next-line/)
      if (disableCheck) {
        continue
      }
    }
    if (line.charCodeAt(line.length - 1) === 32) {
      errors.push({
        message: 'Found trailing whitespace.',
        location: {
          line: lineNumber,
          column: line.length,
        },
      } as LintError)
    }
    lineNumber += 1
    previousLine = line
  }

  return errors
}

export const fix = async (rule: Rule, document: GherkinDocument, fileName: string): Promise<void> => {
  const fileContent = readFileSync(fileName, { encoding: 'utf-8' })
  const lines = fileContent.split('\n')

  const newContent = []

  lines.forEach((line) => {
    newContent.push(line.trimEnd())
  })

  writeFileSync(fileName, newContent.join('\n'))
}
