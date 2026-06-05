<?php

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