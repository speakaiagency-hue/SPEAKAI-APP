import { useState } from "react";
import { Image as ImageIcon, Download, Maximize2, RefreshCw, Layers, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function ImagePage() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  // Mock images for demo
  const mockImages = [
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    "https://images.unsplash.com/photo-1614728853913-1e221134d341?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  ];

  const handleGenerate = () => {
    if (!prompt) {
      toast({ title: "Digite um prompt primeiro", variant: "destructive" });
      return;
    }
    
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => {
      // Shuffle mock images to simulate new generation
      const shuffled = [...mockImages].sort(() => 0.5 - Math.random());
      setGeneratedImages(shuffled);
      setIsGenerating(false);
      toast({ title: "Imagens geradas com sucesso!" });
    }, 2000);
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <span className="p-2 rounded-lg bg-purple-500/10 text-purple-500"><ImageIcon className="w-6 h-6" /></span>
            Geração de Imagem
          </h1>
          <p className="text-muted-foreground">Transforme suas ideias em arte visual.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar Controls */}
        <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm h-fit lg:col-span-1">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label>Prompt</Label>
              <div className="relative">
                <Input 
                  className="pr-10" 
                  placeholder="Descreva a imagem..." 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Wand2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Estilo</Label>
              <Select defaultValue="realistic">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realistic">Fotorealista</SelectItem>
                  <SelectItem value="anime">Anime / Manga</SelectItem>
                  <SelectItem value="3d">3D Render</SelectItem>
                  <SelectItem value="oil">Pintura a Óleo</SelectItem>
                  <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Formato</Label>
                <Select defaultValue="1:1">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1:1">Quadrado (1:1)</SelectItem>
                    <SelectItem value="16:9">Paisagem (16:9)</SelectItem>
                    <SelectItem value="9:16">Retrato (9:16)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Qtd.</Label>
                <Select defaultValue="4">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Imagem</SelectItem>
                    <SelectItem value="2">2 Imagens</SelectItem>
                    <SelectItem value="4">4 Imagens</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between">
                <Label>Guidance Scale</Label>
                <span className="text-xs text-muted-foreground">7.5</span>
              </div>
              <Slider defaultValue={[7.5]} max={20} step={0.5} />
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg shadow-purple-500/20 py-6 text-lg"
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Gerando...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5 mr-2" /> Gerar Arte
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Gallery Area */}
        <div className="lg:col-span-2 space-y-6">
          {generatedImages.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-700">
              {generatedImages.map((src, i) => (
                <div key={i} className="group relative aspect-square rounded-xl overflow-hidden border border-border/50 shadow-md bg-secondary/20">
                  <img src={src} alt={`Generated ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 backdrop-blur-sm">
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Maximize2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="rounded-full">
                      <Layers className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-secondary/5 text-muted-foreground">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4 animate-pulse">
                <ImageIcon className="w-10 h-10 opacity-50" />
              </div>
              <p className="text-lg font-medium">Sua galeria está vazia</p>
              <p className="text-sm opacity-70">Configure os parâmetros e clique em Gerar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
