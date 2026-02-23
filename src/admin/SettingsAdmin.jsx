import React, { useState, useEffect } from 'react'

export default function SettingsAdmin({ store }) {
  const { settings, saveSettings } = store
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (settings) setForm({ ...settings })
  }, [settings])

  const showToast = (msg, type = '') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveSettings(form)
      showToast('✓ Настройки сохранены', 'success')
    } catch {
      showToast('Ошибка сохранения', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (!form) return <div style={{ padding: 40, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>Загрузка...</div>

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Настройки <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>сайта</em></h1>
          <p style={styles.pageSub}>Управляйте контактами, текстами и параметрами магазина</p>
        </div>
        <button style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить →'}
        </button>
      </div>

      <div style={styles.sections}>

        {/* STORE INFO */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Информация о магазине</div>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Название магазина</label>
              <input style={styles.input} value={form.storeName || ''} onChange={e => set('storeName', e.target.value)} />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Слоган</label>
              <input style={styles.input} value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} />
            </div>
            <div style={{ ...styles.field, gridColumn: 'span 2' }}>
              <label style={styles.label}>Описание (hero секция)</label>
              <textarea style={{ ...styles.input, minHeight: 80, resize: 'vertical' }} value={form.description || ''} onChange={e => set('description', e.target.value)} />
            </div>
          </div>
        </div>

        {/* CONTACTS */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Контакты</div>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>WhatsApp номер</label>
              <input style={styles.input} value={form.whatsapp || ''} onChange={e => set('whatsapp', e.target.value)} placeholder="77768880636" />
              <div style={styles.hint}>Без + и пробелов, например: 77761234567</div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Instagram handle</label>
              <input style={styles.input} value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} placeholder="elite.space.kz" />
              <div style={styles.hint}>Без @, например: elite.space.kz</div>
            </div>
          </div>
        </div>

        {/* DELIVERY & POLICY */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Доставка и гарантия</div>
          <div style={styles.formGrid}>
            <div style={styles.field}>
              <label style={styles.label}>Срок доставки</label>
              <input style={styles.input} value={form.deliveryDays || ''} onChange={e => set('deliveryDays', e.target.value)} placeholder="1–3" />
              <div style={styles.hint}>Отображается в разделе «1–3 дня»</div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Гарантия (месяцев)</label>
              <input style={styles.input} type="number" value={form.guaranteeMonths || 12} onChange={e => set('guaranteeMonths', parseInt(e.target.value))} min={1} max={60} />
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <div
                style={{
                  width: 38, height: 20, borderRadius: 100, position: 'relative',
                  background: form.cashDiscountEnabled ? 'var(--success)' : 'rgba(200,140,100,0.25)',
                  border: '1px solid ' + (form.cashDiscountEnabled ? 'transparent' : 'rgba(200,140,100,0.3)'),
                  transition: 'background 0.2s', cursor: 'pointer', flexShrink: 0
                }}
                onClick={() => set('cashDiscountEnabled', !form.cashDiscountEnabled)}
              >
                <div style={{
                  position: 'absolute', width: 14, height: 14, background: 'white', borderRadius: '50%',
                  top: 2, left: form.cashDiscountEnabled ? 20 : 2, transition: 'left 0.2s',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
                }} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 500, color: 'var(--dark)' }}>Скидка при оплате наличными</div>
                <div style={styles.hint}>Показывать бейдж «Скидка наличными» на карточках</div>
              </div>
            </label>
          </div>
        </div>

        {/* PREVIEW */}
        <div style={styles.section}>
          <div style={styles.sectionTitle}>Предпросмотр контактов</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 4 }}>
            <a
              href={`https://api.whatsapp.com/send/?phone=${form.whatsapp}`}
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#25D366', color: 'white', padding: '12px 20px', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500 }}
            >
              💬 Тест WhatsApp
            </a>
            <a
              href={`https://www.instagram.com/${form.instagram}/`}
              target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white', padding: '12px 20px', borderRadius: 4, textDecoration: 'none', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500 }}
            >
              📸 Тест Instagram
            </a>
          </div>
        </div>

      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32, zIndex: 500,
          background: 'var(--dark)', color: 'white',
          padding: '14px 22px', borderRadius: 4, fontSize: 13,
          display: 'flex', alignItems: 'center', gap: 10,
          borderLeft: `3px solid ${toast.type === 'error' ? 'var(--danger)' : 'var(--success)'}`,
          animation: 'fadeIn 0.3s ease', fontFamily: 'var(--font-body)'
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { padding: 40, maxWidth: 900, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid var(--border)' },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 300, lineHeight: 1 },
  pageSub: { fontSize: 13, color: 'var(--muted)', marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 300 },
  saveBtn: { background: 'var(--peach)', color: 'white', border: 'none', padding: '13px 28px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, whiteSpace: 'nowrap' },
  sections: { display: 'flex', flexDirection: 'column', gap: 24 },
  section: { background: 'white', border: '1px solid var(--border)', borderRadius: 4, padding: 32 },
  sectionTitle: { fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 400, marginBottom: 24, color: 'var(--dark)' },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  label: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-body)' },
  input: { background: 'var(--cream)', border: '1px solid var(--border)', color: 'var(--dark)', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', borderRadius: 2, width: '100%' },
  hint: { fontSize: 11, color: 'var(--muted2)', fontFamily: 'var(--font-body)', fontWeight: 300 }
}
