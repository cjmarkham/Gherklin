import { expect } from 'chai'

import Line from '../../src/line'

describe('Line', () => {
  const tests = [
    {
      text: 'Feature: This is a feature',
      expectedKeyword: 'Feature',
      expectedText: ': This is a feature',
    },
    {
      text: 'Scenario: This is a scenario',
      expectedKeyword: 'Scenario',
      expectedText: ': This is a scenario',
    },
    {
      text: 'Given something happens',
      expectedKeyword: 'Given ',
      expectedText: 'something happens',
    },
    {
      text: '    Then something happens',
      expectedKeyword: 'Then ',
      expectedText: 'something happens',
    },
  ]

  tests.forEach((test) => {
    it(`correctly parses "${test.text}"`, () => {
      const line = new Line(test.text)
      expect(line.keyword).to.eq(test.expectedKeyword)
      expect(line.text).to.eq(test.expectedText)
    })
  })
})
