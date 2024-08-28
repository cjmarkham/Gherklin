import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import fs from 'fs'
import { Dirent } from 'node:fs'
import { readdir } from 'node:fs/promises'
import chalk from 'chalk'
import path from 'node:path'
import { Config, getConfigurationFromFile } from './config'
import { configError, LintError } from './error'
import { Rule } from './rule'
import { outputErrors } from './output'

const getFiles = async (dir: string, ext: string): Promise<Array<string>> => {
  const dirents = await readdir(path.resolve(dir), { withFileTypes: true, recursive: true }).catch((err) => {
    console.error(chalk.red(`[GherkinLint] Could not load ".${ext}" files from "${dir}".`), err)
    return []
  })

  const files = dirents
    .filter((dirent: Dirent) => dirent.name.endsWith(`.${ext}`))
    .map((dirent: Dirent) => `${dirent.path}/${dirent.name}`)
  return Array.prototype.concat(...files)
}

export default async (config?: Config): Promise<Array<configError>> => {
  if (!config) {
    config = await getConfigurationFromFile()
    if (!config) {
      console.error('Could not find a gherkin-lint.config.ts configuration file.')
      process.exit(1)
    }
  }

  const errors: Map<string, Array<LintError>> = new Map()

  const gherkinFiles = await getFiles(config.directory, 'feature')
  const rules: Array<Rule> = []

  // Import and validate all rules
  for (const ruleName in config.rules) {
    const rule = new Rule(ruleName, config.rules[ruleName])
    const schemaErrors: Array<configError> = await rule.validateSchema()
    if (schemaErrors.length) {
      console.error(chalk.redBright('Invalid configuration options specified!\n'))
      schemaErrors.forEach((err) => {
        console.log(chalk.underline(err.rule))
        err.errors.forEach((e, idx) => {
          console.log(chalk.dim(`${idx})`), e)
        })
      })

      return schemaErrors
    }

    rules.push(rule)
  }

  const walker = new GherkinDocumentWalker()
  const builder = new Gherkin.AstBuilder(IdGenerator.uuid())
  const matcher = new Gherkin.GherkinClassicTokenMatcher()
  const parser = new Gherkin.Parser(builder, matcher)

  for (const fileName of gherkinFiles) {
    const content = fs.readFileSync(fileName)
    const document = parser.parse(content.toString())
    const walk = walker.walkGherkinDocument(document)

    for (const rule in rules) {
      const ruleErrors: Array<LintError> = rules[rule].run(walk, fileName)
      if (ruleErrors && ruleErrors.length) {
        if (errors.has(fileName)) {
          errors.set(fileName, [...ruleErrors, ...errors.get(fileName)])
          continue
        }
        errors.set(fileName, ruleErrors)
      }
    }
  }

  outputErrors(errors)
  if (errors.size) {
    process.exit(1)
  }
  process.exit(0)
}
