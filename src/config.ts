export interface Config {
  customRulesDir?: string
  directory: string
}

interface NumericalKeywordValue {
  feature?: number
  background?: number
  scenario?: number
  step?: number
  examples?: number
  example?: number
  given?: number
  when?: number
  then?: number
  and?: number
  but?: number
}

export interface RuleConfig {
  allowedTags?: Array<string>
  indentation?: NumericalKeywordValue
  maxScenariosPerFile?: number
  nameLength?: NumericalKeywordValue
}
