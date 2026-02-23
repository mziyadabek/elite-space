import { useState, useEffect, useCallback } from 'react'

const API = '/api'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true)
      const [pRes, sRes] = await Promise.all([
        fetch(`${API}/products`),
        fetch(`${API}/settings`)
      ])
      const [prods, sets] = await Promise.all([pRes.json(), sRes.json()])
      setProducts(prods)
      setSettings(sets)
    } catch (e) {
      setError('Cannot connect to server. Make sure `npm run dev` is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const addProduct = useCallback(async (data) => {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const p = await res.json()
    setProducts(prev => [...prev, p])
    return p
  }, [])

  const updateProduct = useCallback(async (id, data) => {
    const res = await fetch(`${API}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const p = await res.json()
    setProducts(prev => prev.map(x => x.id === id ? p : x))
    return p
  }, [])

  const deleteProduct = useCallback(async (id) => {
    await fetch(`${API}/products/${id}`, { method: 'DELETE' })
    setProducts(prev => prev.filter(x => x.id !== id))
  }, [])

  const toggleAvailable = useCallback(async (id) => {
    const res = await fetch(`${API}/products/${id}/toggle`, { method: 'PATCH' })
    const p = await res.json()
    setProducts(prev => prev.map(x => x.id === id ? p : x))
    return p
  }, [])

  const uploadImage = useCallback(async (file) => {
    const form = new FormData()
    form.append('image', file)
    const res = await fetch(`${API}/upload`, { method: 'POST', body: form })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.url
  }, [])

  const saveSettings = useCallback(async (data) => {
    const res = await fetch(`${API}/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    const s = await res.json()
    setSettings(s)
    return s
  }, [])

  return {
    products, settings, loading, error,
    addProduct, updateProduct, deleteProduct,
    toggleAvailable, uploadImage, saveSettings,
    refresh: fetchAll
  }
}
