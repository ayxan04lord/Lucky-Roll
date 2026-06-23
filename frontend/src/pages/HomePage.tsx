import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './HomePage.module.css';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const SLIDES = [
  {
    title: 'LuckyRoll-a Xoş Gəldiniz',
    desc: 'Zəri at, böyük qazan! Minlərlə oyunçuya qoşul.',
    emoji: '🎲',
  },
  {
    title: 'Şanslı 7 Cekpotu',
    desc: '7 vur və mərcini 5 dəfə artır!',
    emoji: '🍀',
  },
  {
    title: 'Ən Yaxşı Oyunçular',
    desc: 'Liderboardda yarış, şöhrəti qazan.',
    emoji: '🏆',
  },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const { user } = useAuth();
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero slider */}
      <section className={styles.hero}>
        <div className={styles.slideWrap}>
          {SLIDES.map((slide, i) => (
            <div key={i} className={`${styles.slide} ${i === slideIndex ? styles.active : ''}`}>
              <span className={styles.emoji}>{slide.emoji}</span>
              <h1>{slide.title}</h1>
              <p>{slide.desc}</p>
              <button className={styles.ctaBtn} onClick={() => onNavigate(user ? 'play' : 'auth')}>
                {user ? '🎮 İndi Oyna' : '🚀 Başla'}
              </button>
            </div>
          ))}
        </div>
        <div className={styles.dots}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === slideIndex ? styles.activeDot : ''}`}
              onClick={() => setSlideIndex(i)}
              aria-label={`${i + 1}-ci slayd`}
            />
          ))}
        </div>
      </section>

      {/* Features */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Niyə LuckyRoll?</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <span className={styles.icon}>⚡</span>
            <h3>Ani Oyun</h3>
            <p>Yükləmə yoxdur, gözləmə yoxdur. Saniyələr içində oyna.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>🎁</span>
            <h3>Gündəlik Bonus</h3>
            <p>Hər gün pulsuz coin. Oynamağa davam et, qazanmağa davam et.</p>
          </div>
          <div className={styles.card}>
            <span className={styles.icon}>🔒</span>
            <h3>Ədalətli və Təhlükəsiz</h3>
            <p>Sübut edilmiş ədalətli sistem. İrəliləyişin bizdə qorunur.</p>
          </div>
        </div>
      </section>

      {/* Games preview */}
      <section className={styles.games}>
        <h2 className={styles.sectionTitle}>Seçilmiş Oyunlar</h2>
        <div className={styles.grid}>
          <div className={styles.gameCard}>
            <span className={styles.gameIcon}>🎲</span>
            <h3>Klassik Zər</h3>
            <p>Yüksək at, böyük qazan. Sadə və əbədi.</p>
            <button className={styles.playBtn} onClick={() => onNavigate('play')}>
              Oyna →
            </button>
          </div>
          <div className={styles.gameCard}>
            <span className={styles.gameIcon}>🍀</span>
            <h3>Şanslı 7</h3>
            <p>Tam 7 vur — 5x çarpan!</p>
            <button className={styles.playBtn} onClick={() => onNavigate('play')}>
              Oyna →
            </button>
          </div>
          <div className={styles.gameCard}>
            <span className={styles.gameIcon}>💎</span>
            <h3>Cekpot</h3>
            <p>Hamısı eyni rəqəm? Mərcini 10x qazan!</p>
            <button className={styles.playBtn} onClick={() => onNavigate('play')}>
              Oyna →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
