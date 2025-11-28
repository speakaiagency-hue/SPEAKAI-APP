import type { Express, Request, Response } from "express";
import { handleKiwifyPurchase, verifyKiwifySignature, KiwifyWebhookData, deductCredits } from "../services/webhookService";
import { authMiddleware } from "../middleware/authMiddleware";

export async function registerWebhookRoutes(app: Express) {
  // Kiwify Webhook Endpoint
  app.post("/api/webhook/kiwify", async (req: Request, res: Response) => {
    try {
      const signature = req.headers["x-kiwify-signature"] as string;
      const payload = JSON.stringify(req.body);

      if (signature && process.env.KIWIFY_WEBHOOK_SECRET) {
        const isValid = await verifyKiwifySignature(payload, signature);
        if (!isValid) {
          console.warn("Invalid Kiwify webhook signature");
        }
      }

      const webhookData: KiwifyWebhookData = {
        purchase_id: req.body.purchase_id || req.body.id,
        customer_email: req.body.customer?.email || req.body.email,
        customer_name: req.body.customer?.name || req.body.name,
        product_name: req.body.product?.name || req.body.product_name,
        product_id: req.body.product?.id || req.body.product_id,
        value: parseFloat(req.body.value || req.body.total || "0"),
        status: req.body.status || "approved",
      };

      const result = await handleKiwifyPurchase(webhookData);

      if (result.success) {
        return res.status(200).json({
          success: true,
          message: result.message,
          userId: result.userId,
          creditsAdded: result.creditsAdded,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: result.message,
        });
      }
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({
        success: false,
        message: "Erro ao processar webhook",
      });
    }
  });

  // Get user credits endpoint
  app.get("/api/credits/balance", authMiddleware, async (req: Request, res: Response) => {
    try {
      const userCredits = req.userCredits || 0;
      res.json({ credits: userCredits });
    } catch (error) {
      res.status(500).json({ error: "Erro ao buscar saldo de créditos" });
    }
  });
}
