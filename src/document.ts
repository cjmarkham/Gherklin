import fs from 'node:fs/promises'
import { Feature, IdGenerator } from '@cucumber/messages'
import Gherkin from '@cucumber/gherkin'

import { LintError, Location } from './types'

export default class Document {
  public filename: string

  public feature: Feature = new Feature()

  public errors: Array<LintError> = []

  // If true, this document has rule validation disabled
  public disabled: boolean = false

  // A list of lines that are disabled by the gherklin-disable-next-line comment
  // Uses a map of line number => boolean for faster lookups
  public linesDisabled: Map<number, boolean> = new Map()

  // A list of rules that are disabled by the gherklin-disable rule-name comment
  public rulesDisabled: Map<string, boolean> = new Map()

  public constructor(filename: string) {
    this.filename = filename
  }

  public load = async (): Promise<void> => {
    const content = await fs.readFile(this.filename).catch((): never => {
      throw new Error(`Could not open the feature file at "${this.filename}". Does it exist?`)
    })

    const builder = new Gherkin.AstBuilder(IdGenerator.uuid())
    const matcher = new Gherkin.GherkinClassicTokenMatcher()
    const parser = new Gherkin.Parser(builder, matcher)

    const gherkinDocument = parser.parse(content.toString())
    if (!gherkinDocument) {
      return
    }

    if (gherkinDocument.feature) {
      this.feature = gherkinDocument.feature

      gherkinDocument.comments.forEach((comment) => {
        const text = comment.text.trim()

        if (comment.location.line === 1) {
          if (text === '# gherklin-disable') {
            this.disabled = true
            return
          }

          const disableRuleMatch = text.match(/^# gherklin-disable ([a-zA-Z0-9-,\s]+)$/)
          if (disableRuleMatch) {
            const rules = (disableRuleMatch[1] || '').split(',')
            rules.forEach((rule) => {
              this.rulesDisabled.set(rule.trim(), true)
            })
          }
        }

        if (text === '# gherklin-disable-next-line') {
          this.linesDisabled.set(comment.location.line + 1, true)
        }
      })
    }
  }

  public addError = (ruleName: string, message: string, location: Location): void => {
    // Don't add the error if the line has been disabled
    if (this.linesDisabled.get(location.line)) {
      return
    }

    if (this.rulesDisabled.get(ruleName) === true) {
      return
    }

    this.errors.push({
      message,
      location,
    } as LintError)
  }
}
