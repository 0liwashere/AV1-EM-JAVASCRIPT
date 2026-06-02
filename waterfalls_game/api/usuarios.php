<?php
// ─────────────────────────────────────────────
//  api/usuarios.php  –  REST API para Usuários
//
//  GET  /api/usuarios.php        → lista todos
//  POST /api/usuarios.php        → cria novo
// ─────────────────────────────────────────────

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/data.php';

$method = $_SERVER['REQUEST_METHOD'];

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

switch ($method) {
    case 'GET':
        ok(get_all_users());
        break;

    case 'POST':
        $b     = json_decode(file_get_contents('php://input'), true) ?? [];
        $nome  = trim($b['nome']  ?? '');
        $email = trim($b['email'] ?? '');

        if ($nome === '')  fail('O campo "nome" é obrigatório.');
        if ($email === '') fail('O campo "email" é obrigatório.');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('E-mail inválido.');

        $existentes = get_all_users();
        foreach ($existentes as $u) {
            if (strtolower($u['email']) === strtolower($email))
                fail('Este e-mail já está cadastrado.');
        }

        save_user($nome, $email)
            ? ok(['nome' => $nome, 'email' => $email], 201)
            : fail('Erro ao salvar.', 500);
        break;

    default:
        fail('Método não suportado.', 405);
}
