# Manutenção — 30/10/2026

## Honey Bee — 2.0.0 → 2.0.1

Manutenção das bibliotecas de build e tipagens. O teste de orçamento deixou de iniciar uma varredura de dependências que poderia continuar após o fechamento do servidor de teste. A solicitação pelo WhatsApp continua exigindo revisão do cliente; não passou a reservar estoque, confirmar encomenda ou realizar pagamento. O SDK Supabase JavaScript já estava atualizado e foi preservado.

### Bibliotecas diretas alteradas

| Biblioteca | Antes | Depois | Para que serve |
|---|---|---|---|
| `typescript-eslint` | 8.72.0 | 8.72.1 | Verifica código TypeScript e regras de qualidade. |

### Verificações

Teste de orçamento, TypeScript, lint e build.

Auditoria das dependências JavaScript: nenhuma vulnerabilidade conhecida reportada após as mudanças. Isso não substitui revisão de código nem significa risco zero.
