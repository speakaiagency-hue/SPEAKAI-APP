import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface PlansModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    id: "basico",
    name: "Básico",
    price: "R$ 29,90",
    period: "/mês",
    description: "Perfeito para iniciantes",
    features: [
      "Chat IA ilimitado",
      "Gerador de Prompt básico",
      "5 gerações de imagem/mês",
      "Suporte por email",
    ],
    notIncluded: ["Gerador de vídeo", "Prioridade no suporte"],
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "R$ 79,90",
    period: "/mês",
    description: "Para profissionais",
    features: [
      "Chat IA ilimitado",
      "Gerador de Prompt avançado",
      "50 gerações de imagem/mês",
      "10 gerações de vídeo/mês",
      "Suporte prioritário",
      "Análise de desempenho",
    ],
    notIncluded: [],
    highlighted: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: "R$ 199,90",
    period: "/mês",
    description: "Para agências e empresas",
    features: [
      "Tudo do plano Pro",
      "Gerações de imagem ilimitadas",
      "Gerações de vídeo ilimitadas",
      "API dedicada",
      "Suporte 24/7",
      "Relatórios personalizados",
      "Integração customizada",
    ],
    notIncluded: [],
    highlighted: false,
  },
];

export function PlansModal({ open, onOpenChange }: PlansModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-3xl">Nossos Planos</DialogTitle>
          <p className="text-muted-foreground">Escolha o plano ideal para suas necessidades</p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 transition-all duration-300 ${
                plan.highlighted
                  ? "border-indigo-500 bg-gradient-to-b from-indigo-500/10 to-purple-500/5 shadow-2xl shadow-indigo-500/20 scale-105"
                  : "border-border/50 bg-card/50 hover:border-indigo-400/50"
              } p-6 flex flex-col h-full`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600">
                  Mais Popular
                </Badge>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              <div className="flex-1 mb-6 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">Incluso:</p>
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}

                {plan.notIncluded.length > 0 && (
                  <>
                    <p className="text-xs font-semibold text-muted-foreground uppercase pt-3">Não incluso:</p>
                    {plan.notIncluded.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3 opacity-50">
                        <X className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>

              <Button
                className={`w-full h-11 font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20"
                    : "border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                Escolher Plano
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t border-border/50 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Todos os planos incluem período de teste gratuito de 7 dias • Cancele a qualquer momento
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
