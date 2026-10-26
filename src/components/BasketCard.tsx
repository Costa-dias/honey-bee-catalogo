import type { Basket } from '@/lib/supabase';

type Props = {
  basket: Basket;
  onImageClick: () => void;
  onOrder: () => void;
};

export function BasketCard({ basket, onImageClick, onOrder }: Props) {
  const hasImage = basket.image_url && basket.image_url.length > 0;

  return (
    <div className="bg-bege-suave rounded-xl overflow-hidden w-72 shadow-lg card-hover group">
      <button type="button" aria-label={`Ampliar foto de ${basket.name}`}
        className="w-full h-52 bg-verde-musgo-light/30 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={onImageClick}
      >
        {hasImage ? (
          <img
            loading="lazy"
            decoding="async"
            src={basket.image_url}
            alt={basket.name}
            className="w-full h-full object-cover zoom-img"
          />
        ) : (
          <div className="text-bege-suave/50 text-sm px-4 text-center">
            Foto em breve
          </div>
        )}
      </button>

      <div className="p-4 text-left">
        <p className="font-serif text-lg text-verde-musgo mb-1">{basket.name}</p>
        {basket.description && (
          <p className="text-sm text-preto/70 mb-3 leading-relaxed">
            {basket.description}
          </p>
        )}
        {basket.price > 0 && (
          <div className="inline-block bg-amarelo-mel text-preto font-semibold px-3 py-1 rounded-full text-sm">
            R$ {basket.price.toFixed(2).replace('.', ',')}
          </div>
        )}
        <button className="mt-4 w-full rounded-lg bg-verde-musgo px-3 py-2 text-bege-suave" onClick={onOrder}>Consultar encomenda</button>
      </div>
    </div>
  );
}

