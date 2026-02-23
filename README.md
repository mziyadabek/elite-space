# élite space — React App

> Full-stack React storefront + admin panel with image uploads and JSON database

---

## Project Structure

```
elite-space/
├── server/
│   ├── index.js          ← Express API + file upload handler
│   └── db.json           ← Auto-created JSON database (products & settings)
├── src/
│   ├── pages/
│   │   ├── StorePage.jsx ← Public store
│   │   └── AdminPage.jsx ← Admin shell + login
│   ├── admin/
│   │   ├── ProductsAdmin.jsx  ← Product CRUD + image upload
│   │   └── SettingsAdmin.jsx  ← Store settings editor
│   ├── hooks/
│   │   └── useProducts.js    ← Data fetching & state
│   ├── App.jsx           ← Router
│   ├── main.jsx          ← Entry point
│   └── index.css         ← Global styles
├── public/
│   └── uploads/          ← Uploaded product images
├── index.html
├── vite.config.js
└── package.json
```

---

## Setup & Run

**1. Install dependencies**

```bash
cd elite-space
npm install
```

**2. Start development** (runs both frontend + backend)

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Store | http://localhost:3000 |
| Admin | http://localhost:3000/admin |
| API | http://localhost:4000/api |

**3. Build for production**

```bash
npm run build
```

Serve the `dist/` folder with any static host and keep the server running.

---

```js
const ADMIN_USER = 'admin'
const ADMIN_PASS = 'elite2025' // ← change this
```

---

## Features

### Public Store (`/`)
- Animated homepage with live product data
- Auto-hides unavailable products
- Contact modal linking to WhatsApp & Instagram

### Admin Panel (`/admin`)

**Products tab**
- Add, edit, and delete products
- Upload photos (stored in `/public/uploads/`)
- Toggle availability instantly
- Search and filter by brand or status
- Multiple price variants per product

**Settings tab**
- Edit WhatsApp number and Instagram handle
- Change delivery days and guarantee months
- Toggle cash discount badge
- Test contact links live

---

## Database

`server/db.json` is a plain JSON file — easy to back up, edit manually, or migrate. Auto-created on first run with 19 default products pre-loaded.

---

## Image Uploads

Images are uploaded via the API and stored in `public/uploads/`.

- **Formats:** JPG, PNG, WebP, GIF, AVIF
- **Max size:** 10 MB per file

---

## Changing the API Port

Edit `server/index.js`:

```js
const PORT = 4000 // ← change backend port
```

Edit `vite.config.js`:

```js
proxy: {
  '/api': 'http://localhost:4000', // ← match backend port
}
```
