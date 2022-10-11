import 'dotenv/config'
import AuthHelper from '../helpers/auth.helper'
import supertest from 'supertest'

before(async function () {
  let authHelper = new AuthHelper()
  await authHelper.logIn(process.env.LOGIN, process.env.PASSWORD)
  process.env['TOKEN'] = authHelper.response.body.token
})

after(async function () {
  await supertest(process.env.BASE_URL)
    .delete('/config')
    .set('Authorization', `Bearer ${process.env.TOKEN}`)
})