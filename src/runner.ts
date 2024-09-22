import fs from 'node:fs/promises'
import path from 'node:path'
import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'

import { LintError } from './error'
import Rule from './rule'
import { outputSchemaErrors, Results } from './output'
import { getFiles } from './utils'
import Config from './config'
import { GherklinConfiguration, ReporterConfig, Severity } from './types'
import Reporter from './reporters/reporter'
import HTMLReporter from './reporters/html_reporter'
import STDOUTReporter from './reporters/stdout_reporter'
import JSONReporter from './reporters/json_reporter'
import logger from './logger'
import chalk from 'chalk'
import NullReporter from './reporters/null_reporter'

export default class Runner {
  public gherkinFiles: Array<string> = []

  private rules: Array<Rule> = []

  private config: GherklinConfiguration

  private reporter: Reporter

  constructor(gherklinConfig?: GherklinConfiguration) {
    if (gherklinConfig) {
      this.config = new Config().fromInline(gherklinConfig)
    }
  }

  public init = async (): Promise<Results> => {
    if (!this.config) {
      this.config = await new Config().fromFile()
    }

    this.reporter = this.getReporter()

    if (this.config.featureFile) {
      this.gherkinFiles = [path.resolve(this.config.configDirectory, this.config.featureFile)]
    } else {
      this.gherkinFiles = await getFiles(
        path.resolve(this.config.configDirectory, this.config.featureDirectory),
        'feature',
      )
    }

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

      const inlineDisabled = []
      document.comments.forEach((comment) => {
        const rulesToDisable = comment.text.replace(/#\s?gherklin-disable\s?/, '')
        if (rulesToDisable.length) {
          inlineDisabled.push(...rulesToDisable.split(', '))
        }
      })

      // Check for gherklin-disable and no arguments, which means we disable
      // Gherklin for the whole file
      const disableCheck = document.comments[0]?.text?.indexOf('gherklin-disable')
      if (disableCheck !== undefined && disableCheck > -1) {
        if (inlineDisabled.length === 0) {
          continue
        }
      }

      for (const rule of this.rules) {
        if (!rule.schema.enabled || inlineDisabled.includes(rule.name)) {
          continue
        }

        const ruleErrors: Array<LintError> = await rule.run(walk, fileName)
        if (!ruleErrors || (ruleErrors && !ruleErrors.length)) {
          continue
        }

        let shouldFix = false
        if (this.config.fix === true) {
          shouldFix = true
        }
        if (Array.isArray(this.config.fix) && this.config.fix.includes(rule.name)) {
          shouldFix = true
        }

        if (shouldFix) {
          await rule.fix(document, fileName)
          continue
        }

        ruleErrors.forEach((_, index) => {
          ruleErrors[index].severity = rule.schema.severity
          ruleErrors[index].rule = rule.name
        })

        this.reporter.addErrors(fileName, ruleErrors)
      }
    }

    if (this.reporter.errors.size) {
      let allWarns = true

      for (const key of this.reporter.errors.keys()) {
        const errors = this.reporter.errors.get(key)
        const hasErrorSeverity = errors.some((err) => err.severity === Severity.error)
        if (hasErrorSeverity) {
          allWarns = false
        }
      }

      this.reporter.write()

      return {
        success: allWarns === true,
        errors: this.reporter.errors,
        schemaErrors: new Map(),
      }
    }

    if (!(this.reporter instanceof NullReporter)) {
      logger.info(chalk.green('✓ Gherklin found no errors!'))
    }

    return {
      success: true,
      errors: new Map(),
      schemaErrors: new Map(),
    }
  }

  public getReporter(): Reporter {
    const reporterConfig = Object.assign({}, this.config?.reporter, {
      configDirectory: this.config.configDirectory,
    }) as ReporterConfig

    switch (reporterConfig.type) {
      case 'html':
        return new HTMLReporter(reporterConfig)
      case 'json':
        return new JSONReporter(reporterConfig)
      case 'null':
        return new NullReporter(reporterConfig)
      case 'stdout':
      default:
        return new STDOUTReporter(reporterConfig)
    }
  }
}
