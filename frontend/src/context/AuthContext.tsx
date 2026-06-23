import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchMe, logout as apiLogout } from '../api';

interface AuthUser {
  username: string;
  id: number;
  coins: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (token: string, username: string) => void;
  signOut: () => Promise<void>;
  updateCoins: (coins: number) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMe()
        .then((u) => setUser(u))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = (newToken: string, username: string) => {
    localStorage.setItem('token', newToken);
    setUser({ username, id: 0, coins: 0 });
    // fetch real data
    fetchMe().then((u) => setUser(u)).catch(() => {});
  };

  const signOut = async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateCoins = (coins: number) => {
    setUser((prev) => prev ? { ...prev, coins } : prev);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, updateCoins }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
