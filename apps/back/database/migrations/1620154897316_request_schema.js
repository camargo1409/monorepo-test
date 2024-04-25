'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RequestSchema extends Schema {
  up () {
    this.create('requests', (table) => {
      table.increments()

      table.integer('customer_id').unsigned().notNullable()
      table.integer('post_provider_id').unsigned().notNullable()
      table.foreign('customer_id').references('id').inTable('users')
      table.foreign('post_provider_id').references('id').inTable('users')

      table.boolean('customer_confirmed').defaultTo(false)
      table.boolean('provider_accepted').defaultTo(false)
      table.decimal('service_price')
      table.boolean('has_arrived').defaultTo(false)

      table.timestamps()
    })
  }

  down () {
    this.drop('requests')
  }
}

module.exports = RequestSchema
