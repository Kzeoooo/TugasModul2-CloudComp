'use strict';

const os = require('os');
const path = require('path');
const express = require('express');
const mysql = require('mysql2/promise');

const PORT = parseInt(process.env.PORT || '3000', 10);
const DB_WAIT_RETRIES = parseInt(process.env.DB_WAIT_RETRIES || '30', 10);
const DB_WAIT_INTERVAL = parseInt(process.env.DB_WAIT_INTERVAL || '2', 10) * 1000;

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'database',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function initDatabase() {
  for (let i = 1; i <= DB_WAIT_RETRIES; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS notes (
          id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(150) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
      console.log('[db] terhubung dan tabel siap');
      return;
    } catch (err) {
      console.log(`[db] belum siap (${i}/${DB_WAIT_RETRIES}): ${err.code || err.message}`);
      await sleep(DB_WAIT_INTERVAL);
    }
  }
  throw new Error('Database tidak dapat dihubungi');
}

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Health check untuk Docker
app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'database-unavailable' });
  }
});

// Info container (membuktikan app berjalan di dalam container)
app.get('/api/info', async (_req, res) => {
  const [[row]] = await pool.query('SELECT VERSION() AS version, COUNT(*) AS total FROM notes');
  res.json({
    container: os.hostname(),
    node: process.version,
    mysql: row.version,
    totalNotes: row.total,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.get('/api/notes', async (_req, res) => {
  const [rows] = await pool.query('SELECT id, title, content, created_at FROM notes ORDER BY id DESC');
  res.json(rows);
});

app.post('/api/notes', async (req, res) => {
  const title = String(req.body.title || '').trim();
  const content = String(req.body.content || '').trim();
  if (!title || !content) {
    return res.status(400).json({ error: 'Judul dan isi wajib diisi' });
  }
  const [result] = await pool.query(
    'INSERT INTO notes (title, content) VALUES (?, ?)',
    [title.slice(0, 150), content]
  );
  res.status(201).json({ id: result.insertId });
});

app.delete('/api/notes/:id', async (req, res) => {
  await pool.query('DELETE FROM notes WHERE id = ?', [req.params.id]);
  res.json({ deleted: true });
});

// Penanganan error umum
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Terjadi kesalahan server' });
});

initDatabase()
  .then(() => app.listen(PORT, '0.0.0.0', () => console.log(`[app] berjalan di port ${PORT}`)))
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
