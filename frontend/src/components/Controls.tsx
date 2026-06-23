import type { DiceSides } from '../types';
import styles from './Controls.module.css';

const DICE_TYPES: DiceSides[] = [4, 6, 8, 10, 12, 20];
const DICE_COUNTS = [1, 2, 3, 4, 5, 6];

interface ControlsProps {
  diceCount: number;
  sides: DiceSides;
  targetTotal: string;
  onDiceCountChange: (n: number) => void;
  onSidesChange: (s: DiceSides) => void;
  onTargetChange: (v: string) => void;
  onRollAll: () => void;
  onReset: () => void;
}

export default function Controls({
  diceCount, sides, targetTotal,
  onDiceCountChange, onSidesChange, onTargetChange,
  onRollAll, onReset,
}: ControlsProps) {
  return (
    <div className={styles.controls}>
      {/* Dice count */}
      <div className={styles.group}>
        <label className={styles.label}>Zər Sayı</label>
        <div className={styles.chips}>
          {DICE_COUNTS.map((n) => (
            <button
              key={n}
              className={`${styles.chip} ${diceCount === n ? styles.active : ''}`}
              onClick={() => onDiceCountChange(n)}
              aria-pressed={diceCount === n}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Dice type */}
      <div className={styles.group}>
        <label className={styles.label}>Zər Növü</label>
        <div className={styles.chips}>
          {DICE_TYPES.map((s) => (
            <button
              key={s}
              className={`${styles.chip} ${sides === s ? styles.active : ''}`}
              onClick={() => onSidesChange(s)}
              aria-pressed={sides === s}
            >
              D{s}
            </button>
          ))}
        </div>
      </div>

      {/* Target total */}
      <div className={styles.group}>
        <label className={styles.label} htmlFor="target">Hədəf Cəm (istəyə bağlı)</label>
        <input
          id="target"
          className={styles.input}
          type="number"
          min={diceCount}
          max={diceCount * sides}
          placeholder={`${diceCount}–${diceCount * sides}`}
          value={targetTotal}
          onChange={(e) => onTargetChange(e.target.value)}
        />
      </div>

      {/* Action buttons */}
      <div className={styles.buttons}>
        <button className={`${styles.btn} ${styles.primary}`} onClick={onRollAll}>
          🎲 Hamısını At
        </button>
        <button className={`${styles.btn} ${styles.secondary}`} onClick={onReset}>
          ↺ Sıfırla
        </button>
      </div>
    </div>
  );
}
