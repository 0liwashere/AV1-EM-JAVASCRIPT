<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WaterFalls Corporate Game</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<div class="wrapper">

  <!-- ── Hamburger ── -->
  <button class="hamburger">☰</button>

  <!-- ═══════════════════════════════
       SIDEBAR
  ═══════════════════════════════ -->
  <aside class="sidebar">
    <div class="sidebar-brand">
      <div class="logo-badge" data-view="home" style="cursor:pointer">
        <div class="logo-icon">🎮</div>
        <div>
          <div class="logo-text">WaterFalls</div>
          <div class="logo-sub">Corporate Game</div>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section-label">Menu</div>

      <button class="nav-item" data-view="home">
        <span class="nav-icon">🏠</span> Dashboard
      </button>

      <button class="nav-item" data-view="criarMultipla">
        <span class="nav-icon">🔵</span> Criar – Múltipla Escolha
      </button>

      <button class="nav-item" data-view="criarTexto">
        <span class="nav-icon">🟡</span> Criar – Texto Livre
      </button>

      <button class="nav-item" data-view="listar">
        <span class="nav-icon">📋</span> Listar Perguntas
      </button>

      <button class="nav-item" data-view="usuarios">
        <span class="nav-icon">👤</span> Usuários
      </button>
    </nav>

    <div class="sidebar-footer">&copy; <?php echo date('Y'); ?> WaterFalls Game</div>
  </aside>

  <!-- ═══════════════════════════════
       MAIN CONTENT
  ═══════════════════════════════ -->
  <main class="main">

    <!-- ─── VIEW: Dashboard ─────────────────── -->
    <section id="view-home" class="view">
      <div class="page-header">
        <div class="accent-line"></div>
        <h1>Dashboard</h1>
        <p>Visão geral do sistema de perguntas e respostas</p>
      </div>

      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-number" id="stat-total">–</div>
          <div class="stat-label">📋 Total de Perguntas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-multipla">–</div>
          <div class="stat-label">🔵 Múltipla Escolha</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-texto">–</div>
          <div class="stat-label">🟡 Texto Livre</div>
        </div>
        <div class="stat-card">
          <div class="stat-number" id="stat-users">–</div>
          <div class="stat-label">👤 Usuários</div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">⚡ Ações Rápidas</div>
        <div class="btn-group">
          <button class="btn btn-primary"   data-view="criarMultipla">🔵 Nova Múltipla Escolha</button>
          <button class="btn btn-warning"   data-view="criarTexto">🟡 Nova Texto Livre</button>
          <button class="btn btn-secondary" data-view="listar">📋 Ver Todas</button>
          <button class="btn btn-secondary" data-view="usuarios">👤 Usuários</button>
        </div>
      </div>

      <div class="card">
        <div class="card-title">🕓 Últimas Perguntas</div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Enunciado</th><th>Tipo</th><th>Respostas</th><th>Ações</th>
              </tr>
            </thead>
            <tbody id="recent-tbody">
              <tr class="loading-row">
                <td colspan="4"><span class="spinner"></span> Carregando…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ─── VIEW: Criar Múltipla Escolha ──── -->
    <section id="view-criarMultipla" class="view">
      <div class="page-header">
        <div class="accent-line"></div>
        <h1>🔵 Criar Pergunta – Múltipla Escolha</h1>
        <p>Cadastre um enunciado com até 5 alternativas</p>
      </div>

      <div id="alert-criar-multipla"></div>

      <div class="card">
        <div class="card-title">Nova Pergunta <span class="tag">Múltipla Escolha</span></div>

        <form id="form-criar-multipla">
          <div class="form-group">
            <label for="cm-enunciado">Enunciado *</label>
            <textarea id="cm-enunciado" class="form-control" rows="3"
                      placeholder="Digite a pergunta aqui…" required></textarea>
          </div>

          <div class="form-group">
            <label>Opções de Resposta * <small style="color:var(--text-muted)">(mín. 2, máx. 5)</small></label>
            <div class="answers-block">
              <div class="answer-row">
                <div class="answer-letter">A</div>
                <input type="text" class="form-control cm-opcao" placeholder="Opção A (obrigatório)" required>
              </div>
              <div class="answer-row">
                <div class="answer-letter">B</div>
                <input type="text" class="form-control cm-opcao" placeholder="Opção B (obrigatório)" required>
              </div>
              <div class="answer-row">
                <div class="answer-letter">C</div>
                <input type="text" class="form-control cm-opcao" placeholder="Opção C">
              </div>
              <div class="answer-row">
                <div class="answer-letter">D</div>
                <input type="text" class="form-control cm-opcao" placeholder="Opção D">
              </div>
              <div class="answer-row">
                <div class="answer-letter">E</div>
                <input type="text" class="form-control cm-opcao" placeholder="Opção E">
              </div>
            </div>
          </div>

          <hr class="divider">
          <div class="btn-group">
            <button type="submit" id="btn-criar-multipla" class="btn btn-primary">💾 Salvar Pergunta</button>
            <button type="button" class="btn btn-secondary" data-view="home">Cancelar</button>
          </div>
        </form>
      </div>
    </section>

    <!-- ─── VIEW: Criar Texto Livre ─────────── -->
    <section id="view-criarTexto" class="view">
      <div class="page-header">
        <div class="accent-line"></div>
        <h1>🟡 Criar Pergunta – Texto Livre</h1>
        <p>Cadastre uma pergunta com resposta dissertativa</p>
      </div>

      <div id="alert-criar-texto"></div>

      <div class="card">
        <div class="card-title">Nova Pergunta
          <span class="tag tag-yellow">Texto Livre</span>
        </div>

        <form id="form-criar-texto">
          <div class="form-group">
            <label for="ct-enunciado">Enunciado *</label>
            <textarea id="ct-enunciado" class="form-control" rows="3"
                      placeholder="Digite a pergunta aqui…" required></textarea>
          </div>

          <div class="form-group">
            <label for="ct-resposta">Resposta Esperada *</label>
            <textarea id="ct-resposta" class="form-control" rows="5"
                      placeholder="Descreva a resposta esperada ou gabarito…" required></textarea>
          </div>

          <hr class="divider">
          <div class="btn-group">
            <button type="submit" id="btn-criar-texto" class="btn btn-primary">💾 Salvar Pergunta</button>
            <button type="button" class="btn btn-secondary" data-view="home">Cancelar</button>
          </div>
        </form>
      </div>
    </section>

    <!-- ─── VIEW: Listar ─────────────────────── -->
    <section id="view-listar" class="view">
      <div class="page-header">
        <div class="accent-line"></div>
        <h1>📋 Listar Perguntas</h1>
        <p>Gerencie todas as perguntas cadastradas</p>
      </div>

      <div id="alert-listar"></div>

      <div class="filter-bar">
        <span style="font-size:13px;color:var(--text-muted)">Filtrar:</span>
        <button class="btn btn-sm btn-primary filter-btn"   data-tipo="todos">Todos</button>
        <button class="btn btn-sm btn-secondary filter-btn" data-tipo="multipla">🔵 Múltipla</button>
        <button class="btn btn-sm btn-secondary filter-btn" data-tipo="texto">🟡 Texto</button>
        <span class="filter-count" id="filter-count"></span>
      </div>

      <div class="card">
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th><th>Enunciado</th><th>Tipo</th><th>Respostas</th><th>Ações</th>
              </tr>
            </thead>
            <tbody id="listar-tbody">
              <tr class="loading-row">
                <td colspan="5"><span class="spinner"></span> Carregando…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="btn-group">
        <button class="btn btn-primary"   data-view="criarMultipla">🔵 Nova Múltipla Escolha</button>
        <button class="btn btn-warning"   data-view="criarTexto">🟡 Nova Texto Livre</button>
      </div>
    </section>

    <!-- ─── VIEW: Ver (detalhe) ──────────────── -->
    <section id="view-ver" class="view">
      <div class="page-header">
        <div class="accent-line"></div>
        <h1>👁 Visualizar Pergunta</h1>
        <p>Detalhes completos da pergunta selecionada</p>
      </div>

      <div id="detail-content">
        <!-- Preenchido dinamicamente pelo JS -->
      </div>
    </section>

    <!-- ─── VIEW: Editar ─────────────────────── -->
    <section id="view-editar" class="view">
      <div class="page-header">
        <div class="accent-line"></div>
        <h1>✏️ Editar Pergunta</h1>
        <p>Altere o enunciado ou as respostas</p>
      </div>

      <div id="alert-editar"></div>
      <div id="edit-content">
        <!-- Preenchido dinamicamente pelo JS -->
      </div>
    </section>

    <!-- ─── VIEW: Usuários ───────────────────── -->
    <section id="view-usuarios" class="view">
      <div class="page-header">
        <div class="accent-line"></div>
        <h1>👤 Usuários</h1>
        <p>Cadastro de usuários do sistema (armazenados em TXT)</p>
      </div>

      <div id="alert-usuario"></div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start">

        <div class="card">
          <div class="card-title">Novo Usuário</div>
          <form id="form-usuario">
            <div class="form-group">
              <label for="u-nome">Nome completo *</label>
              <input type="text" id="u-nome" class="form-control"
                     placeholder="Ex: João Silva" required>
            </div>
            <div class="form-group">
              <label for="u-email">E-mail *</label>
              <input type="email" id="u-email" class="form-control"
                     placeholder="Ex: joao@empresa.com" required>
            </div>
            <hr class="divider">
            <button type="submit" id="btn-criar-usuario" class="btn btn-primary">💾 Cadastrar</button>
          </form>
        </div>

        <div class="card">
          <div class="card-title">
            Usuários Cadastrados
            <span class="tag" id="stat-user-count"></span>
          </div>
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Nome</th><th>E-mail</th></tr>
              </thead>
              <tbody id="usuarios-tbody">
                <tr class="loading-row">
                  <td colspan="3"><span class="spinner"></span> Carregando…</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>

  </main><!-- /.main -->
</div><!-- /.wrapper -->

<!-- ─── Modal: Confirmar Exclusão ── -->
<div id="modal-delete" class="modal-overlay">
  <div class="modal">
    <div class="modal-title">🗑 Confirmar Exclusão</div>
    <p style="color:var(--text-muted);font-size:14px">
      Deseja excluir a pergunta e todas as suas respostas?
    </p>
    <blockquote id="delete-trecho"
      style="margin:14px 0;padding:12px 16px;background:var(--surface2);border-left:3px solid var(--danger);border-radius:0 8px 8px 0;font-size:14px;color:var(--text-muted)">
    </blockquote>
    <p style="font-size:13px;color:var(--danger)">⚠️ Esta ação não pode ser desfeita.</p>
    <div class="modal-actions">
      <button class="btn btn-secondary" onclick="closeDeleteModal()">Cancelar</button>
      <button id="btn-confirm-delete" class="btn btn-danger">🗑 Sim, excluir</button>
    </div>
  </div>
</div>

<script src="js/app.js"></script>
</body>
</html>
