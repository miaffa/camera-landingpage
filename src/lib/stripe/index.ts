import stripeClient from 'stripe';

const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is not set");
  }
  return new stripeClient(apiKey);
};

export default getStripeClient;