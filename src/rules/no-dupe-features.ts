import path from 'node:path'

import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import { Rule } from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NoDupeFeatures implements Rule {
  public readonly name: string = 'no-dupe-features'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  private features: Map<string, Array<string>> = new Map()

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const featureName = document.feature.name
    if (!this.features.has(featureName)) {
      this.features.set(featureName, [path.basename(document.filename)])
    } else {
      this.features.set(featureName, [path.basename(document.filename), ...this.features.get(featureName)])
      document.addError(
        `Found duplicate feature "${featureName}" in "${this.features.get(featureName).join(', ')}".`,
        document.feature.location,
      )
    }
  }
}
