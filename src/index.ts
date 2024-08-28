import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import fs from 'fs'
import chalk from 'chalk'
import { Config, getConfigurationFromFile } from './config'
import { configError, LintError } from './error'
import { Rule } from './rule'
import { outputErrors, outputSchemaErrors } from './output'
import { getFiles } from './utils'

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
      outputSchemaErrors(schemaErrors)
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
