import { dialects } from '@cucumber/gherkin'

export default class Line {
  public keyword: string = ''

  public text: string = ''

  public indentation: number = 0

  public constructor(line: string) {
    this.text = line

    const allKeywords = Object.entries(dialects['en'])
    const keywords = allKeywords
      .filter((kw) => kw[0] !== 'name' && kw[0] !== 'native')
      .map((kw) => kw[1])
      .flat()
      .filter((kw) => kw.trim() !== '*')
    const regex = new RegExp(`^(${keywords.join('|')})`)

    const keywordMatch = line.trim().match(regex)
    if (keywordMatch) {
      this.keyword = keywordMatch[0]
      this.indentation = line.length - line.trimStart().length
      this.text = line.replace(this.keyword, '').trimStart()
    }
  }
}
