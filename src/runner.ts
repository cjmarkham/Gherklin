import path from 'node:path'
import { outputSchemaErrors, Results } from './output'
import { getFiles } from './utils'
import Config from './config'
import { GherklinConfiguration, ReporterConfig, Severity } from './types'
import Reporter from './reporters/reporter'
import HTMLReporter from './reporters/html/html_reporter'
import STDOUTReporter from './reporters/stdout_reporter'
import JSONReporter from './reporters/json_reporter'
import logger from './logger'
import chalk from 'chalk'
import NullReporter from './reporters/null_reporter'
import RuleLoader from './rule_loader'
import Document from './document'

export default class Runner {
  public gherkinFiles: Array<string> = []

  private config: Config

  private reporter: Reporter

  private ruleLoader: RuleLoader

  private startedAt: number

  constructor(gherklinConfig?: GherklinConfiguration) {
    if (gherklinConfig) {
      this.config = new Config(gherklinConfig)
    }
  }

  public init = async (): Promise<Results> => {
    if (!this.config) {
      this.config = await new Config().fromFile()
    }

    this.ruleLoader = new RuleLoader(this.config)
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
      await this.ruleLoader.load(ruleName, this.config.rules[ruleName], this.config.customRulesDirectory)

      const schemaErrors = this.ruleLoader.validateRules()
      if (schemaErrors.size) {
        outputSchemaErrors(schemaErrors)
        return {
          success: false,
          schemaErrors: schemaErrors,
          errorCount: 0,
          errors: new Map(),
        }
      }
    }

    return {
      success: true,
      schemaErrors: new Map(),
      errorCount: 0,
      errors: new Map(),
    }
  }

  public run = async (): Promise<Results> => {
    this.startedAt = new Date().getTime()

    for (const filename of this.gherkinFiles) {
      const document = new Document(filename)
      await document.load()

      const ruleErrors = await this.ruleLoader.runRules(document)
      if (ruleErrors && ruleErrors.length) {
        this.reporter.addErrors(filename, ruleErrors)
      }
    }

    this.reporter.totalTime = new Date().getTime() - this.startedAt

    if (this.reporter.errors.size) {
      let maxAllowedErrors = this.config.maxErrors ?? 0
      let allWarns = true

      for (const key of this.reporter.errors.keys()) {
        const errors = this.reporter.errors.get(key)
        const hasErrorSeverity = errors.some((err) => err.severity === Severity.error)
        if (hasErrorSeverity) {
          allWarns = false
        }
      }

      const totalErrorCount = this.reporter.errorCount()
      const success = allWarns === true || totalErrorCount <= maxAllowedErrors

      this.reporter.write()

      return {
        success,
        errors: this.reporter.errors,
        errorCount: totalErrorCount,
        schemaErrors: new Map(),
      }
    }

    if (!(this.reporter instanceof NullReporter)) {
      logger.info(chalk.green('✓ Gherklin found no errors!'))
    }

    return {
      success: true,
      errors: new Map(),
      errorCount: 0,
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
