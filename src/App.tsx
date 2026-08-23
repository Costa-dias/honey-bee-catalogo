import { useState } from 'react';
import { AuthProvider, useAuth } from '@/lib/auth';
import { PublicSite } from '@/components/PublicSite';
import { AdminLogin } from '@/components/AdminLogin';
import { AdminPanel } from '@/components/AdminPanel';

type View = 'public' | 'admin';

function AppContent() {
  const { session, loading } = useAuth();
  const [view, setView] = useState<View>('public');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-verde-musgo">
        <div className="text-bege-suave font-serif text-xl animate-pulse">
          Honey Bee
        </div>
      </div>
    );
  }

  if (view === 'admin') {
    if (session) {
      return <AdminPanel onBack={() => setView('public')} />;
    }
    return <AdminLogin onBack={() => setView('public')} />;
  }

  return <PublicSite onAdminClick={() => setView('admin')} />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

