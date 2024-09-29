import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class FeatureDescription implements Rule {
  public readonly name: string = 'feature-description'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  private defaultThreshold: number = 80

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    if (!document.feature.description) {
      document.addError(this.name, 'Feature is missing a description.', document.feature.location)
    }
  }
}
