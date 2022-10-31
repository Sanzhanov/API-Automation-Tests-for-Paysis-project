import 'dotenv/config'
import AuthHelper from '../helpers/auth.helper'
import ConfigHelper from '../helpers/config.helper'

before(async function () {
  const authHelper = new AuthHelper()
  await authHelper.logIn(process.env.LOGIN, process.env.PASSWORD)
  process.env['TOKEN'] = authHelper.response.body.token
})

after(async function () {
  const configHelper = new ConfigHelper()
  await configHelper.delete()
})
