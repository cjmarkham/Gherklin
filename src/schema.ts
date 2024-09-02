import { z } from 'zod'

import { Severity, Switch } from './config'

export const keywordInts = z
  .object({
    feature: z.number(),
    background: z.number(),
    scenario: z.number(),
    step: z.number(),
    examples: z.number(),
    given: z.number(),
    when: z.number(),
    then: z.number(),
    and: z.number(),
    but: z.number(),
    exampleTableHeader: z.number(),
    exampleTableBody: z.number(),
  })
  .partial()
  .strict()

// warn | error
export const severitySchema = z.union([z.literal(Severity.warn), z.literal(Severity.error)])
// on | off | warn | error
export const switchOrSeveritySchema = z.union([z.nativeEnum(Switch), z.nativeEnum(Severity)])
// off | [string] | [error | warn, [string]]
export const offOrStringArrayOrSeverityAndStringArray = z.union([
  z.literal(Switch.off),
  z.string().array(),
  z.tuple([severitySchema, z.string().array()]),
])
//  off | keywordInts | [warn | error, keywordInts]
export const offOrKeywordIntsOrSeverityAndKeywordInts = z.union([
  z.literal(Switch.off),
  keywordInts,
  z.tuple([z.nativeEnum(Severity), keywordInts]),
])
export const offOrNumberOrSeverityAndNumber = z.union([
  z.literal(Switch.off),
  z.number(),
  z.tuple([z.nativeEnum(Severity), z.number()]),
])
