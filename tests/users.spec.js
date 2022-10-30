import UsersHelper from '../helpers/users.helper'
import {getRandomItem} from '../helpers/common.helper'
import {expect} from 'chai'

describe('Users', function () {
  describe('User creation', function () {
    const usersHelper = new UsersHelper()
    let response

    before(async function () {
      response = await usersHelper.create()
    })

    after(async function () {
      await usersHelper.delete(response.body.id)
    })

    it('response status code is 200', function () {
      expect(response.statusCode).to.eq(200)
    })

    it('response body contains user id', function () {
      expect(response.body.id).to.be.a('string')
    })

    it('response body contains initial amount', function () {
      expect(response.body.amount).to.be.a('number')
    })
  })

  describe('Get', function () {
    describe('Single user', function () {
      const usersHelper = new UsersHelper()
      let user
      let response

      before(async function () {
        await usersHelper.create()
        user = usersHelper.response.body
        response = await usersHelper.get(user.id)
      })

      after(async function () {
        await usersHelper.delete(user.id)
      })

      it('response status code is 200', function () {
        expect(response.statusCode).to.eq(200)
      })

      it('response body contains user id', function () {
        expect(response.body.id).to.eq(user.id)
      })

      it('response body contains initial amount', function () {
        expect(response.body.amount).to.eq(user.amount)
      })
    })

    describe('All users', function () {
      const usersHelper = new UsersHelper()
      let response
      let userId1
      let userId2

      before(async function () {
        userId1 = (await usersHelper.create()).body.id
        userId2 = (await usersHelper.create()).body.id
        response = await usersHelper.get()
      })

      after(async function () {
        await usersHelper.delete(userId1)
        await usersHelper.delete(userId2)
      })

      it('response status code is 200', function () {
        expect(response.statusCode).to.eq(200)
      })

      it('response body contains array of at least 2 users', function () {
        expect(response.body.length).to.be.at.least(2)
      })

      it('response body contains user id', function () {
        expect(getRandomItem(response.body).id).not.to.be.undefined
      })

      it('response body contains user id', function () {
        for (let user of response.body) expect(user.id).to.be.a('string')
      })

      it('response body contains initial amount', function () {
        expect(getRandomItem(response.body).amount).not.to.be.undefined
      })

      it('response body contains initial amount', function () {
        for (let user of response.body) expect(user.amount).to.be.a('number')
      })
    })
  })

  describe('Delete', function () {
    describe('With existing user id', function () {
      const usersHelper = new UsersHelper()
      let response

      before(async function () {
        const userId = (await usersHelper.create()).body.id
        response = await usersHelper.delete(userId)
      })

      it('response status code is 200', function () {
        expect(response.statusCode).to.eq(200)
      })

      it('response body contains success message', function () {
        expect(response.body.message).to.eq('User deleted.')
      })
    })

    describe('With non-existing user id', function () {
      const usersHelper = new UsersHelper()
      let response

      before(async function () {
        response = await usersHelper.delete('bbvevfntumnbd')
      })

      it('response status code is 400', function () {
        expect(response.statusCode).to.eq(400)
      })

      it('response body contains error message', function () {
        expect(response.body.message).to.eq('No user found.')
      })
    })
  })
})
