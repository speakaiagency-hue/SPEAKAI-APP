import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { isAuthenticated, getToken } from "@/lib/auth";
import axios from "axios";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    // Se não estiver logado, redireciona para login
    if (!isAuthenticated()) {
      setLocation("/login");
      return;
    }

    // Verifica créditos no backend
    const checkAccess = async () => {
      try {
        const token = getToken();
        const res = await axios.get("/api/auth/check-access", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.hasAccess) {
          setAllowed(true);
        } else {
          setAllowed(false);
          setLocation("/plans"); // redireciona para página de planos/compras
        }
      } catch (err) {
        console.error("Erro ao verificar acesso:", err);
        setAllowed(false);
        setLocation("/plans");
      }
    };

    checkAccess();
  }, [setLocation]);

  // Enquanto verifica, não renderiza nada
  if (allowed === null) {
    return <div>Carregando...</div>;
  }

  // Se não tiver acesso, não renderiza
  if (!allowed) {
    return null;
  }

  // Se tiver acesso, renderiza os filhos
  return <>{children}</>;
}
