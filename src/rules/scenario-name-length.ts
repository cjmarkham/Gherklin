import { offOrNumberOrSeverityAndNumber } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class ScenarioNameLength implements Rule {
  public readonly name: string = 'scenario-name-length'

  public readonly acceptedSchema: AcceptedSchema = offOrNumberOrSeverityAndNumber

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario) {
        return
      }

      let maxLength = 100
      if (this.schema.args) {
        maxLength = Number(this.schema.args)
      }

      if (child.scenario.name.length > maxLength) {
        document.addError(
          this.name,
          `Scenario name is too long. Expected max ${maxLength}, got ${child.scenario.name.length}.`,
          child.scenario.location,
        )
      }
    })
  }
}
