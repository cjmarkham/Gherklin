import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'
import Line from '../line'

export default class NoTrailingSpaces implements Rule {
  public readonly name: string = 'no-trailing-spaces'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    let lineNumber = 1

    document.lines.forEach((line) => {
      const joined = `${line.keyword}${line.text}`
      if (joined.charCodeAt(joined.length - 1) === 32) {
        document.addError(this, 'Found trailing whitespace.', {
          line: lineNumber,
          column: joined.length,
        })
      }
      lineNumber += 1
    })
  }

  public async fix(document: Document): Promise<void> {
    document.lines.forEach((line: Line, index: number) => {
      const joined = `${line.keyword}${line.text.trimEnd()}`
      document.lines[index] = new Line(joined)
    })

    await document.regenerate()
  }
}
