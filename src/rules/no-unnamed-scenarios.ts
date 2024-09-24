import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NoUnnamedScenarios implements Rule {
  public readonly name: string = 'no-unnamed-scenarios'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario) {
        return
      }

      if (child.scenario.name.length === 0) {
        document.addError(this.name, 'Found scenario with no name.', child.scenario.location)
      }
    })
  }
}
