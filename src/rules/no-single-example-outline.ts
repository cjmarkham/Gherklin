import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NoSingleExampleOutline implements Rule {
  public readonly name: string = 'no-single-example-outline'

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

      if (child.scenario.keyword !== 'Scenario Outline') {
        return
      }

      if (!child.scenario.examples.length) {
        return
      }

      let totalExamples = 0

      child.scenario.examples.forEach((example) => {
        totalExamples += example.tableBody.length
      })

      if (totalExamples === 1) {
        document.addError(
          this.name,
          'Scenario Outline has only one example. Consider converting to a simple Scenario.',
          child.scenario.location,
        )
      }
    })
  }
}
