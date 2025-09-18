import stripeClient from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new stripeClient(process.env.STRIPE_SECRET_KEY)
  : null;

export default stripe;