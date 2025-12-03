import { GoogleGenAI, Chat, Content } from "@google/genai";
import { getGeminiKeyRotator } from "../utils/apiKeyRotator";

export async function createChatService() {
  const rotator = getGeminiKeyRotator();
  const apiKey = rotator.getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  return {
    createChat(history?: Content[]): Chat {
      return ai.chats.create({
        model: "gemini-2.5-flash",
        history,
        config: {
          systemInstruction:
            "Você é Speak AI, um assistente de autoajuda compassivo e empático. Seu objetivo é fornecer um espaço seguro e sem julgamentos para que os usuários expressem seus sentimentos. Ouça com atenção, responda com cordialidade e compreensão e guie-os suavemente em direção ao autoconhecimento e bem-estar. Não dê conselhos médicos. Mantenha as respostas concisas sempre que possível.",
        },
      });
    },

    async sendMessage(chat: Chat, message: string) {
      const result = await chat.sendMessage({ message });
      return result;
    },

    async generateTitle(text: string): Promise<string> {
      return await rotator.executeWithRotation(async (apiKey) => {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `Analise a primeira mensagem de uma conversa e crie um título curto e temático (máximo 4 palavras). Mensagem do usuário: "${text}". Responda apenas com o título, sem nenhuma outra formatação ou texto.`,
        });
        return (response.text || "").trim().replace(/"/g, "") || text.split(" ").slice(0, 5).join(" ");
      }).catch((error) => {
        console.error("Failed to generate title:", error);
        return text.split(" ").slice(0, 5).join(" ");
      });
    },
  };
}
