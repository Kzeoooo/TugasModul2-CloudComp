# CloudNotes

Aplikasi catatan sederhana (Node.js + Express + MySQL 8.4) yang dikontainerisasi dengan
Docker dan Docker Compose, untuk Tugas Praktikum Komputasi Awan.

## Arsitektur

```
Browser --HTTP:80--> [app: Node.js :3000] --network backend (internal)--> [database: MySQL 8.4]
                        (network frontend + backend)                       (network backend saja,
                                                                            tanpa port publik,
                                                                            volume mysql_data)
```

## Struktur

```
cloudnotes/
├── Dockerfile          # multi-stage build (deps -> runtime)
├── compose.yaml        # service app + database, network, volume, healthcheck
├── .env.example        # contoh variabel rahasia (salin jadi .env)
├── .gitignore
├── .dockerignore
├── package.json / package-lock.json
├── server.js           # REST API + health check
└── public/             # frontend statis (HTML/CSS/JS)
```

## Menjalankan

```bash
cp .env.example .env
nano .env                       # isi password
docker compose up -d --build
docker compose ps               # tunggu sampai kedua service healthy
```

Buka `http://localhost` (lokal) atau `http://<IP_PUBLIC_VM>` (Azure VM).

## Endpoint

| Method | Path             | Fungsi                      |
|--------|------------------|-----------------------------|
| GET    | /health          | Health check (cek koneksi DB) |
| GET    | /api/info        | Info container, Node, MySQL |
| GET    | /api/notes       | Daftar catatan              |
| POST   | /api/notes       | Tambah catatan              |
| DELETE | /api/notes/:id   | Hapus catatan               |

## Perintah berguna

```bash
docker compose logs -f app
docker compose down        # data tetap aman (volume dipertahankan)
docker compose down -v     # HATI-HATI: menghapus volume/data database
```
