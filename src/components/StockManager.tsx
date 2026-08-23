import { useEffect, useState } from 'react';
import { supabase, type StockMovement } from '@/lib/supabase';
import {
  Plus,
  Trash2,
  ArrowDownCircle,
  ArrowUpCircle,
  Loader2,
  X,
  Save,
  Clock,
  Package as PackageIcon,
} from 'lucide-react';

type NewMovement = {
  product_name: string;
  movement_type: 'entrada' | 'saida';
  quantity: string;
  notes: string;
};

const emptyMovement: NewMovement = {
  product_name: '',
  movement_type: 'entrada',
  quantity: '1',
  notes: '',
};

export function StockManager() {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newMovement, setNewMovement] = useState<NewMovement>(emptyMovement);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterProduct, setFilterProduct] = useState('');

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('stock_movements')
      .select('*')
      .order('recorded_at', { ascending: false });
    if (!error && data) setMovements(data as StockMovement[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!newMovement.product_name.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      product_name: newMovement.product_name.trim(),
      movement_type: newMovement.movement_type,
      quantity: parseInt(newMovement.quantity) || 1,
      notes: newMovement.notes.trim(),
    };

    const { error: insertError } = await supabase.from('stock_movements').insert(payload);

    setSaving(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }

    setNewMovement(emptyMovement);
    setAdding(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este registro de estoque?')) return;
    const { error: deleteError } = await supabase.from('stock_movements').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMovements = filterProduct
    ? movements.filter((m) =>
        m.product_name.toLowerCase().includes(filterProduct.toLowerCase())
      )
    : movements;

  const totals = movements.reduce(
    (acc, m) => {
      const key = m.product_name;
      if (!acc[key]) acc[key] = 0;
      acc[key] += m.movement_type === 'entrada' ? m.quantity : -m.quantity;
      return acc;
    },
    {} as Record<string, number>
  );

  const productNames = Object.keys(totals).sort();

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200 mb-6">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl text-verde-musgo">Controle de Estoque</h2>
          <p className="text-sm text-preto/60 mt-1">
            Registre entradas e saídas de produtos com horário e observações.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="btn bg-verde-musgo hover:bg-verde-musgo-dark flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Registro
        </button>
      </div>

      {productNames.length > 0 && (
        <div className="mb-8 bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-serif text-lg text-verde-musgo mb-4 flex items-center gap-2">
            <PackageIcon size={20} />
            Saldo por produto
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {productNames.map((name) => {
              const total = totals[name];
              return (
                <div
                  key={name}
                  className={`rounded-lg p-3 border ${
                    total > 0
                      ? 'bg-green-50 border-green-200'
                      : total < 0
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <p className="text-sm font-medium text-verde-musgo truncate">{name}</p>
                  <p
                    className={`text-xl font-bold mt-1 ${
                      total > 0
                        ? 'text-green-700'
                        : total < 0
                        ? 'text-red-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {total > 0 ? '+' : ''}
                    {total}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={filterProduct}
          onChange={(e) => setFilterProduct(e.target.value)}
          placeholder="Filtrar por produto..."
          className="w-full max-w-xs px-4 py-2 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel text-sm"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-verde-musgo/60">
          <Loader2 className="animate-spin mr-2" size={24} />
          Carregando...
        </div>
      ) : filteredMovements.length === 0 ? (
        <div className="text-center py-16 text-preto/50">
          <p>Nenhum registro de estoque ainda.</p>
          <p className="text-sm mt-1">Clique em "Novo Registro" para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-verde-musgo text-bege-suave">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Produto</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 font-medium">Qtd</th>
                <th className="text-left px-4 py-3 font-medium">Observações</th>
                <th className="text-left px-4 py-3 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Horário
                  </span>
                </th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.map((m) => (
                <tr
                  key={m.id}
                  className="border-b border-verde-musgo/8 hover:bg-bege-suave/50 transition-colors"
                >
                  <td className="px-4 py-3 font-medium text-verde-musgo">{m.product_name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        m.movement_type === 'entrada'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {m.movement_type === 'entrada' ? (
                        <ArrowDownCircle size={14} />
                      ) : (
                        <ArrowUpCircle size={14} />
                      )}
                      {m.movement_type === 'entrada' ? 'Entrada' : 'Saída'}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold">{m.quantity}</td>
                  <td className="px-4 py-3 text-preto/60 max-w-xs truncate">
                    {m.notes || '—'}
                  </td>
                  <td className="px-4 py-3 text-preto/60 whitespace-nowrap">
                    {formatDate(m.recorded_at)}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-500 hover:text-red-700 transition-colors p-1"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adding && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-5 animate-fade-in"
          onClick={() => setAdding(false)}
        >
          <div
            className="bg-bege-suave rounded-2xl shadow-2xl w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-verde-musgo/10">
              <h3 className="font-serif text-xl text-verde-musgo">Novo Registro de Estoque</h3>
              <button
                onClick={() => setAdding(false)}
                className="text-preto/40 hover:text-preto transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              {error && (
                <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-verde-musgo mb-1">
                  Nome do produto
                </label>
                <input
                  type="text"
                  value={newMovement.product_name}
                  onChange={(e) =>
                    setNewMovement({ ...newMovement, product_name: e.target.value })
                  }
                  placeholder="Ex: Café gourmet 500g"
                  className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-verde-musgo mb-1">
                  Tipo de movimentação
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewMovement({ ...newMovement, movement_type: 'entrada' })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${
                      newMovement.movement_type === 'entrada'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-verde-musgo/15 text-preto/50 hover:border-verde-musgo/30'
                    }`}
                  >
                    <ArrowDownCircle size={18} />
                    Entrada
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMovement({ ...newMovement, movement_type: 'saida' })}
                    className={`flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 transition-all ${
                      newMovement.movement_type === 'saida'
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-verde-musgo/15 text-preto/50 hover:border-verde-musgo/30'
                    }`}
                  >
                    <ArrowUpCircle size={18} />
                    Saída
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-verde-musgo mb-1">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="0"
                  value={newMovement.quantity}
                  onChange={(e) =>
                    setNewMovement({ ...newMovement, quantity: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-verde-musgo mb-1">
                  Observações
                </label>
                <textarea
                  value={newMovement.notes}
                  onChange={(e) => setNewMovement({ ...newMovement, notes: e.target.value })}
                  placeholder="Ex: Compra de fornecedor, ajuste de inventário..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t border-verde-musgo/10">
              <button
                onClick={() => setAdding(false)}
                className="flex-1 py-2.5 rounded-lg border border-verde-musgo/20 text-verde-musgo hover:bg-verde-musgo/5 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 btn bg-verde-musgo hover:bg-verde-musgo-dark flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <Save size={20} />
                    Registrar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

