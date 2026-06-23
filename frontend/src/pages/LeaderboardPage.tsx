import { useState, useEffect } from 'react';
import { fetchLeaderboard } from '../api';
import { useAuth } from '../context/AuthContext';
import type { LeaderboardEntry } from '../types';
import styles from './LeaderboardPage.module.css';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard()
      .then(setEntries)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>🏆 Liderboard</h1>
        <p className={styles.subtitle}>Ümumi uduşa görə sıralanan oyunçular</p>

        {loading ? (
          <p className={styles.loading}>Yüklənir...</p>
        ) : entries.length === 0 ? (
          <p className={styles.empty}>Hələ oyunçu yoxdur. İlk ol! 🎲</p>
        ) : (
          <div className={styles.list}>
            {entries.map((e, i) => (
              <div
                key={e.username}
                className={`${styles.row} ${e.username === user?.username ? styles.mine : ''} ${i < 3 ? styles.top3 : ''}`}
              >
                <span className={styles.rank}>
                  {i < 3 ? medals[i] : `#${i + 1}`}
                </span>
                <div className={styles.avatar}>
                  {e.username[0].toUpperCase()}
                </div>
                <span className={styles.name}>{e.username}</span>
                <div className={styles.details}>
                  <span className={styles.won}>🏆 {e.total_won.toLocaleString()}</span>
                  <span className={styles.coins}>🪙 {e.coins.toLocaleString()}</span>
                  <span className={styles.games}>🎮 {e.games_played}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
