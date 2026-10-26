import type { Basket } from './supabase';
export const WHATSAPP_NUMBER = '818090306709'; // existing business contact
export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
export function todayISO(): string {
  const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export interface OrderDraft { quantity: number; date: string; period: string; fulfillment: 'entrega' | 'retirada'; neighborhood: string; extras: string; card: string; }
export function orderMessage(basket: Basket, draft: OrderDraft): string {
  const date = new Date(`${draft.date}T12:00:00`);
  if (!Number.isInteger(draft.quantity) || draft.quantity < 1 || draft.quantity > 99 || !/^\d{4}-\d{2}-\d{2}$/.test(draft.date) || !Number.isFinite(date.getTime()) || `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}` !== draft.date || draft.date < todayISO() || !['manhã', 'tarde', 'a combinar'].includes(draft.period) || !['entrega', 'retirada'].includes(draft.fulfillment) || (draft.fulfillment === 'entrega' && !draft.neighborhood.trim())) throw new Error('Confira quantidade, data, período e bairro para entrega.');
  return [`Olá! Gostaria de consultar esta encomenda:`, `Cesta: ${basket.name} (ref. ${basket.id})`, `Quantidade: ${draft.quantity}`, `Subtotal das cestas: ${basket.price > 0 ? money(basket.price * draft.quantity) : 'sob consulta'}`, `Data desejada: ${draft.date.split('-').reverse().join('/')} · ${draft.period}`, `Modalidade: ${draft.fulfillment}${draft.fulfillment === 'entrega' ? ` · Bairro/cidade: ${draft.neighborhood.slice(0, 100)}` : ''}`, `Adicionais desejados (preço a confirmar): ${draft.extras.slice(0, 300) || 'nenhum'}`, `Mensagem do cartão: ${draft.card.slice(0, 300) || 'sem mensagem'}`, 'Disponibilidade, antecedência, área atendida, frete e total final sujeitos à confirmação da loja. Este é um pedido de orçamento, sem reserva ou pagamento.'].join('\n');
}
