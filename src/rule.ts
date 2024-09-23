import { AcceptedSchema, RawSchema } from './types'
import Schema from './schema'
import Document from './document'

export declare class Rule {
  public readonly name: string

  public readonly acceptedSchema: AcceptedSchema

  public readonly schema: Schema

  public constructor(rawSchema: RawSchema)

  public run(document: Document): Promise<void>
}
