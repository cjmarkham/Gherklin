import { switchOrSeverityorSeverityAndStringSchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema, Location } from '../types'
import Document from '../document'
import Line from '../line'

export default class NoInconsistentQuotes implements Rule {
  public readonly name: string = 'no-inconsistent-quotes'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeverityorSeverityAndStringSchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    const quotesUsed: Map<string, Array<Location>> = new Map()
    quotesUsed.set(`"`, [])
    quotesUsed.set(`'`, [])

    document.lines.forEach((line: Line, index: number): void => {
      const singleIndex = line.text.indexOf(`'`)
      if (singleIndex > -1) {
        quotesUsed.set(`'`, [
          ...quotesUsed.get(`'`),
          { line: index + 1, column: line.indentation + line.keyword.length + singleIndex + 1 },
        ])
      }
      const doubleIndex = line.text.indexOf(`"`)
      if (doubleIndex > -1) {
        quotesUsed.set(`"`, [
          ...quotesUsed.get(`"`),
          { line: index + 1, column: line.indentation + line.keyword.length + doubleIndex + 1 },
        ])
      }
    })

    if (quotesUsed.get(`'`).length > 0 && quotesUsed.get(`"`).length > 0) {
      quotesUsed.forEach((locations: Array<Location>) => {
        locations.forEach((location: Location): void => {
          document.addError(this.name, 'Found a mix of single and double quotes.', location)
        })
      })
    }
  }

  public async fix(document: Document): Promise<void> {
    let replacer = `'`
    if (this.schema.args) {
      replacer = this.schema.args as string
    }

    document.lines.forEach((line: Line, index: number): void => {
      document.lines[index].text = line.text.replaceAll(/['"]/g, replacer)
    })

    await document.regenerate()
  }
}
