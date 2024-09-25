import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class FilenameSnakeCase implements Rule {
  public readonly name: string = 'filename-snake-case'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    if (!/^\w+((?=_)|\w+)\w+.feature$/.test(document.filename)) {
      document.addError(this.name, 'File names should be snake_case.', { line: 1, column: 1 })
    }
    if (document.filename !== document.filename.toLowerCase()) {
      document.addError(this.name, 'File names should be snake_case.', { line: 1, column: 1 })
    }
  }
}
