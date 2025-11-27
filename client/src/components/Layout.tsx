import { useLocation, Link } from "wouter";
import { MessageSquare, Type, Image as ImageIcon, Video, LayoutDashboard, Moon, Sun, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const navItems = [
    { href: "/", icon: LayoutDashboard, label: "Início" },
    { href: "/chat", icon: MessageSquare, label: "Chat IA" },
    { href: "/prompt", icon: Type, label: "Gerador de Prompt" },
    { href: "/image", icon: ImageIcon, label: "Gerar Imagem" },
    { href: "/video", icon: Video, label: "Gerar Vídeo" },
    { href: "/members", icon: BookOpen, label: "Meus Cursos" },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 border-r border-border flex flex-col fixed h-full z-50 glass bg-background/80 backdrop-blur-xl transition-all duration-300">
        <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-border/50 h-20">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-white font-bold text-xl font-heading">P</span>
          </div>
          <span className="font-heading font-bold text-xl hidden lg:block bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Plataforma IA
          </span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-current")} />
                  <span className="hidden lg:block">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto hidden lg:block w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center justify-center lg:justify-start gap-3 text-muted-foreground hover:text-foreground"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span className="hidden lg:block">{isDark ? "Modo Claro" : "Modo Escuro"}</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-20 lg:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto p-6 lg:p-12 animate-in fade-in duration-500 slide-in-from-bottom-4">
          {children}
        </div>
      </main>
    </div>
  );
}
