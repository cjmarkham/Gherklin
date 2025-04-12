import { offOrStringArrayOrSeverityAndStringArray } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NotAllowedTags implements Rule {
  public readonly name: string = 'not-allowed-tags'

  public readonly acceptedSchema: AcceptedSchema = offOrStringArrayOrSeverityAndStringArray

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    let notAllowedTags = this.schema.args as Array<string>
    if (!notAllowedTags.length) {
      return
    }

    document.feature.tags.forEach((tag) => {
      if (notAllowedTags.includes(tag.name)) {
        document.addError(
          this,
          `Found a feature tag that is not allowed. Got '${tag.name}'.`,
          tag.location,
        )
      }
    })

    document.feature.children.forEach((child) => {
      if (!child.scenario) {
        return
      }

      child.scenario.tags.forEach((tag) => {
        if (notAllowedTags.includes(tag.name)) {
          document.addError(
            this,
            `Found a scenario tag that is not allowed. Got '${tag.name}'.`,
            tag.location,
          )
        }
      })
    })
  }
}
