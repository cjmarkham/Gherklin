import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import fs from 'fs'
import { Dirent } from 'node:fs'
import { readdir } from 'node:fs/promises'
import chalk from 'chalk'
import path from 'node:path'
import defaultRules from './rules'
import { Config, RuleConfig } from './config'
import { LintError } from './error'

const getFiles = async (dir: string, ext: string): Promise<Array<string>> => {
  const dirents = await readdir(path.resolve(dir), { withFileTypes: true, recursive: true }).catch((err) => {
    console.error(chalk.red(`[GherkinLint] Could not load ".${ext}" files from "${dir}".`), err)
    return []
  })

  const files = dirents
    .filter((dirent: Dirent) => dirent.name.endsWith(`.${ext}`))
    .map((dirent: Dirent) => `${dirent.parentPath}/${dirent.name}`)
  return Array.prototype.concat(...files)
}

export default async (config: Config, ruleConfig?: RuleConfig): Promise<Map<string, Array<LintError>>> => {
  const errors: Map<string, Array<LintError>> = new Map()
  const gherkinFiles = await getFiles(config.directory, 'feature')
  const rules = Object.keys(defaultRules).map((key) => defaultRules[key])

  if (config.customRulesDir) {
    const customRuleFiles = await getFiles(config.customRulesDir, 'ts')

    for (const customRuleFile of customRuleFiles) {
      const rule = await import(path.resolve(customRuleFile))
      rules.push(rule.default)
    }
  }

  const walker = new GherkinDocumentWalker()
  const builder = new Gherkin.AstBuilder(IdGenerator.uuid())
  const matcher = new Gherkin.GherkinClassicTokenMatcher()
  const parser = new Gherkin.Parser(builder, matcher)

  for (const file of gherkinFiles) {
    const content = fs.readFileSync(file)
    const document = parser.parse(content.toString())
    const walk = walker.walkGherkinDocument(document)

    for (const key of Object.keys(rules)) {
      const ruleErrors: Array<LintError> = rules[key](ruleConfig, walk, file)
      if (ruleErrors && ruleErrors.length) {
        if (errors.has(file)) {
          errors.set(file, [...ruleErrors, ...errors.get(file)])
          continue
        }
        errors.set(file, ruleErrors)
      }
    }
  }

  let totalErrors = 0

  if (errors.size) {
    errors.forEach((lintErrors: Array<LintError>, file: string): void => {
      let output = `\n${chalk.underline(file)}`
      let maxMessageLength = lintErrors.reduce((a, b) => (a.message.length < b.message.length ? b : a)).message.length

      lintErrors.forEach((err: LintError) => {
        totalErrors += 1

        output += [
          '\n',
          `${(err.location.line + ':' + ((err.location.column || 0) - 1)).toString().padEnd(6)}`,
          err.message.padEnd(maxMessageLength + 4),
          chalk.gray(err.rule),
        ].join('')
      })

      console.error(output)
    })
  }

  if (totalErrors > 0) {
    console.log(chalk.bold.redBright(`\nx ${totalErrors} problems`))
  }

  return errors
}
