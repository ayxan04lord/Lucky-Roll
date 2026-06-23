import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../api';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const { signIn } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const fn = mode === 'login' ? login : register;
      const data = await fn(username.trim(), password);
      signIn(data.token, data.username);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>🎲</div>
        <h1 className={styles.title}>Zər Oyunu</h1>

        {/* Tab switcher */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.active : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Daxil ol
          </button>
          <button
            className={`${styles.tab} ${mode === 'register' ? styles.active : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            Qeydiyyat
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>İstifadəçi adı</label>
            <input
              id="username"
              className={styles.input}
              type="text"
              placeholder="İstifadəçi adını daxil edin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>Şifrə</label>
            <input
              id="password"
              className={styles.input}
              type="password"
              placeholder={mode === 'register' ? 'Min. 6 simvol' : 'Şifrəni daxil edin'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            type="submit"
            className={styles.btn}
            disabled={loading}
          >
            {loading ? '...' : mode === 'login' ? 'Daxil ol' : 'Hesab yarat'}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === 'login' ? 'Hesabınız yoxdur? ' : 'Artıq hesabınız var? '}
          <button
            className={styles.switchBtn}
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
          >
            {mode === 'login' ? 'Qeydiyyat' : 'Daxil ol'}
          </button>
        </p>
      </div>
    </div>
  );
}
