"use strict";

const { default: createStrapi } = require("strapi");

const stripe = require("stripe")(
  "sk_test_51IRmFhFIr861NSk66Irc8Cm6RcdAcJhGPdzEMeGIUTuctyuZavqm1ukPx7eXDHmamKvu49I9U80E7YyJTfqY6fQI00BZmphtP5"
);

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const { token, products, idUser, addressShipping } = ctx.request.body;
    let totalPayment = 0;
    products.forEach((product) => {
      totalPayment = totalPayment + product.price;
    });

    const charge = await stripe.charges.create({
      amount: totalPayment * 100,
      currency: "ars",
      source: token.id,
      description: `ID Usuario: ${idUser}`,
    });
    const createOrder = [];
    for await (const product of products) {
      const data = {
        game: product.id,
        users_permissions_user: idUser,
        totalPayment,
        idPayment: charge.id,
        addressShipping,
      };
      const validData = await strapi.entityValidator.validateEntityCreation(
        strapi.models.order,
        data
      );
      const entry = await strapi.query("order").create(validData);
      createOrder.push(entry);
    }
    return createOrder;
  },
};
