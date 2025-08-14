import { dialects } from '@cucumber/gherkin'
import { camelise } from './utils'

export default class Line {
  public keyword: string = ''

  public safeKeyword: string = ''

  public text: string = ''

  public indentation: number = 0

  public constructor(line: string) {
    this.text = line

    const allKeywords = Object.entries(dialects['en'])
    const keywords = allKeywords
      .filter((kw) => kw[0] !== 'name' && kw[0] !== 'native')
      .map((kw) => kw[1])
      .flat()
      .sort((a, b) => b < a ? -1 : 1)

    const regex = new RegExp(`^(${keywords.map((k: string) => k.replaceAll('*', '\\*')).join('|')})`)
    const keywordMatch = line.trim().match(regex)
    if (keywordMatch) {
      this.keyword = keywordMatch[0]
      this.safeKeyword = camelise(this.keyword).trim()
      this.indentation = line.length - line.trimStart().length
      this.text = line.replace(keywordMatch[0], '').trimStart()
    }
  }
}
