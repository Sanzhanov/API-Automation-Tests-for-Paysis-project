import UsersHelper from '../helpers/users.helper'
import TransactionsHelper from '../helpers/transactions.helper'
import {expect} from 'chai'
import {getRandomItem} from '../helpers/common.helper'

describe('Transactions', function () {
  describe('Create transaction', function () {
    describe('With valid data', function () {
      const usersHelper = new UsersHelper()
      const transactionsHelper = new TransactionsHelper()
      let userFromBefore, userFromAfter, userToBefore, userToAfter
      let response
      const amount = 100

      before(async function () {
        userFromBefore = (await usersHelper.create()).body
        userToBefore = (await usersHelper.create()).body
        response = await transactionsHelper.create(userFromBefore.id, userToBefore.id, amount)
        userFromAfter = (await usersHelper.get(userFromBefore.id)).body
        userToAfter = (await usersHelper.get(userToBefore.id)).body
      })

      after(async function () {
        await usersHelper.delete(userFromBefore.id)
        await usersHelper.delete(userToBefore.id)
      })

      it('response status code is 200', function () {
        expect(response.statusCode).to.eq(200)
      })

      it('response body contains sender id', function () {
        expect(response.body.from).to.eq(userFromBefore.id)
      })

      it('response body contains receiver id', function () {
        expect(response.body.to).to.eq(userToBefore.id)
      })

      it('response body contains entered amount', function () {
        expect(response.body.amount).to.eq(amount)
      })

      it('sender has amount deducted', function () {
        expect(userFromAfter.amount).to.eq(userFromBefore.amount - amount)
      })

      it('receiver has amount added', function () {
        expect(userToAfter.amount).to.eq(userToBefore.amount + amount)
      })

      it('total amount of 2 users is fixed', function () {
        expect(userFromBefore.amount + userToBefore.amount).to.eq(
          userFromAfter.amount + userToAfter.amount
        )
      })
    })

    describe('With invalid data', function () {
      describe.skip('Negative amount', function () {
        const usersHelper = new UsersHelper()
        const transactionsHelper = new TransactionsHelper()
        let userFromBefore, userFromAfter, userToBefore, userToAfter
        let response
        const amount = -5000

        before(async function () {
          userFromBefore = (await usersHelper.create()).body
          userToBefore = (await usersHelper.create()).body
          response = await transactionsHelper.create(userFromBefore.id, userToBefore.id, amount)
          userFromAfter = (await usersHelper.get(userFromBefore.id)).body
          userToAfter = (await usersHelper.get(userToBefore.id)).body
        })

        after(async function () {
          await usersHelper.delete(userFromBefore.id)
          await usersHelper.delete(userToBefore.id)
        })

        it('response status code is 400', function () {
          expect(response.statusCode).to.eq(400)
        })

        it("sender's amount is unchanged", function () {
          expect(userFromAfter.amount).to.eq(userFromBefore.amount)
        })

        it("receiver's amount is unchanged", function () {
          expect(userToAfter.amount).to.eq(userToBefore.amount)
        })
      })

      describe("Amount is more than sender's balance", function () {
        const usersHelper = new UsersHelper()
        const transactionsHelper = new TransactionsHelper()
        let userFromBefore, userFromAfter, userToBefore, userToAfter
        let response
        const amount = 300000

        before(async function () {
          userFromBefore = (await usersHelper.create()).body
          userToBefore = (await usersHelper.create()).body
          response = await transactionsHelper.create(userFromBefore.id, userToBefore.id, amount)
          userFromAfter = (await usersHelper.get(userFromBefore.id)).body
          userToAfter = (await usersHelper.get(userToBefore.id)).body
        })

        after(async function () {
          await usersHelper.delete(userFromBefore.id)
          await usersHelper.delete(userToBefore.id)
        })

        it('response status code is 400', function () {
          expect(response.statusCode).to.eq(400)
        })

        it('Response body contains error message', function () {
          expect(response.body.message).to.eq("Sender doesn't have enough money.")
        })

        it("sender's amount is unchanged", function () {
          expect(userFromAfter.amount).to.eq(userFromBefore.amount)
        })

        it("receiver's amount is unchanged", function () {
          expect(userToAfter.amount).to.eq(userToBefore.amount)
        })
      })

      describe('With non-existing sender', function () {
        const usersHelper = new UsersHelper()
        const transactionsHelper = new TransactionsHelper()
        let userToBefore, userToAfter
        let response
        const amount = 5000

        before(async function () {
          userToBefore = (await usersHelper.create()).body
          response = await transactionsHelper.create('1', userToBefore.id, amount)
          userToAfter = (await usersHelper.get(userToBefore.id)).body
        })

        after(async function () {
          await usersHelper.delete(userToBefore.id)
        })

        it('response status code is 400', function () {
          expect(response.statusCode).to.eq(400)
        })

        it('Response body contains error message', function () {
          expect(response.body.message).to.eq('Sender not found.')
        })

        it("Receiver's balance is unchanged", function () {
          expect(userToAfter.amount).to.eq(userToBefore.amount)
        })
      })

      describe('With non-existing receiver', function () {
        const usersHelper = new UsersHelper()
        const transactionsHelper = new TransactionsHelper()
        let userFromBefore, userFromAfter
        let response
        const amount = 5000

        before(async function () {
          userFromBefore = (await usersHelper.create()).body
          response = await transactionsHelper.create(userFromBefore.id, '1', amount)
          userFromAfter = (await usersHelper.get(userFromBefore.id)).body
        })

        after(async function () {
          await usersHelper.delete(userFromBefore.id)
        })

        it('response status code is 400', function () {
          expect(response.statusCode).to.eq(400)
        })

        it('Response body contains error message', function () {
          expect(response.body.message).to.eq('Receiver not found.')
        })

        it("Sender's balance is unchanged", function () {
          expect(userFromBefore.amount).to.eq(userFromAfter.amount)
        })
      })
    })
  })

  describe('Get', function () {
    describe('Single transaction', function () {
      let usersHelper = new UsersHelper()
      let transactionsHelper = new TransactionsHelper()
      let userFromId, userToId, transaction, response
      const amount = 199

      before(async function () {
        userFromId = (await usersHelper.create()).body.id
        userToId = (await usersHelper.create()).body.id
        transaction = (await transactionsHelper.create(userFromId, userToId, amount)).body
        response = await transactionsHelper.get(transaction.id)
      })

      after(async function () {
        await usersHelper.delete(userFromId)
        await usersHelper.delete(userToId)
      })

      it('response status code is 200', function () {
        expect(response.statusCode).to.eq(200)
      })

      it('response body contains transaction id', function () {
        expect(response.body.id).to.eq(transaction.id)
      })

      it('response body contains initial amount', function () {
        expect(response.body.amount).to.eq(transaction.amount)
      })

      it('response body contains sender id', function () {
        expect(response.body.from).to.eq(userFromId)
      })

      it('response body contains receiver id', function () {
        expect(response.body.to).to.eq(userToId)
      })
    })

    describe('All transactions', function () {
      let usersHelper = new UsersHelper()
      let transactionsHelper = new TransactionsHelper()
      let userFrom, userTo, allTransactions, response

      before(async function () {
        userFrom = (await usersHelper.create()).body
        userTo = (await usersHelper.create()).body

        await transactionsHelper.create(userFrom.id, userTo.id, 29)
        await transactionsHelper.create(userFrom.id, userTo.id, 19)
        await transactionsHelper.create(userFrom.id, userTo.id, 9)
        response = await transactionsHelper.get()
        allTransactions = response.body.slice(-3)
      })

      after(async function () {
        await usersHelper.delete(userFrom.id)
        await usersHelper.delete(userTo.id)
      })

      it('response status code is 200', function () {
        expect(response.statusCode).to.eq(200)
      })

      it('response body contains array of at least 3 transactions', function () {
        expect(allTransactions.length).to.eq(3)
      })

      it('response body contains transaction id', function () {
        expect(getRandomItem(allTransactions).id).not.to.be.undefined
      })

      it('response body contains amount', function () {
        expect(getRandomItem(allTransactions).amount).not.to.be.undefined
      })

      it('response body contains sender id', function () {
        expect(getRandomItem(allTransactions).from).to.eq(userFrom.id)
      })

      it('response body contains recipient id', function () {
        expect(getRandomItem(allTransactions).to).to.eq(userTo.id)
      })

      it('response body contains transaction id', function () {
        expect(getRandomItem(allTransactions).id).to.be.oneOf(
          [allTransactions[0].id, allTransactions[1].id, allTransactions[2].id],
          'nooo why fail??'
        )
      })
      it('response body contains transaction amount', function () {
        expect(getRandomItem(allTransactions).amount).to.be.oneOf(
          [allTransactions[0].amount, allTransactions[1].amount, allTransactions[2].amount],
          'nooo why fail??'
        )
      })
    })
  })
})
