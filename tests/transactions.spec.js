import UsersHelper from '../helpers/users.helper'
import TransactionsHelper from '../helpers/transactions.helper'
import {expect} from 'chai'
import {getRandomItem} from "../helpers/common.helper";

describe('Transactions', function () {
  describe.only('Transaction creation', function () {
    let usersHelper = new UsersHelper()
    let transactionsHelper = new TransactionsHelper()
    let userFromBefore, userFromAfter, userToBefore, userToAfter
    let amount = 100

    before(async function () {
      await usersHelper.create()
      userFromBefore = usersHelper.response.body
      await usersHelper.create()
      userToBefore = usersHelper.response.body
      await transactionsHelper.create(userFromBefore.id, userToBefore.id, amount)
      await usersHelper.get(userFromBefore.id)
      userFromAfter = usersHelper.response.body
      await usersHelper.get(userToBefore.id)
      userToAfter = usersHelper.response.body
      //console.log(transactionsHelper)
    })

    it('response status code is 200', function () {
      expect(usersHelper.response.statusCode).to.eq(200)
    })

    it('response body contains sender id', function () {
      expect(transactionsHelper.response.body.from).to.eq(userFromBefore.id)
    })

    it('response body contains receiver id', function () {
      expect(transactionsHelper.response.body.to).to.eq(userToBefore.id)
    })

    it('response body contains transaction amount', function () {
      expect(transactionsHelper.response.body.amount).to.eq(amount)
    })

    it('sender has amount deducted', function () {
      expect(userFromAfter.amount).to.eq(userFromBefore - amount)
    })

    it('receiver has amount added', function () {
      expect(userToAfter.amount).to.eq(userToBefore + amount)
    })

    it('total amount of 2 users is fixed', function () {
      expect(userFromBefore.amount + userToBefore.amount).to.eq(
        userFromAfter.amount + userToAfter.amount
      )
    })
  })

  describe('Get transaction', function () {
    let usersHelper = new UsersHelper()
    let transactionsHelper = new TransactionsHelper()
    let userFrom, userTo, transaction

    before(async function () {
      await usersHelper.create()
      userFrom = usersHelper.response.body
      await usersHelper.create()
      userTo = usersHelper.response.body

      await transactionsHelper.create(userFrom.id, userTo.id, 199)
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
  })

  describe('Get all transactions', function () {
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
      allTransactions = transactionsHelper.response.body
      console.log(allTransactions)
    })

    it('response status code is 200', function () {
      expect(transactionsHelper.response.statusCode).to.eq(200)
    })

    it('response body contains array of at least 3 transactions', function () {
      expect(allTransactions.length).to.be.at.least(3)
    })

    it('response body contains transaction id', function () {
      expect(getRandomItem(allTransactions).id).not.to.be.undefined
    })

    it('response body contains amount', function () {
      expect(getRandomItem(allTransactions).amount).not.to.be.undefined
    })

    // it('response body contains sender id', function () {
    //   expect(getRandomItem(allTransactions).from).to.eq(userFrom.id)
    // })
    //
    // it('response body contains recipient id', function () {
    //   expect(getRandomItem(allTransactions).to).to.eq(userTo.id)
    // })
    //
    // it('response body contains transaction id', function () {
    //   expect(getRandomItem(allTransactions).id).to.be.oneOf([allTransactions[allTransactions.length-1].id,
    //       allTransactions[allTransactions.length-2].id, allTransactions[allTransactions.length-3].id], 'nooo why fail??')
    // })
    // it('response body contains transaction amount', function () {
    //   expect(getRandomItem(transactionsHelper.response.body).amount).to.be.oneOf([29,19,9], 'nooo why fail??')
    // })

  })
})