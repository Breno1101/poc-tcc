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
| fetch + FormData | Enviar a imagem à API | Sim: nativo, sem dependência nova. Foi necessário converter a imagem para `Blob` antes do envio. |
| @tanstack/react-query | Cache, nova tentativa, estado da requisição | Não agora: há um único endpoint. |

## Fontes oficiais lidas
- [Expo ImagePicker — SDK 58](https://docs.expo.dev/versions/v58.0.0/sdk/imagepicker/): confirma que o módulo funciona no Expo Go, suporta Android/iOS e oferece `launchCameraAsync`, `launchImageLibraryAsync` e solicitações de permissão.
- [Expo SDK 58 — referência](https://docs.expo.dev/versions/v58.0.0/): versão da documentação usada para conferir a API compatível com o projeto.
- [Expo CLI](https://docs.expo.dev/versions/latest/more/expo-cli/): comandos para iniciar o projeto, autenticar a conta e usar o Expo Go.

## Onde a IA errou

- **Pedido:** Implementar o envio da foto com `fetch` e `FormData`.
- **O que veio:** A imagem foi adicionada diretamente ao `FormData` como um objeto com `uri`, `name` e `type`.
- **Como percebi:** Ao tocar em “Analisar” no aparelho físico, o aplicativo exibiu o erro `Unsupported FormDataPart implementation`.
- **O certo:** No runtime utilizado, a imagem precisou ser carregada pela URI, convertida para `Blob` e então adicionada ao `FormData`.
- O lint automático do SDK 58 instalou ESLint 9, mas o comando `expo lint` não conseguiu executá-lo; a validação equivalente foi feita com `eslint .`.

## Resultado e próximos passos no TCC
- A PoC demonstrou o fluxo móvel de captura ou seleção de uma imagem, envio multipart para uma API simulada, espera, exibição do resultado e tratamento de falhas.
- O fluxo foi executado em um aparelho físico conectado ao Expo Go, com a API simulada rodando no computador.
- A análise exibida é simulada: o servidor sorteia uma doença e uma confiança. Portanto, a precisão do diagnóstico não foi avaliada nesta PoC.
- Durante a implementação, foi necessário converter a imagem para `Blob` antes de adicioná-la ao `FormData`, devido ao erro `Unsupported FormDataPart implementation`.
- O próximo passo do TCC é substituir a API simulada pelo classificador real e comparar arquiteturas como ResNet-50, EfficientNet, MobileNet e ViT.
- Também será necessário avaliar o funcionamento com conectividade limitada e definir se haverá suporte offline em uma etapa futura.

