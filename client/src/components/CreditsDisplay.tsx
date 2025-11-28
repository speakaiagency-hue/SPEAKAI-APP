import { Coins, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getAuthHeader } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface CreditsDisplayProps {
  operationCost: number;
  operationName: string;
  creditsAfterOperation?: number;
}

export function CreditsDisplay({ operationCost, operationName, creditsAfterOperation }: CreditsDisplayProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCredits();
    const interval = setInterval(fetchCredits, 2000);
    return () => clearInterval(interval);
  }, [creditsAfterOperation]);

  const fetchCredits = async () => {
    try {
      const response = await fetch("/api/credits/balance", {
        headers: getAuthHeader(),
      });
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error("Error fetching credits:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasEnoughCredits = credits !== null && credits >= operationCost;

  return (
    <div className="space-y-3">
      {/* Credits Balance */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-indigo-400" />
            <span className="text-sm text-muted-foreground">Créditos Disponíveis</span>
          </div>
          <div className={cn(
            "text-2xl font-bold font-heading",
            loading ? "text-gray-500" : hasEnoughCredits ? "text-green-400" : "text-red-400"
          )}>
            {loading ? "..." : credits}
          </div>
        </div>
      </div>

      {/* Operation Cost */}
      <div className={cn(
        "p-3 rounded-lg border flex items-center justify-between",
        hasEnoughCredits 
          ? "bg-blue-500/5 border-blue-500/20" 
          : "bg-red-500/5 border-red-500/20"
      )}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Custo para {operationName}</span>
        </div>
        <div className={cn(
          "font-bold text-lg",
          hasEnoughCredits ? "text-blue-400" : "text-red-400"
        )}>
          -{operationCost}
        </div>
      </div>

      {/* Insufficient Credits Warning */}
      {!loading && !hasEnoughCredits && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div className="text-sm text-red-400">
            <div className="font-medium">Créditos insuficientes!</div>
            <div className="text-xs mt-1">Você precisa de {operationCost} créditos. Compre mais na seção de planos.</div>
          </div>
        </div>
      )}

      {/* After Operation Credits */}
      {creditsAfterOperation !== undefined && (
        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 flex items-center justify-between">
          <span className="text-sm font-medium text-green-400">Créditos após operação</span>
          <div className="font-bold text-green-400">{creditsAfterOperation}</div>
        </div>
      )}
    </div>
  );
}
