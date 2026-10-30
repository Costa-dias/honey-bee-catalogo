# Honey Bee — catálogo e orçamento de cestas

**Versão 2.0.0 · atualizado em 30/10/2026**

Mudança de página estática para aplicação React/TypeScript com catálogo dinâmico, administração autenticada, estoque e orçamento revisável no WhatsApp.

[Histórico e critérios da versão](RELEASES.md).

Aplicação React/TypeScript com catálogo público, painel administrativo, autenticação e dados no Supabase. [Abrir site](https://honey-bee-catalogo.onrender.com/).

## Experiência do cliente

- Cestas por categoria, busca por nome/descrição e ampliação de imagem.
- Link direto compartilhável por cesta.
- Consulta de encomenda por produto: quantidade, data/período desejados, entrega ou retirada, bairro/cidade, adicionais e mensagem do cartão.
- Prévia do orçamento antes de abrir o WhatsApp com a mensagem preenchida.
- Subtotal inclui apenas o preço de catálogo vezes a quantidade. Se não houver preço, aparece sob consulta. Adicionais, frete, antecedência, área atendida e disponibilidade dependem de confirmação da loja.
- Formulário não salva encomendas no banco e não reserva estoque nem realiza pagamentos.
- Falha ao consultar o catálogo exibe erro e opção de tentar novamente; é distinta de catálogo vazio.

O número comercial utilizado é o contato já existente no projeto. Não foram inventadas tarifas, bairros atendidos ou regras comerciais.

## Administração

Cadastro/edição de cestas, fotos, ordem e visibilidade; registro de entradas e saídas de estoque com validação de quantidade positiva. Custos/ficha de composição e baixa automática por encomenda não foram implementados: exigem definição operacional e mudanças no banco validadas com o projeto ativo.

## Executar

Node.js 24; configure `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` com os valores do ambiente. Nunca use `service_role` no frontend.

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

A build estática gera `dist/` para o deploy configurado no Render. A consulta de encomenda exige dados do catálogo disponíveis. Validação local com dados fictícios não comprova autenticação nem operações do banco em produção.

## Validação

Os testes do orçamento cobrem subtotal, referência, quantidade e data inválidas, campos de entrega e indicação de frete/adicionais a confirmar. Para testar operações administrativas reais, o projeto Supabase precisa estar ativo e acessível.
