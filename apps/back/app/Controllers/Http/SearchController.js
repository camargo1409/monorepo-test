'use strict'
const User = use('App/Models/User')
class SearchController {
    async index({request, response, auth}){
        const { id,lat, long } = await auth.getUser()
        console.log(lat,long);
        const usersNearByMe = await User.query().whereNot({id:id}).where({available:false}).nearBy(lat,long,700).fetch()

        return response.json(usersNearByMe)
    }
}

module.exports = SearchController
