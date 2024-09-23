import { readFile } from 'node:fs/promises'

import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import { Rule } from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NewLineAtEof implements Rule {
  public readonly name: string = 'new-line-at-eof'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    // readline automatically strips lines that are only whitespace, so we have to split the lines manually
    const content = await readFile(document.filename)
    const lines = String(content).split(/\r\n|\r|\n/)

    const lastLine = lines[lines.length - 1]
    if (lastLine !== '') {
      document.addError('No new line at end of file.', {
        line: lines.length,
        column: 0,
      })
    }
  }
}
