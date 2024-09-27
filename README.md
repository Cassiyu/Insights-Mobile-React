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

<br/>

- --------------------------------------------------

## Aplicativo

### Funcionalidades Gerais
- Autenticação: O aplicativo permite que os usuários façam login ou se cadastrem usando o Firebase Authentication.
- Cadastro de Produtos: Os usuários podem registrar os produtos.
- Feedback dos Clientes: Após o registro do produto, os usuários podem deixar feedbacks.
- Análise de Sentimentos: Utilizando a API de análise de sentimentos, o aplicativo processa o feedback dos clientes, identificando se as opiniões são positivas, negativas ou neutras.
- Visualização dos Insights: Os usuários podem ver uma análise detalhada dos feedbacks, ajudando as empresas a entender o que está funcionando e o que precisa ser melhorado.

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

#### CustomerFeedback:

- Tela onde os usuários podem deixar feedback sobre os produtos registrados.
- Campo de texto para inserir a avaliação e número de estrelas(0-5).
- Botão para enviar o feedback, que será processado pela API de análise de sentimentos.

#### AnalysisFeedback:

- Tela para exibir a análise do feedback do cliente.
- Mostra uma visualização dos sentimentos identificados (positivos, negativos ou neutros) através da integração com a API de análise de sentimentos.
- Exibe um gráfico resumindo os feedbacks para que as empresas possam obter insights acionáveis.
