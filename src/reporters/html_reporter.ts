import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import Handlebars from 'handlebars'

import Reporter from './reporter'
import { Severity } from '../types'

export default class HTMLReporter extends Reporter {
  public override write = (): void => {
    const templateHTML = readFileSync(path.join(import.meta.dirname, './template.html'), { encoding: 'utf-8' })

    const template = Handlebars.compile(templateHTML)
    const values = {
      title: this.config?.title || 'Gherklin Report',
      files: [],
      totalErrors: 0,
      totalWarns: 0,
      totalLines: 0,
      rules: {},
    }

    const keywords = [
      'Feature',
      'Scenario',
      'Given',
      'When',
      'Then',
      'And',
      'But',
      'Examples',
      'Background',
      'Scenario Outline',
    ]

    for (const [key] of this.errors.entries()) {
      const content = readFileSync(key, { encoding: 'utf-8' })
      const lines = content.split('\n')

      const errors = this.errors.get(key)
      const hasErrors = errors.some((e) => e.severity === Severity.error)
      const fileInfo = {
        path: key,
        hasErrors,
        lines: [],
        issueCount: errors.length,
      }

      values.totalErrors += errors.map((e) => e.severity === Severity.error).length
      values.totalWarns += errors.map((e) => e.severity === Severity.warn).length
      values.totalLines += lines.length

      lines.forEach((line: string, index: number) => {
        const lineIssue = errors.find((e) => e.location.line === index + 1)
        let keyword = undefined
        let lineContent = line
        let padding = lineContent.length

        keywords.forEach((kw: string) => {
          const keywordMatches = line.trim().match(new RegExp(`^${kw}`))
          if (keywordMatches) {
            keyword = keywordMatches[0].trim()
            lineContent = lineContent.replace(keyword, '')
            padding = (lineContent.length - lineContent.trim().length) / 2
            lineContent = lineContent.trim()
            if (!['Feature', 'Scenario', 'Scenario Outline', 'Background'].includes(kw)) {
              lineContent = ' ' + lineContent
            }
          }
        })

        const lineInfo = {
          number: index + 1,
          hasError: lineIssue,
          errorSeverity: lineIssue && lineIssue.severity.toString().toLowerCase(),
          keyword,
          content: lineContent,
          padding,
          ruleName: lineIssue && lineIssue.rule,
          ruleDescrition: 'Something here',
        }

        if (lineIssue) {
          if (lineIssue.rule in values.rules) {
            values.rules[lineIssue.rule] += 1
          } else {
            values.rules[lineIssue.rule] = 1
          }
        }

        fileInfo.lines.push(lineInfo)
      })

      values.files.push(fileInfo)
    }

    const html = template(values)
    writeFileSync(path.resolve(this.config.configDirectory, 'gherklin-report.html'), html)
  }
}
