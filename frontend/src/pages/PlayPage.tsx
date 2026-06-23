import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { play } from '../api';
import { fireConfetti } from '../utils/confetti';
import type { GameType, DiceSides, RollRecord, ResultLabel } from '../types';
import styles from './PlayPage.module.css';

const DOT_POSITIONS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

const GAMES: { id: GameType; label: string; icon: string; desc: string }[] = [
  { id: 'classic', label: 'Klassik Zər', icon: '🎲', desc: 'Yuxarı 25% → 3x | Yuxarı 50% → 1.5x' },
  { id: 'lucky7', label: 'Şanslı 7', icon: '🍀', desc: 'Cəm = 7 → 5x | 7 var → 2x' },
  { id: 'jackpot', label: 'Cekpot', icon: '💎', desc: 'Hamısı eyni → 10x | Yuxarı 20% → 3x' },
];

const RESULT_STYLES: Record<ResultLabel, { label: string; color: string; emoji: string }> = {
  jackpot: { label: 'CEKPOT!', color: '#f5c518', emoji: '🏆' },
  big_win: { label: 'BÖYÜK UDUŞ!', color: '#2ecc71', emoji: '🎉' },
  win: { label: 'UDDUÑ!', color: '#3498db', emoji: '✨' },
  lose: { label: 'Növbəti dəfə uğurlar', color: '#e74c3c', emoji: '😔' },
};

interface PlayPageProps {
  onNavigate: (page: string) => void;
}

export default function PlayPage({ onNavigate }: PlayPageProps) {
  const { user, updateCoins } = useAuth();
  const [gameType, setGameType] = useState<GameType>('classic');
  const [sides, setSides] = useState<DiceSides>(6);
  const [diceCount, setDiceCount] = useState(3);
  const [bet, setBet] = useState(50);
  const [rolling, setRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<RollRecord | null>(null);
  const [lastResult, setLastResult] = useState<ResultLabel | null>(null);
  const [lastNet, setLastNet] = useState<number>(0);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className={styles.authWall}>
        <span>🔒</span>
        <h2>Giriş Tələb Olunur</h2>
        <p>Oynamaq üçün hesab lazımdır.</p>
        <button onClick={() => onNavigate('auth')}>Daxil ol / Qeydiyyat</button>
      </div>
    );
  }

  const handlePlay = async () => {
    setError('');
    setRolling(true);
    try {
      const res = await play(gameType, sides, diceCount, bet);
      setLastRoll(res.roll);
      setLastResult(res.result_label);
      setLastNet(res.net);
      updateCoins(res.profile.coins);
      if (res.result_label === 'jackpot' || res.result_label === 'big_win') {
        fireConfetti();
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setRolling(false);
    }
  };

  const resultStyle = lastResult ? RESULT_STYLES[lastResult] : null;

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <h1 className={styles.title}>🎮 Oyna</h1>

        {/* Game type selector */}
        <div className={styles.gameSelector}>
          {GAMES.map((g) => (
            <button
              key={g.id}
              className={`${styles.gameBtn} ${gameType === g.id ? styles.activeGame : ''}`}
              onClick={() => setGameType(g.id)}
            >
              <span className={styles.gameIcon}>{g.icon}</span>
              <span className={styles.gameName}>{g.label}</span>
              <span className={styles.gameDesc}>{g.desc}</span>
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          {/* Controls */}
          <div className={styles.controlsCard}>
            <h3>Parametrlər</h3>

            <div className={styles.fieldGroup}>
              <label>Zər Növü</label>
              <div className={styles.chips}>
                {([4, 6, 8, 10, 12, 20] as DiceSides[]).map((s) => (
                  <button
                    key={s}
                    className={`${styles.chip} ${sides === s ? styles.activeChip : ''}`}
                    onClick={() => setSides(s)}
                  >D{s}</button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Zər Sayı</label>
              <div className={styles.chips}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <button
                    key={n}
                    className={`${styles.chip} ${diceCount === n ? styles.activeChip : ''}`}
                    onClick={() => setDiceCount(n)}
                  >{n}</button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Mərc Miqdarı</label>
              <div className={styles.chips}>
                {[10, 25, 50, 100, 250, 500].map((b) => (
                  <button
                    key={b}
                    className={`${styles.chip} ${bet === b ? styles.activeChip : ''}`}
                    onClick={() => setBet(b)}
                  >🪙{b}</button>
                ))}
              </div>
              <input
                type="number"
                className={styles.betInput}
                value={bet}
                min={1}
                max={user.coins}
                onChange={(e) => setBet(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            <div className={styles.balanceRow}>
              <span>Balans:</span>
              <span className={styles.balance}>🪙 {user.coins.toLocaleString()}</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              className={styles.rollBtn}
              onClick={handlePlay}
              disabled={rolling || bet > user.coins}
            >
              {rolling ? '🎲 Atılır...' : '🎲 At!'}
            </button>
          </div>

          {/* Dice display */}
          <div className={styles.diceCard}>
            <div className={styles.diceArea}>
              {lastRoll ? (
                lastRoll.values.map((v, i) => {
                  const isD6 = sides === 6;
                  const dots = isD6 ? DOT_POSITIONS[v] ?? [] : [];
                  return (
                    <div key={i} className={`${styles.die} ${rolling ? styles.rolling : ''}`}>
                      {isD6 ? (
                        <svg viewBox="0 0 100 100">
                          {dots.map(([cx, cy], di) => (
                            <circle key={di} cx={cx} cy={cy} r="8" className={styles.dot} />
                          ))}
                        </svg>
                      ) : (
                        <span className={styles.dieNum}>{v}</span>
                      )}
                      <span className={styles.dieLabel}>D{sides}</span>
                    </div>
                  );
                })
              ) : (
                Array.from({ length: diceCount }).map((_, i) => (
                  <div key={i} className={styles.die}>
                    <span className={styles.dieNum}>?</span>
                    <span className={styles.dieLabel}>D{sides}</span>
                  </div>
                ))
              )}
            </div>

            {lastRoll && resultStyle && (
              <div className={styles.resultBanner} style={{ borderColor: resultStyle.color }}>
                <span className={styles.resultEmoji}>{resultStyle.emoji}</span>
                <span className={styles.resultLabel} style={{ color: resultStyle.color }}>
                  {resultStyle.label}
                </span>
                <span className={`${styles.resultNet} ${lastNet >= 0 ? styles.pos : styles.neg}`}>
                  {lastNet >= 0 ? '+' : ''}{lastNet} 🪙
                </span>
                <span className={styles.resultTotal}>Cəm: {lastRoll.total}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
