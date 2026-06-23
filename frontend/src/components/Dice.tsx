import type { DiceSides } from '../types';
import styles from './Dice.module.css';

// Standard D6 dot positions
const D6_DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]],
};

interface DiceProps {
  value: number | null;
  sides: DiceSides;
  locked: boolean;
  rolling: boolean;
  onRoll: () => void;
  onToggleLock: () => void;
}

export default function Dice({ value, sides, locked, rolling, onRoll, onToggleLock }: DiceProps) {
  const isD6 = sides === 6;
  const dots = isD6 && value ? D6_DOTS[value] : [];

  return (
    <div className={styles.wrapper}>
      {/* Lock button */}
      <button
        className={`${styles.lockBtn} ${locked ? styles.locked : ''}`}
        onClick={onToggleLock}
        title={locked ? 'Kilidi aç' : 'Bu zəri kilitle'}
        aria-label={locked ? 'Zərin kilidini aç' : 'Zəri kilitle'}
      >
        {locked ? '🔒' : '🔓'}
      </button>

      {/* Dice face */}
      <div
        className={`${styles.dice} ${rolling ? styles.rolling : ''} ${locked ? styles.lockedDice : ''}`}
        onClick={onRoll}
        title={locked ? 'Kilidli' : `D${sides} atmaq üçün klikle`}
        aria-label={`Zər ${value ?? 'heç nə'} göstərir`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onRoll()}
      >
        {isD6 && value ? (
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            {dots.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="8" className={styles.dot} />
            ))}
          </svg>
        ) : (
          <span className={styles.number}>
            {value ?? '?'}
          </span>
        )}
        <span className={styles.sideLabel}>D{sides}</span>
      </div>
    </div>
  );
}
