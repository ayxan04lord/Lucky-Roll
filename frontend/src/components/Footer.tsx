import styles from './Footer.module.css';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>🎲 LuckyRoll</span>
          <p>Ən yaxşı zər lotereyası təcrübəsi. Şansını sına!</p>
        </div>

        <div className={styles.col}>
          <h4>Naviqasiya</h4>
          <button onClick={() => onNavigate('home')}>Ana Səhifə</button>
          <button onClick={() => onNavigate('play')}>İndi Oyna</button>
          <button onClick={() => onNavigate('leaderboard')}>Liderboard</button>
        </div>

        <div className={styles.col}>
          <h4>Şirkət</h4>
          <button onClick={() => onNavigate('about')}>Haqqımızda</button>
          <button onClick={() => onNavigate('contact')}>Əlaqə</button>
        </div>

        <div className={styles.col}>
          <h4>Oyunlar</h4>
          <p>🎲 Klassik Zər</p>
          <p>🍀 Şanslı 7</p>
          <p>💎 Cekpot</p>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© 2026 LuckyRoll. Bütün hüquqlar qorunur. Məsuliyyətlə oynayın. 18+</p>
      </div>
    </footer>
  );
}
