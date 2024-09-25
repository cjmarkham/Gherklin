import path from 'node:path'
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
import RuleLoader from './rule_loader'
import Document from './document'

export default class Runner {
  public gherkinFiles: Array<string> = []

  private config: GherklinConfiguration

  private reporter: Reporter

  private ruleLoader: RuleLoader

  constructor(gherklinConfig?: GherklinConfiguration) {
    if (gherklinConfig) {
      this.config = new Config().fromInline(gherklinConfig)
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
      await this.ruleLoader.load(
        this.config.configDirectory,
        ruleName,
        this.config.rules[ruleName],
        this.config.customRulesDirectory,
      )

      const schemaErrors = this.ruleLoader.validateRules()
      if (schemaErrors.size) {
        outputSchemaErrors(schemaErrors)
        return {
          success: false,
          schemaErrors: schemaErrors,
          errors: new Map(),
        }
      }
    }

    return {
      success: true,
      schemaErrors: new Map(),
      errors: new Map(),
    }
  }

  public run = async (): Promise<Results> => {
    for (const filename of this.gherkinFiles) {
      const document = new Document(filename)
      await document.load()

      const ruleErrors = await this.ruleLoader.runRules(document)
      if (ruleErrors && ruleErrors.length) {
        this.reporter.addErrors(filename, ruleErrors)
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
