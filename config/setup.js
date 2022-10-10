import 'dotenv/config'
import AuthHelper from '../helpers/auth.helper'

before(async function () {
  let authHelper = new AuthHelper()
  await authHelper.logIn(process.env.LOGIN, process.env.PASSWORD)
  process.env['TOKEN'] = authHelper.response.body.token
})
