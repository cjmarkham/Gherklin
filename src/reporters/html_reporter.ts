import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import Handlebars from 'handlebars'

import Reporter from './reporter'
import { Report, ReportFile, ReportLine, Severity } from '../types'

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
    } as Report

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
      } as ReportFile

      values.totalErrors += errors.map((e) => e.severity === Severity.error).length
      values.totalWarns += errors.map((e) => e.severity === Severity.warn).length
      values.totalLines += lines.length

      lines.forEach((line: string, index: number) => {
        const lineIssue = errors.find((e) => e.location.line === index + 1)

        const lineInfo = {
          number: index + 1,
          hasError: lineIssue !== undefined,
          errorSeverity: lineIssue && lineIssue.severity.toString().toLowerCase(),
          content: line,
          ruleName: lineIssue && lineIssue.rule,
        } as ReportLine

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
