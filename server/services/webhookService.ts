// webhookService.ts
import { IStorage } from "../storage";

// Tipos dos dados recebidos do webhook da Kiwify
export interface KiwifyWebhookData {
  purchase_id: string;            // ID do pedido/compra
  customer_email: string;         // email do comprador (chave do usuário)
  customer_name?: string;
  product_name?: string;
  product_id?: string;            // ID do produto principal (compartilhado entre ofertas)
  product_offer_id?: string;      // ID único da oferta
  checkout_link?: string;         // código do link de checkout (ex.: b25quAR)
  value: number;                  // valor cobrado
  status: "approved" | "pending" | "refunded" | "chargeback" | "canceled" | string;
  raw?: unknown;                  // payload original, se quiser logar
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
// IDs extraídos dos seus arquivos CreditsModal.tsx e PlansModal.tsx
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

// Extrai o melhor identificador da oferta (preferindo checkout_link)
function resolveOfferId(data: KiwifyWebhookData): string | undefined {
  // checkout_link normalmente carrega o código curto do link (ex.: b25quAR)
  const id = (data.checkout_link || data.product_offer_id || "").trim();
  return id || undefined;
}

// Decide se o status deve conceder, reter ou remover créditos
function classifyStatus(status: string): "grant" | "hold" | "revoke" {
  const s = status.toLowerCase();

  // Aprovado/pago: concede
  if (["approved", "paid", "completed", "captured"].includes(s)) return "grant";

  // Pendente/espera: não concede ainda
  if (["pending", "awaiting_payment", "in_process"].includes(s)) return "hold";

  // Reembolsos/chargeback/cancelados: revoga créditos
  if (["refunded", "chargeback", "canceled", "cancelled", "reversed"].includes(s)) return "revoke";

  // Padrão conservador: segurar
  return "hold";
}

// Serviço principal de processamento de compra
export async function handleKiwifyPurchase(
  data: KiwifyWebhookData,
  storage: IStorage
): Promise<PurchaseResult> {
  const offerId = resolveOfferId(data);
  const userId = data.customer_email;
  const purchaseId = data.purchase_id;

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
    // Idempotência básica: evita aplicar múltiplas vezes a mesma compra
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
      await storage.addCredits(userId, credits, {
        source: "kiwify",
        offerId,
        purchaseId,
        value: data.value,
      });
      await storage.markPurchaseProcessed(purchaseId);

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
      // Remove créditos previamente concedidos para essa compra (se aplicável)
      await storage.removeCredits(userId, credits, {
        source: "kiwify",
        offerId,
        purchaseId,
        reason: data.status,
      });

      return {
        success: true,
        message: "Créditos removidos devido a reembolso/chargeback/cancelamento",
        creditsRemoved: credits,
        userId,
        offerId,
        purchaseId,
      };
    }

    // hold: não concede ainda
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

// Exemplo de verificação de assinatura (placeholder)
export async function verifyKiwifySignature(payload: string, signature?: string): Promise<boolean> {
  // Implemente conforme sua secret/estratégia (HMAC, etc.)
  return true;
}
