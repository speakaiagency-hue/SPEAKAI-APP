import { useState } from "react";
import { Video, Clapperboard, Play, Download, Film, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function VideoPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  
  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate video generation
    setTimeout(() => {
      setVideoUrl("https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4");
      setIsGenerating(false);
      toast({ title: "Vídeo gerado com sucesso!" });
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-500/10 text-red-500"><Video className="w-6 h-6" /></span>
            Geração de Vídeo
          </h1>
          <p className="text-muted-foreground">Crie vídeos cinematográficos a partir de texto.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <Card className="lg:col-span-4 border-border/50 shadow-lg bg-card/50 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5" /> Configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Prompt do Vídeo</Label>
              <Textarea 
                placeholder="Um drone voando sobre uma cidade futurista cyberpunk à noite, luzes neon, chuva caindo..." 
                className="h-32 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duração</Label>
                <Select defaultValue="4s">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2s">2 segundos</SelectItem>
                    <SelectItem value="4s">4 segundos</SelectItem>
                    <SelectItem value="8s">8 segundos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Resolução</Label>
                <Select defaultValue="1080p">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="720p">720p HD</SelectItem>
                    <SelectItem value="1080p">1080p FHD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Movimento da Câmera</Label>
              <Select defaultValue="pan">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="static">Estático</SelectItem>
                  <SelectItem value="pan">Panorâmica</SelectItem>
                  <SelectItem value="zoom">Zoom In</SelectItem>
                  <SelectItem value="dolly">Dolly Shot</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold shadow-lg shadow-red-500/20 py-6"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? "Renderizando..." : "Gerar Vídeo"}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-border/50 shadow-2xl relative group">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                loop 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-secondary/10">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="animate-pulse font-mono">Gerando frames...</p>
                  </div>
                ) : (
                  <>
                    <Film className="w-16 h-16 opacity-20 mb-4" />
                    <p>O preview do vídeo aparecerá aqui</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Storyboard Preview (Mock) */}
          <div className="grid grid-cols-4 gap-4">
             {[1, 2, 3, 4].map((frame) => (
               <div key={frame} className="aspect-video rounded-lg bg-secondary/30 border border-border/50 flex items-center justify-center text-xs text-muted-foreground">
                 Frame {frame}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
