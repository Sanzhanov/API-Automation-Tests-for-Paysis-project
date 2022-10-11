module.exports = {
  require: '@babel/register',
  spec: 'tests/transactions.spec.js',
  ignore: 'tests/auth2.spec.js',
  file: 'config/setup.js',
  timeout: 15000,

  
}
