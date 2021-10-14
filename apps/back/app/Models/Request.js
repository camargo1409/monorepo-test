'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Request extends Model {
    customer(){
        return this.belongsTo('App/Models/User','customer_id','id')
    }

    provider(){
        return this.belongsTo('App/Models/User','post_provider_id','id')
    }
}

module.exports = Request
