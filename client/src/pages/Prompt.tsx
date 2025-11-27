import { useState } from "react";
import { Copy, Save, Wand2, RefreshCw, CheckCircle2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export default function Prompt() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [qualityScore, setQualityScore] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const [formData, setFormData] = useState({
    topic: "",
    tone: "professional",
    details: "",
  });

  const handleGenerate = () => {
    if (!formData.topic) {
      toast({ title: "Por favor, digite o tema principal", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const prompt = `Atue como um especialista no assunto "${formData.topic}".
Tom de voz: ${formData.tone === 'professional' ? 'Profissional e Objetivo' : formData.tone === 'casual' ? 'Descontraído e Amigável' : 'Criativo e Inspirador'}.

Detalhes adicionais:
${formData.details || "Nenhum detalhe adicional fornecido."}

Estruture a resposta com:
1. Introdução clara
2. Pontos principais
3. Conclusão acionável`;
      
      setGeneratedPrompt(prompt);
      setQualityScore(Math.floor(Math.random() * 15) + 85);
      setIsGenerating(false);
      toast({ title: "Prompt gerado com sucesso!" });
    }, 1000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({ title: "Copiado!" });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold flex items-center gap-2">
            <span className="p-2 rounded-lg bg-orange-500/10 text-orange-500"><Wand2 className="w-6 h-6" /></span>
            Gerador de Prompt
          </h1>
          <p className="text-muted-foreground">Crie instruções claras para obter as melhores respostas da IA.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section - Simplified */}
        <Card className="border-border/50 shadow-lg bg-card/50 backdrop-blur-sm h-fit">
          <CardHeader>
            <CardTitle>O que você precisa?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic" className="text-base font-medium">Tema ou Assunto Principal</Label>
              <Input 
                id="topic" 
                placeholder="Ex: Marketing Digital, Receita de Bolo, Código Python..." 
                value={formData.topic}
                onChange={(e) => setFormData({...formData, topic: e.target.value})}
                className="py-6 text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Tom de Voz</Label>
              <Select 
                value={formData.tone} 
                onValueChange={(val) => setFormData({...formData, tone: val})}
              >
                <SelectTrigger className="py-6">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">🏢 Profissional & Sério</SelectItem>
                  <SelectItem value="casual">😊 Casual & Amigável</SelectItem>
                  <SelectItem value="creative">🎨 Criativo & Inovador</SelectItem>
                  <SelectItem value="academic">🎓 Acadêmico & Detalhado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center justify-between p-2 h-auto hover:bg-secondary/50">
                  <span className="text-sm font-medium text-muted-foreground">Opções Avançadas (Opcional)</span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-4 pt-4 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <Label>Detalhes Específicos / Restrições</Label>
                  <Textarea 
                    placeholder="Ex: O texto deve ter menos de 500 palavras, usar tópicos, focar em iniciantes..." 
                    className="h-24 resize-none"
                    value={formData.details}
                    onChange={(e) => setFormData({...formData, details: e.target.value})}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>

            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg shadow-orange-500/20 py-6 text-lg mt-2" 
              onClick={handleGenerate} 
              disabled={isGenerating}
            >
              {isGenerating ? <RefreshCw className="w-5 h-5 mr-2 animate-spin" /> : <Wand2 className="w-5 h-5 mr-2" />}
              Gerar Prompt
            </Button>
          </CardContent>
        </Card>

        {/* Output Section */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col border-border/50 shadow-lg bg-card/50 backdrop-blur-sm relative overflow-hidden min-h-[400px]">
             {qualityScore > 0 && (
              <div className="absolute top-0 right-0 p-4 z-10 animate-in fade-in zoom-in">
                <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20 px-3 py-1">
                  Qualidade: {qualityScore}/100
                </Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Resultado
                {generatedPrompt && <CheckCircle2 className="w-5 h-5 text-green-500 animate-in zoom-in" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {generatedPrompt ? (
                <div className="h-full flex flex-col gap-4 flex-1">
                  <div className="bg-secondary/30 p-6 rounded-xl border border-border/50 font-mono text-sm leading-relaxed whitespace-pre-wrap flex-1 shadow-inner">
                    {generatedPrompt}
                  </div>
                  <div className="flex gap-3">
                    <Button className="flex-1" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Texto
                    </Button>
                    <Button variant="secondary" size="icon">
                      <Save className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground flex-1 border-2 border-dashed border-border/50 rounded-xl bg-secondary/5 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-orange-500/50" />
                  </div>
                  <p className="text-lg font-medium text-foreground">Seu prompt aparecerá aqui</p>
                  <p className="text-sm opacity-70 max-w-xs mt-2">Preencha as informações ao lado e clique em Gerar para ver a mágica acontecer.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
