import { z } from 'zod'

export const keywordSpecificNumbers = z
  .object({
    feature: z.number(),
    background: z.number(),
    scenario: z.number(),
    step: z.number(),
    examples: z.number(),
    example: z.number(),
    given: z.number(),
    when: z.number(),
    then: z.number(),
    and: z.number(),
    but: z.number(),
  })
  .partial()
  .strict()

export const severitySchema = z.union([z.literal('warn'), z.literal('error')])
export const switchSchema = z.union([z.literal('on'), z.literal('off')])
