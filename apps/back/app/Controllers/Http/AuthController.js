'use strict'

class AuthController {
    async store({auth,request,response}){
        const {email,password} = request.all()

        const {token} = await auth.attempt(email,password)

        return response.json({token})
    }
}

module.exports = AuthController
