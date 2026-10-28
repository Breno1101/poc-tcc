# Diário de pesquisa

## Contexto do TCC
Plataforma de visão computacional que classifica doenças e pragas da soja a partir de fotos e compara arquiteturas (ResNet-50, EfficientNet, MobileNet, ViT). A PoC é o cliente móvel para o agricultor enviar a foto e ver o diagnóstico.

## Pergunta de pesquisa
Como o app Expo do nosso TCC pode fotografar a folha de soja com expo-image-picker, enviá-la à API do classificador (simulada) e mostrar a doença e a confiança, tratando a espera e a falta de conexão?

## Alternativas consideradas
| Opção | Serve para | Decisão |
|---|---|---|
| expo-image-picker | Abrir a câmera ou a galeria e receber a foto pronta | Sim. [confirmar Expo Go na doc] |
| expo-camera | Câmera embutida na tela, com preview próprio | Não por ora. [confirmar Expo Go na doc] |
| fetch + FormData | Enviar a imagem à API | Sim: nativo, sem dependência nova. |
| @tanstack/react-query | Cache, nova tentativa, estado da requisição | Não agora: há um único endpoint. |

## Fontes oficiais lidas
- [Expo ImagePicker — SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/imagepicker/): confirma que o módulo funciona no Expo Go, suporta Android/iOS e oferece `launchCameraAsync`, `launchImageLibraryAsync` e solicitações de permissão.
- [Expo SDK 58 — referência](https://docs.expo.dev/versions/v58.0.0/): versão da documentação usada para conferir a API compatível com o projeto.

## Onde a IA errou
- Nenhum erro de implementação da IA foi registrado até o momento. O lint automático do SDK 58 instalou ESLint 9, mas o comando `expo lint` não conseguiu executá-lo; a validação equivalente foi feita com `eslint .`.

## Resultado e próximos passos no TCC
- A PoC demonstra o fluxo móvel de captura/seleção, envio multipart para uma API simulada, espera, resultado e tratamento de falhas. O próximo passo do TCC é substituir a URL pelo classificador real e comparar os modelos fora do aplicativo.
- Ainda falta validar os critérios em aparelho físico ou emulador e registrar o resultado em `CRITERIOS.md`.
