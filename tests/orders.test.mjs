import console from 'node:console';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
 const { orderMessage, todayISO } = await server.ssrLoadModule('/src/lib/orders.ts');
 const basket = { id: 'demo', name: 'Cesta demonstração', price: 120 };
 const draft = { quantity: 2, date: todayISO(), period: 'manhã', fulfillment: 'entrega', neighborhood: 'Bairro demonstração', extras: '', card: '' };
 const message = orderMessage(basket, draft);
 assert.match(message, /240/); assert.match(message, /ref\. demo/);
 assert.match(message, /sujeitos à confirmação/); assert.match(message, /sem reserva ou pagamento/);
 assert.throws(() => orderMessage(basket, { ...draft, quantity: 0 }));
 assert.throws(() => orderMessage(basket, { ...draft, quantity: 1.5 }));
 assert.throws(() => orderMessage(basket, { ...draft, date: '2026-02-30' }));
 assert.throws(() => orderMessage(basket, { ...draft, neighborhood: '' }));
 assert.match(orderMessage({ ...basket, price: 0 }, { ...draft, fulfillment: 'retirada', neighborhood: '' }), /sob consulta/);
 console.log('Honey Bee: quantity, subtotal, dates, delivery fields and quote-only message passed.');
} finally { await server.close(); }
