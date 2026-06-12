<?php
if (ob_get_length()) ob_clean();

// Cabeçalhos de segurança para o navegador aceitar a requisição
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include("conexao.php");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Recebe os dados do formulário do index.html
$nome = $_POST['nome'] ?? '';
$nota = $_POST['nota'] ?? '';
$comentario = $_POST['comentario'] ?? '';

// Inserir os dados na tabela 'avaliacoes' no MySQL
$sql = "INSERT INTO avaliacoes (nome, nota, comentario) VALUES ('$nome', '$nota', '$comentario')";

if ($conn->query($sql)) {
    echo "Avaliação cadastrada com sucesso";
    exit;
} else {
    echo "Erro ao cadastrar avaliação";
    exit;
}
?>
