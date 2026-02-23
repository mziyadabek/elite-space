import React, { useState, useEffect, useRef } from 'react'


export default function StorePage({ store }) {
  const { products, settings, loading } = store
  const [contactOpen, setContactOpen] = useState(false)
  const [visible, setVisible] = useState({})
  const observerRef = useRef()

  const s = settings || {}
  const wa = s.whatsapp || '77768880636'
  const ig = s.instagram || 'elite.space.kz'
  const waUrl = `https://api.whatsapp.com/send/?phone=${wa}&text&type=phone_number&app_absent=0`
  const igUrl = `https://www.instagram.com/${ig}/`

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisible(prev => ({ ...prev, [e.target.dataset.id]: true }))
      }),
      { threshold: 0.08 }
    )
    return () => observerRef.current?.disconnect()
  }, [])

  const observe = (el) => { if (el && observerRef.current) observerRef.current.observe(el) }

  const availableProducts = products.filter(p => p.available)
  const brands = [...new Set(products.map(p => p.brand))]

  return (
    <div>
      {/* NAV */}
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <em style={{ fontStyle: 'italic' }}>élite</em>{' '}
          <span style={{ color: 'var(--peach)', fontStyle: 'normal', fontWeight: 600 }}>space</span>
        </div>
        <ul style={styles.navLinks}>
          <li><a href="#products" style={styles.navLink}>Каталог</a></li>
          <li><a href="#howto" style={styles.navLink}>Доставка</a></li>
          <li><a href={igUrl} target="_blank" rel="noreferrer" style={styles.navLink}>Instagram</a></li>
        </ul>
        <div style={{ display: 'flex', gap: 8 }}>
          <a href={waUrl} target="_blank" rel="noreferrer">
            <button style={{ ...styles.navCta, background: '#25D366' }}>💬 WhatsApp</button>
          </a>
          <a href={igUrl} target="_blank" rel="noreferrer">
            <button style={styles.navCta}>📸 Instagram</button>
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={styles.heroBadge}>
            <div style={styles.heroBadgeDot} />
            Оригинальная техника · Алматы
          </div>
          <h1 style={styles.heroTitle}>
            Твоя <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>идеальная</em><br />техника здесь
          </h1>
          <p style={styles.heroDesc}>
            {s.description || 'Apple, Garmin, DJI, Canon, WHOOP и другие топовые бренды. Гарантия 12 месяцев. Скидка при оплате наличными.'}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 0 }}>
            <button style={styles.btnPrimary} onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>
              Смотреть каталог
            </button>
            <button style={styles.btnSecondary} onClick={() => window.open(waUrl, '_blank')}>💬 WhatsApp</button>
            <button style={styles.btnSecondary} onClick={() => window.open(igUrl, '_blank')}>📸 Instagram</button>
          </div>
          <div style={styles.heroStats}>
            <div><div style={styles.statNum}>25K+</div><div style={styles.statLabel}>Покупателей</div></div>
            <div><div style={styles.statNum}>{s.guaranteeMonths || 12}мес</div><div style={styles.statLabel}>Гарантия</div></div>
            <div><div style={styles.statNum}>5★</div><div style={styles.statLabel}>Рейтинг</div></div>
          </div>
        </div>
        <div style={styles.heroVisual}>
          <div style={styles.heroCircle}>
            <div style={styles.heroInner}>✦</div>
            <div style={{ ...styles.floatCard, top: 40, right: -20 }}>
              <div style={styles.floatLabel}>Скидка наличными</div>
              <div style={styles.floatVal}>доступна</div>
            </div>
            <div style={{ ...styles.floatCard, bottom: 60, left: -20 }}>
              <div style={styles.floatLabel}>Доставка по РК</div>
              <div style={styles.floatVal}>{s.deliveryDays || '1–3'} дня</div>
            </div>
          </div>
        </div>
        <div style={styles.heroBg} />
      </section>

      {/* MARQUEE */}
      <div style={styles.marqueeWrap}>
        <div style={styles.marqueeTrack}>
          {[...brands, ...brands].map((b, i) => (
            <div key={i} style={styles.marqueeItem}>{b}</div>
          ))}
        </div>
      </div>

      {/* PRODUCTS */}
      <section style={styles.products} id="products">
        <div style={styles.eyebrow}>Каталог товаров</div>
        <h2 style={styles.sectionTitle}>Актуальные <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>цены</em></h2>
        <p style={styles.sectionSub}>Скидка при оплате наличными. Все цены в тенге. Гарантия на каждое устройство.</p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={styles.spinner} />
          </div>
        ) : (
          <div style={styles.productsGrid}>
            {availableProducts.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onClick={() => setContactOpen(true)}
                observe={observe}
              />
            ))}
          </div>
        )}
      </section>

      {/* BENEFITS */}
      <section style={{ padding: '100px 52px' }}>
        <div style={styles.eyebrow}>Почему мы</div>
        <h2 style={styles.sectionTitle}>Наши <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>преимущества</em></h2>
        <div style={styles.benefitsGrid}>
          {[
            { icon: '✅', title: '100% оригинал', desc: 'Только официальные поставки от авторизованных дистрибьюторов. Никакого серого рынка.' },
            { icon: '💰', title: 'Скидка наличными', desc: 'При оплате наличными — специальная скидка на все позиции каталога.' },
            { icon: '🛡️', title: `Гарантия ${s.guaranteeMonths || 12} мес`, desc: 'Официальная гарантия на каждое устройство. Постгарантийная поддержка.' },
            { icon: '🚀', title: 'Быстрая доставка', desc: `По Алматы — в день заказа. По всему Казахстану — ${s.deliveryDays || '1–3'} рабочих дня.` },
          ].map((b, i) => (
            <div key={i} style={styles.benefitItem}>
              <div style={styles.benefitIcon}>{b.icon}</div>
              <div style={styles.benefitTitle}>{b.title}</div>
              <div style={styles.benefitDesc}>{b.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ ...styles.products, padding: '100px 52px' }} id="howto">
        <div style={styles.eyebrow}>Как сделать заказ</div>
        <h2 style={styles.sectionTitle}>Всё <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>просто</em></h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28, marginTop: 60 }}>
          {[
            { n: '01', icon: '💬', title: 'Напишите нам', desc: 'Свяжитесь через Instagram или WhatsApp. Укажите модель и цвет — ответим мгновенно.' },
            { n: '02', icon: '💳', title: 'Оплатите удобно', desc: 'Наличными (со скидкой), Kaspi, переводом или рассрочкой. Любой удобный способ.' },
            { n: '03', icon: '📦', title: 'Получите товар', desc: 'Самовывоз в Алматы или доставка по всему Казахстану. Быстро и надёжно.' },
          ].map((step, i) => (
            <div key={i} style={styles.howtoCard}>
              <div style={styles.howtoNum}>{step.n}</div>
              <div style={{ fontSize: 30, marginBottom: 20 }}>{step.icon}</div>
              <div style={styles.howtoTitle}>{step.title}</div>
              <div style={styles.benefitDesc}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'white', fontStyle: 'italic' }}>
          <em>élite</em> <span style={{ color: 'var(--peach-light)', fontStyle: 'normal' }}>space</span>
        </div>
        <ul style={{ display: 'flex', gap: 28, listStyle: 'none' }}>
          {[['#products', 'Каталог'], ['#howto', 'Доставка'], [igUrl, 'Instagram']].map(([href, label]) => (
            <li key={label}><a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" style={styles.footerLink}>{label}</a></li>
          ))}
        </ul>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>© 2025 élite space · Алматы</div>
      </footer>

      {/* CONTACT MODAL */}
      {contactOpen && (
        <div style={styles.modalOverlay} onClick={() => setContactOpen(false)}>
          <div style={styles.contactModal} onClick={e => e.stopPropagation()}>
            <button style={styles.modalClose} onClick={() => setContactOpen(false)}>×</button>
            <div style={{ ...styles.eyebrow, marginBottom: 12 }}>Связаться</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 300, marginBottom: 8, lineHeight: 1.1 }}>
              Как вам<br /><em style={{ color: 'var(--peach)' }}>удобнее?</em>
            </h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 32, lineHeight: 1.6 }}>
              Напишите нам в удобный мессенджер — ответим быстро.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href={waUrl} target="_blank" rel="noreferrer" style={styles.waBtn}>💬 Написать в WhatsApp</a>
              <a href={igUrl} target="_blank" rel="noreferrer" style={styles.igBtn}>📸 Написать в Instagram</a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product: p, index, onClick, observe }) {
  const [hovered, setHovered] = useState(false)
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      ref.current.dataset.id = `card-${p.id}`
      observe(ref.current)
    }
  }, [])

  const imgSrc = p.imgUrl && (p.imgUrl.startsWith('/') || p.imgUrl.startsWith('http'))
    ? p.imgUrl
    : null

  return (
    <div
      ref={ref}
      style={{
        ...styles.productCard,
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 16px 48px rgba(200,140,100,0.15)' : 'none',
        animationDelay: `${index * 0.07}s`
      }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.cardImg}>
        {imgSrc ? (
          <img src={imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }} />
        ) : null}
        <div style={{ fontSize: 80, display: imgSrc ? 'none' : 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
          {p.emoji || '📦'}
        </div>
        <div style={styles.cashBadge}>Скидка наличными</div>
      </div>
      <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={styles.cardBrand}>{p.brand}</div>
        <div style={styles.cardName}>{p.name}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {p.variants.map((v, i) => (
            <div key={i} style={styles.priceRow}>
              <span style={styles.priceModel}>{v.model}</span>
              <span style={styles.priceAmount}>{v.price} <span style={{ fontSize: 11, color: 'var(--muted)' }}>тг</span></span>
            </div>
          ))}
        </div>
        <div style={styles.cardFooter}>
          <span style={styles.cardTag}>{p.tag}</span>
          <span style={{ fontSize: 11, color: 'var(--peach)', fontWeight: 500, letterSpacing: 0.5 }}>
            Заказать →
          </span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '18px 52px',
    background: 'rgba(253,246,240,0.92)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
    animation: 'fadeDown 0.7s ease both',
    fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, letterSpacing: 2,
  },
  navLogo: {
    fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 300, letterSpacing: 2
  },
  navLinks: { display: 'flex', gap: 36, listStyle: 'none' },
  navLink: { color: 'var(--muted)', textDecoration: 'none', fontSize: 12, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: 'var(--font-body)' },
  navCta: { background: 'var(--peach)', color: 'white', border: 'none', padding: '11px 26px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', borderRadius: 2, cursor: 'pointer' },
  hero: {
    minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
    alignItems: 'center', padding: '120px 52px 80px', gap: 60, position: 'relative', overflow: 'hidden'
  },
  heroBg: {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'radial-gradient(ellipse 50% 70% at 80% 50%, rgba(232,149,109,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 10% 20%, rgba(242,176,138,0.08) 0%, transparent 50%)'
  },
  heroBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 8,
    background: 'rgba(232,149,109,0.12)', border: '1px solid rgba(232,149,109,0.35)',
    padding: '7px 16px', fontSize: 10, fontWeight: 600, letterSpacing: '2.5px',
    textTransform: 'uppercase', color: 'var(--peach-dark)', marginBottom: 28,
    borderRadius: 100, fontFamily: 'var(--font-body)', animation: 'fadeUp 0.8s 0.2s ease both'
  },
  heroBadgeDot: { width: 5, height: 5, borderRadius: '50%', background: 'var(--peach)', animation: 'pulse 1.8s infinite' },
  heroTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(52px,7vw,96px)', fontWeight: 300, lineHeight: 1.0, marginBottom: 28, animation: 'fadeUp 0.8s 0.35s ease both' },
  heroDesc: { color: 'var(--muted)', fontSize: 15, lineHeight: 1.75, maxWidth: 380, marginBottom: 40, animation: 'fadeUp 0.8s 0.5s ease both', fontWeight: 300, fontFamily: 'var(--font-body)' },
  heroStats: { display: 'flex', gap: 36, marginTop: 52, paddingTop: 36, borderTop: '1px solid var(--border)', animation: 'fadeUp 0.8s 0.8s ease both' },
  statNum: { fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 300, color: 'var(--peach)', lineHeight: 1 },
  statLabel: { fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 4, fontWeight: 500, fontFamily: 'var(--font-body)' },
  heroVisual: { display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'fadeUp 0.8s 0.4s ease both' },
  heroCircle: { width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,149,109,0.15) 0%, rgba(232,149,109,0.05) 50%, transparent 70%)', border: '1px solid rgba(232,149,109,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  heroInner: { width: 300, height: 300, borderRadius: '50%', background: 'rgba(232,149,109,0.1)', border: '1px solid rgba(232,149,109,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, animation: 'float 4s ease-in-out infinite' },
  floatCard: { position: 'absolute', background: 'white', border: '1px solid var(--border)', borderRadius: 12, padding: '14px 18px', boxShadow: '0 8px 32px rgba(200,140,100,0.12)' },
  floatLabel: { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontFamily: 'var(--font-body)' },
  floatVal: { fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--peach-dark)', marginTop: 2 },
  marqueeWrap: { borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', overflow: 'hidden', background: 'var(--warm-white)', padding: '14px 0' },
  marqueeTrack: { display: 'flex', gap: 0, animation: 'marquee 25s linear infinite', width: 'max-content' },
  marqueeItem: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 300, letterSpacing: 4, color: 'var(--muted2)', whiteSpace: 'nowrap', padding: '0 36px', fontStyle: 'italic' },
  products: { background: 'var(--warm-white)', padding: '100px 52px' },
  eyebrow: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--peach)', marginBottom: 14, fontWeight: 600, fontFamily: 'var(--font-body)' },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 'clamp(38px,5vw,64px)', fontWeight: 300, lineHeight: 1.05, marginBottom: 16 },
  sectionSub: { color: 'var(--muted)', fontSize: 14, lineHeight: 1.7, maxWidth: 480, marginBottom: 56, fontWeight: 300, fontFamily: 'var(--font-body)' },
  productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 },
  productCard: { background: 'white', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s ease, box-shadow 0.3s ease', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.5s ease both' },
  cardImg: { height: 300, background: 'var(--peach-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' },
  cashBadge: { position: 'absolute', top: 14, right: 14, background: 'var(--peach)', color: 'white', fontSize: 9, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 10px', borderRadius: 100, fontFamily: 'var(--font-body)' },
  cardBrand: { fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--peach)', fontWeight: 600, marginBottom: 6, fontFamily: 'var(--font-body)' },
  cardName: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 16, lineHeight: 1.2 },
  priceRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--border)' },
  priceModel: { fontSize: 12, color: 'var(--muted)', fontWeight: 400, flex: 1, paddingRight: 12, fontFamily: 'var(--font-body)' },
  priceAmount: { fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 400, color: 'var(--dark)', whiteSpace: 'nowrap' },
  cardFooter: { marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTag: { fontSize: 9, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted2)', fontWeight: 500, fontFamily: 'var(--font-body)' },
  btnPrimary: { background: 'var(--peach)', color: 'white', border: 'none', padding: '15px 32px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 },
  btnSecondary: { background: 'transparent', color: 'var(--dark)', border: '1px solid var(--border)', padding: '15px 32px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 },
  benefitsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', marginTop: 60 },
  benefitItem: { background: 'var(--cream)', padding: '44px 32px' },
  benefitIcon: { width: 44, height: 44, background: 'rgba(232,149,109,0.12)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 22 },
  benefitTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 12 },
  benefitDesc: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, fontWeight: 300, fontFamily: 'var(--font-body)' },
  howtoCard: { background: 'white', border: '1px solid var(--border)', borderRadius: 4, padding: '40px 32px', position: 'relative' },
  howtoNum: { fontFamily: 'var(--font-display)', fontSize: 80, fontWeight: 300, color: 'rgba(232,149,109,0.12)', position: 'absolute', top: 16, right: 24, lineHeight: 1, fontStyle: 'italic' },
  howtoTitle: { fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 12 },
  footer: { background: 'var(--dark)', color: 'rgba(255,255,255,0.6)', padding: '48px 52px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-body)' },
  footerLink: { fontSize: 11, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', letterSpacing: '1.5px', textTransform: 'uppercase', fontWeight: 500 },
  modalOverlay: { position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(28,20,16,0.6)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  contactModal: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 8, padding: '48px 40px', maxWidth: 420, width: '90%', position: 'relative', textAlign: 'center', animation: 'modalIn 0.3s ease both' },
  modalClose: { position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', fontSize: 22, color: 'var(--muted)', cursor: 'pointer' },
  waBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: '#25D366', color: 'white', padding: 16, borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' },
  igBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white', padding: 16, borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase' },
  spinner: { width: 32, height: 32, border: '2px solid var(--border)', borderTop: '2px solid var(--peach)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }
}
