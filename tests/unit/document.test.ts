import { expect, use } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import Document from '../../src/document'

use(chaiAsPromised)

describe('Document', () => {
  describe('load', () => {
    it('handles the file not being present', async () => {
      const document = new Document('invalid.json')
      await expect(document.load()).to.be.rejectedWith(
        Error,
        'Could not open the feature file at "invalid.json". Does it exist?',
      )
    })
  })
})
