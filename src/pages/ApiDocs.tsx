import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { Copy, Code, Terminal, Users, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ApiDocs() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Código copiado!",
      description: "O código foi copiado para a área de transferência",
    });
  };

  const baseUrl = "http://localhost:8000";

  const codeExamples = {
    javascript: {
      extract: `// Fazer pedido de extração
fetch('${baseUrl}/extrair', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer SUA_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'usuario_instagram',
    tipo_extracao: 'seguidores', // ou 'dados'
    threads: 5
  })
})
.then(response => response.json())
.then(data => {
  console.log('Job ID:', data.job_id);
  // Aguardar processamento...
})
.catch(error => console.error('Erro:', error));`,

      status: `// Verificar status do pedido
fetch('${baseUrl}/status/\${job_id}', {
  headers: {
    'Authorization': 'Bearer SUA_API_KEY'
  }
})
.then(response => response.json())
.then(status => {
  console.log('Status:', status.status);
  if (status.status === 'finalizado') {
    // Pedido concluído, baixar resultado
    downloadResult(job_id);
  }
});`,

      download: `// Baixar resultado
function downloadResult(job_id) {
  fetch('${baseUrl}/resultado/\${job_id}/arquivo?tipo_arquivo=seguidores', {
    headers: {
      'Authorization': 'Bearer SUA_API_KEY'
    }
  })
  .then(response => response.blob())
  .then(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'seguidores.xlsx';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });
}`
    },

    python: {
      extract: `import requests
import json

# Fazer pedido de extração
url = "${baseUrl}/extrair"
headers = {
    'Authorization': 'Bearer SUA_API_KEY',
    'Content-Type': 'application/json'
}
data = {
    'username': 'usuario_instagram',
    'tipo_extracao': 'seguidores',  # ou 'dados'
    'threads': 5
}

response = requests.post(url, headers=headers, json=data)
result = response.json()
job_id = result['job_id']
print(f"Job ID: {job_id}")`,

      status: `# Verificar status do pedido
import time

def check_status(job_id):
    url = f"${baseUrl}/status/{job_id}"
    headers = {'Authorization': 'Bearer SUA_API_KEY'}
    
    response = requests.get(url, headers=headers)
    status = response.json()
    
    print(f"Status: {status['status']}")
    return status['status']

# Aguardar conclusão
while True:
    status = check_status(job_id)
    if status == 'finalizado':
        break
    time.sleep(10)`,

      download: `# Baixar resultado
def download_result(job_id, file_type='seguidores'):
    url = f"${baseUrl}/resultado/{job_id}/arquivo"
    params = {'tipo_arquivo': file_type}
    headers = {'Authorization': 'Bearer SUA_API_KEY'}
    
    response = requests.get(url, headers=headers, params=params)
    
    with open(f'{file_type}.xlsx', 'wb') as f:
        f.write(response.content)
    
    print(f"Arquivo {file_type}.xlsx baixado!")

download_result(job_id)`
    },

    curl: {
      extract: `# Fazer pedido de extração
curl -X POST "${baseUrl}/extrair" \\
  -H "Authorization: Bearer SUA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "username": "usuario_instagram",
    "tipo_extracao": "seguidores",
    "threads": 5
  }'`,

      status: `# Verificar status do pedido
curl -X GET "${baseUrl}/status/JOB_ID" \\
  -H "Authorization: Bearer SUA_API_KEY"`,

      download: `# Baixar resultado
curl -X GET "${baseUrl}/resultado/JOB_ID/arquivo?tipo_arquivo=seguidores" \\
  -H "Authorization: Bearer SUA_API_KEY" \\
  -o seguidores.xlsx`
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-4">
            API AUTOLEADX
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Integre a extração de dados do Instagram diretamente em suas aplicações usando nossa API REST
          </p>
        </div>

        {/* Informações Gerais */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Users className="w-5 h-5" />
                <span>Extração de Seguidores</span>
              </CardTitle>
              <CardDescription>
                Obtenha a lista completa de seguidores de qualquer perfil público
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Lista completa de seguidores</li>
                <li>• Dados organizados em planilha Excel</li>
                <li>• Processamento em até 10 minutos</li>
                <li>• Custo: R$ 5,00 por extração</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-primary">
                <Database className="w-5 h-5" />
                <span>Extração de Dados</span>
              </CardTitle>
              <CardDescription>
                Extraia informações completas do perfil do Instagram
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Bio, e-mail, telefone, website</li>
                <li>• Estatísticas do perfil</li>
                <li>• Dados em formato JSON e Excel</li>
                <li>• Custo: R$ 5,00 por extração</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Endpoints */}
        <Card className="bg-card border-primary/20 mb-8">
          <CardHeader>
            <CardTitle className="text-primary">Endpoints da API</CardTitle>
            <CardDescription>URLs base e autenticação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">URL Base</h4>
              <code className="block p-2 bg-muted rounded text-sm">{baseUrl}</code>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Autenticação</h4>
              <p className="text-sm text-muted-foreground">
                Todas as requisições devem incluir o header de autorização:
              </p>
              <code className="block p-2 bg-muted rounded text-sm">
                Authorization: Bearer SUA_API_KEY
              </code>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium text-primary">POST /extrair</h4>
                <p className="text-sm text-muted-foreground">Iniciar extração</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">GET /status/{`{job_id}`}</h4>
                <p className="text-sm text-muted-foreground">Verificar status</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-primary">GET /resultado/{`{job_id}`}/arquivo</h4>
                <p className="text-sm text-muted-foreground">Baixar resultado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exemplos de Código */}
        <Card className="bg-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-primary">
              <Code className="w-5 h-5" />
              <span>Exemplos de Código</span>
            </CardTitle>
            <CardDescription>
              Exemplos práticos de integração em diferentes linguagens
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Language Selector */}
            <div className="flex space-x-2 mb-6">
              {Object.keys(codeExamples).map(lang => (
                <Button
                  key={lang}
                  variant={selectedLanguage === lang ? 'neon' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLanguage(lang)}
                  className="capitalize"
                >
                  {lang === 'javascript' ? 'JavaScript' : 
                   lang === 'python' ? 'Python' : 
                   lang.toUpperCase()}
                </Button>
              ))}
            </div>

            {/* Code Examples */}
            <div className="space-y-6">
              {/* Extract */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary">1. Fazer Pedido de Extração</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeExamples[selectedLanguage as keyof typeof codeExamples].extract)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples[selectedLanguage as keyof typeof codeExamples].extract}</code>
                </pre>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary">2. Verificar Status</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeExamples[selectedLanguage as keyof typeof codeExamples].status)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples[selectedLanguage as keyof typeof codeExamples].status}</code>
                </pre>
              </div>

              {/* Download */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-primary">3. Baixar Resultado</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(codeExamples[selectedLanguage as keyof typeof codeExamples].download)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{codeExamples[selectedLanguage as keyof typeof codeExamples].download}</code>
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Codes */}
        <Card className="bg-card border-primary/20 mt-6">
          <CardHeader>
            <CardTitle className="text-primary">Status e Códigos de Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Status do Pedido</h4>
                <ul className="space-y-1 text-sm">
                  <li><code>pendente</code> - Pedido recebido</li>
                  <li><code>processando</code> - Em processamento</li>
                  <li><code>finalizado</code> - Concluído</li>
                  <li><code>erro</code> - Erro no processamento</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Códigos HTTP</h4>
                <ul className="space-y-1 text-sm">
                  <li><code>200</code> - Sucesso</li>
                  <li><code>400</code> - Dados inválidos</li>
                  <li><code>401</code> - Não autorizado</li>
                  <li><code>403</code> - Saldo insuficiente</li>
                  <li><code>500</code> - Erro interno</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}