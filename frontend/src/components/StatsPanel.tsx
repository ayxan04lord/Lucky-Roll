import type { Stats } from '../types';
import styles from './StatsPanel.module.css';

interface StatsPanelProps {
  stats: Stats | null;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  if (!stats || stats.totalRolls === 0) {
    return (
      <div className={styles.empty}>
        Statistikanı görmək üçün zər at 📊
      </div>
    );
  }

  const maxFreq = Math.max(...Object.values(stats.faceFrequency), 1);

  return (
    <div className={styles.container}>
      {/* Summary cards */}
      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.totalRolls}</span>
          <span className={styles.cardLabel}>Ümumi Atış</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.highestTotal}</span>
          <span className={styles.cardLabel}>Ən Yaxşı Cəm</span>
        </div>
        <div className={styles.card}>
          <span className={styles.cardValue}>{stats.averageTotal.toFixed(1)}</span>
          <span className={styles.cardLabel}>Ortalama</span>
        </div>
      </div>

      {/* Face frequency bar chart */}
      {Object.keys(stats.faceFrequency).length > 0 && (
        <div className={styles.chart}>
          <p className={styles.chartTitle}>Üz Tezliyi</p>
          <div className={styles.bars}>
            {Object.entries(stats.faceFrequency)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([face, count]) => (
                <div key={face} className={styles.barGroup}>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.bar}
                      style={{ height: `${(count / maxFreq) * 100}%` }}
                    />
                  </div>
                  <span className={styles.barLabel}>{face}</span>
                  <span className={styles.barCount}>{count}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
