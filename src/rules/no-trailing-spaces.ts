import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'
import { createReadStream } from 'node:fs'
import * as readline from 'node:readline'

export default class NoTrailingSpaces implements Rule {
  public readonly name: string = 'no-trailing-spaces'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    // Cucumber automatically trims the spaces when parsing the Gherkin, so we need to read the actual file
    const stream = createReadStream(document.filename)
    const rl = readline.createInterface({
      input: stream,
    })

    let lineNumber = 1

    for await (const line of rl) {
      if (line.charCodeAt(line.length - 1) === 32) {
        document.addError('Found trailing whitespace.', {
          line: lineNumber,
          column: line.length,
        })
      }
      lineNumber += 1
    }
  }
}
