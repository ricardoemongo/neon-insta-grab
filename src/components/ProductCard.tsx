import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, Database } from "lucide-react";

interface ProductCardProps {
  type: 'followers' | 'data';
  onPurchase: (type: 'followers' | 'data') => void;
  isLoggedIn: boolean;
}

export const ProductCard = ({ type, onPurchase, isLoggedIn }: ProductCardProps) => {
  const isFollowers = type === 'followers';
  
  const productInfo = {
    followers: {
      title: "Extração de Seguidores",
      description: "Receba uma lista completa dos seguidores de qualquer perfil público do Instagram",
      icon: Users,
      features: [
        "Lista completa de seguidores",
        "Dados organizados em planilha",
        "Processamento em até 10 minutos",
        "Suporte técnico incluído",
        "API disponível"
      ]
    },
    data: {
      title: "Extração de Dados",
      description: "Receba todos os dados públicos de um perfil do Instagram (bio, e-mail, telefone, etc)",
      icon: Database,
      features: [
        "Dados completos do perfil",
        "Bio, contatos e estatísticas",
        "Análise de engajamento",
        "Formato JSON e Excel",
        "Integração via API"
      ]
    }
  };

  const Icon = productInfo[type].icon;

  return (
    <Card className="bg-card border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-neon transform hover:scale-105">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-xl text-primary">
          {productInfo[type].title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {productInfo[type].description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-primary">R$ 5,00</div>
          <div className="text-sm text-muted-foreground">por 1.000 extrações</div>
        </div>

        <div className="space-y-3">
          {productInfo[type].features.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </div>
          ))}
        </div>

        <Button 
          variant="neon" 
          size="lg" 
          className="w-full"
          onClick={() => onPurchase(type)}
          disabled={!isLoggedIn}
        >
          {isLoggedIn ? `Comprar ${isFollowers ? 'Seguidores' : 'Dados'}` : 'Faça Login para Comprar'}
        </Button>
      </CardContent>
    </Card>
  );
};