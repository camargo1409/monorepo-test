"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DaySchema extends Schema {
  up() {
    this.create("days", (table) => {
      table.increments();
      table.enu("weekday_name", [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ]).unique();

      table.timestamps();
    });
  }

  down() {
    this.drop("days");
  }
}

module.exports = DaySchema;
