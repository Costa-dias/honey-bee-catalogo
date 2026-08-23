import { X } from 'lucide-react';

type Props = {
  src: string | null;
  onClose: () => void;
};

export function ImageModal({ src, onClose }: Props) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 z-[9999] flex items-center justify-center p-5 animate-fade-in"
      onClick={onClose}
    >
      <button
        className="absolute top-5 right-5 text-white hover:text-amarelo-mel transition-colors"
        onClick={onClose}
        aria-label="Fechar"
      >
        <X size={40} />
      </button>
      <img
        src={src}
        alt="Imagem ampliada"
        className="max-w-[90%] max-h-[85vh] rounded-lg animate-surgir object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

