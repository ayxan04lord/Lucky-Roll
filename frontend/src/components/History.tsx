import type { RollRecord } from '../types';
import styles from './History.module.css';

interface HistoryProps {
  records: RollRecord[];
  onClear: () => void;
}

export default function History({ records, onClear }: HistoryProps) {
  if (records.length === 0) {
    return (
      <div className={styles.empty}>
        <span>Hələ atış yoxdur. Oynamağa başla! 🎲</span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Atış Tarixi</h3>
        <button className={styles.clearBtn} onClick={onClear}>Hamısını Sil</button>
      </div>
      <ul className={styles.list}>
        {[...records].reverse().map((r) => (
          <li key={r.id} className={styles.item}>
            <span className={styles.values}>
              [{r.values.join(', ')}]
            </span>
            <span className={styles.meta}>D{r.sides}</span>
            <span className={styles.total}>= {r.total}</span>
            <span className={styles.time}>
              {new Date(r.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
