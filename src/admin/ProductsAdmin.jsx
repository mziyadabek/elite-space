import React, { useState, useRef } from 'react'

export default function ProductsAdmin({ store }) {
  const { products, toggleAvailable, deleteProduct, addProduct, updateProduct, uploadImage } = store
  const [search, setSearch] = useState('')
  const [filterBrand, setFilterBrand] = useState('')
  const [filterAvail, setFilterAvail] = useState('')
  const [modal, setModal] = useState(null) // null | 'add' | {product}
  const [deleting, setDeleting] = useState(null)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const brands = [...new Set(products.map(p => p.brand))].sort()

  const showToast = (msg, type = '') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const filtered = products.filter(p => {
    const matchS = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase())
    const matchB = !filterBrand || p.brand === filterBrand
    const matchA = !filterAvail || (filterAvail === 'available' ? p.available : !p.available)
    return matchS && matchB && matchA
  })

  const handleToggle = async (id) => {
    const p = await toggleAvailable(id)
    showToast(p.available ? `✓ В наличии: ${p.name}` : `○ Скрыт: ${p.name}`, p.available ? 'success' : '')
  }

  const handleDelete = async (id) => {
    const p = products.find(x => x.id === id)
    await deleteProduct(id)
    setDeleting(null)
    showToast(`🗑 ${p.name} удалён`)
  }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal?.product) {
        await updateProduct(modal.product.id, data)
        showToast(`✓ ${data.name} обновлён`, 'success')
      } else {
        await addProduct(data)
        showToast(`✓ ${data.name} добавлен`, 'success')
      }
      setModal(null)
    } catch (e) {
      showToast('Ошибка сохранения', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Каталог <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>товаров</em></h1>
          <p style={styles.pageSub}>{products.length} товаров · {products.filter(p => p.available).length} в наличии</p>
        </div>
        <button style={styles.addBtn} onClick={() => setModal({ new: true })}>
          + Добавить товар
        </button>
      </div>

      {/* FILTERS */}
      <div style={styles.toolbar}>
        <input
          style={styles.searchInput}
          placeholder="Поиск по названию или бренду..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={styles.filterSel} value={filterBrand} onChange={e => setFilterBrand(e.target.value)}>
          <option value="">Все бренды</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select style={styles.filterSel} value={filterAvail} onChange={e => setFilterAvail(e.target.value)}>
          <option value="">Любой статус</option>
          <option value="available">В наличии</option>
          <option value="unavailable">Нет в наличии</option>
        </select>
      </div>

      {/* TABLE */}
      <div style={styles.table}>
        <div style={styles.tableHead}>
          <div></div>
          <div>Товар</div>
          <div>Бренд</div>
          <div>Модели / Цены</div>
          <div>Статус</div>
          <div>Действия</div>
        </div>
        {filtered.length === 0 ? (
          <div style={styles.empty}>🔍 Ничего не найдено</div>
        ) : (
          filtered.map(p => (
            <ProductRow
              key={p.id}
              product={p}
              onToggle={() => handleToggle(p.id)}
              onEdit={() => setModal({ product: p })}
              onDelete={() => setDeleting(p)}
            />
          ))
        )}
      </div>

      {/* ADD/EDIT MODAL */}
      {modal && (
        <ProductModal
          product={modal.product}
          brands={brands}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
          uploadImage={uploadImage}
        />
      )}

      {/* DELETE CONFIRM */}
      {deleting && (
        <div style={styles.overlay} onClick={() => setDeleting(null)}>
          <div style={styles.deleteBox} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🗑️</div>
            <div style={styles.deleteTitle}>Удалить товар?</div>
            <div style={styles.deleteSub}>«{deleting.brand} — {deleting.name}» будет удалён навсегда.</div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28 }}>
              <button style={styles.cancelBtn} onClick={() => setDeleting(null)}>Отмена</button>
              <button style={styles.confirmDeleteBtn} onClick={() => handleDelete(deleting.id)}>Удалить</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div style={{
          ...styles.toast,
          borderLeftColor: toast.type === 'error' ? 'var(--danger)' : toast.type === 'success' ? 'var(--success)' : 'var(--peach)'
        }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}

function ProductRow({ product: p, onToggle, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const imgSrc = p.imgUrl && (p.imgUrl.startsWith('/') || p.imgUrl.startsWith('http')) ? p.imgUrl : null

  return (
    <div
      style={{ ...styles.tableRow, background: hov ? 'var(--warm-white)' : 'white', opacity: p.available ? 1 : 0.55 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div style={styles.thumb}>
        {imgSrc
          ? <img src={imgSrc} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={e => { e.target.style.display = 'none' }} />
          : <span style={{ fontSize: 22 }}>{p.emoji || '📦'}</span>
        }
      </div>
      <div>
        <div style={styles.rowBrand}>{p.brand}</div>
        <div style={styles.rowName}>{p.name}</div>
        <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 2, fontFamily: 'var(--font-body)' }}>{p.tag}</div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>{p.brand}</div>
      <div>
        {p.variants.slice(0, 3).map((v, i) => (
          <div key={i} style={styles.priceChip}>
            <span style={{ color: 'var(--muted)' }}>{v.model}</span>
            <span style={{ fontFamily: 'var(--font-display)', color: 'var(--dark)' }}> {v.price} тг</span>
          </div>
        ))}
        {p.variants.length > 3 && <div style={{ fontSize: 10, color: 'var(--peach)', marginTop: 2, fontFamily: 'var(--font-body)' }}>+{p.variants.length - 3} ещё</div>}
      </div>
      <div>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={onToggle}>
          <div style={{
            width: 38, height: 20, borderRadius: 100, position: 'relative',
            background: p.available ? 'var(--success)' : 'rgba(200,140,100,0.25)',
            border: '1px solid ' + (p.available ? 'transparent' : 'rgba(200,140,100,0.3)'),
            transition: 'background 0.2s', flexShrink: 0
          }}>
            <div style={{
              position: 'absolute', width: 14, height: 14, background: 'white', borderRadius: '50%',
              top: 2, left: p.available ? 20 : 2, transition: 'left 0.2s',
              boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
            }} />
          </div>
          <span style={{ fontSize: 11, color: p.available ? 'var(--success)' : 'var(--muted)', fontWeight: 500, fontFamily: 'var(--font-body)' }}>
            {p.available ? 'Есть' : 'Нет'}
          </span>
        </label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button style={styles.actionBtn} onClick={onEdit}>Изменить</button>
        <button style={{ ...styles.actionBtn, color: 'var(--danger)', borderColor: 'rgba(217,79,79,0.3)' }} onClick={onDelete}>Удалить</button>
      </div>
    </div>
  )
}

function ProductModal({ product, brands, onSave, onClose, saving, uploadImage }) {
  const [brand, setBrand] = useState(product?.brand || '')
  const [name, setName] = useState(product?.name || '')
  const [emoji, setEmoji] = useState(product?.emoji || '📦')
  const [imgUrl, setImgUrl] = useState(product?.imgUrl || '')
  const [tag, setTag] = useState(product?.tag || 'В наличии')
  const [available, setAvailable] = useState(product?.available ?? true)
  const [variants, setVariants] = useState(product?.variants || [{ model: '', price: '' }, { model: '', price: '' }])
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(product?.imgUrl || '')
  const fileRef = useRef()

  const addVariant = () => setVariants(v => [...v, { model: '', price: '' }])
  const removeVariant = i => setVariants(v => v.filter((_, j) => j !== i))
  const updateVariant = (i, field, val) => setVariants(v => v.map((x, j) => j === i ? { ...x, [field]: val } : x))

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreviewUrl(URL.createObjectURL(file))
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setImgUrl(url)
    } catch (err) {
      alert('Ошибка загрузки файла')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = () => {
    if (!brand.trim() || !name.trim()) return alert('Укажите бренд и название')
    const cleanVariants = variants.filter(v => v.model && v.price)
    if (!cleanVariants.length) return alert('Добавьте хотя бы один вариант с ценой')
    onSave({ brand: brand.trim(), name: name.trim(), emoji, imgUrl, tag, available, variants: cleanVariants })
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.modalClose} onClick={onClose}>×</button>
        <div style={styles.modalEye}>{product ? 'Редактирование' : 'Новый товар'}</div>
        <h2 style={styles.modalTitle}>
          {product ? <>Изменить <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>{product.name}</em></> : <>Добавить <em style={{ fontStyle: 'italic', color: 'var(--peach)' }}>товар</em></>}
        </h2>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Бренд *</label>
            <input style={styles.fieldInput} list="brands-dl" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Apple" />
            <datalist id="brands-dl">{brands.map(b => <option key={b} value={b} />)}</datalist>
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Название (линейка) *</label>
            <input style={styles.fieldInput} value={name} onChange={e => setName(e.target.value)} placeholder="iPhone" />
          </div>

          {/* IMAGE UPLOAD */}
          <div style={{ ...styles.field, gridColumn: 'span 2' }}>
            <label style={styles.fieldLabel}>Фото товара</label>
            <div style={styles.uploadArea} onClick={() => fileRef.current.click()}>
              {previewUrl ? (
                <img src={previewUrl} alt="preview" style={{ maxHeight: 120, maxWidth: '100%', objectFit: 'contain', borderRadius: 4 }} />
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📤</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>Нажмите чтобы загрузить фото</div>
                  <div style={{ fontSize: 10, color: 'var(--muted2)', marginTop: 4, fontFamily: 'var(--font-body)' }}>JPG, PNG, WebP до 10MB</div>
                </div>
              )}
              {uploading && <div style={{ position: 'absolute', inset: 0, background: 'rgba(253,246,240,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                <div style={{ width: 24, height: 24, border: '2px solid var(--border)', borderTop: '2px solid var(--peach)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              </div>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
            {previewUrl && (
              <button style={{ ...styles.cancelBtn, marginTop: 8, fontSize: 11 }} onClick={() => { setPreviewUrl(''); setImgUrl('') }}>
                × Удалить фото
              </button>
            )}
          </div>

          <div style={styles.field}>
            <label style={styles.fieldLabel}>Описание / подзаголовок</label>
            <input style={styles.fieldInput} value={tag} onChange={e => setTag(e.target.value)} placeholder="Смартфоны" />
          </div>
          <div style={styles.field}>
            <label style={styles.fieldLabel}>Эмодзи (запасное)</label>
            <input style={styles.fieldInput} value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="📱" maxLength={4} />
          </div>
          <div style={{ ...styles.field, gridColumn: 'span 2' }}>
            <label style={styles.fieldLabel}>Статус</label>
            <select style={styles.fieldInput} value={available ? 'yes' : 'no'} onChange={e => setAvailable(e.target.value === 'yes')}>
              <option value="yes">✓ В наличии</option>
              <option value="no">○ Нет в наличии</option>
            </select>
          </div>
        </div>

        {/* VARIANTS */}
        <div style={{ marginTop: 24 }}>
          <div style={styles.fieldLabel}>Модели и цены *</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
            {variants.map((v, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 36px', gap: 8, alignItems: 'start' }}>
                <input style={styles.fieldInput} placeholder="iPhone 16 Pro 128GB" value={v.model} onChange={e => updateVariant(i, 'model', e.target.value)} />
                <input style={styles.fieldInput} placeholder="199 900" value={v.price} onChange={e => updateVariant(i, 'price', e.target.value)} />
                <button style={styles.removeBtn} onClick={() => removeVariant(i)} title="Удалить вариант">×</button>
              </div>
            ))}
          </div>
          <button style={styles.addVariantBtn} onClick={addVariant}>+ Добавить модель</button>
        </div>

        <div style={styles.modalFooter}>
          <button style={styles.cancelBtn} onClick={onClose}>Отмена</button>
          <button style={{ ...styles.saveBtn, opacity: saving ? 0.6 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Сохранение...' : 'Сохранить →'}
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { padding: 40, maxWidth: 1200, margin: '0 auto' },
  header: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' },
  pageTitle: { fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 300, lineHeight: 1 },
  pageSub: { fontSize: 13, color: 'var(--muted)', marginTop: 6, fontFamily: 'var(--font-body)', fontWeight: 300 },
  addBtn: { background: 'var(--peach)', color: 'white', border: 'none', padding: '13px 28px', fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 500, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, whiteSpace: 'nowrap' },
  toolbar: { display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' },
  searchInput: { background: 'white', border: '1px solid var(--border)', color: 'var(--dark)', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', borderRadius: 2, flex: 1, minWidth: 200 },
  filterSel: { background: 'white', border: '1px solid var(--border)', color: 'var(--dark)', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: 12, outline: 'none', borderRadius: 2, cursor: 'pointer' },
  table: { background: 'white', border: '1px solid var(--border)', borderRadius: 4, overflow: 'hidden' },
  tableHead: { display: 'grid', gridTemplateColumns: '52px 1fr 120px 220px 100px 160px', padding: '12px 20px', background: 'var(--warm-white)', borderBottom: '1px solid var(--border)', fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-body)', gap: 12 },
  tableRow: { display: 'grid', gridTemplateColumns: '52px 1fr 120px 220px 100px 160px', padding: '16px 20px', borderBottom: '1px solid var(--border)', alignItems: 'center', transition: 'background 0.15s', gap: 12 },
  thumb: { width: 44, height: 44, background: 'var(--peach-pale)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
  rowBrand: { fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'var(--peach)', fontWeight: 600, fontFamily: 'var(--font-body)' },
  rowName: { fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 400, lineHeight: 1.2 },
  priceChip: { fontSize: 11, marginBottom: 2, fontFamily: 'var(--font-body)' },
  actionBtn: { border: '1px solid var(--border)', background: 'transparent', padding: '7px 12px', fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, color: 'var(--muted)', whiteSpace: 'nowrap' },
  empty: { textAlign: 'center', padding: 60, color: 'var(--muted)', fontSize: 14, fontFamily: 'var(--font-body)' },
  overlay: { position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(28,20,16,0.65)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  modal: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 8, padding: 48, width: '100%', maxWidth: 640, position: 'relative', maxHeight: '90vh', overflowY: 'auto', animation: 'modalIn 0.3s ease both' },
  modalClose: { position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', fontSize: 24, color: 'var(--muted)', cursor: 'pointer', lineHeight: 1 },
  modalEye: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--peach)', marginBottom: 12, fontWeight: 600, fontFamily: 'var(--font-body)' },
  modalTitle: { fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 300, marginBottom: 32, lineHeight: 1.1 },
  formGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  field: { display: 'flex', flexDirection: 'column', gap: 7 },
  fieldLabel: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600, fontFamily: 'var(--font-body)' },
  fieldInput: { background: 'white', border: '1px solid var(--border)', color: 'var(--dark)', padding: '11px 14px', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none', borderRadius: 2, width: '100%' },
  uploadArea: { background: 'white', border: '2px dashed rgba(232,149,109,0.35)', borderRadius: 4, padding: '28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', minHeight: 120, position: 'relative', transition: 'border-color 0.2s' },
  removeBtn: { width: 36, height: 36, background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', cursor: 'pointer', borderRadius: 2, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  addVariantBtn: { background: 'transparent', border: '1px dashed rgba(232,149,109,0.4)', color: 'var(--peach)', padding: 10, fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, width: '100%', marginTop: 8, fontWeight: 500 },
  modalFooter: { display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' },
  cancelBtn: { background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '12px 28px', fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 },
  saveBtn: { background: 'var(--peach)', color: 'white', border: 'none', padding: '12px 32px', fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, fontWeight: 500 },
  deleteBox: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 8, padding: 40, maxWidth: 400, width: '90%', textAlign: 'center', animation: 'modalIn 0.3s ease both' },
  deleteTitle: { fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 300, marginBottom: 10 },
  deleteSub: { fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, fontFamily: 'var(--font-body)', fontWeight: 300 },
  confirmDeleteBtn: { background: 'var(--danger)', color: 'white', border: 'none', padding: '12px 28px', fontFamily: 'var(--font-body)', fontSize: 12, letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2 },
  toast: { position: 'fixed', bottom: 32, right: 32, zIndex: 500, background: 'var(--dark)', color: 'white', padding: '14px 22px', borderRadius: 4, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, borderLeft: '3px solid var(--peach)', animation: 'fadeIn 0.3s ease', fontFamily: 'var(--font-body)' }
}
