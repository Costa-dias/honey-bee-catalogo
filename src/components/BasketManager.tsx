import { useEffect, useState } from 'react';
import { supabase, type Basket } from '@/lib/supabase';
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  X,
  Upload,
  Loader2,
  Save,
} from 'lucide-react';

type EditingBasket = {
  id?: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image_url: string;
  display_order: number;
  is_visible: boolean;
};

const emptyBasket: EditingBasket = {
  name: '',
  description: '',
  price: '',
  category: 'Diversos',
  image_url: '',
  display_order: 0,
  is_visible: true,
};

export function BasketManager() {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<EditingBasket | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('baskets')
      .select('*')
      .order('display_order', { ascending: true });
    if (!error && data) setBaskets(data as Basket[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    if (!editing.name.trim()) {
      setError('O nome da cesta é obrigatório.');
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      name: editing.name.trim(),
      description: editing.description.trim(),
      price: parseFloat(editing.price) || 0,
      category: editing.category.trim() || 'Diversos',
      image_url: editing.image_url,
      display_order: editing.display_order,
      is_visible: editing.is_visible,
      updated_at: new Date().toISOString(),
    };

    if (editing.id) {
      const { error: updateError } = await supabase
        .from('baskets')
        .update(payload)
        .eq('id', editing.id);
      if (updateError) setError(updateError.message);
    } else {
      const { error: insertError } = await supabase
        .from('baskets')
        .insert(payload);
      if (insertError) setError(insertError.message);
    }

    setSaving(false);
    if (!error) {
      setEditing(null);
      load();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta cesta?')) return;
    const { error: deleteError } = await supabase.from('baskets').delete().eq('id', id);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    load();
  };

  const toggleVisible = async (basket: Basket) => {
    const { error: updateError } = await supabase
      .from('baskets')
      .update({ is_visible: !basket.is_visible, updated_at: new Date().toISOString() })
      .eq('id', basket.id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    load();
  };

  const handleUpload = async (file: File) => {
    if (!editing) return;
    setUploading(true);
    setError(null);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('baskets')
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('baskets').getPublicUrl(filePath);

    setEditing({ ...editing, image_url: urlData.publicUrl });
    setUploading(false);
  };

  return (
    <div>
      {error && (
        <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200 mb-6">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="font-serif text-2xl text-verde-musgo">Mostruário de Cestas</h2>
          <p className="text-sm text-preto/60 mt-1">
            Adicione fotos, observações e valores das cestas. As cestas visíveis
            aparecem no catálogo público.
          </p>
        </div>
        <button
          onClick={() => setEditing({ ...emptyBasket })}
          className="btn bg-verde-musgo hover:bg-verde-musgo-dark flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Cesta
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-verde-musgo/60">
          <Loader2 className="animate-spin mr-2" size={24} />
          Carregando...
        </div>
      ) : baskets.length === 0 ? (
        <div className="text-center py-16 text-preto/50">
          <p>Nenhuma cesta cadastrada ainda.</p>
          <p className="text-sm mt-1">Clique em "Nova Cesta" para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {baskets.map((basket) => (
            <div
              key={basket.id}
              className="bg-white rounded-xl shadow-md overflow-hidden card-hover"
            >
              <div className="w-full h-44 bg-bege-suave overflow-hidden relative">
                {basket.image_url ? (
                  <img
                    src={basket.image_url}
                    alt={basket.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-preto/30 text-sm">
                    Sem foto
                  </div>
                )}
                <span
                  className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                    basket.is_visible
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {basket.is_visible ? 'Visível' : 'Oculta'}
                </span>
              </div>
              <div className="p-4">
                <p className="font-serif text-lg text-verde-musgo">{basket.name}</p>
                <p className="text-xs text-amarelo-mel-dark mt-1">{basket.category}</p>
                {basket.description && (
                  <p className="text-sm text-preto/60 mt-2 line-clamp-2">
                    {basket.description}
                  </p>
                )}
                {basket.price > 0 && (
                  <p className="text-verde-musgo font-semibold mt-2">
                    R$ {basket.price.toFixed(2).replace('.', ',')}
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() =>
                      setEditing({
                        id: basket.id,
                        name: basket.name,
                        description: basket.description,
                        price: String(basket.price),
                        category: basket.category,
                        image_url: basket.image_url,
                        display_order: basket.display_order,
                        is_visible: basket.is_visible,
                      })
                    }
                    className="flex-1 flex items-center justify-center gap-1 bg-verde-musgo/10 hover:bg-verde-musgo/20 text-verde-musgo py-2 rounded-lg text-sm transition-colors"
                  >
                    <Pencil size={16} />
                    Editar
                  </button>
                  <button
                    onClick={() => toggleVisible(basket)}
                    className="flex items-center justify-center bg-verde-musgo/10 hover:bg-verde-musgo/20 text-verde-musgo p-2 rounded-lg transition-colors"
                    title={basket.is_visible ? 'Ocultar' : 'Mostrar'}
                  >
                    {basket.is_visible ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(basket.id)}
                    className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-5 animate-fade-in"
          onClick={() => setEditing(null)}
        >
          <div
            className="bg-bege-suave rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-verde-musgo/10">
              <h3 className="font-serif text-xl text-verde-musgo">
                {editing.id ? 'Editar Cesta' : 'Nova Cesta'}
              </h3>
              <button
                onClick={() => setEditing(null)}
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
                  Nome da cesta
                </label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="Ex: Cesta Café Clássica"
                  className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-verde-musgo mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  placeholder="Ex: Cestas de Café"
                  className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-verde-musgo mb-1">
                  Observações (visível no mostruário)
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  placeholder="Descrição da cesta, itens inclusos, etc."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-verde-musgo mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editing.price}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    placeholder="0,00"
                    className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-verde-musgo mb-1">
                    Ordem
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editing.display_order}
                    onChange={(e) =>
                      setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-verde-musgo/20 bg-white focus:outline-none focus:ring-2 focus:ring-amarelo-mel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-verde-musgo mb-2">
                  Foto da cesta
                </label>
                {editing.image_url && (
                  <div className="mb-3 relative inline-block">
                    <img
                      src={editing.image_url}
                      alt="Prévia"
                      className="w-32 h-32 object-cover rounded-lg border border-verde-musgo/20"
                    />
                    <button
                      onClick={() => setEditing({ ...editing, image_url: '' })}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-verde-musgo/25 hover:border-amarelo-mel hover:bg-amarelo-mel/5 text-verde-musgo cursor-pointer transition-all">
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      Enviar foto
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(file);
                    }}
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.is_visible}
                  onChange={(e) => setEditing({ ...editing, is_visible: e.target.checked })}
                  className="w-5 h-5 rounded accent-amarelo-mel"
                />
                <span className="text-sm text-verde-musgo">
                  Visível no catálogo público
                </span>
              </label>
            </div>

            <div className="flex gap-3 p-6 border-t border-verde-musgo/10">
              <button
                onClick={() => setEditing(null)}
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
                    Salvar
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

