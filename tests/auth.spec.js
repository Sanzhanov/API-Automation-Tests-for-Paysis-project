import {expect} from 'chai'
import AuthHelper from '../helpers/auth.helper'

describe('Authentication', function () {
  describe('Log in with valid credentials', function () {
    let authHelper = new AuthHelper()

    before(async function () {
      await authHelper.logIn(process.env.LOGIN, process.env.PASSWORD)
    })

    it('Response status code is 200', function () {
      expect(authHelper.response.statusCode).to.eq(200)
    })
    it('Response body contains token', function () {
      expect(authHelper.response.body.token).not.to.be.undefined
    })
  })

  describe('Log in with incorrect credentials', function () {
    let authHelper = new AuthHelper()

    before(async function () {
      await authHelper.logIn('invalid', 'invalid')
    })

    it('Response status code is 404', function () {
      expect(authHelper.response.statusCode).to.eq(404)
    })
    it('Response body contains error message', function () {
      expect(authHelper.response.body.message).to.eq('Wrong login or password.')
    })
  })
})
