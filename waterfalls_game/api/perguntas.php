<?php
// ─────────────────────────────────────────────
//  api/perguntas.php  –  REST API para Perguntas
//
//  GET    /api/perguntas.php          → lista todas
//  GET    /api/perguntas.php?id=xxx   → busca uma
//  POST   /api/perguntas.php          → cria
//  PUT    /api/perguntas.php          → atualiza
//  DELETE /api/perguntas.php?id=xxx   → exclui
// ─────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/data.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── helpers ──────────────────────────────────
function ok(mixed $data, int $code = 200): void {
    http_response_code($code);
    echo json_encode(['ok' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit;
}

function fail(string $msg, int $code = 400): void {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}

function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

// ── Roteamento ────────────────────────────────
switch ($method) {

    // ── GET ──────────────────────────────────
    case 'GET':
        if (!empty($_GET['id'])) {
            $q = get_question_by_id(trim($_GET['id']));
            $q ? ok($q) : fail('Pergunta não encontrada.', 404);
        }
        ok(get_all_questions());
        break;

    // ── POST (criar) ─────────────────────────
    case 'POST':
        $b         = body();
        $enunciado = trim($b['enunciado'] ?? '');
        $tipo      = trim($b['tipo']      ?? '');
        $respostas = $b['respostas']      ?? [];

        if ($enunciado === '')
            fail('O campo "enunciado" é obrigatório.');

        if (!in_array($tipo, ['multipla', 'texto'], true))
            fail('O campo "tipo" deve ser "multipla" ou "texto".');

        if ($tipo === 'multipla') {
            $respostas = array_values(array_filter(array_map('trim', $respostas)));
            if (count($respostas) < 2)
                fail('Informe ao menos 2 opções para múltipla escolha.');
        } else {
            $resp = trim($respostas[0] ?? '');
            if ($resp === '') fail('A resposta esperada é obrigatória para texto livre.');
            $respostas = [$resp];
        }

        $q = [
            'id'        => generate_id(),
            'tipo'      => $tipo,
            'enunciado' => $enunciado,
            'respostas' => $respostas,
        ];

        save_question($q)
            ? ok($q, 201)
            : fail('Erro ao salvar no arquivo.', 500);
        break;

    // ── PUT (atualizar) ──────────────────────
    case 'PUT':
        $b         = body();
        $id        = trim($b['id']        ?? '');
        $enunciado = trim($b['enunciado'] ?? '');
        $respostas = $b['respostas']      ?? [];

        if ($id === '')        fail('O campo "id" é obrigatório.');
        if ($enunciado === '') fail('O campo "enunciado" é obrigatório.');

        $existing = get_question_by_id($id);
        if (!$existing) fail('Pergunta não encontrada.', 404);

        if ($existing['tipo'] === 'multipla') {
            $respostas = array_values(array_filter(array_map('trim', $respostas)));
            if (count($respostas) < 2)
                fail('Informe ao menos 2 opções para múltipla escolha.');
        } else {
            $resp = trim($respostas[0] ?? '');
            if ($resp === '') fail('A resposta esperada é obrigatória.');
            $respostas = [$resp];
        }

        $updated = [
            'id'        => $id,
            'tipo'      => $existing['tipo'],
            'enunciado' => $enunciado,
            'respostas' => $respostas,
        ];

        update_question($updated)
            ? ok($updated)
            : fail('Erro ao atualizar.', 500);
        break;

    // ── DELETE ───────────────────────────────
    case 'DELETE':
        $id = trim($_GET['id'] ?? body()['id'] ?? '');
        if ($id === '') fail('O parâmetro "id" é obrigatório.');

        delete_question($id)
            ? ok(['deleted' => $id])
            : fail('Pergunta não encontrada.', 404);
        break;

    default:
        fail('Método não suportado.', 405);
}
