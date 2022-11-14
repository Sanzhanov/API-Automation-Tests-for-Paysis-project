import ConfigHelper from '../helpers/config.helper'
import {expect} from 'chai'

describe('Config', function () {
  const configHelper = new ConfigHelper()
  let response

  describe('Get', function () {
    before(async function () {
      response = await configHelper.get()
    })

    it('Response status code is 200', function () {
      expect(response.statusCode).to.eq(200)
    })

    it('Response body contains number of entries', function () {
      expect(response.body.number_of_entries).to.be.a('number')
    })

    it('Response body contains initial amount', function () {
      expect(response.body.initial_amount).to.be.a('number')
    })
  })

  describe('Patch', function () {
    describe('With valid data', function () {
      const newNumberOfEntries = 10
      const newInitialAmount = 1000
      let newConfig

      before(async function () {
        response = await configHelper.patch(newNumberOfEntries, newInitialAmount)
        newConfig = (await configHelper.get()).body
      })

      it('Response status code is 200', function () {
        expect(response.statusCode).to.eq(200)
      })

      it('New config contains new number of entries', function () {
        expect(newConfig.number_of_entries).to.eq(newNumberOfEntries)
      })

      it('New config contains new initial amount', function () {
        expect(newConfig.initial_amount).to.eq(newInitialAmount)
      })

      it('New config contains new data', function () {
        expect(newConfig).to.include({
          'number_of_entries': newNumberOfEntries,
          'initial_amount': newInitialAmount,
        })
      })

      it('New config contains new data', function () {
        expect(newConfig).to.have.keys({
          'number_of_entries': newNumberOfEntries,
          'initial_amount': newInitialAmount,
        })
      })
    })

    describe('With invalid data', function () {
      const newNumberOfEntries = 51
      let initialConfig, newConfig

      before(async function () {
        initialConfig = (await configHelper.get()).body
        response = await configHelper.patch(newNumberOfEntries)
        newConfig = (await configHelper.get()).body
      })

      it('Response status code is 400', function () {
        expect(response.statusCode).to.eq(400)
      })

      it('Response body contains error message', function () {
        expect(response.body.message).to.eq(
          'Number of entries must be between 5 and 25 (inclusively).'
        )
      })

      it('Response message is a string', function () {
        expect(response.body.message).to.be.a('string')
      })

      it("Number of entries didn't change", function () {
        expect(newConfig.number_of_entries).to.eq(initialConfig.number_of_entries)
      })
    })
  })

  describe('Delete', async function () {
    before(async function () {
      response = await configHelper.delete()
    })

    it('Response status code is 200 ', function () {
      expect(response.statusCode).to.eq(200)
    })

    it('Response contains success message', function () {
      expect(response.body.message).to.eq('Data wiped out.')
    })

    it('Response messsage is a string', function () {
      expect(response.body.message).to.be.a('string')
    })
  })
})
