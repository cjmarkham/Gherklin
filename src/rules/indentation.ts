import { offOrKeywordIntsOrSeverityAndKeywordInts } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema, GherkinKeywordNumericals } from '../types'
import Document from '../document'
import Line from '../line'

export default class Indentation implements Rule {
  public readonly name: string = 'indentation'

  public readonly acceptedSchema: AcceptedSchema = offOrKeywordIntsOrSeverityAndKeywordInts

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const args = this.schema.args as GherkinKeywordNumericals
    if (!args) {
      return
    }

    if (args.feature !== undefined) {
      if (document.feature.location.column !== args.feature) {
        document.addError(
          this,
          `Invalid indentation for feature. Got ${document.feature.location.column}, wanted ${args.feature}`,
          document.feature.location,
        )
      }
    }

    document.feature.children.forEach((child) => {
      if (child.background && args.background !== undefined) {
        if (child.background.location.column !== args.background) {
          document.addError(
            this,
            `Invalid indentation for background. Got ${child.background.location.column}, wanted ${args.background}`,
            child.background.location,
          )
        }
      }

      if (child.scenario && args.scenario !== undefined) {
        if (child.scenario.location.column !== args.scenario) {
          document.addError(
            this,
            `Invalid indentation for scenario. Got ${child.scenario.location.column}, wanted ${args.scenario}`,
            child.scenario.location,
          )
        }
      }

      if (child.background) {
        child.background.steps.forEach((step) => {
          if (step.keyword.toLowerCase() in args) {
            if (step.location.column !== args[step.keyword.toLowerCase()]) {
              document.addError(
                this,
                `Invalid indentation for "${step.keyword.toLowerCase()}". Got ${step.location.column}, wanted ${args[step.keyword.toLowerCase()]}`,
                child.background.location,
              )
            }
          }
        })
      }

      if (child.scenario) {
        child.scenario.steps.forEach((step) => {
          const stepNormalized = step.keyword.toLowerCase().trimEnd()
          if (stepNormalized in args) {
            if (step.location.column !== args[stepNormalized]) {
              document.addError(
                this,
                `Invalid indentation for "${stepNormalized}". Got ${step.location.column}, wanted ${args[stepNormalized]}`,
                step.location,
              )
            }
          }
        })

        if (child.scenario.examples && args.examples !== undefined) {
          child.scenario.examples.forEach((example) => {
            if (example.location.column !== args.examples) {
              document.addError(
                this,
                `Invalid indentation for "examples". Got ${example.location.column}, wanted ${args.examples}`,
                example.location,
              )
            }

            if (example.tableHeader && args.exampleTableHeader !== undefined) {
              if (example.tableHeader.location.column !== args.exampleTableHeader) {
                document.addError(
                  this,
                  `Invalid indentation for "example table header". Got ${example.tableHeader.location.column}, wanted ${args.exampleTableHeader}`,
                  example.location,
                )
              }
            }

            if (example.tableBody && args.exampleTableBody !== undefined) {
              example.tableBody.forEach((row) => {
                if (row.location.column !== args.exampleTableBody) {
                  document.addError(
                    this,
                    `Invalid indentation for "example table row". Got ${row.location.column}, wanted ${args.exampleTableBody}`,
                    example.location,
                  )
                }
              })
            }
          })
        }
      }
    })
  }

  public async fix(document: Document): Promise<void> {
    const expectedIndentation = this.schema.args as GherkinKeywordNumericals

    document.lines.forEach((line: Line, index: number) => {
      const expected = expectedIndentation[line.keyword.trim().toLowerCase()]
      if (expected) {
        document.lines[index].indentation = expected - 1
      }
    })

    await document.regenerate()
  }
}
