import { Instagram } from 'lucide-react';

export function Footer() {
  return (
    <footer
      id="contato"
      className="bg-verde-musgo-dark text-white text-center py-10 px-5"
    >
      <p className="text-sm text-bege-suave/90">
        &copy; {new Date().getFullYear()} Honey Bee | Cestas e Experiências Afetivas
      </p>
      <p className="text-sm mt-2">
        Siga-nos no{' '}
        <a
          href="https://www.instagram.com/b_honey.bee"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amarelo-mel hover:underline inline-flex items-center gap-1"
        >
          <Instagram size={14} />
          Instagram
        </a>
      </p>
    </footer>
  );
}

