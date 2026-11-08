# Panduan Deploy & Pengujian (Azure VM)

## A. Uji lokal (laptop)
```bash
docker build -t cloudnotes-app .
cp .env.example .env && nano .env
docker compose up -d --build
docker compose ps
# buka http://localhost
```

## B. Push ke GitHub (dari laptop)
```bash
git init
git add .
git status                 # PASTIKAN .env TIDAK muncul
git commit -m "CloudNotes: dockerized app"
git branch -M main
git remote add origin https://github.com/<username>/cloudnotes.git
git push -u origin main
```

## C. Deploy di Azure VM
```bash
ssh <username>@<IP_VM>
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
git clone https://github.com/<username>/cloudnotes.git
cd cloudnotes
cp .env.example .env && nano .env     # isi password
sudo docker compose up -d --build
sudo docker compose ps
```
Buka `http://<IP_PUBLIC_VM>` (pastikan NSG mengizinkan port 80).

## D. Bukti pengujian (ambil screenshot)

1. **Struktur folder + isi Dockerfile & compose.yaml**
   ```bash
   ls -la && cat Dockerfile && cat compose.yaml
   ```
2. **Status service**
   ```bash
   sudo docker compose ps          # app & database: running (healthy)
   ```
3. **Browser** membuka `http://<IP_PUBLIC_VM>` (address bar terlihat).
4. **Azure Portal > VM > Overview**: nama VM + IP publik yang sama.
5. **Persistensi data**
   ```bash
   # tambah 1-2 catatan lewat browser, screenshot
   sudo docker compose down
   sudo docker compose up -d
   sudo docker compose ps
   # refresh browser: catatan masih ada, screenshot
   ```
6. **Keamanan network** (database tidak publish port)
   ```bash
   sudo docker compose ps                       # kolom PORTS database kosong / hanya 3306/tcp
   sudo docker port cloudnotes-db               # tidak ada output
   sudo ss -tlnp | grep 3306                    # tidak ada hasil
   nc -zv <IP_PUBLIC_VM> 3306                   # dari laptop: gagal/timeout
   ```
7. **Restart**
   ```bash
   sudo docker stop cloudnotes-app
   sudo docker compose ps                       # (opsional) lihat status
   # restart VM dari Azure Portal, lalu SSH lagi:
   sudo docker compose ps                       # kedua container kembali running
   ```
   Catatan: `docker stop` manual TIDAK otomatis dinyalakan oleh `unless-stopped`.
   Untuk bukti auto-restart paling jelas, gunakan **restart VM** atau:
   `sudo docker kill cloudnotes-app` (container mati paksa lalu hidup lagi sendiri).

## E. Setelah selesai
Azure Portal > VM > **Stop** (pastikan statusnya *Stopped (deallocated)*).
