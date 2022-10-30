import UsersHelper from '../helpers/users.helper'
import TransactionsHelper from '../helpers/transactions.helper'
import {expect} from 'chai'
import {getRandomItem} from '../helpers/common.helper'

describe.only('Transactions', function () {
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
      describe('Negative amount', function () {
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
    })
  })

  describe('Get', function () {
    describe('Single transaction', function () {
      let usersHelper = new UsersHelper()
      let transactionsHelper = new TransactionsHelper()
      let userFrom, userTo, transaction
      const amount = 199

      before(async function () {
        await usersHelper.create()
        userFrom = usersHelper.response.body.id
        await usersHelper.create()
        userTo = usersHelper.response.body.id

        await transactionsHelper.create(userFrom, userTo, amount)
        transaction = transactionsHelper.response.body
        await transactionsHelper.get(transaction.id)
      })

      it('response status code is 200', function () {
        expect(transactionsHelper.response.statusCode).to.eq(200)
      })

      it('response body contains transaction id', function () {
        expect(transactionsHelper.response.body.id).to.eq(transaction.id)
      })

      it('response body contains initial amount', function () {
        expect(transactionsHelper.response.body.amount).to.eq(transaction.amount)
      })

      it('response body contains sernder id', function () {
        expect(transactionsHelper.response.body.from).to.eq(userFrom)
      })

      it('response body contains receiver id', function () {
        expect(transactionsHelper.response.body.to).to.eq(userTo)
      })
    })

    describe('All transactions', function () {
      let usersHelper = new UsersHelper()
      let transactionsHelper = new TransactionsHelper()
      let userFrom, userTo, allTransactions

      before(async function () {
        await usersHelper.create()
        userFrom = usersHelper.response.body
        await usersHelper.create()
        userTo = usersHelper.response.body

        await transactionsHelper.create(userFrom.id, userTo.id, 29)
        await transactionsHelper.create(userFrom.id, userTo.id, 19)
        await transactionsHelper.create(userFrom.id, userTo.id, 9)
        await transactionsHelper.get()
        allTransactions = transactionsHelper.response.body.slice(-3)
      })

      it('response status code is 200', function () {
        expect(transactionsHelper.response.statusCode).to.eq(200)
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
