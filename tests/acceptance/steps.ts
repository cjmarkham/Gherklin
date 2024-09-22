import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { Given, DataTable, When, Then, After, Before } from '@cucumber/cucumber'
import { expect } from 'chai'
import { v4 } from 'uuid'

import { Runner } from '../../src/index'
import { GherklinConfiguration, RuleConfiguration } from '../../src/types'
import { mkdirSync } from 'fs'
import path from 'node:path'

After(function () {
  this.featureFiles.forEach((featureFile) => {
    rmSync(featureFile)
  })
})

Before(function () {
  this.tmpLocation = path.resolve(import.meta.dirname, './tmp')
  if (!existsSync(this.tmpLocation)) {
    mkdirSync(this.tmpLocation)
  }
  if (!Array.isArray(this.featureFiles)) {
    this.featureFiles = []
  }
})

Given('the following feature file', function (featureContent: string): void {
  const featureFile = `${this.tmpLocation}/${v4()}.feature`
  this.featureFiles.push(featureFile)
  writeFileSync(featureFile, featureContent)
})

Given('the following feature file named {string}', function (name: string, featureContent: string): void {
  const featureFile = `${this.tmpLocation}/${name}.feature`
  this.featureFiles.push(featureFile)
  writeFileSync(featureFile, featureContent)
})

When('Gherklin is ran with the following configuration', async function (table: DataTable): Promise<void> {
  const config: GherklinConfiguration = {
    featureDirectory: path.resolve(import.meta.dirname, './tmp'),
    configDirectory: import.meta.dirname,
    reporter: {
      configDirectory: import.meta.dirname,
      type: 'null',
    },
  }

  table.hashes().forEach((hash) => {
    Object.keys(hash).forEach((key) => {
      const value = parse(hash[key])
      if (key === 'rules') {
        this.rules = value
      }
      config[key] = value as unknown
    })
  })

  const runner = new Runner(config)
  await runner.init()
  this.runResult = await runner.run()
})

Then('there is/are {int} file(s) with errors', function (amount: number): void {
  expect(this.runResult.errors.size).to.eq(amount)
})

Then('the error(s) are/is', function (table: DataTable): void {
  const errors = []
  expect(this.runResult.errors.size).to.be.greaterThan(0)
  this.featureFiles.forEach((featureFile) => {
    if (this.runResult.errors.has(featureFile)) {
      errors.push(...this.runResult.errors.get(featureFile))
    }
  })
  const expectedErrors = []

  table.hashes().forEach((hash) => {
    const error = {
      message: hash.message,
      rule: hash.rule,
      location: parse(hash.location),
      severity: hash.severity,
    }
    expectedErrors.push(error)
  })

  expect(errors).to.deep.equal(expectedErrors)
})

When('the file is loaded', function () {
  this.fileContent = readFileSync(this.featureFiles[0], { encoding: 'utf-8' })
})

Then('the content has trailing whitespace on line {int}', function (lineNumber: number) {
  const lines = this.fileContent.split('\n')
  const line = lines[lineNumber]
  expect(line.length).to.not.eq(line.trimEnd().length)
})

Then('the content has no trailing whitespace on line {int}', function (lineNumber: number) {
  const lines = this.fileContent.split('\n')
  const line = lines[lineNumber]
  expect(line.length).to.eq(line.trimEnd().length)
})

Then('there is no new line at the end', function () {
  const lines = this.fileContent.split('\n')
  expect(lines[lines.length - 1].length).to.not.eq(0)
})

Then('there is a new line at the end', function () {
  const lines = this.fileContent.split('\n')
  expect(lines[lines.length - 1].length).to.eq(0)
})

Then('the indentation follows the rule', function () {
  const lines = this.fileContent.split('\n')
  const rule = this.rules.indentation
  const keywords = ['Feature', 'Scenario', 'Given', 'When', 'Then', 'And', 'But']

  lines.forEach((line) => {
    const keywordMatch = line.match(new RegExp(`${keywords.join('|')}`))
    if (!keywordMatch) {
      return
    }

    const keyword = keywordMatch[0]
    const spacing = line.length - line.trimStart().length + 1
    expect(spacing).to.eq(rule[keyword?.toLowerCase()])
  })
})

const parse = (value: string) => {
  if (value === 'true' || value === 'false') {
    return Boolean(value)
  }

  if (!isNaN(Number(value))) {
    return Number(value)
  }

  if (value.indexOf('[') === 0) {
    const parts = value.replace('[', '').replace(']', '').split(',')
    return parts.map((p) => {
      return parse(p.trim())
    })
  }
  if (value.indexOf('{') === 0) {
    return JSON.parse(value)
  }

  return value
}
