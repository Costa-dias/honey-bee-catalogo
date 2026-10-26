import { useEffect, useRef, useState } from 'react';
import type { Basket } from '@/lib/supabase';
import { WHATSAPP_NUMBER, orderMessage, todayISO, type OrderDraft } from '@/lib/orders';

export function OrderModal({ basket, onClose }: { basket: Basket; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [draft, setDraft] = useState<OrderDraft>({ quantity: 1, date: todayISO(), period: 'a combinar', fulfillment: 'entrega', neighborhood: '', extras: '', card: '' });
  const [review, setReview] = useState(''), [error, setError] = useState('');
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => { el?.close(); }; }, []);
  const field = 'mt-1 w-full rounded-lg border border-verde-musgo/30 bg-white p-2';
  return <dialog ref={dialog} onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) onClose(); }} className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl bg-bege-suave p-5 text-verde-musgo backdrop:bg-black/60" aria-labelledby="order-title">
    <div className="flex items-center justify-between gap-3"><h2 id="order-title" className="font-serif text-2xl">Encomendar {basket.name}</h2><button aria-label="Fechar encomenda" onClick={onClose}>Fechar</button></div>
    {review ? <div>
      <h3 className="my-3 font-semibold">Confira antes de abrir o WhatsApp</h3>
      <pre className="whitespace-pre-wrap break-words rounded-lg bg-white p-3 font-sans text-sm">{review}</pre>
      <p className="my-3 text-sm">A loja confirmará os valores e a disponibilidade na conversa.</p>
      <div className="flex flex-wrap gap-3"><button className={field} onClick={() => setReview('')}>Editar</button>
      <a className="btn bg-verde-musgo" href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(review)}`} target="_blank" rel="noopener noreferrer">Abrir WhatsApp com o orçamento</a></div>
    </div> : <form className="mt-4 space-y-3" onSubmit={e => { e.preventDefault(); try { setReview(orderMessage(basket, draft)); setError(''); } catch (err) { setError(err instanceof Error ? err.message : 'Confira os campos.'); } }}>
      <label className="block text-sm">Quantidade<input className={field} type="number" min="1" max="99" step="1" value={draft.quantity} onChange={e => setDraft({ ...draft, quantity: Number(e.target.value) })} required /></label>
      <label className="block text-sm">Data desejada<input className={field} type="date" min={todayISO()} value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} required /></label>
      <label className="block text-sm">Período desejado<select className={field} value={draft.period} onChange={e => setDraft({ ...draft, period: e.target.value })}><option value="a combinar">A combinar</option><option value="manhã">Manhã</option><option value="tarde">Tarde</option></select></label>
      <label className="block text-sm">Modalidade<select className={field} value={draft.fulfillment} onChange={e => setDraft({ ...draft, fulfillment: e.target.value as OrderDraft['fulfillment'] })}><option value="entrega">Consultar entrega</option><option value="retirada">Consultar retirada</option></select></label>
      {draft.fulfillment === 'entrega' && <label className="block text-sm">Bairro e cidade<input className={field} maxLength={100} value={draft.neighborhood} onChange={e => setDraft({ ...draft, neighborhood: e.target.value })} required /></label>}
      <label className="block text-sm">Adicionais desejados (a confirmar)<textarea className={field} maxLength={300} value={draft.extras} onChange={e => setDraft({ ...draft, extras: e.target.value })} /></label>
      <label className="block text-sm">Mensagem para o cartão<textarea className={field} maxLength={300} value={draft.card} onChange={e => setDraft({ ...draft, card: e.target.value })} /></label>
      <p className="text-xs">Datas, bairros atendidos, retirada, adicionais e frete precisam de confirmação da loja. Seus campos não são salvos no site; serão levados ao WhatsApp quando você abrir a conversa.</p>
      {error && <p role="alert" className="text-red-700">{error}</p>}
      <button className="btn bg-verde-musgo" type="submit">Revisar orçamento</button>
    </form>}
  </dialog>;
}
