import { offOrNumberOrSeverityOrSeverityAndNumber } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'
import { levenshtein } from '../utils'

export default class NoSimilarScenarios implements Rule {
  public readonly name: string = 'no-similar-scenarios'

  public readonly acceptedSchema: AcceptedSchema = offOrNumberOrSeverityOrSeverityAndNumber

  public readonly schema: Schema

  private defaultThreshold: number = 80

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.feature.children.forEach((child) => {
      if (!child.scenario) {
        return
      }

      const { steps: thisSteps } = child.scenario
      const otherScenarios = document.feature.children
        .filter((c) => c.scenario !== undefined)
        .filter((c) => c.scenario.id !== child.scenario.id)
        .map((c) => c.scenario)

      let totalLev = 0
      let maxPossibleLev = 0

      otherScenarios.forEach((other) => {
        totalLev += thisSteps
          .map((step, i): number => {
            const nextStep = other?.steps[i]
            if (!nextStep) {
              return 0
            }

            const comparison = [`${step.keyword}${step.text}`, `${nextStep.keyword}${nextStep.text}`]
            maxPossibleLev += comparison[0].length + comparison[1].length
            return levenshtein(comparison[0], comparison[1])
          })
          .reduce((a, b) => a + b,0)

        const percentage = 100 - (totalLev / maxPossibleLev) * 100

        let threshold = this.defaultThreshold
        if (this.schema.args) {
          threshold = this.schema.args as number
        }

        if (percentage > threshold) {
          document.addError(
            this,
            `Scenario "${child.scenario.name}" is too similar (> ${threshold}%) to scenario "${other.name}".`,
            child.scenario.location,
          )
        }
      })
    })
  }
}
