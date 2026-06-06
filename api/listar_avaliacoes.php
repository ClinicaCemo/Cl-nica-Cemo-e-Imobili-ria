<?php
if (ob_get_length()) ob_clean();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

include("conexao.php");

$sql = "SELECT * FROM avaliacoes ORDER BY id DESC"; 
$resultado = $conn->query($sql);

$avaliacoes = [];

if ($resultado) {
    while ($row = $resultado->fetch_assoc()) {
        $avaliacoes[] = $row;
    }
}

echo json_encode($avaliacoes);
exit;
?>