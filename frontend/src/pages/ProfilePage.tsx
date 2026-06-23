import { useState, useEffect, useRef } from 'react';
import { fetchProfile, fetchHistory, fetchStats, clearHistory, claimBonus } from '../api';
import { useAuth } from '../context/AuthContext';
import type { UserProfile, RollRecord, Stats } from '../types';
import styles from './ProfilePage.module.css';

function useCountdown(nextBonusAt: string | null) {
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!nextBonusAt) { setRemaining(''); return; }

    const tick = () => {
      const diff = new Date(nextBonusAt).getTime() - Date.now();
      if (diff <= 0) { setRemaining(''); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextBonusAt]);

  return remaining;
}

export default function ProfilePage() {
  const { user, updateCoins } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<RollRecord[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [tab, setTab] = useState<'stats' | 'history'>('stats');
  const [bonusMsg, setBonusMsg] = useState('');
  const [nextBonusAt, setNextBonusAt] = useState<string | null>(null);
  const countdown = useCountdown(nextBonusAt);

  useEffect(() => {
    fetchProfile().then((p) => {
      setProfile(p);
      // calculate next bonus time from last_bonus
      if (p.last_bonus) {
        const next = new Date(new Date(p.last_bonus).getTime() + 24 * 3600 * 1000);
        if (next > new Date()) setNextBonusAt(next.toISOString());
      }
    }).catch(() => {});
    fetchHistory().then(setHistory).catch(() => {});
    fetchStats().then(setStats).catch(() => {});
  }, []);

  const handleBonus = async () => {
    try {
      const res = await claimBonus();
      setBonusMsg(res.message);
      updateCoins(res.coins);
      setProfile((p) => p ? { ...p, coins: res.coins } : p);
      setNextBonusAt(new Date(Date.now() + 24 * 3600 * 1000).toISOString());
      setTimeout(() => setBonusMsg(''), 4000);
    } catch (e: unknown) {
      const err = e as Error & { next_bonus_at?: string };
      if (err.next_bonus_at) {
        setNextBonusAt(err.next_bonus_at);
      }
      setBonusMsg(err.message ?? 'Error');
      setTimeout(() => setBonusMsg(''), 4000);
    }
  };

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
    setStats(null);
  };

  if (!user) return null;
  const maxFreq = stats ? Math.max(...Object.values(stats.faceFrequency), 1) : 1;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Profile header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>{user.username[0].toUpperCase()}</div>
          <div className={styles.info}>
            <h1>{user.username}</h1>
            <p className={styles.joinedLabel}>LuckyRoll Oyunçusu</p>
          </div>
          <button className={styles.bonusBtn} onClick={handleBonus} disabled={!!countdown}>
            {countdown ? `⏳ ${countdown}` : '🎁 Gündəlik Bonus'}
          </button>
        </div>

        {bonusMsg && <div className={styles.bonusBanner}>{bonusMsg}</div>}

        {/* Coins row */}
        <div className={styles.statsRow}>
          <div className={styles.statBox}>
            <span className={styles.statVal}>🪙 {(profile?.coins ?? 0).toLocaleString()}</span>
            <span className={styles.statLbl}>Balans</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>🏆 {(profile?.total_won ?? 0).toLocaleString()}</span>
            <span className={styles.statLbl}>Ümumi Uduş</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>💸 {(profile?.total_spent ?? 0).toLocaleString()}</span>
            <span className={styles.statLbl}>Ümumi Xərc</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statVal}>🎮 {profile?.games_played ?? 0}</span>
            <span className={styles.statLbl}>Oyun Sayı</span>
          </div>
        </div>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'stats' ? styles.active : ''}`} onClick={() => setTab('stats')}>📊 Statistika</button>
          <button className={`${styles.tab} ${tab === 'history' ? styles.active : ''}`} onClick={() => setTab('history')}>📜 Tarix</button>
        </div>

        {tab === 'stats' && stats && (
          <div className={styles.statsSection}>
            <div className={styles.miniStats}>
              <div className={styles.miniBox}>
                <span>{stats.totalRolls}</span><label>Atış</label>
              </div>
              <div className={styles.miniBox}>
                <span>{stats.highestTotal}</span><label>Ən Yaxşı Cəm</label>
              </div>
              <div className={styles.miniBox}>
                <span>{stats.averageTotal}</span><label>Ortalama</label>
              </div>
            </div>
            {Object.keys(stats.faceFrequency).length > 0 && (
              <div className={styles.chart}>
                <p className={styles.chartTitle}>Üz Tezliyi</p>
                <div className={styles.bars}>
                  {Object.entries(stats.faceFrequency)
                    .sort(([a], [b]) => Number(a) - Number(b))
                    .map(([face, count]) => (
                      <div key={face} className={styles.barGroup}>
                        <div className={styles.barTrack}>
                          <div className={styles.bar} style={{ height: `${(count / maxFreq) * 100}%` }} />
                        </div>
                        <span>{face}</span>
                        <span className={styles.barCnt}>{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {tab === 'history' && (
          <div className={styles.historySection}>
            <div className={styles.histHeader}>
              <h3>Atış Tarixi</h3>
              {history.length > 0 && (
                <button className={styles.clearBtn} onClick={handleClear}>Hamısını Sil</button>
              )}
            </div>
            {history.length === 0 ? (
              <p className={styles.empty}>Hələ atış yoxdur. Oynamağa başla! 🎲</p>
            ) : (
              <ul className={styles.histList}>
                {history.map((r) => (
                  <li key={r.id} className={styles.histItem}>
                    <span className={styles.gameTag}>{r.game_type}</span>
                    <span className={styles.vals}>[{r.values.join(', ')}]</span>
                    <span className={styles.histTotal}>= {r.total}</span>
                    <span className={`${styles.histNet} ${r.winnings > r.bet ? styles.pos : styles.neg}`}>
                      {r.winnings > r.bet ? '+' : ''}{r.winnings - r.bet} 🪙
                    </span>
                    <span className={styles.histTime}>
                      {new Date(r.timestamp).toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
