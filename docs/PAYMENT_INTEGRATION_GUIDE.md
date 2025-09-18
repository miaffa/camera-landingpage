# Payment Integration Guide 💳

## Currently Commented Out

The following payment-related files are commented out to allow deployment without payment setup:

### Webhook Routes (commented out):
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/api/webhooks/dodo/route.ts` 
- `src/app/api/webhooks/paypal/route.ts`

## To Enable Payment Integrations Later:

### 1. **Stripe Integration**
1. Uncomment `src/app/api/webhooks/stripe/route.ts`
2. Set environment variables:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_WEBHOOK_SECRET`
3. Configure webhook endpoint in Stripe dashboard

### 2. **DodoPayments Integration**
1. Uncomment `src/app/api/webhooks/dodo/route.ts`
2. Set environment variables:
   - `DODO_PAYMENTS_API_URL`
   - `DODO_PAYMENTS_API_KEY`
3. Configure webhook endpoint in DodoPayments dashboard

### 3. **PayPal Integration**
1. Uncomment `src/app/api/webhooks/paypal/route.ts`
2. Set environment variables:
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
   - `PAYPAL_WEBHOOK_ID`
3. Configure webhook endpoint in PayPal dashboard

## How to Uncomment:

1. **Remove the comment blocks:**
   - Delete `// COMMENTED OUT - [Service] webhook route (uncomment when [Service] is configured)`
   - Delete `/*` at the start
   - Delete `*/` at the end

2. **Remove placeholder routes:**
   - Delete the placeholder `export const POST = async () => { ... }` functions

3. **Restore original functionality:**
   - The original webhook handlers will be restored

## Current Status:

✅ **App deploys successfully without payment setup**
✅ **All payment features show appropriate "not configured" messages**
✅ **Ready to add payment integrations when needed**

## Testing:

- Webhook endpoints currently return 404 with "not configured" message
- Payment flows redirect to error pages with helpful messages
- App works perfectly for development and basic functionality
