import { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { HoneyBeeLogo } from './HoneyBeeLogo';

type Props = {
  onAdminClick: () => void;
};

export function Header({ onAdminClick }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Catálogo', href: '#catalogo' },
    { label: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="bg-black py-8 px-4 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-3">
          <HoneyBeeLogo className="w-14 h-14" />
          <span className="font-serif text-2xl text-amarelo-mel tracking-wide">Honey Bee</span>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-bege-suave font-medium hover:text-amarelo-mel transition-colors duration-300"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={onAdminClick}
            className="flex items-center gap-2 text-bege-suave/60 hover:text-amarelo-mel transition-colors duration-300 text-sm"
            title="Área da administradora"
          >
            <Lock size={16} />
            <span>Admin</span>
          </button>
        </nav>

        <button
          className="md:hidden text-bege-suave"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {menuOpen && (
        <nav className="md:hidden mt-6 flex flex-col items-center gap-4 animate-fade-in">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNavClick(link.href)}
              className="text-bege-suave font-medium hover:text-amarelo-mel transition-colors text-lg"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMenuOpen(false);
              onAdminClick();
            }}
            className="flex items-center gap-2 text-bege-suave/60 hover:text-amarelo-mel transition-colors text-sm"
          >
            <Lock size={16} />
            <span>Admin</span>
          </button>
        </nav>
      )}
    </header>
  );
}

