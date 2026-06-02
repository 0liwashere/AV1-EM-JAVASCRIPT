# 🎮 WaterFalls Corporate Game — Sistema de Perguntas & Respostas

Sistema web **SPA (Single Page Application)** com frontend em **JavaScript puro (fetch/AJAX)** e backend em **PHP REST API**, com persistência em arquivos `.txt`.

---

## 📁 Estrutura de Pastas

```
waterfalls_game/
│
├── index.php               ← Único arquivo HTML/PHP da aplicação (SPA)
│
├── api/
│   ├── data.php            ← Funções de leitura/escrita nos arquivos TXT
│   ├── perguntas.php       ← REST API de Perguntas (GET/POST/PUT/DELETE)
│   └── usuarios.php        ← REST API de Usuários  (GET/POST)
│
├── css/
│   └── style.css           ← Estilo global
│
├── js/
│   └── app.js              ← Toda a lógica frontend (fetch, DOM, SPA)
│
└── data/                   ← Criado automaticamente
    ├── perguntas.txt
    └── usuarios.txt
```

---

## ⚙️ Requisitos

- PHP 7.4 ou superior
- Servidor local: XAMPP, WAMP, Laragon, ou `php -S localhost:8000`

---

## 🚀 Como executar

### Opção 1 — PHP embutido (recomendado para desenvolvimento)
```bash
cd waterfalls_game
php -S localhost:8000
```
Acesse: **http://localhost:8000**

### Opção 2 — XAMPP / WAMP
1. Copie a pasta `waterfalls_game/` para `htdocs/` (XAMPP) ou `www/` (WAMP)
2. Inicie o Apache
3. Acesse: **http://localhost/waterfalls_game/**

---

## 🏗 Arquitetura

```
┌─────────────────────────────┐
│   index.php  (HTML + SPA)   │  ← único ponto de entrada
│      js/app.js              │  ← controla todas as views e requisições
└────────────┬────────────────┘
             │  fetch() JSON
     ┌───────▼────────┐
     │   PHP REST API │
     │  api/perguntas.php   GET / POST / PUT / DELETE
     │  api/usuarios.php    GET / POST
     └───────┬────────┘
             │  leitura/escrita
     ┌───────▼────────┐
     │  data/*.txt    │  ← banco de dados em arquivo
     └────────────────┘
```

---

## 📡 Endpoints da API

### Perguntas — `api/perguntas.php`

| Método   | URL                          | Descrição                        |
|----------|------------------------------|----------------------------------|
| `GET`    | `api/perguntas.php`          | Lista todas as perguntas         |
| `GET`    | `api/perguntas.php?id=xxx`   | Retorna uma pergunta pelo ID     |
| `POST`   | `api/perguntas.php`          | Cria nova pergunta               |
| `PUT`    | `api/perguntas.php`          | Atualiza uma pergunta existente  |
| `DELETE` | `api/perguntas.php?id=xxx`   | Exclui pergunta e respostas      |

**Body POST/PUT (JSON):**
```json
{
  "enunciado": "Qual é a melhor prática?",
  "tipo": "multipla",
  "respostas": ["Opção A", "Opção B", "Opção C"]
}
```

### Usuários — `api/usuarios.php`

| Método | URL               | Descrição              |
|--------|-------------------|------------------------|
| `GET`  | `api/usuarios.php` | Lista todos os usuários |
| `POST` | `api/usuarios.php` | Cadastra novo usuário   |

---

## 📋 Funcionalidades

| # | Funcionalidade                          |
|---|-----------------------------------------|
| 1 | Criar pergunta de múltipla escolha      |
| 2 | Criar pergunta de texto livre           |
| 3 | Alterar pergunta de múltipla escolha    |
| 4 | Alterar pergunta de texto livre         |
| 5 | Listar todas as perguntas (com filtro)  |
| 6 | Visualizar uma pergunta                 |
| 7 | Excluir pergunta e respostas (modal)    |
| + | Cadastro de usuários (arquivo TXT)      |

---

## 👥 Projeto

Desenvolvido para a disciplina de Sistemas de Informação.
Baseado no minimundo do **Sr. Water Falls Corporate Game**.
