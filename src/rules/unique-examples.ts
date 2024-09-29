import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class UniqueExamples implements Rule {
  public readonly name: string = 'unique-examples'

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

      const names = []
      child.scenario.examples.map((e) => {
        if (!names.includes(e.name)) {
          names.push(e.name)
          return
        }

        document.addError(this.name, 'Examples should contain a unique name if there are more than one.', e.location)
      })
    })
  }
}
