import Gherkin from '@cucumber/gherkin'
import { GherkinDocumentWalker } from '@cucumber/gherkin-utils'
import { IdGenerator } from '@cucumber/messages'
import fs from 'fs'
import { Dirent } from 'node:fs'
import { readdir } from 'node:fs/promises'
import chalk from 'chalk'
import path from 'node:path'
import { Config } from './config'
import { configError, LintError } from './error'
import { Rule } from './rule'

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

const getConfiguration = async (): Promise<Config> => {
  const dirents = await readdir(path.resolve('.'), { withFileTypes: true })

  const configFile = dirents.find((dirent: Dirent) => dirent.name === 'gherkin-lint.config.ts')
  if (!configFile) {
    return
  }

  const config = (await import(`${configFile.path}/${configFile.name}`)).default
  return {
    directory: config.directory,
    customRulesDir: config.customRulesDir,
    rules: config.rules,
  } as Config
}

export default async (config?: Config): Promise<Array<configError>> => {
  if (!config) {
    config = await getConfiguration()
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

  let totalErrors = 0
  let totalWarns = 0

  if (errors.size) {
    errors.forEach((lintErrors: Array<LintError>, file: string): void => {
      let output = `\n${chalk.underline(file)}`
      let maxMessageLength = lintErrors.reduce((a, b) => (a.message.length < b.message.length ? b : a)).message.length

      lintErrors.forEach((err: LintError) => {
        let color = chalk.yellow
        if (err.severity === 'error') {
          color = chalk.redBright
          totalErrors += 1
        }
        if (err.severity === 'warn') {
          totalWarns += 1
        }

        output += [
          '\n',
          `${(err.location.line + ':' + ((err.location.column || 0) - 1)).toString()} ${color(err.severity)}`,
          // TODO: Fix this padStart mess
          err.message.padEnd(maxMessageLength + 4).padStart(70),
          chalk.gray(err.rule),
        ].join('')
      })

      console.error(output)
    })
  }

  if (totalErrors + totalWarns > 0) {
    let color = chalk.bold.redBright
    if (!totalErrors) {
      color = chalk.bold.yellow
    }
    console.log(color(`\nx ${totalErrors + totalWarns} problems (${totalErrors} error(s), ${totalWarns} warning(s))`))

    if (totalErrors) {
      process.exit(1)
    }
  }

  process.exit(0)
}
