import { dialects } from '@cucumber/gherkin'

import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class BackgroundOnlySetup implements Rule {
  public readonly name: string = 'background-only-setup'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.background) {
        return
      }

      child.background.steps.forEach((step): void => {
        if (!['Given', '*'].includes(step.keyword.trim())) {
          document.addError(
            this.name,
            `Background should only be used for set up. Found "${step.keyword.trim()}".`,
            step.location,
          )
        }
      })
    })
  }
}
