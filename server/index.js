const express = require('express')
const multer = require('multer')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 4000

// ── PATHS ──
const DB_PATH = path.join(__dirname, 'db.json')
const UPLOADS_DIR = path.join(__dirname, '../public/uploads')

if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

// ── MIDDLEWARE ──
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(UPLOADS_DIR))

// ── MULTER (file upload) ──
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  }
})
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|avif/i
    if (allowed.test(path.extname(file.originalname)) && allowed.test(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

// ── DB HELPERS ──
function readDB() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = { products: getDefaultProducts(), settings: defaultSettings() }
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2))
    return initial
  }
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function defaultSettings() {
  return {
    storeName: 'élite space',
    tagline: 'Твоя идеальная техника здесь',
    description: 'Apple, Garmin, DJI, Canon, WHOOP и другие топовые бренды. Гарантия 12 месяцев.',
    whatsapp: '77768880636',
    instagram: 'elite.space.kz',
    deliveryDays: '1–3',
    guaranteeMonths: 12,
    cashDiscountEnabled: true
  }
}

function getDefaultProducts() {
  return [
    { id: 1, brand: 'Apple', name: 'iPhone 15', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '128 GB', price: '359 900' }, { model: '256 GB', price: '414 900' }] },
    { id: 2, brand: 'Apple', name: 'iPhone 16e', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '128 GB', price: '314 900' }, { model: '256 GB', price: '375 000' }] },
    { id: 3, brand: 'Apple', name: 'iPhone 16', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '128 GB', price: '405 000' }, { model: '256 GB', price: '465 000' }] },
    { id: 4, brand: 'Apple', name: 'iPhone 16+', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '128 GB', price: '475 000' }, { model: '256 GB', price: '529 900' }] },
    { id: 5, brand: 'Apple', name: 'iPhone 17', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '256 GB eSIM', price: '484 900' }, { model: '256 GB SIM', price: '495 900' }] },
    { id: 6, brand: 'Apple', name: 'iPhone Air', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '256 GB eSIM', price: '545 900' }, { model: '512 GB eSIM', price: '649 900' }] },
    { id: 7, brand: 'Apple', name: 'iPhone 17 Pro', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '256 GB eSIM', price: '645 000' }, { model: '512 GB eSIM', price: '765 000' }, { model: '1 TB eSIM', price: '895 000' }] },
    { id: 8, brand: 'Apple', name: 'iPad mini 6', emoji: '📱', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '64 GB Wi-Fi', price: '214 900' }, { model: '256 GB Wi-Fi', price: '314 900' }, { model: '256 GB SIM', price: '414 900' }] },
    { id: 9, brand: 'Apple', name: 'iPad Air 7', emoji: '💻', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '11" 128 GB Wi-Fi', price: '324 900' }, { model: '11" 256 GB Wi-Fi', price: '374 900' }, { model: '13" 256 GB Wi-Fi', price: '524 900' }] },
    { id: 10, brand: 'Apple', name: 'iPad 11 (A16)', emoji: '💻', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '128 GB Wi-Fi', price: '194 900' }, { model: '256 GB Wi-Fi', price: '264 900' }] },
    { id: 11, brand: 'Apple', name: 'iPad Pro 11" M5', emoji: '💻', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '256 GB Wi-Fi', price: '554 900' }, { model: '512 GB SIM', price: '864 900' }] },
    { id: 12, brand: 'Apple', name: 'iPad Pro 13" M5', emoji: '💻', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: '256 GB Wi-Fi', price: '674 900' }, { model: '512 GB SIM', price: '914 900' }, { model: '1 TB SIM', price: '1 094 900' }] },
    { id: 13, brand: 'Apple', name: 'AirPods', emoji: '🎧', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: 'AirPods 4', price: '77 400' }, { model: 'AirPods 4 ANC', price: '112 900' }, { model: 'AirPods Pro 3', price: '168 600' }, { model: 'AirPods Max', price: '322 900' }] },
    { id: 14, brand: 'Apple', name: 'Apple Watch', emoji: '⌚', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: 'Watch 11, 42mm', price: '249 900' }, { model: 'Watch 11, 46mm', price: '274 900' }, { model: 'Watch Ultra-3, 49mm', price: '528 900' }] },
    { id: 15, brand: 'Ray-Ban × Meta', name: 'Ray-Ban Gen-2', emoji: '🕶️', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: 'Ray-Ban Meta Gen-2', price: '338 900' }, { model: 'Meta Photochromic Gen-2', price: '364 900' }] },
    { id: 16, brand: 'Garmin', name: 'Garmin Смарт-часы', emoji: '⌚', imgUrl: '', tag: 'В наличии', available: true, variants: [{ model: 'Venu 4, 41mm', price: '342 900' }, { model: 'Venu 4, 45mm', price: '349 900' }, { model: 'Forerunner 965', price: '402 900' }, { model: 'Forerunner 970', price: '440 900' }, { model: 'Fenix 8, 47mm', price: '667 900' }] },
    { id: 17, brand: 'WHOOP', name: 'WHOOP Фитнес-трекер', emoji: '💪', imgUrl: '', tag: 'Как у Роналду', available: true, variants: [{ model: 'WHOOP Peak 5.0', price: '195 900' }, { model: 'WHOOP Life MG', price: '268 900' }] },
    { id: 18, brand: 'DJI', name: 'DJI Osmo Pocket 3', emoji: '🎥', imgUrl: '', tag: 'Для контента', available: true, variants: [{ model: 'Osmo Pocket 3 Creator Combo', price: '367 900' }] },
    { id: 19, brand: 'Canon', name: 'Canon G7X Mark III', emoji: '📷', imgUrl: '', tag: 'Для влогеров', available: true, variants: [{ model: 'Canon G7X Mark III', price: '764 900' }] }
  ]
}

