import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import fs from 'node:fs'
import { getConfigurationFromFile, GlobalConfiguration } from './config'
import { LintError } from './error'
import Rule from './rule'
import { outputErrors, outputSchemaErrors, Results } from './output'
import { getFiles } from './utils'

export default async (globalConfiguration?: GlobalConfiguration): Promise<Results> => {
  let config = globalConfiguration?.config
  if (!globalConfiguration?.config) {
    config = await getConfigurationFromFile(globalConfiguration?.configDirectory)
    if (!config) {
      throw new Error('Could not find a gherkin-lint.config.ts configuration file.')
    }
  }

  const errors: Map<string, Array<LintError>> = new Map()

  if (!config.directory) {
    throw new Error('no directory specified for feature files. Please set `config.directory`')
  }

  const gherkinFiles = await getFiles(config.directory, 'feature')
  const rules: Array<Rule> = []

  // Import and validate all default rules
  for (const ruleName in config.rules) {
    const rule = new Rule(ruleName, config.rules[ruleName])
    const loadError = await rule.load(config.configLocation, config.customRulesDir)
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
