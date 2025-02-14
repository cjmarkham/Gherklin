import { offOrStringArrayOrSeverityAndStringArray } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class AllowedTags implements Rule {
  public readonly name: string = 'allowed-tags'

  public readonly acceptedSchema: AcceptedSchema =
    offOrStringArrayOrSeverityAndStringArray

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    let allowedTags = this.schema.args as Array<string>
    if (!allowedTags.length) {
      return
    }

    document.feature.tags.forEach((tag) => {
      if (!allowedTags.includes(tag.name)) {
        document.addError(
          this,
          `Found a feature tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`,
          tag.location,
        )
      }
    })

    document.feature.children.forEach((child) => {
      if (!child.scenario) {
        return
      }

      child.scenario.tags.forEach((tag) => {
        if (!allowedTags.includes(tag.name)) {
          document.addError(
            this,
            `Found a scenario tag that is not allowed. Got ${tag.name}, wanted ${Array.isArray(allowedTags) ? allowedTags.join(', ') : allowedTags}`,
            tag.location,
          )
        }
      })
    })
  }
}
