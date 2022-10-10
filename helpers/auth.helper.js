import supertest from 'supertest'

export default class AuthHelper {
  //response

  async logIn(username, password) {
    this.response = await supertest(process.env.BASE_URL)
      .post('/auth')
      .send({login: username, password: password})
    return this.response
  }
}