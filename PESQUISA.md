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
- [título da página] ([endereço])

## Onde a IA errou
- Pedido:
- O que veio:
- Como percebi:
- O certo:

## Resultado e próximos passos no TCC
- [preencher no Encontro 2]
