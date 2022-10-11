import UsersHelper from '../helpers/users.helper'
import TransactionsHelper from '../helpers/transactions.helper'
import {expect} from 'chai'
import {getRandomItem} from '../helpers/common.helper'

describe('Transactions', function () {
  describe('Transaction creation', function () {
    let usersHelper = new UsersHelper()
    let transactionsHelper = new TransactionsHelper()
    let userFromBefore, userFromAfter, userToBefore, userToAfter
    const amount = 100

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

  describe('Get single transaction', function () {
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