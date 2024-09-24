import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'
import Line from '../line'

export default class NewLineAtEof implements Rule {
  public readonly name: string = 'new-line-at-eof'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const lines = document.lines

    const lastLine = lines[lines.length - 1]
    if (lastLine.text !== '') {
      document.addError(this.name, 'No new line at end of file.', {
        line: lines.length,
        column: 0,
      })
    }
  }

  public async fix(document: Document): Promise<void> {
    document.lines.push(new Line(''))
    await document.regenerate()
  }
}
