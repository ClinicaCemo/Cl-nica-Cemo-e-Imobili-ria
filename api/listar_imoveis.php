<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8"); // Essa linha avisa o JS que é uma lista vinda do banco

include("conexao.php");

$sql = "SELECT * FROM imoveis ORDER BY id DESC";
$resultado = $conn->query($sql);

$imoveis = [];

while ($row = $resultado->fetch_assoc()) {
    $imoveis[] = $row;
}

header('Content-Type: application/json');
echo json_encode($imoveis);

?>