<div align="center">
   <h2> DaVinci Insights </h2>
</div>

<h3> Integrantes </h3>

- RM550341 - Allef Santos (2TDSPV)
- RM551491 - Cassio Yuji Hirassike Sakai
- RM97836 - Debora Damasso Lopes
- RM550323 - Paulo Barbosa Neto
- RM552314 - Yasmin Araujo Santos Lopes

- --------------------------------------------------

## Projeto

O projeto tem como objetivo processar dados de feedbacks de usuários que adquiriram produtos ou serviços. A análise desses feedbacks visa extrair insights para que as empresas possam entender as razões das avaliações (sejam elas positivas ou negativas), definir estratégias para melhorar a satisfação dos consumidores e conquistar novos compradores. As avaliações dos clientes são cruciais para a decisão de compra de novos clientes.

- --------------------------------------------------

## Aplicativo

### Funcionalidades Gerais
- **Autenticação**: Os usuários podem fazer login ou se registrar usando Firebase Authentication.
- **Cadastro de Produtos**: Os usuários podem registrar produtos no Firebase Realtime Database, com cada produto associado ao usuário que o registrou.
- **Feedback dos Clientes**: Após registrar um produto, os usuários podem adicionar feedbacks sobre ele.
- **CRUD de Produtos e Feedbacks**: Inclui criação, leitura, atualização e exclusão.
- **Análise de Sentimentos**: O feedback é processado por uma API de análise de sentimentos, classificando as opiniões como positivas, negativas ou neutras.
- **Visualização dos Insights**: Os usuários têm acesso a uma análise detalhada dos feedbacks, permitindo insights sobre pontos positivos e negativos dos produtos.
- **AsyncStorage**: Armazena localmente preferências de usuário ou tokens de autenticação, permitindo salvar dados offline.

### Estrutura das Telas:
#### Login:
- Permite que os usuários façam login no aplicativo usando Firebase Authentication.
- Campos de entrada para email e senha.
- Botão para redirecionar para a tela de cadastro (SignUp) se o usuário ainda não tiver uma conta.

#### SignUp

- Tela para registrar novos usuários, também utilizando Firebase Authentication.
- Campos para inserir email, senha e confirmação de senha.
- Botão para criar uma nova conta e redirecionar para a tela de cadastro (Loign) se o usuário já tiver uma conta.

#### RegisterProduct:

- Tela onde os usuários podem registrar os produtos.
- Formulário com campos como nome do produto, descrição e link da imagem do produto.
- Botão para salvar o produto e prosseguir para o feedback.
- Os usuários podem editar e excluir os produtos adicionados.

#### CustomerFeedback:

- Tela onde os usuários podem deixar feedback sobre os produtos registrados.
- Campo de texto para inserir a avaliação e número de estrelas(0-5).
- Botão para enviar o feedback, que será processado pela API de análise de sentimentos.
- Os usuários podem editar e excluir os feedbacks adicionados.

#### AnalysisFeedback:

- Tela para exibir a análise do feedback do cliente.
- Mostra uma visualização dos sentimentos identificados (positivos, negativos ou neutros) através da integração com a API de análise de sentimentos.
- Exibe um gráfico resumindo os feedbacks para que as empresas possam obter insights acionáveis.
