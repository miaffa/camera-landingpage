import DodoPayments from "dodopayments";

const getDodoPaymentsClient = () => {
  const apiKey = process.env.DODO_PAYMENTS_API_KEY;
  const apiUrl = process.env.DODO_PAYMENTS_API_URL;
  
  if (!apiKey || !apiUrl) {
    throw new Error("DODO_PAYMENTS_API_KEY and DODO_PAYMENTS_API_URL environment variables are required");
  }
  
  return new DodoPayments({
    baseURL: apiUrl,
    bearerToken: apiKey,
  });
};

export default getDodoPaymentsClient;
