// webhookService.ts
import type { IStorage } from "../storage";

// Tipos dos dados recebidos do webhook da Kiwify
export interface KiwifyWebhookData {
  purchase_id: string;
  customer_email: string;
  customer_name?: string;
  product_name?: string;
  product_id?: string;
  product_offer_id?: string;
  checkout_link?: string;
  value: number;
  status: string;
  raw?: unknown;
}

// Resultado padronizado do processamento
export interface PurchaseResult {
  success: boolean;
  message: string;
  creditsAdded?: number;
  creditsRemoved?: number;
  userId?: string;
  offerId?: string;
  purchaseId?: string;
}

// 🔗 Mapeamento de ofertas -> créditos
const offerCredits: Record<string, number> = {
  // Créditos avulsos
  "b25quAR": 100,
  "OHJeYkb": 200,
  "Ypa4tzr": 300,
  "iRNfqB9": 500,
  "zbugEDV": 1000,
  "LFJ342L": 2000,

  // Planos
  "jM0siPY": 500,    // Básico
  "q0rFdNB": 1500,   // Pro
  "KFXdvJv": 5000,   // Premium
};

// Extrai o melhor identificador da oferta
function resolveOfferId(data: KiwifyWebhookData): string | undefined {
  const id = (data.checkout_link || data.product_offer_id || "").trim();
  return id || undefined;
}

// Decide se o status deve conceder, reter ou remover créditos
function classifyStatus(status: string): "grant" | "hold" | "revoke" {
  const s = status.toLowerCase();

  if (["approved", "paid", "completed", "captured"].includes(s)) return "grant";
  if (["pending", "awaiting_payment", "in_process"].includes(s)) return "hold";
  if (["refunded", "chargeback", "canceled", "cancelled", "reversed"].includes(s)) return "revoke";

  return "hold";
}

// Serviço principal de processamento de compra
export async function handleKiwifyPurchase(
  data: KiwifyWebhookData,
  storage: IStorage
): Promise<PurchaseResult> {
  const offerId = resolveOfferId(data);
  const purchaseId = data.purchase_id;

  // ✅ Buscar usuário pelo e-mail
  const user = await storage.getUserByEmail(data.customer_email);
  if (!user) {
    return {
      success: false,
      message: "Usuário não encontrado para o e-mail informado",
      userId: data.customer_email,
      purchaseId,
    };
  }

  const userId = user.id; // ✅ agora usamos o UUID do usuário

  if (!offerId) {
    return {
      success: false,
      message: "OfferId ausente: checkout_link ou product_offer_id não enviados",
      userId,
      purchaseId,
    };
  }

  const credits = offerCredits[offerId] || 0;
  if (credits <= 0) {
    return {
      success: false,
      message: `Oferta não reconhecida: ${offerId}`,
      userId,
      offerId,
      purchaseId,
    };
  }

  const action = classifyStatus(data.status);

  try {
    const alreadyProcessed = await storage.hasProcessedPurchase(purchaseId);
    if (alreadyProcessed && action === "grant") {
      return {
        success: true,
        message: "Compra já processada anteriormente (idempotente)",
        creditsAdded: 0,
        userId,
        offerId,
        purchaseId,
      };
    }

    if (action === "grant") {
      await storage.addCredits(userId, credits);
      await storage.markPurchaseProcessed(purchaseId, userId);

      return {
        success: true,
        message: "Créditos adicionados com sucesso",
        creditsAdded: credits,
        userId,
        offerId,
        purchaseId,
      };
    }

    if (action === "revoke") {
      await storage.deductCredits(userId, credits);

      return {
        success: true,
        message: "Créditos removidos devido a reembolso/chargeback/cancelamento",
        creditsRemoved: credits,
        userId,
        offerId,
        purchaseId,
      };
    }

    return {
      success: true,
      message: "Status pendente — aguardando confirmação de pagamento",
      creditsAdded: 0,
      userId,
      offerId,
      purchaseId,
    };
  } catch (err) {
    console.error("Erro ao processar compra:", err);
    return {
      success: false,
      message: "Erro interno ao processar compra",
      userId,
      offerId,
      purchaseId,
    };
  }
}

// 🔐 Verificação de assinatura (placeholder)
export async function verifyKiwifySignature(payload: string, signature?: string): Promise<boolean> {
  return true;
}

// 🔽 Wrapper para compatibilidade antiga
export async function deductCredits(
  userId: string,
  amount: number,
  storage: IStorage,
  reason?: string
): Promise<PurchaseResult> {
  try {
    await storage.deductCredits(userId, amount);
    return {
      success: true,
      message: "Créditos removidos com sucesso",
      creditsRemoved: amount,
      userId,
    };
  } catch (err) {
    console.error("Erro ao remover créditos:", err);
    return { success: false, message: "Erro ao remover créditos", userId };
  }
}
