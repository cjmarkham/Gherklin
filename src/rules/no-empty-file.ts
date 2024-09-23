import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NoEmptyFile implements Rule {
  public readonly name: string = 'no-empty-file'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    if (document.feature.keyword === '') {
      document.addError('Feature file is empty.', {
        line: 0,
        column: 0,
      })
    }
  }
}
