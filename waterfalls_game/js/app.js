// ─────────────────────────────────────────────────────────────
//  app.js  –  WaterFalls Game | SPA Controller
//  Todas as requisições ao backend são feitas via fetch() JSON
// ─────────────────────────────────────────────────────────────

const API = {
  perguntas: 'api/perguntas.php',
  usuarios:  'api/usuarios.php',
};

const LETTERS = ['A','B','C','D','E'];

// ══════════════════════════════════════════════
//  Utilitários
// ══════════════════════════════════════════════

/** Exibe uma view e marca o nav ativo */
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const view = document.getElementById('view-' + id);
  const nav  = document.querySelector(`[data-view="${id}"]`);
  if (view) view.classList.add('active');
  if (nav)  nav.classList.add('active');
  window._currentView = id;
  document.querySelector('.sidebar')?.classList.remove('open');
  // Executar inicializador da view se existir
  if (typeof viewInits[id] === 'function') viewInits[id]();
}

/** Cria e remove automaticamente um alerta */
function showAlert(containerSel, msg, type = 'success', ttl = 4000) {
  const container = document.querySelector(containerSel);
  if (!container) return;
  const el = document.createElement('div');
  el.className = `alert alert-${type}`;
  el.innerHTML = (type === 'success' ? '✅ ' : '❌ ') + escHtml(msg);
  container.prepend(el);
  if (ttl > 0) setTimeout(() => el.remove(), ttl);
}

