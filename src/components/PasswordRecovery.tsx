import { useState, type FormEvent } from 'react';
import { Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { HoneyBeeLogo } from '@/components/HoneyBeeLogo';

type Props = {
  hasSession: boolean;
  onDone: () => Promise<void>;
};

export function PasswordRecovery({ hasSession, onDone }: Props) {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [complete, setComplete] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('A senha precisa ter pelo menos 8 caracteres.');
      return;
    }

    if (password !== confirmation) {
      setError('As senhas não coincidem.');
      return;
    }

    setSaving(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setComplete(true);
    setPassword('');
    setConfirmation('');
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-verde-musgo px-5 py-12">
      <section className="w-full max-w-md bg-bege-suave rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="bg-black rounded-full p-3 mb-4">
            <HoneyBeeLogo className="w-16 h-16" />
          </div>
          <h1 className="font-serif text-2xl text-verde-musgo">
            {complete ? 'Senha atualizada' : 'Definir nova senha'}
          </h1>
          <p className="text-sm text-preto/60 mt-2">
            {complete
              ? 'Sua senha foi alterada com segurança.'
              : 'Este acesso foi liberado pelo link de recuperação enviado ao seu e-mail.'}
          </p>
        </div>

        {!hasSession ? (
          <div className="text-center text-sm text-red-700">
            O link de recuperação é inválido ou expirou. Solicite um novo pelo administrador do Supabase.
          </div>
        ) : complete ? (
          <div className="flex flex-col items-center gap-5">
            <CheckCircle2 className="text-verde-musgo" size={32} />
            <button
              type="button"
              onClick={onDone}
              className="btn bg-verde-musgo hover:bg-verde-musgo-dark w-full"
            >
              Ir para o login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-verde-musgo/40"
                size={18}
              />
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Nova senha (mínimo 8 caracteres)"
                aria-label="Nova senha"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-verde-musgo/20 bg-bege-claro focus:outline-none focus:ring-2 focus:ring-amarelo-mel transition-all"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-verde-musgo/40"
                size={18}
              />
              <input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="Confirme a nova senha"
                aria-label="Confirme a nova senha"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-verde-musgo/20 bg-bege-claro focus:outline-none focus:ring-2 focus:ring-amarelo-mel transition-all"
              />
            </div>

            {error && (
              <div role="alert" className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn bg-verde-musgo hover:bg-verde-musgo-dark flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={20} /> : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
