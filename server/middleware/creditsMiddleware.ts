import type { Request, Response, NextFunction } from "express";
import { storage } from "../storage";

declare global {
  namespace Express {
    interface Request {
      userCredits?: number;
    }
  }
}

export async function creditsCheckMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      return res.status(401).json({ 
        error: "unauthorized", 
        message: "Usuário não autenticado" 
      });
    }

    const credits = await storage.getUserCredits(req.user.id);
    req.userCredits = credits?.credits ?? 0;

    if (req.userCredits <= 0) {
      console.warn(`⚠️ Usuário ${req.user.id} sem créditos`);
      return res.status(403).json({
        error: "insufficient_credits",
        message: "Você não tem créditos disponíveis. Compre mais créditos para continuar.",
        creditsRemaining: 0,
      });
    }

    // ➕ expõe créditos restantes para qualquer rota que venha depois
    res.locals.creditsRemaining = req.userCredits;

    next();
  } catch (error) {
    console.error(`🔥 Erro ao verificar créditos do usuário ${req.user?.id}:`, error);
    res.status(500).json({ 
      error: "server_error", 
      message: "Erro ao verificar créditos" 
    });
  }
}
