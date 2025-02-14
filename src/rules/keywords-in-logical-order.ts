import { dialects } from '@cucumber/gherkin'

import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class KeywordsInLogicalOrder implements Rule {
  public readonly name: string = 'keywords-in-logical-order'

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

      child.scenario.steps.forEach((step, index) => {
        const nextStep = child.scenario.steps[index + 1]
        if (!nextStep) {
          return
        }
        const nextTrimmed = nextStep.keyword.trim()

        const dialect = dialects[document.feature.language]
        const given = dialect.given.filter((w) => w !== '* ')
        const when = dialect.when.filter((w) => w !== '* ')
        const then = dialect.then.filter((w) => w !== '* ')
        const and = dialect.and.filter((w) => w !== '* ')
        const but = dialect.but.filter((w) => w !== '* ')
        const trimmedWhen = when.map((w) => w.trim())
        const trimmedThen = then.map((w) => w.trim())
        const trimmedAnd = and.map((w) => w.trim())
        const trimmedBut = but.map((w) => w.trim())

        // Check for Given, followed by When, And or But
        if (
          given.includes(step.keyword) &&
          ![...and, ...but, ...when].includes(nextStep.keyword)
        ) {
          document.addError(
            this,
            `Expected "${step.keyword.trim()}" to be followed by "${[...trimmedAnd, ...trimmedBut, ...trimmedWhen].join(', ')}", got "${nextTrimmed}"`,
            step.location,
          )
        }

        // Check for When, followed by Then, And or But
        if (
          when.includes(step.keyword) &&
          ![...and, ...but, ...then].includes(nextStep.keyword)
        ) {
          document.addError(
            this,
            `Expected "${step.keyword.trim()}" to be followed by "${[...trimmedAnd, ...trimmedBut, ...trimmedThen].join(', ')}", got "${nextTrimmed}"`,
            step.location,
          )
        }

        // Check for Then, followed by And or When
        if (
          then.includes(step.keyword) &&
          ![...and, ...when].includes(nextStep.keyword)
        ) {
          document.addError(
            this,
            `Expected "${step.keyword.trim()}" to be followed by "${[...trimmedAnd, ...trimmedWhen].join(', ')}", got "${nextTrimmed}"`,
            step.location,
          )
        }
      })
    })
  }
}
