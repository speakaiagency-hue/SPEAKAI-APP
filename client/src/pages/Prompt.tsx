import { useState } from "react";
import { Copy, Save, Wand2, RefreshCw, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Prompt() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [qualityScore, setQualityScore] = useState(0);
  
  const [formData, setFormData] = useState({
    objective: "",
    audience: "",
    tone: "professional",
    format: "text",
    constraints: "",
  });

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const prompt = `Atue como um especialista em ${formData.objective || "assunto geral"}. 
Escreva um conteúdo focado em ${formData.audience || "público geral"} com um tom ${formData.tone}.
Formato desejado: ${formData.format}.
Restrições importantes: ${formData.constraints || "Nenhuma"}.
      
Use uma estrutura clara, linguagem envolvente e garanta que o resultado seja prático e acionável.`;
      
      setGeneratedPrompt(prompt);
      setQualityScore(Math.floor(Math.random() * 20) + 80); // Random score 80-100
      setIsGenerating(false);
      toast({ title: "Prompt gerado com sucesso!" });
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({ title: "Copiado para a área de transferência" });
  };

  const handleRefine = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedPrompt((prev) => "PROMPT REFINADO: \n\n" + prev + "\n\n[Adicionado instruções de cadeia de pensamento e exemplos few-shot para melhor performance]");
      setQualityScore(98);
      setIsGenerating(false);
      toast({ title: "Prompt refinado para máxima qualidade" });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><Wand2 className="w-6 h-6" /></span>
            Gerador de Prompt
          </h1>
          <p className="text-muted-foreground">Crie prompts perfeitos para qualquer modelo de IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Configuração</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Template</Label>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-secondary/50">
                  <TabsTrigger value="general">Geral</TabsTrigger>
                  <TabsTrigger value="coding">Coding</TabsTrigger>
                  <TabsTrigger value="marketing">Mkt</TabsTrigger>
                  <TabsTrigger value="academic">Acadêmico</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <Label htmlFor="objective">Objetivo Principal</Label>
              <Input 
                id="objective" 
                placeholder="Ex: Criar um post para LinkedIn sobre produtividade" 
                value={formData.objective}
                onChange={(e) => setFormData({...formData, objective: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Público Alvo</Label>
                <Input 
                  placeholder="Ex: Desenvolvedores Junior" 
                  value={formData.audience}
                  onChange={(e) => setFormData({...formData, audience: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Tom de Voz</Label>
                <Select 
                  value={formData.tone} 
                  onValueChange={(val) => setFormData({...formData, tone: val})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Profissional</SelectItem>
                    <SelectItem value="casual">Casual / Amigável</SelectItem>
                    <SelectItem value="technical">Técnico</SelectItem>
                    <SelectItem value="persuasive">Persuasivo</SelectItem>
                    <SelectItem value="humorous">Bem-humorado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Restrições e Regras</Label>
              <Textarea 
                placeholder="Ex: Máximo de 200 palavras, não usar gírias, usar bullet points." 
                className="h-24 resize-none"
                value={formData.constraints}
                onChange={(e) => setFormData({...formData, constraints: e.target.value})}
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-500/20" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
              Gerar Prompt Otimizado
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="h-full flex flex-col border-border/50 shadow-lg bg-card/50 backdrop-blur-sm relative overflow-hidden">
             {qualityScore > 0 && (
              <div className="absolute top-0 right-0 p-4 z-10">
                <Badge variant={qualityScore > 90 ? "default" : "secondary"} className={qualityScore > 90 ? "bg-green-500 hover:bg-green-600" : ""}>
                  Score: {qualityScore}/100
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Resultado
                {generatedPrompt && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {generatedPrompt ? (
                <div className="h-full flex flex-col gap-4">
                  <div className="bg-secondary/30 p-4 rounded-xl border border-border/50 font-mono text-sm leading-relaxed whitespace-pre-wrap flex-1 min-h-[300px]">
                    {generatedPrompt}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={handleRefine}>
                      <Sparkles className="w-4 h-4 mr-2 text-yellow-500" />
                      Refinar (IA)
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground min-h-[300px] border-2 border-dashed border-border/50 rounded-xl">
                  <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                  <p>Preencha o formulário e gere seu prompt</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
