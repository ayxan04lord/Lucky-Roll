import { useState, type FormEvent } from 'react';
import styles from './ContactPage.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In real app, send to backend
    setSent(true);
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1>📩 Bizimlə Əlaqə</h1>
          <p>Sualınız və ya təklifiniz var? Sizdən eşitməkdən məmnun olarıq.</p>
        </div>

        <div className={styles.layout}>
          {/* Info */}
          <div className={styles.info}>
            <div className={styles.infoCard}>
              <span>📧</span>
              <div>
                <strong>E-poçt</strong>
                <p>support@luckyroll.io</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span>💬</span>
              <div>
                <strong>Canlı Söhbət</strong>
                <p>Hər gün saat 9:00–18:00</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span>🌍</span>
              <div>
                <strong>Ünvan</strong>
                <p>Bakı, Azərbaycan 🇦🇿</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <span>⏰</span>
              <div>
                <strong>Cavab Müddəti</strong>
                <p>24 saat ərzində</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className={styles.formCard}>
            {sent ? (
              <div className={styles.success}>
                <span>✅</span>
                <h3>Mesaj Göndərildi!</h3>
                <p>24 saat ərzində sizinlə əlaqə saxlayacağıq.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }}>
                  Yenidən Göndər
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <h3>Mesaj Göndər</h3>
                <div className={styles.field}>
                  <label>Ad</label>
                  <input
                    type="text"
                    placeholder="Adınız"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>E-poçt</label>
                  <input
                    type="email"
                    placeholder="sizin@email.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.field}>
                  <label>Mesaj</label>
                  <textarea
                    placeholder="Mesajınız..."
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className={styles.sendBtn}>Mesaj Göndər →</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
