const $ = (id) => document.getElementById(id);

function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

async function loadInfo() {
  try {
    const r = await fetch('/api/info');
    const i = await r.json();
    $('info-list').innerHTML = `
      <dt>Container</dt><dd>${esc(i.container)}</dd>
      <dt>Node.js</dt><dd>${esc(i.node)}</dd>
      <dt>MySQL</dt><dd>${esc(i.mysql)}</dd>
      <dt>Total catatan</dt><dd>${esc(String(i.totalNotes))}</dd>
      <dt>Uptime app</dt><dd>${esc(String(i.uptimeSeconds))} detik</dd>`;
  } catch {
    $('info-list').innerHTML = '<dt>Gagal memuat info</dt>';
  }
}

async function loadNotes() {
  const r = await fetch('/api/notes');
  const notes = await r.json();
  const ul = $('notes');
  if (!notes.length) {
    ul.innerHTML = '<li class="empty">Belum ada catatan.</li>';
    return;
  }
  ul.innerHTML = notes.map((n) => `
    <li>
      <div>
        <h3>${esc(n.title)}</h3>
        <p>${esc(n.content)}</p>
        <small>#${n.id} · ${new Date(n.created_at).toLocaleString('id-ID')}</small>
      </div>
      <button class="del" data-id="${n.id}">Hapus</button>
    </li>`).join('');
}

$('note-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('msg').textContent = '';
  const r = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: $('title').value, content: $('content').value }),
  });
  if (!r.ok) {
    $('msg').textContent = (await r.json()).error || 'Gagal menyimpan';
    return;
  }
  e.target.reset();
  await Promise.all([loadNotes(), loadInfo()]);
});

$('notes').addEventListener('click', async (e) => {
  const btn = e.target.closest('button.del');
  if (!btn) return;
  await fetch('/api/notes/' + btn.dataset.id, { method: 'DELETE' });
  await Promise.all([loadNotes(), loadInfo()]);
});

loadInfo();
loadNotes();
