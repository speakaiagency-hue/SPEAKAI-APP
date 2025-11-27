import { useState } from "react";
import { Video, Clapperboard, Film, Upload, FileImage, Type, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function VideoPage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [activeTab, setActiveTab] = useState("text-to-video");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const handleGenerate = () => {
    if (activeTab === "image-to-video" && !uploadedImage) {
      toast({ title: "Por favor, faça upload de uma imagem", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    // Simulate video generation
    setTimeout(() => {
      setVideoUrl("https://assets.mixkit.co/videos/preview/mixkit-waves-in-the-water-1164-large.mp4");
      setIsGenerating(false);
      toast({ title: "Vídeo gerado com sucesso!" });
    }, 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedImage(url);
      toast({ title: "Imagem carregada com sucesso!" });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <span className="p-2 rounded-lg bg-red-500/10 text-red-500"><Video className="w-6 h-6" /></span>
            Geração de Vídeo
          </h1>
          <p className="text-muted-foreground">Crie vídeos cinematográficos usando IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <Card className="lg:col-span-4 border-border/50 shadow-lg bg-card/50 backdrop-blur-sm h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clapperboard className="w-5 h-5" /> Configuração
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="text-to-video" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="text-to-video" className="gap-2"><Type className="w-4 h-4" /> Texto</TabsTrigger>
                <TabsTrigger value="image-to-video" className="gap-2"><FileImage className="w-4 h-4" /> Imagem</TabsTrigger>
              </TabsList>

              <TabsContent value="text-to-video" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Descreva seu vídeo</Label>
                  <Textarea 
                    placeholder="Um drone voando sobre uma cidade futurista cyberpunk à noite, luzes neon, chuva caindo..." 
                    className="h-32 resize-none bg-secondary/20"
                  />
                </div>
              </TabsContent>

              <TabsContent value="image-to-video" className="space-y-4 mt-0">
                <div className="space-y-2">
                  <Label>Imagem de Referência</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 hover:bg-secondary/20 transition-colors relative group cursor-pointer text-center">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {uploadedImage ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                        <img src={uploadedImage} alt="Upload" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> Trocar Imagem</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 py-4">
                        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-2">
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">Clique ou arraste uma imagem</p>
                        <p className="text-xs text-muted-foreground">PNG, JPG até 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Instruções de Animação (Opcional)</Label>
                  <Textarea 
                    placeholder="Faça as ondas do mar se moverem suavemente..." 
                    className="h-20 resize-none bg-secondary/20"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="grid grid-cols-2 gap-4 pt-2">
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

            <Button 
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-bold shadow-lg shadow-red-500/20 py-6"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Renderizando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <PlayCircle className="w-5 h-5" />
                  Gerar Vídeo
                </span>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Preview Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-border/50 shadow-2xl relative group ring-1 ring-white/10">
            {videoUrl ? (
              <video 
                src={videoUrl} 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                loop 
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-secondary/10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-secondary/20 to-background">
                {isGenerating ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-spin" />
                      <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <Film className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-lg font-medium text-foreground animate-pulse">Criando sua obra-prima...</p>
                      <p className="text-sm text-muted-foreground">Isso pode levar alguns segundos</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4 p-6">
                    <div className="w-24 h-24 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-2 border border-white/5">
                      <Film className="w-10 h-10 opacity-30" />
                    </div>
                    <div>
                      <p className="text-xl font-medium text-foreground">Preview do Vídeo</p>
                      <p className="text-sm opacity-60 max-w-md mx-auto mt-2">
                        Seu vídeo gerado aparecerá aqui em alta definição. Configure os parâmetros ao lado para começar.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Storyboard Preview (Mock) */}
          <div>
            <Label className="mb-3 block text-muted-foreground">Storyboard (Preview dos Frames)</Label>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((frame) => (
                <div key={frame} className="aspect-video rounded-lg bg-secondary/30 border border-border/50 flex items-center justify-center group hover:border-primary/50 transition-colors cursor-pointer">
                  <span className="text-xs text-muted-foreground group-hover:text-primary">Frame {frame}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
