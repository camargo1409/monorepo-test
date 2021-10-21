'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

const Database = use('Database')

class User extends Model {
  static get hidden () {
    return ['password']
  }

  static scopeNearBy (query, latitude, longitude, distance) {
    const haversine = "(6371 * acos(cos(radians("+latitude+")) * cos(radians(`lat`)) * cos(radians(`long`) - radians("+longitude+")) + sin(radians("+latitude+")) * sin(radians(`lat`))))"

    return query
      .select('*', Database.raw(`${haversine} as distance`))
      .whereRaw(haversine + " < "+distance)
  }
  static boot () {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async (userInstance) => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password)
      }
    })
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  customer(){
    return this.hasMany('App/Models/Request','id','customer_id')
  }

  provider(){
    return this.hasMany('App/Models/Request','id','post_provider_id')
  }
}

module.exports = User
