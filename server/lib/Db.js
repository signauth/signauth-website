// Next line is to avoid that npm-check-unused reports it
require('sqlite3')
//
const path = require('path')
const fs = require('fs-extra')

const dbDir = path.resolve(__dirname, '../../db')
fs.ensureDirSync(dbDir)
const filename = path.join(dbDir, 'auth.sqlite3')

class Db {

  constructor() {

    this.knex = require('knex')({
      client: 'sqlite3',
      connection: {
        filename
      },
      useNullAsDefault: true
    })
  }

  async init() {

    // await this.knex.schema.dropTable('users')
    // await this.knex.schema.dropTable('tokens')

    if (!(await this.knex.schema.hasTable('users'))) {
      await this.knex.schema.createTable('users', function (table) {
        table.integer('created_at').unsigned()
        table.integer('last_signin_at')
        table.text('email').unique()
        table.text('public_key')
        table.integer('nonce')
      })
    }
    if (!(await this.knex.schema.hasTable('tokens'))) {
      await this.knex.schema.createTable('tokens', function (table) {
        table.string('email')
        table.string('token')
        table.integer('expiration')
      })
    }
  }

}

const instance = new Db()
instance.init()

module.exports = instance

