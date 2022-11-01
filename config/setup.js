import 'dotenv/config'
import AuthHelper from '../helpers/auth.helper'
import ConfigHelper from '../helpers/config.helper'
import {start} from './server'

const baseUrl = process.env.BASE_URL
const port = process.env.PORT
const isMock = baseUrl.includes('localhost') && baseUrl.includes(port)

if (isMock) start(port)

before(async function () {
  const authHelper = new AuthHelper()
  await authHelper.logIn(process.env.LOGIN, process.env.PASSWORD)
  process.env['TOKEN'] = authHelper.response.body.token
})

after(async function () {
  if (!isMock) {
    const configHelper = new ConfigHelper()
    await configHelper.delete()
  }
})
