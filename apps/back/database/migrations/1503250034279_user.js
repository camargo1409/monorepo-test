'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.string('cpf', 15).notNullable().unique()
      table.string('address', 100).notNullable()
      table.string('state',100).notNullable()
      table.string('city',100).notNullable()
      table.decimal('lat',10,6).notNullable()
      table.decimal('long',10,6).notNullable()
      table.boolean('available').notNullable().defaultTo(false)
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
