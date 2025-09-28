import stripeClient from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new stripeClient(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  : null;

export default stripe;