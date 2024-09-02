import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import fs from 'node:fs'
import { getConfigurationFromFile } from './config'
import { LintError } from './error'
import Rule from './rule'
import { outputErrors, outputSchemaErrors, Results } from './output'
import { getFiles } from './utils'
import path from 'node:path'

export default async (): Promise<Results> => {
  const config = await getConfigurationFromFile()
  const errors: Map<string, Array<LintError>> = new Map()
  const gherkinFiles = await getFiles(path.resolve(config.configDirectory, config.featureDirectory), 'feature')
  const rules: Array<Rule> = []

  // Import and validate all default rules
  for (const ruleName in config.rules) {
    const rule = new Rule(ruleName, config.rules[ruleName])
    const loadError = await rule.load(config.configDirectory, config.customRulesDirectory)
    if (loadError) {
      throw loadError
    }

    const schemaErrors = await rule.validateSchema()

    if (schemaErrors.size) {
      outputSchemaErrors(schemaErrors)
      return {
        success: false,
        schemaErrors,
        errors: new Map(),
      }
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
    return {
      success: false,
      errors,
      schemaErrors: new Map(),
    }
  }

  return {
    success: true,
    errors: new Map(),
    schemaErrors: new Map(),
  }
}