// ── PRODUCTS ROUTES ──
app.get('/api/products', (req, res) => {
  const db = readDB()
  res.json(db.products)
})

app.post('/api/products', (req, res) => {
  const db = readDB()
  const maxId = db.products.reduce((m, p) => Math.max(m, p.id), 0)
  const product = { ...req.body, id: maxId + 1 }
  db.products.push(product)
  writeDB(db)
  res.json(product)
})

app.put('/api/products/:id', (req, res) => {
  const db = readDB()
  const id = parseInt(req.params.id)
  const idx = db.products.findIndex(p => p.id === id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  db.products[idx] = { ...db.products[idx], ...req.body, id }
  writeDB(db)
  res.json(db.products[idx])
})

app.delete('/api/products/:id', (req, res) => {
  const db = readDB()
  const id = parseInt(req.params.id)
  db.products = db.products.filter(p => p.id !== id)
  writeDB(db)
  res.json({ ok: true })
})

app.patch('/api/products/:id/toggle', (req, res) => {
  const db = readDB()
  const id = parseInt(req.params.id)
  const p = db.products.find(p => p.id === id)
  if (!p) return res.status(404).json({ error: 'Not found' })
  p.available = !p.available
  writeDB(db)
  res.json(p)
})

// Reorder products
app.put('/api/products/reorder', (req, res) => {
  const db = readDB()
  db.products = req.body // ordered array of products
  writeDB(db)
  res.json({ ok: true })
})

// ── UPLOAD ROUTE ──
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' })
  const url = `/uploads/${req.file.filename}`
  res.json({ url })
})

// ── SETTINGS ROUTES ──
app.get('/api/settings', (req, res) => {
  const db = readDB()
  res.json(db.settings || defaultSettings())
})

app.put('/api/settings', (req, res) => {
  const db = readDB()
  db.settings = { ...defaultSettings(), ...req.body }
  writeDB(db)
  res.json(db.settings)
})

// ── SERVE FRONTEND ──
const DIST_DIR = path.join(__dirname, '../dist')
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res) => res.sendFile(path.join(DIST_DIR, 'index.html')))
}

// ── START ──
app.listen(PORT, () => {
  console.log(`\n🚀 élite space API running at http://localhost:${PORT}`)
  console.log(`📁 DB: ${DB_PATH}`)
  console.log(`🖼  Uploads: ${UPLOADS_DIR}\n`)
})
