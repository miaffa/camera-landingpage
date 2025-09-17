import { PlanProvider } from "@/lib/plans/getSubscribeUrl";
import SuccessRedirector from "./SuccessRedirector";
import client from "@/lib/dodopayments/client";
import ErrorRedirector from "./ErrorRedirector";

export default async function SubscribeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{
    session_id?: string; // STRIPE
    provider: PlanProvider;
    subscription_id?: string; // DODO
    status?: string; // DODO
    payment_id?: string; // DODO
  }>;
}) {
  const { provider, subscription_id, payment_id } = await searchParams;

  switch (provider) {
    case PlanProvider.DODO:
      // Check if subscription is active
      if (subscription_id) {
        // Subscription Case
        try {
          const dodoClient = client();
          if (!dodoClient) {
            console.error("DodoPayments client not configured");
            return <ErrorRedirector />;
          }
          const subscription = await dodoClient.subscriptions.retrieve(
            subscription_id
          );
          if (subscription.status !== "active") {
            return <ErrorRedirector />;
          }
        } catch (error) {
          console.error("DodoPayments error:", error);
          return <ErrorRedirector />;
        }
      }
      // Payment Case
      if (payment_id) {
        try {
          const dodoClient = client();
          if (!dodoClient) {
            console.error("DodoPayments client not configured");
            return <ErrorRedirector />;
          }
          const payment = await dodoClient.payments.retrieve(payment_id);
          if (payment.status !== "succeeded") {
            return <ErrorRedirector />;
          }
        } catch (error) {
          console.error("DodoPayments error:", error);
          return <ErrorRedirector />;
        }
      }
      break;
  }

  return <SuccessRedirector />;
}
