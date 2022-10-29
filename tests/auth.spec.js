import {expect} from 'chai'
import AuthHelper from '../helpers/auth.helper'

describe('Authentication', function () {
  let authHelper = new AuthHelper()
  let response

  describe('Log in with valid credentials', function () {
    before(async function () {
      response = await authHelper.logIn(process.env.LOGIN, process.env.PASSWORD)
      console.log(response.body.token)
    })

    it('Response status code is 200', function () {
      expect(response.statusCode).to.eq(200)
    })
    it('Response body contains token', function () {
      expect(response.body.token).not.to.be.undefined
    })
  })

  describe('Log in with incorrect credentials', function () {
    before(async function () {
      response = await authHelper.logIn('invalid', 'invalid')
    })

    it('Response status code is 404', function () {
      expect(response.statusCode).to.eq(404)
    })
    it('Response body contains error message', function () {
      expect(response.body.message).to.eq('Wrong login or password.')
    })
  })
})