function escHtml(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function setLoading(btn, loading) {
  if (!btn) return;
  if (loading) {
    btn._origText = btn.innerHTML;
    btn.innerHTML = '<span class="spinner"></span> Salvando…';
    btn.disabled = true;
  } else {
    btn.innerHTML = btn._origText || 'Salvar';
    btn.disabled = false;
  }
}

// ══════════════════════════════════════════════
//  Fetch helpers
// ══════════════════════════════════════════════

async function apiGet(url) {
  const r = await fetch(url);
  return r.json();
}

async function apiPost(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function apiPut(url, body) {
  const r = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function apiDelete(url) {
  const r = await fetch(url, { method: 'DELETE' });
  return r.json();
}

// ══════════════════════════════════════════════
//  VIEW: Dashboard
// ══════════════════════════════════════════════

async function initDashboard() {
  const [pRes, uRes] = await Promise.all([
    apiGet(API.perguntas),
    apiGet(API.usuarios),
  ]);

  const questions = pRes.ok ? pRes.data : [];
  const users     = uRes.ok ? uRes.data : [];
  const multipla  = questions.filter(q => q.tipo === 'multipla').length;
  const texto     = questions.filter(q => q.tipo === 'texto').length;

  document.getElementById('stat-total').textContent    = questions.length;
  document.getElementById('stat-multipla').textContent = multipla;
  document.getElementById('stat-texto').textContent    = texto;
  document.getElementById('stat-users').textContent    = users.length;

  // Últimas 5 perguntas
  const tbody = document.getElementById('recent-tbody');
  const recentes = [...questions].reverse().slice(0, 5);
  if (recentes.length === 0) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="4">Nenhuma pergunta cadastrada ainda.</td></tr>`;
  } else {
    tbody.innerHTML = recentes.map(q => `
      <tr>
        <td>${escHtml(q.enunciado.substring(0,60))}${q.enunciado.length > 60 ? '…' : ''}</td>
        <td>${badgeHtml(q.tipo)}</td>
        <td>${q.respostas.length}</td>
        <td>
          <div class="btn-group">
            <button class="btn btn-secondary btn-sm" onclick="openDetail('${escHtml(q.id)}')">👁 Ver</button>
            <button class="btn btn-warning btn-sm"   onclick="openEdit('${escHtml(q.id)}')">✏️ Editar</button>
          </div>
        </td>
      </tr>`).join('');
  }
}

function badgeHtml(tipo) {
  return tipo === 'multipla'
    ? `<span class="badge badge-multiple">🔵 Múltipla</span>`
    : `<span class="badge badge-text">🟡 Texto</span>`;
}

// ══════════════════════════════════════════════
//  VIEW: Criar Múltipla Escolha
// ══════════════════════════════════════════════

function initCriarMultipla() {
  document.getElementById('form-criar-multipla').reset();
  document.getElementById('alert-criar-multipla').innerHTML = '';
}

async function submitCriarMultipla(e) {
  e.preventDefault();
  const btn       = document.getElementById('btn-criar-multipla');
  const enunciado = document.getElementById('cm-enunciado').value.trim();
  const opcoes    = [...document.querySelectorAll('.cm-opcao')]
    .map(i => i.value.trim()).filter(Boolean);

  if (opcoes.length < 2) {
    showAlert('#alert-criar-multipla', 'Informe ao menos 2 opções de resposta.', 'danger');
    return;
  }

  setLoading(btn, true);
  const res = await apiPost(API.perguntas, { enunciado, tipo: 'multipla', respostas: opcoes });
  setLoading(btn, false);

  if (res.ok) {
    showAlert('#alert-criar-multipla', 'Pergunta criada com sucesso!');
    document.getElementById('form-criar-multipla').reset();
  } else {
    showAlert('#alert-criar-multipla', res.error, 'danger');
  }
}

// ══════════════════════════════════════════════
//  VIEW: Criar Texto Livre
// ══════════════════════════════════════════════

function initCriarTexto() {
  document.getElementById('form-criar-texto').reset();
  document.getElementById('alert-criar-texto').innerHTML = '';
}

async function submitCriarTexto(e) {
  e.preventDefault();
  const btn       = document.getElementById('btn-criar-texto');
  const enunciado = document.getElementById('ct-enunciado').value.trim();
  const resposta  = document.getElementById('ct-resposta').value.trim();

  setLoading(btn, true);
  const res = await apiPost(API.perguntas, { enunciado, tipo: 'texto', respostas: [resposta] });
  setLoading(btn, false);

  if (res.ok) {
    showAlert('#alert-criar-texto', 'Pergunta criada com sucesso!');
    document.getElementById('form-criar-texto').reset();
  } else {
    showAlert('#alert-criar-texto', res.error, 'danger');
  }
}

// ══════════════════════════════════════════════
//  VIEW: Listar
// ══════════════════════════════════════════════

let _allQuestions = [];
let _filterTipo   = 'todos';

async function initListar() {
  document.getElementById('alert-listar').innerHTML = '';
  await loadListar();
}

async function loadListar() {
  const tbody = document.getElementById('listar-tbody');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="5"><span class="spinner"></span> Carregando…</td></tr>`;

  const res = await apiGet(API.perguntas);
  if (!res.ok) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="5">Erro ao carregar perguntas.</td></tr>`;
    return;
  }

  _allQuestions = res.data;
  renderListar();
}

function setFilter(tipo) {
  _filterTipo = tipo;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('btn-primary',   b.dataset.tipo === tipo);
    b.classList.toggle('btn-secondary', b.dataset.tipo !== tipo);
  });
  renderListar();
}

function renderListar() {
  const questions = _filterTipo === 'todos'
    ? _allQuestions
    : _allQuestions.filter(q => q.tipo === _filterTipo);

  document.getElementById('filter-count').textContent = `${questions.length} pergunta(s)`;
  const tbody = document.getElementById('listar-tbody');

  if (questions.length === 0) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="5" style="text-align:center;padding:40px">Nenhuma pergunta encontrada.</td></tr>`;
    return;
  }

  tbody.innerHTML = questions.map((q, idx) => `
    <tr>
      <td style="color:var(--text-muted);width:36px">${idx + 1}</td>
      <td>
        <span style="color:var(--text);font-weight:500;cursor:pointer"
              onclick="openDetail('${escHtml(q.id)}')">
          ${escHtml(q.enunciado.substring(0,70))}${q.enunciado.length > 70 ? '…' : ''}
        </span>
      </td>
      <td>${badgeHtml(q.tipo)}</td>
      <td>${q.respostas.length}</td>
      <td>
        <div class="btn-group">
          <button class="btn btn-secondary btn-sm" onclick="openDetail('${escHtml(q.id)}')">👁 Ver</button>
          <button class="btn btn-warning btn-sm"   onclick="openEdit('${escHtml(q.id)}')">✏️ Editar</button>
          <button class="btn btn-danger btn-sm"    onclick="confirmDelete('${escHtml(q.id)}', ${escHtml(JSON.stringify(q.enunciado.substring(0,40)))})">🗑 Excluir</button>
        </div>
      </td>
    </tr>`).join('');
}

// ── Delete com modal de confirmação ──────────

function confirmDelete(id, trecho) {
  document.getElementById('delete-trecho').textContent = trecho + '…';
  document.getElementById('btn-confirm-delete').onclick = () => executeDelete(id);
  document.getElementById('modal-delete').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('modal-delete').classList.remove('open');
}

async function executeDelete(id) {
  const btn = document.getElementById('btn-confirm-delete');
  setLoading(btn, true);
  const res = await apiDelete(`${API.perguntas}?id=${encodeURIComponent(id)}`);
  setLoading(btn, false);
  closeDeleteModal();

  if (res.ok) {
    showAlert('#alert-listar', 'Pergunta excluída com sucesso.');
    await loadListar();
  } else {
    showAlert('#alert-listar', res.error, 'danger');
  }
}

// ══════════════════════════════════════════════
//  VIEW: Ver (detalhe de uma pergunta)
// ══════════════════════════════════════════════

async function openDetail(id) {
  showView('ver');
  document.getElementById('detail-content').innerHTML =
    `<div style="padding:40px;text-align:center"><span class="spinner" style="width:32px;height:32px;border-width:3px"></span></div>`;

  const res = await apiGet(`${API.perguntas}?id=${encodeURIComponent(id)}`);
  if (!res.ok) {
    document.getElementById('detail-content').innerHTML =
      `<div class="alert alert-danger">❌ ${escHtml(res.error)}</div>`;
    return;
  }

  const q = res.data;
  let respostasHtml = '';

  if (q.tipo === 'multipla') {
    respostasHtml = `<ul class="answer-list">
      ${q.respostas.map((r,i) => `
        <li>
          <div class="letter-chip">${LETTERS[i] ?? i+1}</div>
          <span>${escHtml(r)}</span>
        </li>`).join('')}
    </ul>`;
  } else {
    respostasHtml = `<div style="background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:18px;line-height:1.7">
      ${escHtml(q.respostas[0] ?? '').replace(/\n/g,'<br>')}
    </div>`;
  }

  document.getElementById('detail-content').innerHTML = `
    <div class="question-detail">
      <div class="question-detail-header">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap">
          <div>
            ${badgeHtml(q.tipo)}
            <h2 style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700;line-height:1.4;margin-top:10px">
              ${escHtml(q.enunciado)}
            </h2>
          </div>
          <div class="btn-group">
            <button class="btn btn-warning btn-sm" onclick="openEdit('${escHtml(q.id)}')">✏️ Editar</button>
            <button class="btn btn-secondary btn-sm" onclick="showView('listar')">← Voltar</button>
          </div>
        </div>
      </div>
      <div class="question-detail-body">
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;font-weight:600;letter-spacing:.06em;text-transform:uppercase">
          ${q.tipo === 'multipla' ? 'Alternativas' : 'Resposta Esperada'}
        </p>
        ${respostasHtml}
        <hr class="divider">
        <button class="btn btn-danger" onclick="confirmDelete('${escHtml(q.id)}', '${escHtml(q.enunciado.substring(0,40))}')">
          🗑 Excluir Pergunta
        </button>
      </div>
    </div>`;
}

// ══════════════════════════════════════════════
//  VIEW: Editar
// ══════════════════════════════════════════════

let _editQuestion = null;

async function openEdit(id) {
  showView('editar');
  document.getElementById('edit-content').innerHTML =
    `<div style="padding:40px;text-align:center"><span class="spinner" style="width:32px;height:32px;border-width:3px"></span></div>`;
  document.getElementById('alert-editar').innerHTML = '';

  const res = await apiGet(`${API.perguntas}?id=${encodeURIComponent(id)}`);
  if (!res.ok) {
    document.getElementById('edit-content').innerHTML =
      `<div class="alert alert-danger">❌ ${escHtml(res.error)}</div>`;
    return;
  }

  _editQuestion = res.data;
  renderEditForm(_editQuestion);
}

function renderEditForm(q) {
  const isMultipla = q.tipo === 'multipla';

  // Monta campos de resposta
  let respostasHtml = '';
  if (isMultipla) {
    const vals = [...q.respostas];
    while (vals.length < 5) vals.push('');
    respostasHtml = `
      <div class="form-group">
        <label>Opções de Resposta * <small style="color:var(--text-muted)">(mín. 2, máx. 5)</small></label>
        <div class="answers-block">
          ${vals.map((v, i) => `
            <div class="answer-row">
              <div class="answer-letter">${LETTERS[i]}</div>
              <input type="text" class="form-control edit-opcao"
                     placeholder="Opção ${LETTERS[i]}${i < 2 ? ' (obrigatório)' : ''}"
                     value="${escHtml(v)}" ${i < 2 ? 'required' : ''}>
            </div>`).join('')}
        </div>
      </div>`;
  } else {
    respostasHtml = `
      <div class="form-group">
        <label for="edit-resposta">Resposta Esperada *</label>
        <textarea id="edit-resposta" class="form-control" rows="5">${escHtml(q.respostas[0] ?? '')}</textarea>
      </div>`;
  }

  document.getElementById('edit-content').innerHTML = `
    <div class="card">
      <div class="card-title">
        Editar Pergunta
        <span class="tag ${isMultipla ? '' : 'tag-yellow'}">${isMultipla ? '🔵 Múltipla Escolha' : '🟡 Texto Livre'}</span>
      </div>
      <div class="form-group">
        <label for="edit-enunciado">Enunciado *</label>
        <textarea id="edit-enunciado" class="form-control" rows="3" required>${escHtml(q.enunciado)}</textarea>
      </div>
      ${respostasHtml}
      <hr class="divider">
      <div class="btn-group">
        <button id="btn-salvar-edicao" class="btn btn-primary" onclick="submitEdit()">💾 Salvar Alterações</button>
        <button class="btn btn-secondary" onclick="openDetail('${escHtml(q.id)}')">Cancelar</button>
      </div>
    </div>`;
}

async function submitEdit() {
  if (!_editQuestion) return;
  const btn       = document.getElementById('btn-salvar-edicao');
  const enunciado = document.getElementById('edit-enunciado').value.trim();

  let respostas = [];
  if (_editQuestion.tipo === 'multipla') {
    respostas = [...document.querySelectorAll('.edit-opcao')]
      .map(i => i.value.trim()).filter(Boolean);
    if (respostas.length < 2) {
      showAlert('#alert-editar', 'Informe ao menos 2 opções de resposta.', 'danger');
      return;
    }
  } else {
    const r = document.getElementById('edit-resposta')?.value.trim();
    if (!r) { showAlert('#alert-editar', 'A resposta é obrigatória.', 'danger'); return; }
    respostas = [r];
  }

  setLoading(btn, true);
  const res = await apiPut(API.perguntas, {
    id: _editQuestion.id, enunciado, respostas,
  });
  setLoading(btn, false);

  if (res.ok) {
    showAlert('#alert-editar', 'Pergunta atualizada com sucesso!');
    _editQuestion = res.data;
  } else {
    showAlert('#alert-editar', res.error, 'danger');
  }
}

// ══════════════════════════════════════════════
//  VIEW: Usuários
// ══════════════════════════════════════════════

async function initUsuarios() {
  document.getElementById('form-usuario').reset();
  document.getElementById('alert-usuario').innerHTML = '';
  await loadUsuarios();
}

async function loadUsuarios() {
  const tbody = document.getElementById('usuarios-tbody');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="3"><span class="spinner"></span> Carregando…</td></tr>`;
  const res = await apiGet(API.usuarios);
  if (!res.ok) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="3">Erro ao carregar usuários.</td></tr>`;
    return;
  }
  const users = res.data;
  if (users.length === 0) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="3" style="text-align:center;padding:40px">Nenhum usuário cadastrado.</td></tr>`;
  } else {
    tbody.innerHTML = users.map((u, i) => `
      <tr>
        <td style="color:var(--text-muted)">${i + 1}</td>
        <td>${escHtml(u.nome)}</td>
        <td style="color:var(--text-muted)">${escHtml(u.email)}</td>
      </tr>`).join('');
  }
  document.getElementById('stat-user-count').textContent = `${users.length} usuário(s)`;
}

async function submitUsuario(e) {
  e.preventDefault();
  const btn   = document.getElementById('btn-criar-usuario');
  const nome  = document.getElementById('u-nome').value.trim();
  const email = document.getElementById('u-email').value.trim();

  setLoading(btn, true);
  const res = await apiPost(API.usuarios, { nome, email });
  setLoading(btn, false);

  if (res.ok) {
    showAlert('#alert-usuario', `Usuário "${nome}" cadastrado com sucesso!`);
    document.getElementById('form-usuario').reset();
    await loadUsuarios();
  } else {
    showAlert('#alert-usuario', res.error, 'danger');
  }
}

// ══════════════════════════════════════════════
//  Inicializadores de views (chamados ao navegar)
// ══════════════════════════════════════════════

const viewInits = {
  home:          initDashboard,
  listar:        initListar,
  criarMultipla: initCriarMultipla,
  criarTexto:    initCriarTexto,
  usuarios:      initUsuarios,
};

// ══════════════════════════════════════════════
//  Bootstrap
// ══════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
  // Navegação
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => showView(btn.dataset.view));
  });

  // Formulários
  document.getElementById('form-criar-multipla')
    ?.addEventListener('submit', submitCriarMultipla);
  document.getElementById('form-criar-texto')
    ?.addEventListener('submit', submitCriarTexto);
  document.getElementById('form-usuario')
    ?.addEventListener('submit', submitUsuario);

  // Filtros da listagem
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setFilter(btn.dataset.tipo));
  });

  // Modal fechar ao clicar fora
  document.getElementById('modal-delete')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeDeleteModal();
  });

  // Hamburger
  document.querySelector('.hamburger')?.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.toggle('open');
  });

  // Inicia na home
  showView('home');
});
