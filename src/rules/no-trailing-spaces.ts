import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import Document from '../document'

import type { RawSchema, AcceptedSchema } from '../types'

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
    let changed = false

    document.lines.forEach((line) => {
      const trimmed = line.text.trimEnd()

      if (trimmed !== line.text) {
        line.text = trimmed
        changed = true
      }
    })

    if (changed) {
      await document.regenerate()
    }
  }
}
