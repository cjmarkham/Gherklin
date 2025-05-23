import fs from 'node:fs/promises'
import path from 'node:path'
import { Feature, IdGenerator, GherkinDocument } from '@cucumber/messages'
import Gherkin from '@cucumber/gherkin'

import { LintError, Location } from './types'
import { writeFileSync } from 'node:fs'
import Line from './line'
import Rule from './rule'

export default class Document {
  public filename: string

  public feature: Feature = new Feature()

  public path: string

  public gherkinDocument: GherkinDocument

  // Sometimes, we need access to the raw lines since Gherkin has processing
  // to trim line content in the AST
  public lines: Array<Line> = []

  public errors: Array<LintError> = []

  // If true, this document has rule validation disabled
  public disabled: boolean = false

  // A list of lines that are disabled by the gherklin-disable-next-line comment
  // Uses a map of line number => array of rules to disable
  public linesDisabled: Map<number, Array<string>> = new Map()

  // A list of rules that are disabled by the gherklin-disable rule-name comment
  public rulesDisabled: Map<string, boolean> = new Map()

  public constructor(filePath: string) {
    this.filename = path.basename(filePath)
    this.path = filePath
  }

  public load = async (): Promise<void> => {
    const content = await fs.readFile(this.path).catch((): never => {
      throw new Error(`Could not open the feature file at "${this.filename}". Does it exist?`)
    })

    this.parseGherkin(String(content))
    if (!this.gherkinDocument) {
      return
    }

    const lines = String(content).split(/\r\n|\r|\n/)
    lines.forEach((line) => {
      this.lines.push(new Line(line))
    })

    this.getDisabledRules()
  }

  private parseGherkin = (content: string): void => {
    const builder = new Gherkin.AstBuilder(IdGenerator.uuid())
    const matcher = new Gherkin.GherkinClassicTokenMatcher()
    const parser = new Gherkin.Parser(builder, matcher)

    this.gherkinDocument = parser.parse(content.toString())
    if (this.gherkinDocument.feature) {
      this.feature = this.gherkinDocument.feature
    }
  }

  public addError = (rule: Rule, message: string, location: Location): void => {
    // Don't add the error if the line has been disabled
    const disabledLine = this.linesDisabled.get(location.line)
    if (disabledLine) {
      // If the array is empty, we disable all rules
      if (disabledLine.length === 0) {
        return
      }

      // Specific rule disabled for next line
      if (disabledLine.includes(rule.name)) {
        return
      }
    }

    // Don't add the error if the rule is disabled via
    // # gherklin-disable rule-name
    if (this.rulesDisabled.get(rule.name) === true) {
      return
    }

    this.errors.push({
      message,
      location,
      severity: rule.schema.severity,
      rule: rule.name,
    } as LintError)
  }

  private getDisabledRules = (): void => {
    this.gherkinDocument.comments.forEach((comment) => {
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

      const disableNextLineMatches = text.match(/#\sgherklin-disable-next-line\s?([a-zA-Z0-9-,\s]+)?/)
      if (disableNextLineMatches && disableNextLineMatches.length) {
        const specificRules = disableNextLineMatches[1]
        this.linesDisabled.set(comment.location.line + 1, specificRules?.split(',').map((r): string => r.trim()) ?? [])
      }
    })
  }

  /**
   * Regenerates the file from the lines array, overwriting the existing file
   */
  public regenerate = async (): Promise<void> => {
    const lines = []

    this.lines.forEach((l) => {
      let padding = []
      if (l.indentation > 0) {
        padding = Array(Number(l.indentation)).fill(' ')
      }
      lines.push(padding.join('') + l.keyword + l.text)
    })

    const content = lines.join('\n')
    writeFileSync(this.path, content)

    // Need to regenerate the Gherkin AST since some rules rely on that
    this.parseGherkin(content)
  }
}
