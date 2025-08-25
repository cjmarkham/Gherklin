import chalk from 'chalk'
import winston from 'winston'
import { expect } from 'chai'
import { Writable } from 'node:stream'

import logger from '../../src/logger'
import STDOUTReporter from '../../src/reporters/stdout_reporter'
import { LintError, Severity } from '../../src'

const logs: string[] = []
const captureStream = new Writable({
  write(chunk, _enc, cb) {
    logs.push(chunk.toString())
    cb()
  },
})

describe('STDOUTReporter', () => {
  describe('write', () => {
    it('successfully writes the errors to STDOUT', () => {
      const oldTransports = logger.transports.slice()
      logger.clear().add(new winston.transports.Stream({ stream: captureStream }))

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

        logger.clear();
        oldTransports.forEach(t => logger.add(t));

      const expectedOutput = `
${chalk.underline('some/path.ts')}
1:0 ${chalk.yellow('warn')} This is a fake error ${chalk.gray('some-rule')}
${chalk.bold.yellow('\n1 problems (0 errors, 1 warning)')}
`
      expect(logs.join('')).to.eq(expectedOutput)
    })
  })
})
