import DodoPayments from "dodopayments";

let client: DodoPayments | null = null;

const getClient = () => {
  if (!client) {
    const apiUrl = process.env.DODO_PAYMENTS_API_URL;
    const apiKey = process.env.DODO_PAYMENTS_API_KEY;
    
    if (!apiUrl || !apiKey) {
      console.warn("DodoPayments API credentials not configured - returning null client");
      return null;
    }
    
    client = new DodoPayments({
      baseURL: apiUrl,
      bearerToken: apiKey,
    });
  }
  
  return client;
};

export default getClient;
