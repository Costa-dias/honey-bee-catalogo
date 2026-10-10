import { useState } from 'react';
import { Lock, Mail, ArrowLeft, UserPlus, LogIn, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { HoneyBeeLogo } from '@/components/HoneyBeeLogo';

type Props = {
  onBack: () => void;
};

type Mode = 'login' | 'signup' | 'recover';

export function AdminLogin({ onBack }: Props) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (mode === 'recover') {
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin,
      });

      setLoading(false);
      if (recoveryError) {
        setError('Não foi possível enviar o link agora. Verifique o e-mail e tente novamente.');
        return;
      }

      setRecoverySent(true);
      return;
    }

    if (mode === 'signup') {
      const { data: isValid, error: rpcError } = await supabase
        .rpc('verify_registration_code', { input_code: inviteCode.trim() });

      if (rpcError) {
        setError('Erro ao validar o código de convite.');
        setLoading(false);
        return;
      }

      if (!isValid) {
        setError('Código de convite inválido, inativo ou esgotado.');
        setLoading(false);
        return;
      }

      const result = await signUp(email, password);

      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const { error: consumeError } = await supabase
        .rpc('consume_registration_code', { input_code: inviteCode.trim() });

      if (consumeError) {
        // não bloqueia o cadastro já feito, apenas registra
        console.warn('Erro ao consumir código de convite:', consumeError.message);
      }

      setLoading(false);
    } else {
      const result = await signIn(email, password);
      setLoading(false);
      if (result.error) {
        setError(result.error);
      }
    }
  };

  const returnToLogin = () => {
    setMode('login');
    setRecoverySent(false);
    setError(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-verde-musgo px-5 py-12">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="text-bege-suave/70 hover:text-amarelo-mel transition-colors flex items-center gap-2 mb-8 text-sm"
        >
          <ArrowLeft size={18} />
          Voltar ao site
        </button>

        <div className="bg-bege-suave rounded-2xl shadow-2xl p-8 animate-slide-up">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-black rounded-full p-3 mb-4">
              <HoneyBeeLogo className="w-16 h-16" />
            </div>
            <h2 className="font-serif text-2xl text-verde-musgo">
              {mode === 'login'
                ? 'Área da Administradora'
                : mode === 'signup'
                  ? 'Criar Conta'
                  : 'Recuperar acesso'}
            </h2>
            <p className="text-sm text-preto/60 mt-1 text-center">
              {mode === 'login'
                ? 'Acesse para gerenciar cestas e estoque'
                : mode === 'signup'
                  ? 'É necessário um código de convite válido'
                  : recoverySent
                    ? 'Se o e-mail estiver cadastrado, enviaremos um link para redefinir sua senha.'
                    : 'Informe o e-mail da conta administrativa para receber um link de recuperação.'}
            </p>
          </div>

          {recoverySent ? (
            <div className="flex flex-col gap-4">
              <div role="status" className="bg-green-50 text-green-800 text-sm rounded-lg px-4 py-3 border border-green-200 text-center">
                Confira sua caixa de entrada e a pasta de spam. O link é de uso único e expira.
              </div>
              <button
                type="button"
                onClick={returnToLogin}
                className="btn bg-verde-musgo hover:bg-verde-musgo-dark w-full"
              >
                Voltar para o login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {mode === 'signup' && (
                <div className="relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-verde-musgo/40"
                    size={18}
                  />
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Código de convite"
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-verde-musgo/20 bg-bege-claro focus:outline-none focus:ring-2 focus:ring-amarelo-mel transition-all"
                  />
                </div>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-verde-musgo/40"
                  size={18}
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-mail"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-verde-musgo/20 bg-bege-claro focus:outline-none focus:ring-2 focus:ring-amarelo-mel transition-all"
                />
              </div>

              {mode !== 'recover' && (
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-verde-musgo/40"
                    size={18}
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-verde-musgo/20 bg-bege-claro focus:outline-none focus:ring-2 focus:ring-amarelo-mel transition-all"
                  />
                </div>
              )}

              {error && (
                <div role="alert" className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 border border-red-200">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn bg-verde-musgo hover:bg-verde-musgo-dark flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : mode === 'login' ? (
                  <>
                    <LogIn size={20} />
                    Entrar
                  </>
                ) : mode === 'signup' ? (
                  <>
                    <UserPlus size={20} />
                    Criar conta
                  </>
                ) : (
                  <>
                    <Mail size={20} />
                    Enviar link de recuperação
                  </>
                )}
              </button>

              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    setMode('recover');
                    setRecoverySent(false);
                    setError(null);
                  }}
                  className="text-verde-musgo font-semibold hover:underline text-sm"
                >
                  Esqueci minha senha
                </button>
              )}
            </form>
          )}

          <div className="mt-6 text-center text-sm text-preto/60">
            {mode === 'signup' ? (
              <p>
                Já tem conta?{' '}
                <button
                  type="button"
                  onClick={returnToLogin}
                  className="text-verde-musgo font-semibold hover:underline"
                >
                  Fazer login
                </button>
              </p>
            ) : mode === 'recover' && !recoverySent ? (
              <button
                type="button"
                onClick={returnToLogin}
                className="text-verde-musgo font-semibold hover:underline"
              >
                Voltar para o login
              </button>
            ) : null}
          </div>
        </div>

        {mode === 'login' && (
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setError(null);
              }}
              className="text-bege-suave/30 hover:text-amarelo-mel/70 transition-colors text-xs"
            >
              Possui um código de convite?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
