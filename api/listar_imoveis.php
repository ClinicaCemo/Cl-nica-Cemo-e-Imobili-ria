<?php
// Limpa qualquer texto ou espaço que tenha vazado de outros arquivos anteriores
if (ob_get_length()) ob_clean();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include("conexao.php");

$sql = "SELECT * FROM imoveis ORDER BY id DESC";
$resultado = $conn->query($sql);

$imoveis = [];

if ($resultado) {
    while ($row = $resultado->fetch_assoc()) {
        $imoveis[] = $row;
    }
}

echo json_encode($imoveis);
exit;
?>