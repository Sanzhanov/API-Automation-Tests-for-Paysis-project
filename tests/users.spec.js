import UsersHelper from '../helpers/users.helper'
import {getRandomItem} from '../helpers/common.helper'
import {expect} from 'chai'

describe('Users', function () {
  describe('User creation', function () {
    let usersHelper = new UsersHelper()

    before(async function () {
      await usersHelper.create()
    })

    it('response status code is 200', function () {
      expect(usersHelper.response.statusCode).to.eq(200)
    })

    it('response body contains user id', function () {
      expect(usersHelper.response.body.id).to.be.a('string')
    })

    it('response body contains initial amount', function () {
      expect(usersHelper.response.body.amount).to.be.a('number')
    })
  })

  describe('Get user', function () {
    let usersHelper = new UsersHelper()
    let user

    before(async function () {
      await usersHelper.create()
      user = usersHelper.response.body
      await usersHelper.get(user.id)
    })

    it('response status code is 200', function () {
      expect(usersHelper.response.statusCode).to.eq(200)
    })

    it('response body contains user id', function () {
      expect(usersHelper.response.body.id).to.eq(user.id)
    })

    it('response body contains initial amount', function () {
      expect(usersHelper.response.body.amount).to.eq(user.amount)
    })
  })

  describe('Get all users', function () {
    let usersHelper = new UsersHelper()

    before(async function () {
      await usersHelper.create()
      await usersHelper.create()
      await usersHelper.get()
    })

    it('response status code is 200', function () {
      expect(usersHelper.response.statusCode).to.eq(200)
    })

    it('response body contains array of at least 2 users', function () {
      expect(usersHelper.response.body.length).to.be.at.least(2)
    })

    it('response body contains user id', function () {
      expect(getRandomItem(usersHelper.response.body).id).not.to.be.undefined
    })

    it('response body contains initial amount', function () {
      expect(getRandomItem(usersHelper.response.body).amount).not.to.be.undefined
    })
  })

  describe('Delete user', function () {
    let usersHelper = new UsersHelper()
    let userId

    before(async function () {
      await usersHelper.create()
      userId = usersHelper.response.body.id
      await usersHelper.delete(userId)
    })

    it('response status code is 200', function () {
      expect(usersHelper.response.statusCode).to.eq(200)
    })

    it('response body contains success message', function () {
      expect(usersHelper.response.body.message).to.eq('User deleted.')
    })
  })
})