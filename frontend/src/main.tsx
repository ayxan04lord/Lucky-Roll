import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PlayPage from './pages/PlayPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthPage from './pages/AuthPage';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Theme } from './types';
import './index.css';

function App() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState('home');
  const [theme] = useLocalStorage<Theme>('theme', 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const navigate = (p: string) => {
    if (p === 'auth' && user) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#0d0d1a',
        color: 'white', fontSize: '3rem',
      }}>
        🎲
      </div>
    );
  }

  if (!user && page === 'auth') {
    return (
      <>
        <Navbar currentPage="auth" onNavigate={navigate} />
        <main style={{ paddingTop: '64px' }}>
          <AuthPage />
        </main>
      </>
    );
  }

  const renderPage = () => {
    if (!user && (page === 'profile')) return <AuthPage />;
    switch (page) {
      case 'play': return <PlayPage onNavigate={navigate} />;
      case 'profile': return <ProfilePage />;
      case 'leaderboard': return <LeaderboardPage />;
      case 'about': return <AboutPage />;
      case 'contact': return <ContactPage />;
      case 'auth': return user ? <HomePage onNavigate={navigate} /> : <AuthPage />;
      default: return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar currentPage={page} onNavigate={navigate} />
      <main style={{ paddingTop: '64px', flex: 1 }}>
        {renderPage()}
      </main>
      <Footer onNavigate={navigate} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
