import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'
import Line from '../line'

export default class NoScenarioSplat implements Rule {
  public readonly name: string = 'no-scenario-splat'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child): void => {
      if (!child.scenario) {
        return
      }

      child.scenario.steps.forEach((step): void => {
        if (step.keyword.trim() === '*') {
          document.addError(this.name, 'Found a splat (*) inside a scenario.', step.location)
        }
      })
    })
  }
}
