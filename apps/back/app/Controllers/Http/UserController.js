'use strict'
const User = use('App/Models/User')
class UserController {

  async index ({ request, response, view }) {
    return await User.all()  
  }

  async store ({ request, response }) {
    const { email, ...data } = request.post()

    const userAlreadyExists = await User.findBy('email',email)

    if(!userAlreadyExists){
      try {
        const user = await User.create({email,...data})
        return response.status(200).json(user)
      } catch (error) {
        return response.status(400).json({msg:error.sqlMessage})
      }
    }else{
      return response.status(409).json({msg:"User already exists"})
    }

  }

  async show ({ params, request, response, view }) {
  }

  async edit ({ params, request, response, view }) {
  }

  async update ({ params, request, response }) {
  }

  async destroy ({ params, request, response }) {
  }
}

module.exports = UserController
