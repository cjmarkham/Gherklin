import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class ScenarioVerification implements Rule {
  public readonly name: string = 'scenario-verification'

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

      const whens = child.scenario.steps.filter((s) => s.keyword.trim() === 'Then')
      if (whens.length === 0) {
        document.addError(
          this.name,
          'Scenario should contain a "Then" to denote verification of an action.',
          child.scenario.location,
        )
      }
    })
  }
}
