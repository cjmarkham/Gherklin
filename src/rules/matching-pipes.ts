import { switchOrSeveritySchema } from '../schemas'
import Schema from '../schema'
import Rule from '../rule'
import { RawSchema, AcceptedSchema } from '../types'
import Document from '../document'

export default class MatchingPipes implements Rule {
  public readonly name: string = 'matching-pipes'

  public readonly acceptedSchema: AcceptedSchema = switchOrSeveritySchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema) {
    this.schema = new Schema(rawSchema)
  }

  public async run(document: Document): Promise<void> {
    document.lines.forEach((line, lineIndex) => {
      if (line.text.trimStart().charAt(0) !== '|') {
        return
      }

      const next = document.lines[lineIndex + 1]
      if (!next) {
        return
      }

      const pipeIndices = []
      let pipeIndex = line.text.indexOf('|')
      while (pipeIndex !== -1) {
        pipeIndices.push(pipeIndex);
        pipeIndex = line.text.indexOf('|', pipeIndex + 1);
      }

      const nextPipeIndices = []
      let nextPipeIndex = next.text.indexOf('|')
      while (nextPipeIndex !== -1) {
        nextPipeIndices.push(nextPipeIndex);
        nextPipeIndex = next.text.indexOf('|', nextPipeIndex + 1);
      }

      pipeIndices.forEach((pipeIndex, index) => {
        const next = nextPipeIndices[index]
        if (!next) {
          return
        }

        if (pipeIndex !== next) {
          document.addError(
            this,
            `Data table is not formatted correctly`,
            {
              line: lineIndex + 1,
              column: next,
            },
          )
        }
      })
    })
  }
}
