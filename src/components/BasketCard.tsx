import type { Basket } from '@/lib/supabase';

type Props = {
  basket: Basket;
  onImageClick: () => void;
};

export function BasketCard({ basket, onImageClick }: Props) {
  const hasImage = basket.image_url && basket.image_url.length > 0;

  return (
    <div className="bg-bege-suave rounded-xl overflow-hidden w-72 shadow-lg card-hover group">
      <div
        className="w-full h-52 bg-verde-musgo-light/30 flex items-center justify-center overflow-hidden cursor-pointer"
        onClick={onImageClick}
      >
        {hasImage ? (
          <img
            src={basket.image_url}
            alt={basket.name}
            className="w-full h-full object-cover zoom-img"
          />
        ) : (
          <div className="text-bege-suave/50 text-sm px-4 text-center">
            Foto em breve
          </div>
        )}
      </div>

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
      </div>
    </div>
  );
}

