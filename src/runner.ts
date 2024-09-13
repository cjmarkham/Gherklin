import fs from 'node:fs/promises'
import path from 'node:path'
import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'

import { LintError } from './error'
import Rule from './rule'
import { outputErrors, outputSchemaErrors, Results } from './output'
import { getFiles } from './utils'
import Config from './config'
import { GherklinConfiguration, Severity } from './types'

export default class Runner {
  private errors: Map<string, Array<LintError>> = new Map()

  public gherkinFiles: Array<string> = []

  private rules: Array<Rule> = []

  private config: GherklinConfiguration

  constructor(gherklinConfig?: GherklinConfiguration) {
    if (gherklinConfig) {
      this.config = new Config().fromInline(gherklinConfig)
    }
  }

  public init = async (): Promise<Results> => {
    if (!this.config) {
      this.config = await new Config().fromFile()
    }

    this.gherkinFiles = await getFiles(
      path.resolve(this.config.configDirectory, this.config.featureDirectory),
      'feature',
    )

    // Import and validate all default rules
    for (const ruleName in this.config.rules) {
      const rule = new Rule(ruleName, this.config.rules[ruleName])
      const loadError = await rule.load(this.config.configDirectory, this.config.customRulesDirectory)
      if (loadError) {
        throw loadError
      }
      const validationErrors = rule.validate()

      if (validationErrors.size) {
        outputSchemaErrors(validationErrors)
        return {
          success: false,
          schemaErrors: validationErrors,
          errors: new Map(),
        }
      }

      this.rules.push(rule)
    }

    return {
      success: true,
      schemaErrors: new Map(),
      errors: new Map(),
    }
  }

  public run = async (): Promise<Results> => {
    const walker = new GherkinDocumentWalker()
    const builder = new Gherkin.AstBuilder(IdGenerator.uuid())
    const matcher = new Gherkin.GherkinClassicTokenMatcher()
    const parser = new Gherkin.Parser(builder, matcher)

    for (const fileName of this.gherkinFiles) {
      const content = await fs.readFile(fileName).catch((): never => {
        throw new Error(`Could not open the feature file at ${fileName}. Does it exist?`)
      })

      const document = parser.parse(content.toString())
      const walk = walker.walkGherkinDocument(document)

      for (const rule of this.rules) {
        if (!rule.schema.enabled) {
          continue
        }

        const ruleErrors: Array<LintError> = await rule.run(walk, fileName)
        if (ruleErrors && ruleErrors.length) {
          ruleErrors.forEach((_, index) => {
            ruleErrors[index].severity = rule.schema.severity
            ruleErrors[index].rule = rule.name
          })

          if (this.errors.has(fileName)) {
            this.errors.set(fileName, [...ruleErrors, ...this.errors.get(fileName)])
            continue
          }
          this.errors.set(fileName, ruleErrors)
        }
      }
    }

    outputErrors(this.errors)

    if (this.errors.size) {
      let allWarns = true

      for (const key of this.errors.keys()) {
        const errors = this.errors.get(key)
        const hasErrorSeverity = errors.some((err) => err.severity === Severity.error)
        if (hasErrorSeverity) {
          allWarns = false
        }
      }

      return {
        success: allWarns === true,
        errors: this.errors,
        schemaErrors: new Map(),
      }
    }

    return {
      success: true,
      errors: new Map(),
      schemaErrors: new Map(),
    }
  }
}
