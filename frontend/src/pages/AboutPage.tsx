import styles from './AboutPage.module.css';

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.hero}>
          <span>🎲</span>
          <h1>LuckyRoll Haqqında</h1>
          <p>Ən yaxşı onlayn zər lotereyası təcrübəsi</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Bizim Hekayəmiz</h2>
            <p>
              LuckyRoll sadə bir ideyadan doğuldu: onlayn oyunu hər kəs üçün əyləncəli, ədalətli
              və əlçatan etmək. Zər oyunlarının köhnəlməz həyəcanını müasir texnologiya ilə
              birləşdirərək şansın strategiya ilə buluşduğu bir platforma yaratdıq.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Necə İşləyir</h2>
            <p>
              Pulsuz qeydiyyatdan keçin və 1.000 başlanğıc coin alın. Müxtəlif zər oyunlarına —
              Klassik, Şanslı 7 və ya Cekpot — mərc edin. Yüksək ataraq və ya xüsusi
              kombinasiyalar tutaraq coin qazanın. Oynamağa davam etmək üçün gündəlik bonusları
              götürün!
            </p>
          </div>

          <div className={styles.card}>
            <h2>Ədalətli Oyun</h2>
            <p>
              Zər atışlarımız kriptoqrafik cəhətdən təhlükəsiz təsadüfi ədəd generatoru ilə
              işləyir. Hər atış müstəqil və ədalətlidir — heç bir hiyləgərlik, heç bir
              manipulyasiya yoxdur. Şansınız həqiqətən sizindir.
            </p>
          </div>

          <div className={styles.card}>
            <h2>Oyun Rejimləri</h2>
            <ul className={styles.list}>
              <li>🎲 <strong>Klassik Zər</strong> — Yüksək at, mərcini 3x-ə qədər artır</li>
              <li>🍀 <strong>Şanslı 7</strong> — Tam 7 vur — möhtəşəm 5x mükafat!</li>
              <li>💎 <strong>Cekpot</strong> — Hamısını eyni nömrəylə at — mərcin 10x-i!</li>
            </ul>
          </div>
        </div>

        <div className={styles.team}>
          <h2>Dəyərlərimiz</h2>
          <div className={styles.values}>
            {[
              { icon: '⚡', title: 'Sürətli', desc: 'Ani nəticələr, gözləmə yoxdur' },
              { icon: '🔒', title: 'Təhlükəsiz', desc: 'Məlumatlarınız həmişə qorunur' },
              { icon: '🎯', title: 'Ədalətli', desc: 'Sübut edilmiş təsadüfi nəticələr' },
              { icon: '💬', title: 'Mehriban', desc: '7/24 icma dəstəyi' },
            ].map((v) => (
              <div key={v.title} className={styles.valueCard}>
                <span>{v.icon}</span>
                <strong>{v.title}</strong>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
