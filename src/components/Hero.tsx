import { MessageCircle, Instagram } from 'lucide-react';

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative text-white text-center py-32 px-5 overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/6087638/pexels-photo-6087638.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-verde-musgo/75" />

      <div className="relative z-10 max-w-2xl mx-auto animate-fade-in">
        <h1 className="font-serif text-4xl md:text-5xl mb-5 leading-tight">
          Bem-vinda à <span className="text-amarelo-mel">Honey Bee</span>
        </h1>
        <p className="text-base md:text-lg text-bege-suave/90 leading-relaxed mb-8">
          As melhores cestas você encontra por aqui! Proporcionando experiências
          únicas com presentes afetivos para alegrar o seu momento. Fique à
          vontade para acessar nosso perfil e fazer um pedido via WhatsApp.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://wa.me/818090306709"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp flex items-center gap-2"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>
          <a
            href="https://www.instagram.com/b_honey.bee"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-instagram flex items-center gap-2"
          >
            <Instagram size={20} />
            Instagram
          </a>
        </div>
      </div>
    </section>
  );
}

