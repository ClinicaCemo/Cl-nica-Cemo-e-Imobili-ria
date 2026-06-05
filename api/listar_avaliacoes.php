<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

include("conexao.php");

$sql = "SELECT * FROM avaliacoes ORDER BY id DESC";

$resultado = $conn->query($sql);

$avaliacoes = [];

while ($row = $resultado->fetch_assoc()) {

    $avaliacoes[] = $row;

}

header('Content-Type: application/json');

echo json_encode($avaliacoes);

?>