import { MessageCircle, Instagram } from 'lucide-react';

export function SocialFloat() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      <a
        href="https://wa.me/818090306709"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-whatsapp shadow-lg flex items-center justify-center transition-transform hover:scale-115"
        aria-label="WhatsApp"
      >
        <MessageCircle className="text-white" size={28} />
      </a>
      <a
        href="https://www.instagram.com/b_honey.bee"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-instagram shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Instagram"
      >
        <Instagram className="text-white" size={28} />
      </a>
    </div>
  );
}

