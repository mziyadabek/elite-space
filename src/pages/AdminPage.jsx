import React, { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import ProductsAdmin from '../admin/ProductsAdmin'
import SettingsAdmin from '../admin/SettingsAdmin'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'elite2025'

export default function AdminPage({ store }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('es_auth') === '1')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const login = () => {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      sessionStorage.setItem('es_auth', '1')
      setAuthed(true)
    } else {
      setErr('Неверный логин или пароль')
      setTimeout(() => setErr(''), 3000)
    }
  }

  const logout = () => {
    sessionStorage.removeItem('es_auth')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen user={user} pass={pass} err={err} setUser={setUser} setPass={setPass} login={login} />

  const avail = store.products.filter(p => p.available).length
  const brands = new Set(store.products.map(p => p.brand)).size

  return (
    <div style={styles.shell}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarLogo}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', color: 'white' }}>
            élite <span style={{ color: 'var(--peach-light)', fontStyle: 'normal' }}>space</span>
          </div>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 2, fontFamily: 'var(--font-body)' }}>Admin Panel</div>
        </div>

        <div style={styles.sidebarStats}>
          <div style={styles.sidebarStat}><div style={styles.sidebarStatN}>{store.products.length}</div><div style={styles.sidebarStatL}>Товаров</div></div>
          <div style={styles.sidebarStat}><div style={styles.sidebarStatN}>{avail}</div><div style={styles.sidebarStatL}>В наличии</div></div>
          <div style={styles.sidebarStat}><div style={styles.sidebarStatN}>{brands}</div><div style={styles.sidebarStatL}>Брендов</div></div>
        </div>

        <nav style={styles.sidebarNav}>
          <SideNavLink to="/admin" end icon="📦" label="Товары" />
          <SideNavLink to="/admin/settings" icon="⚙️" label="Настройки" />
          <a href="/" target="_blank" rel="noreferrer" style={styles.sideNavExternal}>
            <span>🌐</span> Открыть сайт
          </a>
        </nav>

        <button style={styles.logoutBtn} onClick={logout}>← Выйти</button>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>
        <Routes>
          <Route index element={<ProductsAdmin store={store} />} />
          <Route path="settings" element={<SettingsAdmin store={store} />} />
        </Routes>
      </main>

      {/* TOAST */}
      {store.toast && <Toast msg={store.toast} type={store.toastType} />}
    </div>
  )
}

function SideNavLink({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        ...styles.sideNavItem,
        background: isActive ? 'rgba(232,149,109,0.15)' : 'transparent',
        color: isActive ? 'var(--peach-light)' : 'rgba(255,255,255,0.6)',
        borderLeft: isActive ? '2px solid var(--peach)' : '2px solid transparent'
      })}
    >
      <span>{icon}</span> {label}
    </NavLink>
  )
}

function Toast({ msg, type }) {
  return (
    <div style={{
      position: 'fixed', bottom: 32, right: 32, zIndex: 500,
      background: 'var(--dark)', color: 'white',
      padding: '14px 22px', borderRadius: 4,
      fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
      borderLeft: `3px solid ${type === 'error' ? 'var(--danger)' : type === 'success' ? 'var(--success)' : 'var(--peach)'}`,
      animation: 'fadeIn 0.3s ease', fontFamily: 'var(--font-body)'
    }}>
      {msg}
    </div>
  )
}

function LoginScreen({ user, pass, err, setUser, setPass, login }) {
  const onKey = e => e.key === 'Enter' && login()
  return (
    <div style={styles.loginBg}>
      <div style={styles.loginBox}>
        <div style={styles.loginEye}>Панель управления</div>
        <h2 style={styles.loginTitle}><em style={{ fontStyle: 'italic' }}>élite</em> space</h2>
        <p style={styles.loginSub}>Войдите для управления каталогом</p>
        <div style={styles.loginField}>
          <label style={styles.loginLabel}>Логин</label>
          <input style={styles.loginInput} type="text" placeholder="admin" value={user} onChange={e => setUser(e.target.value)} onKeyDown={onKey} autoComplete="username" />
        </div>
        <div style={styles.loginField}>
          <label style={styles.loginLabel}>Пароль</label>
          <input style={styles.loginInput} type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={onKey} autoComplete="current-password" />
        </div>
        {err && <div style={styles.loginErr}>{err}</div>}
        <button style={styles.loginBtn} onClick={login}>Войти →</button>
        <div style={{ marginTop: 20, fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>
          admin / elite2025
        </div>
      </div>
    </div>
  )
}

const styles = {
  shell: { display: 'flex', minHeight: '100vh' },
  sidebar: { width: 240, background: 'var(--dark)', display: 'flex', flexDirection: 'column', padding: '32px 0', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' },
  sidebarLogo: { padding: '0 24px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  sidebarStats: { display: 'flex', padding: '20px 24px', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' },
  sidebarStat: { flex: 1, textAlign: 'center' },
  sidebarStatN: { fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--peach-light)', lineHeight: 1 },
  sidebarStatL: { fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginTop: 4, fontFamily: 'var(--font-body)' },
  sidebarNav: { flex: 1, padding: '16px 0', display: 'flex', flexDirection: 'column', gap: 2 },
  sideNavItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 24px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, textDecoration: 'none', transition: 'all 0.15s', letterSpacing: 0.3 },
  sideNavExternal: { display: 'flex', alignItems: 'center', gap: 10, padding: '11px 24px', fontFamily: 'var(--font-body)', fontSize: 13, fontWeight: 500, textDecoration: 'none', color: 'rgba(255,255,255,0.4)', letterSpacing: 0.3, borderLeft: '2px solid transparent', transition: 'color 0.15s' },
  logoutBtn: { margin: '0 16px 0', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)', padding: '10px', fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 },
  main: { flex: 1, background: 'var(--cream)', overflow: 'auto' },
  loginBg: { minHeight: '100vh', background: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loginBox: { background: 'var(--cream)', border: '1px solid rgba(232,149,109,0.25)', borderRadius: 8, padding: '56px 48px', width: 380, animation: 'fadeUp 0.6s ease both' },
  loginEye: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--peach)', marginBottom: 12, fontWeight: 600, fontFamily: 'var(--font-body)' },
  loginTitle: { fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 300, marginBottom: 8, lineHeight: 1.1 },
  loginSub: { fontSize: 13, color: 'var(--muted)', marginBottom: 36, fontWeight: 300, fontFamily: 'var(--font-body)' },
  loginField: { display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 },
  loginLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-body)' },
  loginInput: { background: 'white', border: '1px solid var(--border)', color: 'var(--dark)', padding: '13px 16px', fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', borderRadius: 2, width: '100%' },
  loginErr: { fontSize: 12, color: 'var(--danger)', background: 'rgba(217,79,79,0.08)', border: '1px solid rgba(217,79,79,0.2)', padding: '10px 14px', borderRadius: 4, marginBottom: 8, fontFamily: 'var(--font-body)' },
  loginBtn: { width: '100%', background: 'var(--peach)', color: 'white', border: 'none', padding: 15, fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, marginTop: 8 }
}
