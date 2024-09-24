import path from 'node:path'

import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class NoDupeScenarios implements Rule {
  public readonly name: string = 'no-dupe-scenarios'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  private scenarios: Map<string, Array<string>> = new Map()

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario) {
        return
      }

      const scenarioName = child.scenario.name
      if (!this.scenarios.has(scenarioName)) {
        this.scenarios.set(scenarioName, [path.basename(document.filename)])
      } else {
        const existing = this.scenarios.get(scenarioName)
        // Prevent duplicates
        if (existing.indexOf(path.basename(document.filename)) === -1) {
          this.scenarios.set(scenarioName, [path.basename(document.filename), ...this.scenarios.get(scenarioName)])
        }
        document.addError(
          this.name,
          `Found duplicate scenario "${scenarioName}" in "${this.scenarios.get(scenarioName).join(', ')}".`,
          child.scenario.location,
        )
      }
    })
  }
}
