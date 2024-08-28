export interface GherkinKeywordNumericals {
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

export enum Switch {
  off = 'off',
  on = 'on',
}

export enum Severity {
  warn = 'warn',
  error = 'error',
}

export type RuleArguments =
  | Severity
  | Switch
  | GherkinKeywordNumericals
  | Array<string>
  | [string, GherkinKeywordNumericals | Array<string>]

export interface RuleConfiguration {
  [ruleName: string]: RuleArguments
}

export interface Config {
  customRulesDir?: string
  directory: string
  rules: RuleConfiguration
}

export interface RuleDefinition {
  schema: any
  run: Function
}
