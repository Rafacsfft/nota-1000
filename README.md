# Nota 1000

Plataforma web de treino para redação do ENEM, com editor de 30 linhas, modo simulado, envio de foto ou PDF, correção assistida por IA, histórico de resultados e painel das cinco competências.

O projeto agora é independente da hospedagem de desenvolvimento anterior. O acesso usa Firebase Authentication, os dados ficam no Cloud Firestore e a correção é executada no servidor com uma chave da API da OpenAI pertencente ao administrador do site. O aluno não precisa ter conta em nenhum serviço de IA.

## Tecnologias

- Next.js 16 e React 19
- Firebase Authentication (Google e e-mail/senha)
- Cloud Firestore e Firebase Storage
- Firebase App Hosting
- API da OpenAI, chamada exclusivamente no servidor

## Executar no VS Code

1. Instale o Node.js 22 ou superior.
2. Abra esta pasta no VS Code.
3. No terminal, execute `npm install`.
4. Copie `.env.example` para `.env.local`.
5. Preencha as variáveis do Firebase e a chave `OPENAI_API_KEY`.
6. Execute `npm run dev`.
7. Abra `http://localhost:3000`.

Nunca coloque `OPENAI_API_KEY` em uma variável iniciada por `NEXT_PUBLIC_` nem envie o arquivo `.env.local` ao GitHub.

## Configurar o Firebase

1. Crie um projeto no Firebase Console.
2. Em **Authentication**, ative os provedores **Google** e **E-mail/senha**.
3. Em **Authentication > Settings > Authorized domains**, adicione seu domínio final.
4. Crie um banco **Cloud Firestore** e um bucket **Storage**.
5. Em **Project settings > Your apps**, registre um aplicativo Web.
6. Copie os valores do SDK Web para as variáveis `NEXT_PUBLIC_FIREBASE_*` do `.env.local`.
7. Instale a CLI: `npm install -g firebase-tools`.
8. Entre na conta: `firebase login`.
9. Selecione o projeto: `firebase use SEU_PROJECT_ID`.
10. Publique as regras: `firebase deploy --only firestore:rules,firestore:indexes,storage`.

As regras incluídas neste repositório impedem que um usuário leia o histórico de outro. A gravação de correções e do consumo mensal acontece somente pelo servidor.

## Configurar a correção por IA

Crie uma chave de API para o projeto e armazene-a como segredo no Firebase App Hosting. Para ambiente local, use apenas `OPENAI_API_KEY` no `.env.local`.

Variáveis disponíveis:

- `OPENAI_MODEL`: modelo usado na correção.
- `MONTHLY_CORRECTION_LIMIT`: limite por usuário a cada mês; padrão 5.
- `STORE_ESSAY_TEXT`: mantenha `false` para não salvar o texto integral da redação.

O endpoint `/api/correct` valida o token Firebase, limita tamanho e formato do envio, controla a franquia mensal, solicita uma resposta estruturada e salva apenas o resultado. A chave nunca é enviada ao navegador.

## Publicar pelo GitHub e Firebase App Hosting

1. Crie um repositório no GitHub e envie esta pasta para a branch `main`.
2. No Firebase Console, abra **App Hosting** e escolha **Get started**.
3. Conecte sua conta do GitHub e selecione o repositório e a branch `main`.
4. Cadastre as variáveis públicas `NEXT_PUBLIC_*` no backend do App Hosting.
5. Cadastre `OPENAI_API_KEY` no Secret Manager e permita que o backend acesse o segredo.
6. Confirme o domínio temporário do Firebase e faça uma publicação de teste.
7. Depois, conecte o domínio próprio e atualize `NEXT_PUBLIC_SITE_URL` e os domínios autorizados do Authentication.

O arquivo `apphosting.yaml` contém a configuração de execução e a referência ao segredo. Os valores públicos do seu projeto Firebase não estão preenchidos porque são exclusivos da sua conta.

## Comandos de qualidade

- `npm run lint` — verifica padrões e erros estáticos.
- `npm run typecheck` — valida os tipos TypeScript.
- `npm run build` — produz a versão de produção.
- `npm test` — executa typecheck e build.

## Rotas principais

- `/` — apresentação pública.
- `/inicio` — painel do aluno.
- `/login` — login e cadastro próprios.
- `/correcao` — editor e envio de redação.
- `/simulado` — treino cronometrado.
- `/aprender` — conteúdo de estudo.
- `/perfil` — conta, dados e exclusão.
- `/privacidade` e `/termos` — documentos legais iniciais.

## Antes do lançamento público

- Substitua o e-mail de suporte pelo endereço real.
- Revise Termos e Privacidade com um responsável e orientação jurídica adequada ao Brasil, especialmente por atender estudantes e poder tratar dados de menores.
- Configure alertas de orçamento no Firebase/Google Cloud e no provedor da API.
- Teste criação, recuperação e exclusão de conta, limites de uso, upload e visualização mobile.
- Não anuncie a correção como resultado oficial do ENEM; ela é uma ferramenta educacional de treino.
