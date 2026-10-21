<?php
declare(strict_types=1);

require_once __DIR__ . '/conexao.php';

$usuario = 'cemoadmin';
$senha = '24681022@Cemo';
$senhaHash = password_hash($senha, PASSWORD_DEFAULT);

if ($senhaHash === false) {
    exit('Erro ao proteger a senha.');
}

$stmt = $conn->prepare(
    'INSERT INTO administradores (usuario, senha_hash) VALUES (?, ?)'
);

if (!$stmt) {
    exit('Erro ao preparar o cadastro: ' . htmlspecialchars($conn->error));
}

$stmt->bind_param('ss', $usuario, $senhaHash);

if ($stmt->execute()) {
    echo 'Administrador criado com sucesso!';
} else {
    echo 'Não foi possível criar. Talvez esse usuário já exista.';
}

$stmt->close();
$conn->close();
?>