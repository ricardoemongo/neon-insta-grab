import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/ProductCard";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Star, Shield, Zap, Headphones, Code, TrendingUp } from "lucide-react";

const Index = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('autoleadx_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('autoleadx_user');
    localStorage.removeItem('autoleadx_orders');
    setUser(null);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  const handlePurchase = (type: 'followers' | 'data') => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.balance < 5) {
      toast({
        title: "Saldo insuficiente",
        description: "Você precisa depositar saldo para fazer pedidos",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    
    navigate('/dashboard');
  };

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Marketing Digital",
      comment: "Excelente serviço! Consegui extrair dados de concorrentes rapidamente.",
      rating: 5
    },
    {
      name: "Ana Costa",
      role: "Social Media Manager", 
      comment: "A API é muito fácil de usar e integrar. Economizou muito tempo!",
      rating: 5
    },
    {
      name: "Pedro Santos",
      role: "Desenvolvedor",
      comment: "Documentação clara e suporte rápido. Recomendo!",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Processamento Rápido",
      description: "Resultados em até 10 minutos"
    },
    {
      icon: Shield,
      title: "100% Seguro",
      description: "Dados protegidos e confidenciais"
    },
    {
      icon: Code,
      title: "API Completa",
      description: "Integração fácil e documentada"
    },
    {
      icon: Headphones,
      title: "Suporte 24/7",
      description: "Atendimento sempre disponível"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={!!user}
        userEmail={user?.email}
        userBalance={user?.balance || 0}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight">
            AUTOLEADX
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
            Extração Inteligente de Instagram
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Receba dados completos de perfis do Instagram de forma automática, rápida e segura.
            Integração via API disponível para desenvolvedores.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="neon" 
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
            >
              {user ? 'Acessar Dashboard' : 'Começar Agora'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/api-docs')}
            >
              Ver Documentação
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-primary mb-4">Por que escolher o AUTOLEADX?</h3>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card border-primary/20 hover:border-primary/40 transition-colors text-center">
              <CardContent className="pt-6">
                <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-primary mb-4">Nossos Produtos</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Escolha o tipo de extração que melhor atende suas necessidades
          </p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <ProductCard 
            type="followers" 
            onPurchase={handlePurchase}
            isLoggedIn={!!user}
          />
          <ProductCard 
            type="data" 
            onPurchase={handlePurchase}
            isLoggedIn={!!user}
          />
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-primary mb-4">O que nossos clientes dizem</h3>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-card border-primary/20">
              <CardContent className="pt-6">
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-primary fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-neon text-center border-primary">
          <CardContent className="pt-8 pb-8">
            <h3 className="text-3xl font-bold text-primary-foreground mb-4">
              Pronto para começar?
            </h3>
            <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto">
              Crie sua conta e ganhe R$ 10,00 de bônus para testar nossos serviços.
              Sem mensalidades, pague apenas pelo que usar.
            </p>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/register')}
            >
              {user ? 'Ir para Dashboard' : 'Criar Conta Grátis'}
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8">
        <div className="container mx-auto px-4">
          <div className="grid gap-6 md:grid-cols-3 text-center md:text-left">
            <div>
              <h4 className="font-bold text-primary mb-2">AUTOLEADX</h4>
              <p className="text-sm text-muted-foreground">
                Extração inteligente de dados do Instagram
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Contato</h4>
              <p className="text-sm text-muted-foreground">
                contato@autoleadx.com<br />
                (11) 99999-9999
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-foreground mb-2">Links</h4>
              <div className="space-y-1">
                <button 
                  onClick={() => navigate('/api-docs')}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Documentação API
                </button>
                <button className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Política de Privacidade
                </button>
                <button className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                  Termos de Uso
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 pt-6 border-t border-primary/20">
            <p className="text-sm text-muted-foreground">
              © 2024 AUTOLEADX. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
