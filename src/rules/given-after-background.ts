import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'
import Line from '../line'

export default class GivenAfterBackground implements Rule {
  public readonly name: string = 'given-after-background'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const backgrounds = document.feature.children.filter((child) => child.background !== undefined)
    if (!backgrounds.length) {
      return
    }

    document.feature.children.forEach((child): void => {
      if (!child.scenario) {
        return
      }

      child.scenario.steps.forEach((step): void => {
        if (step.keyword.trim() === 'Given') {
          document.addError(this.name, 'Found "Given" in scenario when background exists.', step.location)
        }
      })
    })
  }
}
