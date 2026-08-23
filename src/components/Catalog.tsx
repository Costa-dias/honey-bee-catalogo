import { useEffect, useState } from 'react';
import { supabase, type Basket } from '@/lib/supabase';
import { Package } from 'lucide-react';
import { BasketCard } from './BasketCard';
import { ImageModal } from './ImageModal';

export function Catalog() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('baskets')
        .select('*')
        .eq('is_visible', true)
        .order('display_order', { ascending: true });

      if (!error && data) {
        setBaskets(data as Basket[]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const categories = baskets.reduce<Record<string, Basket[]>>((acc, b) => {
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

      {loading ? (
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
                  <BasketCard
                    key={basket.id}
                    basket={basket}
                    onImageClick={() => setModalImage(basket.image_url)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
    </section>
  );
}

