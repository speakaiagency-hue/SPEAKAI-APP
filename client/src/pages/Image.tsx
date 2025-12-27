import { useState, useRef } from "react";
import { Image as ImageIcon, Download, Maximize2, RefreshCw, Upload, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { getAuthHeader } from "@/lib/auth";
import { withMembershipCheck } from "@/components/ProtectedGenerator";

const IMAGE_COST = 7;

function ImagePageComponent() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState("16:9");

  // Upload de imagem
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageData, setUploadedImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(",")[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const base64 = await fileToBase64(file);
      setUploadedImage(URL.createObjectURL(file));
      setUploadedImageData({ base64, mimeType: file.type });
      toast({ title: "Imagem carregada com sucesso!" });
    } catch {
      toast({ title: "Erro ao carregar imagem", variant: "destructive" });
    }
  };

  const clearImage = () => {
    setUploadedImage(null);
    setUploadedImageData(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleGenerate = async () => {
    if (!prompt.trim() && !uploadedImageData) {
      toast({ title: "Digite um prompt ou envie uma imagem", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const payload: any = {
        prompt: prompt.trim() || null,
        aspectRatio,
      };

      if (uploadedImageData) {
        payload.imageBase64 = uploadedImageData.base64;
        payload.imageMimeType = uploadedImageData.mimeType;
      }

      const response = await fetch("/api/image/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === "insufficient_credits") {
          throw new Error("Créditos insuficientes. Compre mais para continuar.");
        }
        throw new Error(error.error || "Erro ao gerar imagem");
      }

      const result = await response.json();
      console.log("API result:", result);

      if (Array.isArray(result.images)) {
        setGeneratedImages(result.images);
      } else if (result.imageUrl) {
        setGeneratedImages([result.imageUrl]);
      } else if (result.url) {
        setGeneratedImages([result.url]);
      } else {
        throw new Error("Resposta da API não contém URL da imagem.");
      }

      toast({ title: "Imagem gerada com sucesso!" });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro inesperado.";
      toast({ title: errorMessage, variant: "destructive" });
      console.error("Image generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col items-center text-center gap-2 mb-8">
        <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
          <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
            <ImageIcon className="w-6 h-6" />
          </span>
          Geração de Imagem
        </h1>
        <p className="text-muted-foreground">
          Crie imagens a partir de texto ou edite uma foto enviada.
        </p>
      </div>

      {/* Upload de imagem */}
      <div className="space-y-4">
        {uploadedImage ? (
          <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-indigo-500/30">
            <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover" />
            <button
              onClick={clearImage}
              className="absolute top-3 right-3 p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white shadow-xl"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all flex flex-col items-center justify-center gap-3"
          >
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-slate-400">Subir foto para edição</span>
          </button>
        )}
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
      </div>

      {/* Prompt + Aspect ratio + Botão */}
      <div className="space-y-4">
        <div className="bg-[#0f1117] p-1 rounded-xl border border-[#1f2937] shadow-2xl">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              uploadedImage
                ? "O que você quer mudar? Ex: 'Troque a cor da camisa para azul'"
                : "Descreva o que você quer criar..."
            }
            className="min-h-[240px] w-full bg-[#0f1117] border-none resize-none text-lg p-6 focus-visible:ring-0 placeholder:text-muted-foreground/40"
            maxLength={2000}
          />

          <div className="flex items-end justify-between px-6 pb-4">
            <div className="flex items-center gap-2 bg-[#0f1117]">
              {["16:9", "9:16", "1:1"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-sm font-medium transition-all border",
                    aspectRatio === ratio
                      ? "bg-[#6366f1] text-white border-[#6366f1]"
                      : "bg-[#1a1d24] text-gray-400 border-[#2d3748] hover:bg-[#2d3748]"
                  )}
                >
                  {ratio}
                </button>
              ))}
            </div>
            <div className="text-xs text-muted-foreground font-mono">{prompt.length}/2000</div>
          </div>
        </div>

        <Button
          className="w-full bg-[#6d28d9] hover:bg-[#5b21b6] text-white font-bold h-16 rounded-xl text-xl shadow-lg shadow-purple-900/20 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-3"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <RefreshCw className="w-6 h-6 animate-spin" /> Gerando...
            </span>
          ) : (
            <>
              <span className="text-sm font-semibold px-2 py-1 rounded bg-white/20 border border-white/30">
                {IMAGE_COST} ⚡
              </span>
              <span>{uploadedImage ? "Aplicar Mudanças" : "Gerar Imagem"}</span>
            </>
          )}
        </Button>
      </div>

      {/* Gallery */}
      {generatedImages.length > 0 && (
        <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-8 duration
