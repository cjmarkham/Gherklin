export interface ReporterConfig {
  type?: string
  title?: string
  configDirectory: string
  outFile?: string
}

export interface GherkinKeywordNumericals {
  feature?: number
  background?: number
  scenario?: number
  step?: number
  examples?: number
  given?: number
  when?: number
  then?: number
  and?: number
  but?: number
  exampleTableHeader?: number
  exampleTableBody?: number
}

export enum Switch {
  off = 'off',
  on = 'on',
}

export enum Severity {
  warn = 'warn',
  error = 'error',
}

// RawSchema is the schema before it's parsed
// It can contain, severity, switch, arguments or a mix
export type RawSchema =
  | Severity
  | Switch
  | GherkinKeywordNumericals
  | Array<string>
  | [string, GherkinKeywordNumericals | Array<string> | number]
  | number

// RuleArguments are the arguments when the RuleSchema is parsed in
// to its severity | switch and arguments
export type RuleArguments = GherkinKeywordNumericals | Array<string> | number

export interface RuleConfiguration {
  [ruleName: string]: RawSchema
}

export interface GherklinConfiguration {
  configDirectory?: string
  customRulesDirectory?: string
  featureDirectory?: string
  rules?: RuleConfiguration
  reporter?: ReporterConfig
  featureFile?: string
  fix?: boolean | Array<string>
}

export interface RuleDefinition {
  schema: any
  run: Function
  fix?: Function
}

export interface Report {
  title: string
  files: Array<ReportFile>
  totalErrors: number
  totalWarns: number
  totalLines: number
  rules: {
    [name: string]: number
  }
}

export interface ReportFile {
  path: string
  hasErrors: boolean
  lines: Array<ReportLine>
  issueCount: number
}

export interface ReportLine {
  number: number
  hasError: boolean
  errorSeverity: Severity
  content: string
  ruleName: string
}
