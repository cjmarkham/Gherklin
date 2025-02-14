import { offOrNumberOrSeverityAndNumber } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class MaxScenarios implements Rule {
  public readonly name: string = 'max-scenarios'

  public readonly acceptedSchema: AcceptedSchema =
    offOrNumberOrSeverityAndNumber

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    let scenarioCount = 0
    document.feature.children.forEach((child) => {
      if (child.scenario) {
        scenarioCount += 1
      }
    })

    const expected = this.schema.args as number
    if (scenarioCount > expected) {
      document.addError(
        this,
        `Expected max ${expected} scenarios per file. Found ${scenarioCount}.`,
        document.feature.location,
      )
    }
  }
}
