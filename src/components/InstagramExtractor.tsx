import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, Instagram, Zap, Shield, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';
const API_KEY = 'SUA_API_KEY'; // Substitua pela sua chave real

interface JobStatus {
  status: 'aguardando' | 'executando' | 'finalizado' | 'erro';
  progresso?: number;
  mensagem?: string;
}

interface ExtractionResult {
  job_id: string;
  status: string;
  dados?: any;
}

export default function InstagramExtractor() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Verificar status do job em tempo real
  useEffect(() => {
    if (currentJobId && jobStatus?.status !== 'finalizado' && jobStatus?.status !== 'erro') {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/status/${currentJobId}`, {
            headers: {
              'Authorization': `Bearer ${API_KEY}`,
            },
          });
          
          if (response.ok) {
            const status = await response.json();
            setJobStatus(status);
            
            if (status.status === 'finalizado') {
              toast({
                title: "✅ Extração concluída!",
                description: "Seus dados estão prontos para download.",
              });
            }
          }
        } catch (error) {
          console.error('Erro ao verificar status:', error);
        }
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [currentJobId, jobStatus?.status, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "❌ Erro",
        description: "Por favor, insira um username válido.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim()) {
      toast({
        title: "❌ Erro", 
        description: "Por favor, insira seu e-mail.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/extrair`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.replace('@', ''),
          tipo_extracao: 'dados',
          threads: 5,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentJobId(data.job_id);
        setJobStatus({ status: 'aguardando' });
        
        toast({
          title: "🚀 Pedido enviado!",
          description: `Job ID: ${data.job_id}`,
        });
      } else {
        throw new Error('Erro na API');
      }
    } catch (error) {
      toast({
        title: "❌ Erro",
        description: "Erro ao processar pedido. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!currentJobId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/resultado/${currentJobId}/arquivo?tipo_arquivo=dados`, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `instagram-data-${username}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        toast({
          title: "📥 Download iniciado!",
          description: "Arquivo baixado com sucesso.",
        });
      }
    } catch (error) {
      toast({
        title: "❌ Erro no download",
        description: "Erro ao baixar arquivo. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = () => {
    switch (jobStatus?.status) {
      case 'aguardando':
        return <Clock className="w-5 h-5 text-warning animate-pulse" />;
      case 'executando':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'finalizado':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'erro':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (jobStatus?.status) {
      case 'aguardando':
        return 'Aguardando processamento...';
      case 'executando':
        return 'Extraindo dados...';
      case 'finalizado':
        return 'Dados extraídos com sucesso!';
      case 'erro':
        return 'Erro no processamento';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Matrix background effect */}
      <div className="matrix-bg" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Instagram className="w-12 h-12 text-primary" />
            <h1 className="text-6xl font-bold bg-gradient-neon bg-clip-text text-transparent">
              Extração de Dados Instagram
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Receba dados completos de perfis do Instagram de forma automática, rápida e segura.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Pricing Card */}
          <Card className="gradient-border neon-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-card opacity-50" />
            <CardHeader className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl font-bold">Plano Premium</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Extração profissional de dados
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary mb-2">R$ 5,00</div>
                <div className="text-xl text-muted-foreground">1.000 extrações</div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Entrega rápida (menos de 5 minutos)</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Dados completos em JSON</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span>Suporte técnico incluso</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-success" />
                  <span>100% seguro e privado</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Form */}
          <Card className="gradient-border neon-glow relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-card opacity-50" />
            <CardHeader className="relative">
              <CardTitle className="text-2xl font-bold">Fazer Pedido</CardTitle>
              <CardDescription>
                Preencha os dados abaixo para iniciar a extração
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Username do Instagram
                  </label>
                  <Input
                    type="text"
                    placeholder="@username ou username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-input border-border focus:border-primary focus:ring-primary"
                    disabled={isLoading || !!currentJobId}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Seu E-mail
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-input border-border focus:border-primary focus:ring-primary"
                    disabled={isLoading || !!currentJobId}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-bold py-3 text-lg neon-glow"
                  disabled={isLoading || !!currentJobId}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-2" />
                      Comprar Agora
                    </>
                  )}
                </Button>
              </form>

              {/* Job Status */}
              {currentJobId && (
                <div className="mt-8 p-4 bg-secondary/50 rounded-lg border border-border">
                  <div className="flex items-center gap-3 mb-3">
                    {getStatusIcon()}
                    <div>
                      <div className="font-medium">{getStatusText()}</div>
                      <div className="text-sm text-muted-foreground">Job ID: {currentJobId}</div>
                    </div>
                  </div>

                  {jobStatus?.progresso && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progresso</span>
                        <span>{jobStatus.progresso}%</span>
                      </div>
                      <div className="progress-bar h-2">
                        <div 
                          className="progress-fill h-full"
                          style={{ width: `${jobStatus.progresso}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {jobStatus?.status === 'finalizado' && (
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-success hover:bg-success/80 text-black font-bold neon-glow mt-4"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Baixar Dados
                    </Button>
                  )}

                  {jobStatus?.status === 'erro' && (
                    <Button
                      onClick={() => {
                        setCurrentJobId(null);
                        setJobStatus(null);
                      }}
                      variant="outline"
                      className="w-full mt-4"
                    >
                      Tentar Novamente
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="gradient-border neon-glow text-center">
            <CardContent className="pt-6">
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Super Rápido</h3>
              <p className="text-muted-foreground">
                Processamento em segundos com nossa API otimizada
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-border neon-glow text-center">
            <CardContent className="pt-6">
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">100% Seguro</h3>
              <p className="text-muted-foreground">
                Seus dados são protegidos e nunca compartilhados
              </p>
            </CardContent>
          </Card>

          <Card className="gradient-border neon-glow text-center">
            <CardContent className="pt-6">
              <Download className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Dados Completos</h3>
              <p className="text-muted-foreground">
                Receba todas as informações em formato JSON estruturado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center border-t border-border pt-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-8">
            <div>
              <h4 className="font-bold mb-2">Contato</h4>
              <p className="text-muted-foreground">contato@exemplo.com</p>
              <p className="text-muted-foreground">+55 (11) 99999-9999</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Suporte</h4>
              <p className="text-muted-foreground">suporte@exemplo.com</p>
              <p className="text-muted-foreground">Resposta em até 2 horas</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Política</h4>
              <p className="text-muted-foreground">Privacidade e Termos</p>
              <p className="text-muted-foreground">Uso responsável</p>
            </div>
          </div>
          
          <div className="text-muted-foreground">
            <p>&copy; 2024 Instagram Data Extractor. Todos os direitos reservados.</p>
            <p className="mt-2">
              <Badge variant="outline" className="text-primary border-primary">
                Powered by Advanced AI Technology
              </Badge>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}