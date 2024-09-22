import { writeFileSync } from 'node:fs'
import path from 'node:path'

import Reporter from './reporter'
import logger from '../logger'

export default class JSONReporter extends Reporter {
  public write = (): void => {
    const json = JSON.stringify(Object.fromEntries(this.errors), null, 2)

    if (!this.config.outFile) {
      logger.info(json)
      return
    }

    writeFileSync(path.join(this.config.configDirectory, this.config.outFile || 'gherklin-report.json'), json, {
      flag: 'w',
    })
  }
}
