'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProviderAvailabilitySchema extends Schema {
  up () {
    this.create('provider_availabilities', (table) => {
      table.increments()
      
      table.integer('day_id').unsigned()
      table.integer('request_id').unsigned()
      table.boolean('available').notNullable().defaultTo(false)
      table.string('start_time')
      table.string('end_time')

      table.foreign('day_id').references('id').inTable('days')
      table.foreign('request_id').references('id').inTable('requests')


      table.timestamps()
    })
  }

  down () {
    this.drop('provider_availabilities')
  }
}

module.exports = ProviderAvailabilitySchema
