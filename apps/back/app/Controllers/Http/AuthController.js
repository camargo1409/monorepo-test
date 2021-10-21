'use strict'
const User = use('App/Models/User')

class AuthController {
    async store({auth,request,response}){
        const {email,password} = request.all()

        const user = await User.findBy('email',email)

        const {token} = await auth.attempt(email,password)

        return response.json({token,user})
    }

    async show({auth, request, response}){
        const user = await auth.getUser()

        return response.json(user)
    }
}

module.exports = AuthController
