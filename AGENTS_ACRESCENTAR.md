<!-- Cole isto no FINAL do AGENTS.md que o create-expo-app gerou, sem apagar nada. -->

## Convenções deste projeto
- Não altere arquivos fora do escopo pedido. Explique cada alteração.
- Componentes ficam em `components/`, um arquivo por componente.
- Estado nunca é modificado no lugar: sempre gere um novo valor.
- Valores que podem ser calculados a partir do estado não viram estado.
- Antes de usar um pacote, confirme na documentação se ele funciona no Expo Go.

## Contexto desta prova de conceito
- TCC: plataforma que classifica doenças e pragas da soja a partir de fotos e compara modelos de visão computacional.
- Problema: o agricultor está no campo, com sinal ruim, e precisa fotografar a planta e receber o diagnóstico.
- Tecnologia investigada: `expo-image-picker` (captura da foto) e `fetch` com `FormData` (envio à API).
- Uma tela só, em `App.tsx`: o usuário toca em Fotografar, vê a foto, toca em Analisar, vê um carregamento e depois a doença e a confiança em porcentagem. Se falhar, vê uma mensagem de erro e pode tentar de novo.
- API simulada: servidor Node em `mock-api/`, `POST /diagnostico` com o campo `foto`, resposta `{ "doenca": string, "confianca": number }` (0 a 1). A URL fica em uma constante no topo do `App.tsx`.
- Não usar Expo Router, `expo-camera`, react-query nem armazenamento local.
- Fora de escopo: login, design final, histórico de diagnósticos, Grad-CAM e qualquer modelo de IA real.
