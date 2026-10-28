# PoC TCC Soja

Prova de conceito de um aplicativo Expo/React Native para capturar ou selecionar uma foto de uma folha de soja, enviá-la para uma API simulada e exibir um diagnóstico com nível de confiança.

> A API desta PoC não executa um modelo real de inteligência artificial. Ela sorteia um resultado para demonstrar o fluxo completo do aplicativo.

## Pré-requisitos

- Windows com PowerShell.
- Node.js 22 ou superior. O projeto foi validado com Node `22.23.4`.
- Expo Go instalado no celular.
- Celular e computador na mesma rede Wi-Fi.
- Conta Expo:
  - login no terminal;
  - login no aplicativo Expo Go.

Confira as versões:

```powershell
node --version
npm --version
```

## Instalação

Clone o repositório ou abra a pasta do projeto. Para evitar problemas de sincronização do OneDrive com o Metro, prefira uma pasta local, por exemplo:

```powershell
C:\Dev\poc-tcc
```

Entre na pasta e instale as dependências:

```powershell
cd C:\Dev\poc-tcc
npm ci
```

Se você usa NVM for Windows:

```powershell
nvm install 22
nvm use 22
```

## Login no Expo

O Expo Go pode exigir que o terminal e o aplicativo estejam autenticados com a mesma conta.

Para fazer login sem depender da abertura automática do navegador:

```powershell
npx expo login --no-browser
```

Informe o usuário e a senha quando solicitado. Se a conta usar autenticação em dois fatores, informe o código solicitado.

Confirme o login:

```powershell
npx expo whoami
```

Depois, abra o Expo Go no celular e entre com a mesma conta.

## Configuração da API

A API simulada fica no computador e escuta a porta `3000`.

Descubra o IPv4 do computador:

```powershell
ipconfig
```

No arquivo [App.tsx](./App.tsx), atualize a constante `API_URL` com o IPv4 correto:

```ts
const API_URL = 'http://192.168.15.27:3000/diagnostico';
```

Não use `localhost` ou `127.0.0.1` no aplicativo do celular, pois esses endereços apontam para o próprio celular.

Se necessário, permita a porta no Firewall do Windows, em um PowerShell executado como administrador:

```powershell
New-NetFirewallRule `
  -DisplayName "PoC TCC Soja - API Node 3000" `
  -Direction Inbound `
  -Protocol TCP `
  -LocalPort 3000 `
  -Action Allow
```

## Execução

### Terminal 1: API simulada

Na raiz do projeto:

```powershell
node mock-api/server.js
```

Mantenha esse terminal aberto. A mensagem esperada é semelhante a:

```text
Mock da API em http://0.0.0.0:3000/diagnostico
```

### Testar a API

A rota aceita `POST`. Este comando testa a comunicação com o servidor:

```powershell
curl.exe -i -X POST `
  -H "Content-Type: multipart/form-data; boundary=test" `
  --data-binary "fake-image" `
  http://192.168.15.27:3000/diagnostico
```

A resposta deve conter uma doença e uma confiança, por exemplo:

```json
{"doenca":"Oídio","confianca":0.77}
```

O resultado pode variar porque o servidor escolhe uma opção aleatoriamente.

### Terminal 2: aplicativo Expo

Em outro terminal:

```powershell
npx expo start -c
```

O parâmetro `-c` limpa o cache do Metro. Escaneie o QR Code com o Expo Go.

Se a conexão local não funcionar, tente:

```powershell
npx expo start --tunnel
```

O túnel resolve o acesso ao servidor Expo, mas o celular ainda precisa conseguir acessar a API no IP do computador.

## Fluxo principal

No aplicativo:

1. Toque em **Fotografar** ou **Escolher da galeria**.
2. Conceda a permissão solicitada.
3. Capture ou selecione uma imagem.
4. Confirme se a imagem aparece na tela.
5. Toque em **Analisar**.
6. Aguarde o indicador **Analisando...**.
7. Confira o nome da doença e a confiança em porcentagem.

Durante o envio, o terminal da API deve registrar algo como:

```text
foto recebida: ... bytes
```

## Testes dos critérios de aceitação

### Cancelamento

- Abra a câmera e cancele.
- Abra a galeria e cancele.
- Confirme que o aplicativo não trava e exibe uma mensagem.

### Permissões negadas

Nas configurações do celular, negue a permissão da câmera e tente fotografar. Depois repita com a permissão da galeria.

O aplicativo deve mostrar uma mensagem clara e continuar funcionando.

### Falha de rede

1. Selecione uma foto.
2. Ative o modo avião.
3. Toque em **Analisar**.
4. Confirme a mensagem de erro.
5. Desative o modo avião.
6. Toque em **Tentar novamente**.

A foto deve ser mantida após a falha.

### Timeout

Pare a API com `Ctrl+C` e altere temporariamente [mock-api/server.js](./mock-api/server.js):

```js
const DELAY_MS = 11000;
```

Inicie novamente:

```powershell
node mock-api/server.js
```

Faça uma análise e aguarde até 10 segundos. O aplicativo deve informar que a análise excedeu o limite e permitir uma nova tentativa.

Depois do teste, restaure:

```js
const DELAY_MS = 2000;
```

## Validação técnica

Execute na raiz do projeto:

```powershell
npx tsc --noEmit
npm run lint
npx expo-doctor
```

O Expo Doctor deve concluir com:

```text
20/20 checks passed. No issues detected!
```

## Estrutura principal

```text
App.tsx                 Tela única da PoC
mock-api/server.js      API simulada
app.json                Configuração do Expo e permissões
CRITERIOS.md            Critérios de aceitação
PESQUISA.md             Diário de pesquisa
```

## Solução de problemas

### `Unsupported FormDataPart implementation`

O upload usa um `Blob` criado a partir da URI da imagem antes de adicioná-lo ao `FormData`. Se o erro aparecer:

1. Confirme que está executando a cópia correta do projeto.
2. Reinicie o Expo com cache limpo:

```powershell
npx expo start -c
```

### Erro no Metro ou `TreeFS`

Evite executar o projeto diretamente dentro do OneDrive. Use uma cópia em `C:\Dev\poc-tcc`, reinstale as dependências e reinicie o Metro:

```powershell
cd C:\Dev\poc-tcc
npm ci
npx expo start -c
```

### O celular não acessa a API

Confira:

- o servidor está rodando;
- o computador e o celular estão na mesma rede;
- o IP usado em `API_URL` é o IPv4 atual;
- a porta `3000` está liberada no firewall;
- a API está sendo acessada com `POST`.

## Escopo da PoC

Esta versão demonstra captura, seleção, envio, carregamento, resultado e tratamento de falhas. Ela não inclui modelo real de IA, comparação de arquiteturas, login próprio, histórico, armazenamento local, Grad-CAM ou Expo Router.
