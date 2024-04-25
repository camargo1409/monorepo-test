'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddressSchema extends Schema {
  up () {
    this.create('addresses', (table) => {
      table.increments()
      table.string('street').notNullable()
      table.string('neighborhood').notNullable()
      table.string('city').notNullable()
      
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')

      table.timestamps()
    })
  }

  down () {
    this.drop('addresses')
  }
}

module.exports = AddressSchema
