import { existsSync, rmSync, writeFileSync } from 'node:fs'
import { Given, DataTable, When, Then, After } from '@cucumber/cucumber'
import { expect } from 'chai'
import { v4 } from 'uuid'

import { Runner } from '../../src/index'
import { GherklinConfiguration, RuleConfiguration } from '../../src/types'
import { mkdirSync } from 'fs'
import path from 'node:path'

After(function () {
  rmSync(this.featureFile)
})

Given('the following feature file', function (featureContent: string): void {
  const tmpLocation = path.resolve(import.meta.dirname, './tmp')
  if (!existsSync(tmpLocation)) {
    mkdirSync(tmpLocation)
  }
  this.featureFile = `${tmpLocation}/${v4()}.feature`
  writeFileSync(this.featureFile, featureContent)
})

When('Gherklin is ran with the following rule(s)', async function (table: DataTable): Promise<void> {
  const rules: RuleConfiguration = {}
  table.hashes().forEach((hash) => {
    Object.keys(hash).forEach((key) => {
      const value = parse(hash[key])
      rules[key] = value as unknown
    })
  })

  const config: GherklinConfiguration = {
    rules,
    featureFile: this.featureFile,
    configDirectory: import.meta.dirname,
    reporter: {
      configDirectory: import.meta.dirname,
      type: 'null',
    },
  }

  const runner = new Runner(config)
  await runner.init()
  this.runResult = await runner.run()
})

Then('there is/are {int} error(s)', function (amount: number): void {
  expect(this.runResult.errors.size).to.eq(amount)
})

Then('the error(s) are/is', function (table: DataTable): void {
  const errors = this.runResult.errors.get(this.featureFile)
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

  expect(expectedErrors).to.deep.equal(errors)
})

const parse = (value: string) => {
  if (value.indexOf('[') === 0) {
    return [value.replace('[', '').replace(']', '')]
  }
  if (value.indexOf('{') === 0) {
    return JSON.parse(value)
  }
}
