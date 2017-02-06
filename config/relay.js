var schema     = require('./schema.json')
module.exports = require('babel-relay-plugin')(schema.data)
