"use strict";
const User = use("App/Models/User");
const Address = use("App/Models/Address");
const Database = use("Database");
class UserController {
  async index({ request, response, view }) {
    return await User.all();
  }

  async store({ auth, request, response }) {
    const { email, password, address, ...data } = request.post();

    const userAlreadyExists = await User.findBy("email", email);

    const trx = await Database.beginTransaction();

    if (!userAlreadyExists) {
      try {
        const user = await User.create({ email, password, ...data }, trx);
        const addr = await Address.create({ ...address }, trx);

        await addr.user().associate(user, trx);

        await trx.commit();

        const { token } = await auth.attempt(email, password);

        return response.status(200).json({ user, token });
      } catch (error) {
        await trx.rollback();
        console.log(error);
        return response.status(400).json({ msg: error.sqlMessage });
      }
    } else {
      return response.status(409).json({ msg: "User already exists" });
    }
  }

  async update({ params, request, response, auth }) {
    const { address, ...data } = request.post();

    const user = await auth.getUser();

    const { email } = user;

    const userExists = await User.findBy("email", email);

    if (!userExists)
      return response.status(404).json({ msg: "User doesn't exists" });

    const trx = await Database.beginTransaction();

    try {
      userExists.merge({ email, ...data });
      await userExists.save(trx);

      const addr = await Address.findBy("user_id", userExists.id);
      addr.merge(address);
      await addr.save(trx);

      await trx.commit();

      // return userExists;

      return response.status(200).json({
        ...userExists.toJSON(),
        address: addr.toJSON(),
      });
    } catch (error) {
      await trx.rollback();
      return response.status(400).json({ msg: error.sqlMessage });
    }
  }

  async destroy({ params, request, response }) {}
}

module.exports = UserController;
