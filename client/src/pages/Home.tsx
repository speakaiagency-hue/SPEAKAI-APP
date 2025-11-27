import { Link } from "wouter";
import { ArrowRight, MessageSquare, Type, Image as ImageIcon, Video, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Import assets
import chatImg from "@assets/generated_images/abstract_ai_chat_concept.png";
import promptImg from "@assets/generated_images/creative_writing_prompt_concept.png";
import imageImg from "@assets/generated_images/digital_art_generation_concept.png";
import videoImg from "@assets/generated_images/video_production_concept.png";

export default function Home() {
  const modules = [
    {
      title: "Chat IA",
      description: "Converse com uma inteligência artificial avançada com contexto e memória.",
      href: "/chat",
      icon: MessageSquare,
      image: chatImg,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Gerador de Prompt",
      description: "Crie prompts perfeitos para coding, marketing e design com templates prontos.",
      href: "/prompt",
      icon: Type,
      image: promptImg,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Geração de Imagem",
      description: "Transforme texto em imagens incríveis com estilos variados e alta resolução.",
      href: "/image",
      icon: ImageIcon,
      image: imageImg,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Geração de Vídeo",
      description: "Crie vídeos curtos e storyboards a partir de descrições textuais.",
      href: "/video",
      icon: Video,
      image: videoImg,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12 relative overflow-hidden rounded-3xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Nova Versão 2.0 Disponível</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-heading font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/60">
            Crie o impossível com <br />
            <span className="text-primary">Inteligência Artificial</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Uma suite completa de ferramentas criativas potencializadas por IA. 
            Gere textos, imagens, vídeos e otimize seus prompts em um único lugar.
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {modules.map((module) => (
          <Link key={module.href} href={module.href}>
            <a className="group">
              <Card className="h-full overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500">
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
                  <img 
                    src={module.image} 
                    alt={module.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className={`absolute top-4 left-4 p-3 rounded-xl ${module.bg} backdrop-blur-md z-20 border border-white/10`}>
                    <module.icon className={`w-6 h-6 ${module.color}`} />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between font-heading text-2xl">
                    {module.title}
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardTitle>
                  <CardDescription className="text-base">
                    {module.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </a>
          </Link>
        ))}
      </section>
    </div>
  );
}
