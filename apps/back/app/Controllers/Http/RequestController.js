"use strict";
const Request = use("App/Models/Request");
const Day = use("App/Models/Day");
const ProviderAvailability = use("App/Models/ProviderAvailability");
class RequestController {
  async index({ request, response, auth }) {
    const { as } = request.get();

    const { id } = await auth.getUser();

    if (as === "customer") {
      const requests = await Request.query()
        .where("customer_id", id)
        .with("provider.addresses")
        .with("providerAvailability.day")
        .fetch();
      return response.json(requests);
    }

    if (as === "provider") {
      const requests = await Request.query()
        .where("post_provider_id", id)
        .with("customer.addresses")
        .with("providerAvailability.day")
        .fetch();
      return response.json(requests);
    }

    return response.json(await Request.all());
  }

  async store({ request, response, auth }) {
    const { post_provider_id } = request.all();
    const { id: customer_id } = await auth.getUser();

    const getOpenRequests = await Request.query()
      .where({
        post_provider_id,
        customer_id,
        provider_accepted: false,
      })
      .fetch();

    const isAlreadyOpenRequest = getOpenRequests.toJSON();

    if (customer_id === post_provider_id) {
      return response
        .status(400)
        .json({ msg: "customer and provider are the same users" });
    }

    if (isAlreadyOpenRequest.length > 0) {
      return response
        .status(403)
        .json({ msg: "there is already an open request with this provider" });
    }

    try {
      const req = await Request.create({ customer_id, post_provider_id });
      return response.status(200).json(req);
    } catch (error) {
      return response.status(400).json({ msg: error.sqlMessage });
    }
  }

  async update({ request, response, auth, params }) {
    const { id } = params;
    const { id: user_id } = await auth.getUser();
    const { action } = request.get();

    const req = await Request.findOrFail(id);

    if (action === "accept") {
      if (req.post_provider_id !== user_id) {
        return response
          .status(401)
          .json({ msg: "you aren't the provider of the request" });
      }

      const { service_price, provider_availability } = request.post();

      if (!service_price)
        return response
          .status(400)
          .json({ msg: "provide the price of service" });

      req.service_price = service_price;
      req.provider_accepted = true;

      for (const key in provider_availability) {
        const day = await Day.query().where({ weekday_name: key }).first();

        await ProviderAvailability.create({
          day_id: day.id,
          request_id: id,
          start_time: provider_availability[key].from,
          end_time: provider_availability[key].to,
          available: provider_availability[key].available,
        });
      }

      const updated = await req.save();

      return response.status(200).json(updated);
    }

    if (action === "hire_provider") {
      if (req.customer_id !== user_id) {
        return response
          .status(401)
          .json({ msg: "you aren't the owner of this order" });
      }

      req.customer_confirmed = true;

      const updated = await req.save();

      return response.status(200).json(updated);
    }

    if (action === "has_arrived") {
      if (req.post_provider_id !== user_id) {
        return response
          .status(401)
          .json({ msg: "you aren't the provider of the request" });
      }

      req.has_arrived = true;

      const updated = await req.save();

      return response.status(200).json(updated);
    }

    if (action === "refuse") {
      if (req.post_provider_id === user_id || req.customer_id === user_id) {
        req.delete();

        return response.status(204).json({});
      }

      return response
        .status(401)
        .json({ msg: "you aren't related to this order" });
    }

    return response.json({ id, action, req });
  }
}

module.exports = RequestController;
