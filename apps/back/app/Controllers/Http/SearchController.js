'use strict'
const User = use('App/Models/User')
class SearchController {
    async index({request, response, auth}){
        const {distance} = request.get()
        
        const { id,lat, long } = await auth.getUser()
        const usersNearByMe = await User.query().whereNot({id:id}).where({available:true}).nearBy(lat,long,+distance).fetch()

        return response.json(usersNearByMe)
    }
}

module.exports = SearchController
