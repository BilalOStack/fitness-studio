import Stripe from 'stripe';

/**
 * Returns a configured Stripe instance using STRIPE_SECRET_KEY from environment variables.
 */
export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not defined in environment variables (.env.local). Please add your Stripe Test Secret Key (sk_test_...).'
    );
  }
  return new Stripe(secretKey);
}
