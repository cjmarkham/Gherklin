import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'
import Line from '../line'

export default class NoFullStop implements Rule {
  public readonly name: string = 'no-full-stop'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.lines.forEach((line: Line, index: number): void => {
      const trimmed = line.text.trimEnd()
      if (trimmed[trimmed.length - 1] === '.') {
        document.addError(this, `Line ends with a full stop.`, {
          line: index + 1,
          column: (line.keyword + trimmed).length,
        })
      }
    })
  }

  public async fix(document: Document): Promise<void> {
    document.lines.forEach((line: Line, index: number): void => {
      const trimmed = line.text.trimEnd()
      if (trimmed[trimmed.length - 1] === '.') {
        document.lines[index].text = trimmed.substring(0, trimmed.length - 1)
      }
    })

    await document.regenerate()
  }
}
