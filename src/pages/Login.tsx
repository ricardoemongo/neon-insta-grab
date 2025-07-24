import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simular login (substituir por autenticação real)
    setTimeout(() => {
      if (email && password) {
        // Salvar dados do usuário no localStorage (simulação)
        const userData = {
          email,
          balance: 0,
          apiKey: `ak_${Math.random().toString(36).substr(2, 9)}`,
          isLoggedIn: true
        };
        localStorage.setItem('autoleadx_user', JSON.stringify(userData));
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao AUTOLEADX",
        });
        
        navigate('/dashboard');
      } else {
        toast({
          title: "Erro no login",
          description: "Por favor, preencha todos os campos",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Login</CardTitle>
          <CardDescription>
            Entre na sua conta AUTOLEADX
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="neon" 
              size="lg" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center space-y-2">
              <button
                type="button"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                onClick={() => toast({
                  title: "Recuperação de senha",
                  description: "Funcionalidade em desenvolvimento",
                })}
              >
                Esqueceu sua senha?
              </button>
              
              <div className="text-sm text-muted-foreground">
                Não tem conta?{" "}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-primary hover:text-primary-glow font-medium"
                >
                  Criar conta
                </button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}