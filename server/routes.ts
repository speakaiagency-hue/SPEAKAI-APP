import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateVideo, type GenerateVideoParams } from "./services/geminiService";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Video Generation API
  app.post("/api/video/generate", async (req: Request, res: Response) => {
    try {
      const params: GenerateVideoParams = req.body;

      if (!params.prompt) {
        return res.status(400).json({ error: "Prompt é obrigatório" });
      }

      const result = await generateVideo(params);
      res.json(result);
    } catch (error) {
      console.error("Video generation error:", error);
      const message = error instanceof Error ? error.message : "Erro ao gerar vídeo";
      res.status(500).json({ error: message });
    }
  });

  return httpServer;
}
