import supertest from 'supertest'

export default class TransactionsHelper {
  async create(userFromId, userToId, amount) {
    this.response = await supertest(process.env.BASE_URL)
      .post('/transactions')
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
      .send({from: userFromId, to: userToId, amount: amount})
    return this.response
  }

  async get(transactionId = '') {
    this.response = await supertest(process.env.BASE_URL)
      .get(`/transactions${transactionId !== '' ? `?id=${transactionId}` : ''}`)
      .set('Authorization', `Bearer ${process.env.TOKEN}`)
    return this.response
  }
}