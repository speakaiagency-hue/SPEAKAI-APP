import { useEffect, useState } from "react";
import { getAuthHeader, isAuthenticated } from "@/lib/auth";
import { useLocation } from "wouter";

export function withMembershipCheck<P extends object>(
  Component: React.ComponentType<P>
) {
  return function ProtectedComponent(props: P) {
    const [, setLocation] = useLocation();
    const [hasMembership, setHasMembership] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isAuthenticated()) {
        setLocation("/login");
        return;
      }

      checkMembership();
    }, []);

    const checkMembership = async () => {
      try {
        const response = await fetch("/api/auth/check-access", {
          headers: { ...getAuthHeader(), Accept: "application/json" },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.hasAccess) {
            console.log("✅ Acesso liberado");
            setHasMembership(true);
          } else {
            console.log("❌ Sem acesso, redirecionando para planos");
            setLocation("/plans");
          }
        } else if (response.status === 402) {
          console.log("❌ Créditos insuficientes, redirecionando para planos");
          setLocation("/plans");
        } else {
          console.warn("Resposta inesperada da API:", response.status);
          setHasMembership(true); // ⚠️ libera acesso para não travar
        }
      } catch (error) {
        console.error("Erro ao verificar acesso:", error);
        setHasMembership(true); // ⚠️ libera acesso em caso de erro
      } finally {
        setLoading(false);
      }
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-muted-foreground">Verificando acesso...</div>
        </div>
      );
    }

    if (!hasMembership) {
      return null;
    }

    return <Component {...props} />;
  };
}
