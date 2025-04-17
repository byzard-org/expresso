const AppService = require("..");

/**
 * Service for managing stripe payment and subscriptions
 */
class PaymentService {
  static #config = AppService.config;

  static stripe = this.#config.stripeSecretKey
    ? require("stripe")(this.#config.stripeSecretKey)
    : null;

  /**
   * Creates a Stripe customer for the given user.
   *
   * @param {Object} user - The user object for which to create a Stripe customer.
   * @param {string} user.email - The email of the user.
   * @param {string} user.name - The name of the user.
   *
   * @returns {Promise<Object>} - The created Stripe customer object.
   */
  static async createStripeCustomer(user) {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
    });

    user.stripeId = customer.id;

    await user.save();

    return customer;
  }

  /**
   * Enhances a user object with Stripe-related details, including subscriptions and activity status.
   *
   * @param {Object} user - The user object to enhance.
   * @param {string} [user.stripeId] - The Stripe customer ID of the user.
   * @param {string} user.email - The email address of the user.
   * @param {string} user.name - The name of the user.
   *
   * @returns {Promise<Object>} A promise that resolves to an enhanced user object.
   * The returned object contains:
   * - `subscriptions` {Array<Object>} List of active or canceled subscriptions with details.
   * - `hasActiveSubscriptions` {boolean} Indicates if the user has active subscriptions.
   *
   * Each subscription includes:
   * - `id` {string} Subscription ID.
   * - `items` {Array<Object>} List of subscription items with:
   *   - `priceId` {string} The Stripe price ID.
   *   - `productId` {string} The Stripe product ID.
   *   - `productName` {string} The name of the product.
   *   - `productDescription` {string} The description of the product.
   * - `subStart` {Object} Details of the subscription start date:
   *   - `strFull` {string} Full formatted date.
   *   - `strDate` {string} Date without time.
   *   - `strDateWithDay` {string} Date with day.
   *   - `strDateWithTime` {string} Date with time.
   *   - `date` {Date} JavaScript Date object.
   * - `subEnd` {Object} Details of the subscription end date (same structure as `subStart`).
   *
   * @throws Will throw an error if there are issues with Stripe API calls or date processing.
   */
  static async userWithStripe(user) {

    const stripeId =
      user.stripeId ?? (await this.createStripeCustomer(user)).id;

    const stripeUser = Object.assign(user);

    const subscriptions = (
      await this.stripe.subscriptions.list({
        customer: stripeId,
        status: "all",
      })
    ).data;

    stripeUser.subscriptions = [];
    stripeUser.hasActiveSubscriptions = false;

    // all active subs and canceled but not ended
    const actives = subscriptions.filter(
      (sub) =>
        sub.status === "active" ||
        (sub.status === "canceled" &&
          sub.current_period_end * 1000 > Date.now())
    );

    for (const sub of actives) {
      const s = {
        id: sub.id,
        items: [],
      };

      /**
       *
       * @param {number} stamp Timestamp to convert
       * @returns Object with strings date
       */
      function dateObject(stamp) {
        return {
          strFull: strDate(stamp, true, true),
          strDate: strDate(stamp),
          strDateWithDay: strDate(stamp, true),
          strDateWithTime: strDate(stamp, false, true),
          date: dateFromStamp(stamp),
        };
      }

      const subEndTimestamp = sub.current_period_end * 1000;
      const subStartTimestamp = sub.current_period_start * 1000;

      s.subStart = dateObject(subStartTimestamp);
      s.subEnd = dateObject(subEndTimestamp);

      for (const item of sub.items.data) {
        const priceId = item.price.id;
        const productId = item.price.product;
        const product = await this.stripe.products.retrieve(
          productId
        );
        const productName = product.name;
        const productDescription = product.description;

        const obj = { priceId, productId, productDescription, productName };
        s.items.push(obj);
      }

      stripeUser.subscriptions.push(s);
    }

    stripeUser.hasActiveSubscriptions = actives.length > 0;
    
    return stripeUser;
  }
}

module.exports = PaymentService;
