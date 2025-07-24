import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  Plus, 
  Instagram, 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle,
  Copy,
  Eye,
  EyeOff,
  Users,
  Database
} from "lucide-react";

interface Order {
  id: string;
  username: string;
  type: 'followers' | 'data';
  status: 'pending' | 'processing' | 'completed' | 'error';
  date: string;
  jobId?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [extractionType, setExtractionType] = useState<'followers' | 'data'>('followers');
  const [depositAmount, setDepositAmount] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [showApiKey, setShowApiKey] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('autoleadx_user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    
    // Carregar pedidos salvos
    const savedOrders = localStorage.getItem('autoleadx_orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('autoleadx_user');
    localStorage.removeItem('autoleadx_orders');
    navigate('/');
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      toast({
        title: "Erro",
        description: "Valor inválido",
        variant: "destructive",
      });
      return;
    }

    const updatedUser = { ...user, balance: user.balance + amount };
    setUser(updatedUser);
    localStorage.setItem('autoleadx_user', JSON.stringify(updatedUser));
    setDepositAmount("");
    
    toast({
      title: "Depósito realizado!",
      description: `R$ ${amount.toFixed(2)} adicionados ao seu saldo`,
    });
  };

  const handleOrderSubmit = async () => {
    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Digite um username do Instagram",
        variant: "destructive",
      });
      return;
    }

    if (user.balance < 5) {
      toast({
        title: "Saldo insuficiente",
        description: "Você precisa de pelo menos R$ 5,00 para fazer um pedido",
        variant: "destructive",
      });
      return;
    }

    // Simular pedido na API
    const newOrder: Order = {
      id: Date.now().toString(),
      username: username.trim(),
      type: extractionType,
      status: 'pending',
      date: new Date().toLocaleDateString('pt-BR'),
      jobId: `job_${Math.random().toString(36).substr(2, 9)}`
    };

    // Descontar saldo
    const updatedUser = { ...user, balance: user.balance - 5 };
    setUser(updatedUser);
    localStorage.setItem('autoleadx_user', JSON.stringify(updatedUser));

    // Adicionar pedido
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('autoleadx_orders', JSON.stringify(updatedOrders));

    setUsername("");
    
    toast({
      title: "Pedido enviado!",
      description: `Extração de ${extractionType === 'followers' ? 'seguidores' : 'dados'} iniciada`,
    });

    // Simular processamento
    setTimeout(() => {
      const processingOrder = { ...newOrder, status: 'processing' as const };
      const updatedOrdersProcessing = updatedOrders.map(o => o.id === newOrder.id ? processingOrder : o);
      setOrders(updatedOrdersProcessing);
      localStorage.setItem('autoleadx_orders', JSON.stringify(updatedOrdersProcessing));
    }, 2000);

    setTimeout(() => {
      const completedOrder = { ...newOrder, status: 'completed' as const };
      const updatedOrdersCompleted = updatedOrders.map(o => o.id === newOrder.id ? completedOrder : o);
      setOrders(updatedOrdersCompleted);
      localStorage.setItem('autoleadx_orders', JSON.stringify(updatedOrdersCompleted));
      
      toast({
        title: "Extração concluída!",
        description: "Seu pedido está pronto para download",
      });
    }, 8000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(user.apiKey);
    toast({
      title: "API Key copiada!",
      description: "Sua chave foi copiada para a área de transferência",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-warning" />;
      case 'processing': return <Clock className="w-4 h-4 text-primary animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error': return <XCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'processing': return 'Processando';
      case 'completed': return 'Concluído';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        isLoggedIn={true}
        userEmail={user.email}
        userBalance={user.balance}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Saldo e Depósito */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <CreditCard className="w-5 h-5" />
                <span>Meu Saldo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                R$ {user.balance.toFixed(2)}
              </div>
              
              <div className="space-y-2">
                <Label>Depositar valor</Label>
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                  <Button onClick={handleDeposit} variant="neon" size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[5, 10, 20, 50].map(amount => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setDepositAmount(amount.toString())}
                  >
                    R$ {amount}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Novo Pedido */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Instagram className="w-5 h-5" />
                <span>Novo Pedido</span>
              </CardTitle>
              <CardDescription>R$ 5,00 por extração</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Username do Instagram</Label>
                <Input
                  placeholder="@usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo de extração</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={extractionType === 'followers' ? 'neon' : 'outline'}
                    onClick={() => setExtractionType('followers')}
                    className="h-auto p-3 flex flex-col"
                  >
                    <Users className="w-4 h-4 mb-1" />
                    <span className="text-xs">Seguidores</span>
                  </Button>
                  <Button
                    variant={extractionType === 'data' ? 'neon' : 'outline'}
                    onClick={() => setExtractionType('data')}
                    className="h-auto p-3 flex flex-col"
                  >
                    <Database className="w-4 h-4 mb-1" />
                    <span className="text-xs">Dados</span>
                  </Button>
                </div>
              </div>

              <Button 
                onClick={handleOrderSubmit}
                variant="neon" 
                size="lg" 
                className="w-full"
                disabled={user.balance < 5}
              >
                {user.balance >= 5 ? 'Fazer Pedido' : 'Saldo Insuficiente'}
              </Button>
            </CardContent>
          </Card>

          {/* API Key */}
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="text-primary">Sua API Key</CardTitle>
              <CardDescription>Use para integração automática</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={user.apiKey}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyApiKey}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => navigate('/api-docs')}
                className="w-full"
              >
                Ver Documentação
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Histórico de Pedidos */}
        <Card className="mt-6 bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Histórico de Pedidos</CardTitle>
            <CardDescription>Seus últimos pedidos e status</CardDescription>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Nenhum pedido encontrado
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-primary/10 rounded-lg hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {order.type === 'followers' ? 
                          <Users className="w-4 h-4 text-primary" /> : 
                          <Database className="w-4 h-4 text-primary" />
                        }
                        <span className="font-medium">@{order.username}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className="text-sm text-muted-foreground">
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      
                      <span className="text-sm text-muted-foreground">{order.date}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {order.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast({
                            title: "Download simulado",
                            description: "Em integração real, seria baixado o arquivo",
                          })}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar
                        </Button>
                      )}
                      
                      {order.jobId && (
                        <span className="text-xs text-muted-foreground font-mono">
                          {order.jobId}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}