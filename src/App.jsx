import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import StorePage from './pages/StorePage'
import AdminPage from './pages/AdminPage'
import { useProducts } from './hooks/useProducts'

export default function App() {
  const store = useProducts()

  return (
    <Routes>
      <Route path="/" element={<StorePage store={store} />} />
      <Route path="/admin/*" element={<AdminPage store={store} />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
