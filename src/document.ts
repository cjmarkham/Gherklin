import fs from 'node:fs/promises'
import { Feature, IdGenerator } from '@cucumber/messages'
import Gherkin from '@cucumber/gherkin'

import { LintError, Location } from './types'

export default class Document {
  public filename: string

  public feature: Feature = new Feature()

  public errors: Array<LintError> = []

  public constructor(filename: string) {
    this.filename = filename
  }

  public load = async (): Promise<void> => {
    const content = await fs.readFile(this.filename).catch((): never => {
      throw new Error(`Could not open the feature file at "${this.filename}". Does it exist?`)
    })

    const builder = new Gherkin.AstBuilder(IdGenerator.uuid())
    const matcher = new Gherkin.GherkinClassicTokenMatcher()
    const parser = new Gherkin.Parser(builder, matcher)

    const gherkinDocument = parser.parse(content.toString())
    if (!gherkinDocument) {
      return
    }

    if (gherkinDocument.feature) {
      this.feature = gherkinDocument.feature
    }
  }

  public addError = (message: string, location: Location): void => {
    this.errors.push({
      message,
      location,
    } as LintError)
  }
}
