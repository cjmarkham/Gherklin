import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import Handlebars from 'handlebars'

import Reporter from './reporter'

export default class HTMLReporter extends Reporter {
  public override write = (): void => {
    const templateHTML = readFileSync(path.join(import.meta.dirname, './template.html'), { encoding: 'utf-8' })

    const template = Handlebars.compile(templateHTML)
    const values = {
      title: this.config?.title || 'Gherklin Report',
      files: [],
    }

    for (const [key] of this.errors.entries()) {
      const content = readFileSync(key, { encoding: 'utf-8' })
      const lines = content.split('\n')
      const value = {
        anchor: key.replace(this.config.configDirectory, '').replaceAll('/', '-'),
        name: key.replace(this.config.configDirectory, ''),
        lines: [],
      }

      lines.forEach((line, index) => {
        const errors = this.errors.get(key)
        const lineErrors = errors.filter((e) => e.location.line === index + 1)

        const lineValue = {
          content: line,
          lineNumber: index + 1,
          column: line.length - line.trim().length,
          padding: (line.length - line.trim().length) / 2,
          hasError: lineErrors.length,
          errors: lineErrors,
        } as any

        value.lines.push(lineValue)
      })
      values.files.push(value)
    }

    const html = template(values)
    writeFileSync(path.resolve(this.config.configDirectory, 'gherklin-report.html'), html)
  }
}
