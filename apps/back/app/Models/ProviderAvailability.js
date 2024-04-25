"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ProviderAvailability extends Model {
  day() {
    return this.belongsTo("App/Models/Day", "day_id", "id");
  }
}

module.exports = ProviderAvailability;
