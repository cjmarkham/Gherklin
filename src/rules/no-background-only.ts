import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import { Rule } from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NoBackgroundOnly implements Rule {
  public readonly name: string = 'no-background-only'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.background) {
        return
      }

      if (document.feature.children.length < 2) {
        document.addError(`File contains only a background.`, document.feature.location)
      }
    })
  }
}
