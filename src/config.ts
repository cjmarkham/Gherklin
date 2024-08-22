export interface Config {
  customRulesDir?: string
  directory: string
}

interface IndentationRule {
  feature: number
  background: number
  scenario: number
  examples: number
  example: number
  given: number
  when: number
  then: number
  and: number
  but: number
}

export enum FileNameFormat {
  camel,
  kebab,
  pascal,
  snake,
  title,
}

export interface RuleConfig {
  allowedTags?: Array<string>
  indentation?: IndentationRule
  fileName?: FileNameFormat
  maxScenariosPerFile?: number
}
