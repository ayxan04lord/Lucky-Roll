import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Theme } from '../types';
import styles from './Navbar.module.css';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'dark');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const nav = (page: string) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        {/* Logo */}
        <button className={styles.logo} onClick={() => nav('home')}>
          🎲 <span>LuckyRoll</span>
        </button>

        {/* Desktop links */}
        <ul className={styles.links}>
          {[
            { id: 'home', label: '🏠 Ana Səhifə' },
            { id: 'play', label: '🎮 Oyna' },
            { id: 'leaderboard', label: '🏆 Liderboard' },
            { id: 'about', label: 'ℹ️ Haqqımızda' },
            { id: 'contact', label: '📩 Əlaqə' },
          ].map((item) => (
            <li key={item.id}>
              <button
                className={`${styles.link} ${currentPage === item.id ? styles.active : ''}`}
                onClick={() => nav(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className={styles.right}>
          {user && (
            <button className={styles.coinBadge} onClick={() => nav('profile')}>
              🪙 <span>{user.coins.toLocaleString()}</span>
            </button>
          )}

          <button className={styles.iconBtn} onClick={toggleTheme} title="Tema dəyiş">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.avatar} onClick={() => nav('profile')}>
                {user.username[0].toUpperCase()}
              </button>
              <div className={styles.dropdown}>
                <span className={styles.dropName}>👤 {user.username}</span>
                <button onClick={() => nav('profile')}>Profilim</button>
                <button onClick={() => signOut()}>↩ Çıxış</button>
              </div>
            </div>
          ) : (
            <button className={styles.loginBtn} onClick={() => nav('auth')}>
              Daxil ol
            </button>
          )}

          {/* Hamburger */}
          <button className={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {[
            { id: 'home', label: '🏠 Ana Səhifə' },
            { id: 'play', label: '🎮 Oyna' },
            { id: 'leaderboard', label: '🏆 Liderboard' },
            { id: 'about', label: 'ℹ️ Haqqımızda' },
            { id: 'contact', label: '📩 Əlaqə' },
            ...(user ? [{ id: 'profile', label: '👤 Profil' }] : []),
          ].map((item) => (
            <button key={item.id} className={styles.mobileLink} onClick={() => nav(item.id)}>
              {item.label}
            </button>
          ))}
          {user && (
            <button className={`${styles.mobileLink} ${styles.mobileLogout}`} onClick={() => signOut()}>
              ↩ Çıxış
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
