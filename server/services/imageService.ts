import { GoogleGenAI } from "@google/genai";
import { getGeminiKeyRotator } from "../utils/apiKeyRotator";

export async function createImageService() {
  const rotator = getGeminiKeyRotator();

  return {
    async generateImage(
      prompt: string,
      aspectRatio: string = "1:1",
      inputImage?: { data: string; mimeType: string }
    ): Promise<{ imageUrl: string; model: string }> {
      return await rotator.executeWithRotation(async (apiKey) => {
        const ai = new GoogleGenAI({ apiKey });

        const parts: any[] = [];

        if (inputImage) {
          // Modo edição: envia a imagem primeiro
          parts.push({
            inlineData: {
              data: inputImage.data,
              mimeType: inputImage.mimeType,
            },
          });

          const refinedPrompt = prompt
            ? `Edite esta imagem seguindo esta instrução: ${prompt}. Preserve as características principais e o realismo.`
            : "Melhore a qualidade desta imagem mantendo os elementos originais.";

          parts.push({ text: refinedPrompt });
        } else {
          // Modo geração: só texto
          parts.push({ text: prompt || "Uma arte digital cinematográfica e detalhada" });
        }

        const geminiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: { parts },
          config: {
            imageConfig: { aspectRatio },
          },
        });

        if (
          geminiResponse.candidates &&
          geminiResponse.candidates[0] &&
          geminiResponse.candidates[0].content &&
          geminiResponse.candidates[0].content.parts
        ) {
          for (const part of geminiResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64EncodeString: string = part.inlineData.data || "";
              const mimeType = part.inlineData.mimeType;
              return {
                imageUrl: `data:${mimeType};base64,${base64EncodeString}`,
                model: "Gemini Flash",
              };
            }
          }
        }

        throw new Error("A resposta da API não continha uma imagem.");
      });
    },
  };
}
