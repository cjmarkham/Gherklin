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

    if (args.featureTag && document.feature.tags.length) {
      if (document.feature.tags[0].location.column !== args.featureTag) {
        document.addError(
          this,
          `Invalid indentation for feature tags. Got ${document.feature.tags[0].location.column}, wanted ${args.featureTag}`,
          document.feature.tags[0].location,
        )
      }
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

      if (child.scenario) {
        const scenarioType = child.scenario.keyword === 'Scenario Outline' ? 'scenarioOutline' : 'scenario'
        if (scenarioType in args) {
          if (child.scenario.location.column !== args[scenarioType]) {
            document.addError(
              this,
              `Invalid indentation for ${scenarioType}. Got ${child.scenario.location.column}, wanted ${args[scenarioType]}`,
              child.scenario.location,
            )
          }
        }

        if (args.scenarioTag && child.scenario.tags.length) {
          if (child.scenario.tags[0].location.column !== args.scenarioTag) {
            document.addError(
              this,
              `Invalid indentation for ${scenarioType} tags. Got ${child.scenario.tags[0].location.column}, wanted ${args.scenarioTag}`,
              child.scenario.tags[0].location,
            )
          }
        }
      }

      if (child.background) {
        child.background.steps.forEach((step) => {
          if (step.keyword.toLowerCase() in args) {
            if (step.location.column !== args[step.keyword.toLowerCase()]) {
              document.addError(
                this,
                `Invalid indentation for ${step.keyword.toLowerCase()}. Got ${step.location.column}, wanted ${args[step.keyword.toLowerCase()]}`,
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
                `Invalid indentation for ${stepNormalized}. Got ${step.location.column}, wanted ${args[stepNormalized]}`,
                step.location,
              )
            }
          }

          if (step.dataTable && args.dataTable !== undefined) {
            if (step.dataTable.location.column !== args.dataTable) {
              document.addError(
                this,
                `Invalid indentation for ${stepNormalized} data table. Got ${step.dataTable.location.column}, wanted ${args.dataTable}`,
                step.dataTable.location,
              )
            }
          }
        })

        if (child.scenario.examples) {
          child.scenario.examples.forEach((example) => {
            if (example.tableHeader && args.exampleTableHeader !== undefined) {
              if (example.tableHeader.location.column !== args.exampleTableHeader) {
                document.addError(
                  this,
                  `Invalid indentation for example table header. Got ${example.tableHeader.location.column}, wanted ${args.exampleTableHeader}`,
                  example.tableHeader.location,
                )
              }
            }

            if (example.tableBody && args.exampleTableBody !== undefined) {
              example.tableBody.forEach((row) => {
                if (row.location.column !== args.exampleTableBody) {
                  document.addError(
                    this,
                    `Invalid indentation for example table row. Got ${row.location.column}, wanted ${args.exampleTableBody}`,
                    row.location,
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
      const expected = expectedIndentation[line.safeKeyword]
      if (expected) {
        document.lines[index].indentation = expected - 1
      }
    })

    await document.regenerate()
  }
}
