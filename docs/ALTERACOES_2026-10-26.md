# Alterações e validação — 26/10/2026

## Mudanças

- Catálogo: busca, link direto por cesta e erro com nova tentativa, distinto de catálogo vazio.
- Orçamento por cesta: quantidade, data/período desejados, modalidade, bairro/cidade, adicionais e cartão.
- Cliente revisa a mensagem antes de abrir o WhatsApp. Subtotal não inclui frete ou adicionais; o texto pede confirmação da loja, sem reserva ou pagamento.
- Estoque: quantidade precisa ser inteira e positiva; erro de leitura aparece em tela.
- README atualizado para React/TypeScript, Supabase e Render; teste de orçamento incluído no CI.

## Verificação

`npm test`, typecheck, lint e build passaram. No navegador local com catálogo simulado: formulário de 390 px, subtotal de duas unidades, mensagem do WhatsApp, erro de catálogo e nova tentativa foram verificados. Nenhuma mensagem foi enviada.

## Pendência externa

Em 26/10/2026, o projeto Supabase honey-bee-producao retornou INACTIVE e uma consulta de leitura falhou com Database is possibly not accessible at the moment. Não houve alterações de banco ou autenticação. Operações reais do catálogo/admin precisam ser revalidadas quando o banco estiver acessível. Composição de custos e baixa automática de estoque não fazem parte desta implementação.
