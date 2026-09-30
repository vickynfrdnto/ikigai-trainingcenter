# IKIGAI Training Center

Portal training React + Vite yang tersambung ke Firebase:

- Firebase Realtime Database untuk user, progres, modul, bank soal, dan status realtime.
- Firebase Anonymous Auth untuk sesi login.
- Firebase Storage untuk upload dokumen PDF dari Admin Panel.
- Video dan dokumen modul memakai tautan OneDrive/SharePoint yang dibagikan melalui Admin Panel.

## Jalankan Lokal

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:5173
```

## Build Produksi

```bash
npm run build
```

Output build ada di:

```text
dist
```

Folder `dist` bisa di-host ke Firebase Hosting, Vercel, Netlify, atau hosting static lain.

## Firebase

Konfigurasi Firebase ada di:

```text
src/firebase-config.js
```

Pastikan Firebase project mengaktifkan:

- Authentication: Anonymous sign-in
- Realtime Database
- Storage

Kode admin mengikuti data di Realtime Database pada node:

```text
users/{kode}
```
