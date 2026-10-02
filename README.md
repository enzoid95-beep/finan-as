# Nosso caixa

Controle financeiro do casal: um caixa único, com gastos, entradas e limites por categoria.
Site estático (GitHub Pages) + banco de dados e login no Supabase.

## 1. Criar o banco no Supabase

1. Crie uma conta em https://supabase.com e um projeto novo (o plano gratuito basta).
2. Abra **SQL Editor**, cole o conteúdo de `schema.sql`.
3. No final do arquivo, troque os dois e-mails e nomes pelos de vocês. Rode (**Run**).

## 2. Configurar o site

1. No Supabase, vá em **Project Settings > API** e copie a **Project URL** e a chave **anon public** (ou **publishable**).
2. Cole as duas no arquivo `config.js`.

## 3. Publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser privado se sua conta permitir Pages em privados; senão, público. Os dados não ficam no código, ficam no Supabase).
2. Envie os arquivos `index.html`, `config.js`, `schema.sql` e `README.md` (**Add file > Upload files**).
3. Vá em **Settings > Pages**, em *Source* escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em um ou dois minutos o endereço aparece ali, algo como `https://seu-usuario.github.io/nosso-caixa/`.

## 4. Liberar o login para esse endereço

No Supabase, vá em **Authentication > URL Configuration**:

- **Site URL**: cole o endereço do GitHub Pages.
- **Redirect URLs**: adicione o mesmo endereço.

Sem isso, o link do e-mail leva para o lugar errado.

## 5. Usar

Abram o site, digitem o e-mail e toquem no link que chega (abram no mesmo aparelho).
Dica: no celular, use "Adicionar à tela de início" para abrir como um app.

## Observações

- Só os e-mails da tabela `membros` conseguem ver ou lançar qualquer coisa. Para trocar alguém, edite essa tabela no **Table Editor**.
- O envio de e-mail embutido do Supabase tem limite de poucos e-mails por hora. Se o link não chegar, espere um pouco e tente de novo.
- Projetos gratuitos do Supabase pausam após cerca de uma semana sem uso; é só reativar no painel.
