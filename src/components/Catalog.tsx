import { OrderModal } from './OrderModal';
import { useEffect, useState } from 'react';
import { supabase, type Basket } from '@/lib/supabase';
import { Package } from 'lucide-react';
import { BasketCard } from './BasketCard';
import { ImageModal } from './ImageModal';

export function Catalog() {
  const [orderBasket, setOrderBasket] = useState<Basket | null>(null);
  const [error, setError] = useState(false);
  const [reload, setReload] = useState(0);
  const [search, setSearch] = useState('');
  const [shareMessage, setShareMessage] = useState('');
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true); setError(false);
      try {
      const { data, error } = await supabase
        .from('baskets')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (cancelled) return;
      if (error) { setError(true); return; }
      if (data) {
        setBaskets(data as Basket[]);
      }
      } catch { if (!cancelled) setError(true); }
      finally { if (!cancelled) setLoading(false); }
    };
    load();
    return () => { cancelled = true; };
  }, [reload]);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id.startsWith('cesta-') && baskets.some(b => `cesta-${b.id}` === id)) document.getElementById(id)?.scrollIntoView({ block: 'center' });
  }, [baskets]);

  const categories = baskets.filter(b => `${b.name} ${b.category} ${b.description}`.toLowerCase().includes(search.toLowerCase())).reduce<Record<string, Basket[]>>((acc, b) => {
    if (!acc[b.category]) acc[b.category] = [];
    acc[b.category].push(b);
    return acc;
  }, {});

  return (
    <section id="catalogo" className="bg-verde-musgo py-20 px-5 text-center">
      <h2 className="font-serif text-4xl md:text-5xl text-bege-suave mb-4">
        Nosso Catálogo
      </h2>
      <div className="w-20 h-1 bg-amarelo-mel mx-auto mb-12 rounded-full" />

      <label className="mx-auto mb-6 block max-w-md text-bege-suave">Buscar no catálogo
        <input className="mt-2 w-full rounded-lg bg-bege-suave p-3 text-verde-musgo" type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome, categoria ou descrição" />
      </label>
      {shareMessage && <p role="status" className="mb-3 text-bege-suave">{shareMessage}</p>}
      {error ? <div role="alert" className="text-bege-suave"><p>Não foi possível carregar o catálogo. Tente novamente ou fale com a loja pelo WhatsApp.</p><button className="mt-3 rounded-lg border p-2" onClick={() => setReload(reload + 1)}>Tentar novamente</button></div> : loading ? (
        <div className="flex flex-col items-center gap-4 text-bege-suave/70 py-12">
          <Package className="w-10 h-10 animate-pulse" />
          <p>Carregando cestas...</p>
        </div>
      ) : baskets.length === 0 ? (
        <p className="text-bege-suave/70 py-12">
          Nenhuma cesta disponível no momento. Volte em breve!
        </p>
      ) : (
        <div className="max-w-6xl mx-auto flex flex-col gap-14">
          {Object.entries(categories).map(([category, items]) => (
            <div key={category} className="animate-slide-up">
              <h3 className="text-amarelo-mel font-serif text-2xl md:text-3xl mb-8">
                {category}
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {items.map((basket) => (
                  <div key={basket.id} id={`cesta-${basket.id}`}><BasketCard
                    basket={basket}
                    onImageClick={() => setModalImage(basket.image_url)}
                    onOrder={() => setOrderBasket(basket)}
                  />
                  <button className="mt-2 text-sm text-bege-suave underline" onClick={async () => {
                    try { const url = new URL(window.location.href); url.hash = `cesta-${basket.id}`; await navigator.clipboard.writeText(url.toString()); setShareMessage('Link da cesta copiado.'); } catch { setShareMessage('Não foi possível copiar o link.'); }
                  }}>Copiar link da cesta</button></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && baskets.length > 0 && Object.keys(categories).length === 0 && <p className="text-bege-suave">Nenhuma cesta encontrada nessa busca.</p>}
      {orderBasket && <OrderModal key={orderBasket.id} basket={orderBasket} onClose={() => setOrderBasket(null)} />}
      <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
    </section>
  );
}

