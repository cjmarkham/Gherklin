import { expect } from 'chai'
import * as sinon from 'sinon'

import STDOUTReporter from '../../src/reporters/stdout_reporter'
import { LintError, Severity } from '../../src'
import logger from '../../src/logger'
import chalk from 'chalk'

describe('STDOUTReporter', () => {
  describe('write', () => {
    let loggerSpy = sinon.spy(logger, 'error')

    it('successfully writes the errors to STDOUT', () => {
      const reporter = new STDOUTReporter({
        configDirectory: '.',
      })

      reporter.errors = new Map()
      reporter.errors.set('some/path.ts', [
        {
          message: 'This is a fake error',
          location: {
            line: 1,
          },
          severity: Severity.warn,
          rule: 'some-rule',
        } as LintError,
      ])

      reporter.write()
      expect(loggerSpy.calledOnce).to.eq(true)

      const expectedOutput = `\n${chalk.underline('some/path.ts')}\n1:0 ${chalk.yellow('warn')} This is a fake error ${chalk.gray('some-rule')}`
      const args = loggerSpy.args[0][0]
      expect(args).to.eq(expectedOutput)
    })
  })
})
