import { AcceptedSchema } from './types'
import Schema from './schema'
import Document from './document'

export default abstract class Rule {
  public readonly name: string

  public readonly acceptedSchema: AcceptedSchema

  public readonly schema: Schema

  public abstract run(document: Document): Promise<void>
}
