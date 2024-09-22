import * as fs from 'node:fs/promises'

import { GherkinDocument } from '@cucumber/messages'

import { LintError } from '../error'
import Rule from '../rule'
import { switchOrSeveritySchema } from '../schemas'
import { readFileSync, writeFileSync } from 'node:fs'

/**
 * Allowed:
 * off | on | error | warn
 */
export const schema = switchOrSeveritySchema

export const run = async (rule: Rule, document: GherkinDocument, fileName: string): Promise<Array<LintError>> => {
  const errors: Array<LintError> = []

  // readline automatically strips lines that are only whitespace, so we have to split the lines manually
  const content = await fs.readFile(fileName)
  const lines = String(content).split(/\r\n|\r|\n/)

  const lastLine = lines[lines.length - 1]
  if (lastLine !== '') {
    errors.push({
      message: 'No new line at end of file.',
      location: {
        line: lines.length,
        column: 0,
      },
    } as LintError)
  }

  return errors
}

export const fix = async (rule: Rule, document: GherkinDocument, fileName: string): Promise<void> => {
  const fileContent = readFileSync(fileName, { encoding: 'utf-8' })
  const newContent = fileContent + '\n'

  writeFileSync(fileName, newContent)
}
