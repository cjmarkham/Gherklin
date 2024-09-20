import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import Handlebars from 'handlebars'
import { v4 } from 'uuid'

import Reporter from './reporter'

export default class HTMLReporter extends Reporter {
  public override write = (): void => {
    const templateHTML = readFileSync(path.join(import.meta.dirname, './template.html'), { encoding: 'utf-8' })

    const template = Handlebars.compile(templateHTML)
    const values = {
      title: this.config?.title || 'Gherklin Report',
      files: [],
    }

    const keywords = ['Feature', 'Scenario', 'Given', 'When', 'Then', 'And', 'But', 'Examples']

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
        const lineError = errors.filter((e) => e.location.line === index + 1)?.[0]
        const keywordMatch = line.match(new RegExp(`^${keywords.join('|')}`))
        let keyword
        if (keywordMatch) {
          keyword = keywordMatch[0]
          line = line.replace(keyword, '')
          if (keyword === 'Feature') {
          }
        }

        let keywordFormatted
        if (keyword) {
          if (['Feature', 'Scenario', 'Examples'].includes(keyword)) {
            keywordFormatted = `${keyword}`
          } else {
            keywordFormatted = `${keyword} `
          }
        }

        const lineValue = {
          id: v4(),
          content: line.trim(),
          number: index + 1,
          keyword: keyword && keywordFormatted,
          column: line.length - line.trim().length,
          padding: (line.length - line.trim().length) * 6,
          hasError: lineError !== undefined,
          error: lineError,
        } as any

        value.lines.push(lineValue)
      })
      values.files.push(value)
    }

    const html = template(values)
    writeFileSync(path.resolve(this.config.configDirectory, 'gherklin-report.html'), html)
  }
}
