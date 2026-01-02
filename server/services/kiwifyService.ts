import axios from "axios";

const KIWIFY_API_URL = "https://api.kiwify.com.br";

interface KiwifyUser {
  id: string;
  email: string;
  name: string;
  status: "active" | "inactive";
  products: string[];
}

export async function createKiwifyService() {
  const clientSecret = process.env.KIWIFY_CLIENT_SECRET;
  const clientId = process.env.KIWIFY_CLIENT_ID;
  const accountId = process.env.KIWIFY_ACCOUNT_ID;
  
  // Check if Kiwify credentials are configured
  const hasKiwifyConfig = clientSecret && clientId && accountId;

  if (!hasKiwifyConfig) {
    console.warn("⚠️ Kiwify credentials not fully configured. Using development mode.");
  }

  return {
    async validateCustomer(email: string, productId: string): Promise<boolean> {
      try {
        const response = await axios.get(`${KIWIFY_API_URL}/customers`, {
          headers: {
            Authorization: `Bearer ${clientSecret}`, // corrigido
          },
          params: { email },
        });

        if (!response.data?.data || response.data.data.length === 0) {
          return false;
        }

        const customer = response.data.data[0];
        
        if (customer.status !== "active") {
          return false;
        }

        // Check if customer purchased the product
        const hasPurchase = await this.checkPurchase(customer.id, productId);
        return hasPurchase;
      } catch (error) {
        console.error("🔥 Error validating customer with Kiwify:", error);
        throw new Error("Erro ao validar cliente");
      }
    },

    async checkPurchase(customerId: string, productId: string): Promise<boolean> {
      try {
        const response = await axios.get(
          `${KIWIFY_API_URL}/customers/${customerId}/purchases`,
          {
            headers: {
              Authorization: `Bearer ${clientSecret}`, // corrigido
            },
          }
        );

        if (!response.data?.data) {
          return false;
        }

        return response.data.data.some(
          (purchase: any) =>
            purchase.product_id === productId &&
            ["approved", "paid", "completed"].includes(purchase.status) // corrigido
        );
      } catch (error) {
        console.error("🔥 Error checking purchase:", error);
        return false;
      }
    },

    async hasAnyPurchase(email: string): Promise<boolean> {
      try {
        if (!hasKiwifyConfig) {
          // Dev mode fallback
          return email === "speakai.agency@gmail.com";
        }

        const response = await axios.get(`${KIWIFY_API_URL}/customers`, {
          headers: {
            Authorization: `Bearer ${clientSecret}`,
          },
          params: { email },
        });

        if (!response.data?.data || response.data.data.length === 0) {
          return false;
        }

        const customer = response.data.data[0];
        const purchasesResponse = await axios.get(
          `${KIWIFY_API_URL}/customers/${customer.id}/purchases`,
          {
            headers: {
              Authorization: `Bearer ${clientSecret}`,
            },
          }
        );

        if (!purchasesResponse.data?.data) {
          return false;
        }

        return purchasesResponse.data.data.some(
          (purchase: any) => ["approved", "paid", "completed"].includes(purchase.status)
        );
      } catch (error) {
        console.error("🔥 Error checking any purchase:", error);
        return false;
      }
    },

    async authenticateUser(email: string, password: string): Promise<KiwifyUser | null> {
      try {
        if (!hasKiwifyConfig) {
          // Development mode fallback
          if (email === "speakai.agency@gmail.com" && password === "Diamante2019@") {
            return {
              id: "dev-user-001",
              email,
              name: "Speak AI Admin",
              status: "active",
              products: [],
            };
          }
          return null;
        }

        // Kiwify API não valida senha diretamente
        // Apenas verifica se o cliente existe e está ativo
        const response = await axios.get(`${KIWIFY_API_URL}/customers`, {
          headers: {
            Authorization: `Bearer ${clientSecret}`,
          },
          params: { email },
        });

        if (!response.data?.data || response.data.data.length === 0) {
          return null;
        }

        const customer = response.data.data[0];

        if (customer.status === "active") {
          return {
            id: customer.id,
            email: customer.email,
            name: customer.name,
            status: customer.status,
            products: customer.products || [],
          };
        }
        return null;
      } catch (error) {
        console.error("🔥 Error authenticating user:", error);
        return null;
      }
    },
  };
}
