import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { ArrowLeft, LogOut, Package, ClipboardList } from 'lucide-react';
import { BasketManager } from './BasketManager';
import { StockManager } from './StockManager';

type Props = {
  onBack: () => void;
};

type Tab = 'baskets' | 'stock';

export function AdminPanel({ onBack }: Props) {
  const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>('baskets');

  const handleSignOut = async () => {
    await signOut();
    onBack();
  };

  return (
    <div className="min-h-screen bg-bege-suave">
      <header className="bg-verde-musgo text-bege-suave shadow-lg">
        <div className="container mx-auto px-5 py-5 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl">Painel Honey Bee</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-bege-suave/70 hover:text-amarelo-mel transition-colors text-sm"
            >
              <ArrowLeft size={18} />
              Ver site
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-verde-musgo-light hover:bg-verde-musgo-dark text-bege-suave px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-5 py-8">
        <div className="flex gap-2 mb-8 border-b border-verde-musgo/15">
          <button
            onClick={() => setTab('baskets')}
            className={`flex items-center gap-2 px-5 py-3 font-medium transition-all border-b-2 -mb-px ${
              tab === 'baskets'
                ? 'border-amarelo-mel text-verde-musgo'
                : 'border-transparent text-preto/50 hover:text-verde-musgo'
            }`}
          >
            <Package size={20} />
            Mostruário de Cestas
          </button>
          <button
            onClick={() => setTab('stock')}
            className={`flex items-center gap-2 px-5 py-3 font-medium transition-all border-b-2 -mb-px ${
              tab === 'stock'
                ? 'border-amarelo-mel text-verde-musgo'
                : 'border-transparent text-preto/50 hover:text-verde-musgo'
            }`}
          >
            <ClipboardList size={20} />
            Controle de Estoque
          </button>
        </div>

        <div className="animate-fade-in">
          {tab === 'baskets' ? <BasketManager /> : <StockManager />}
        </div>
      </div>
    </div>
  );
}

