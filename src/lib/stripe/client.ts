import Stripe from 'stripe';

const getStripeClient = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(apiKey, {
    apiVersion: '2024-06-20',
  });
};

export { getStripeClient };
