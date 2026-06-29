<?php

header('Content-Type: application/json; charset=utf-8');

include("conexao.php");

$sql = "SELECT
            id,
            titulo,
            endereco,
            descricao,
            preco,
            foto
        FROM imoveis
        ORDER BY id DESC";

$resultado = $conn->query($sql);

$imoveis = [];

if ($resultado && $resultado->num_rows > 0) {

    while($row = $resultado->fetch_assoc()) {

        $imoveis[] = [
            "id" => $row["id"] ?? "",
            "titulo" => $row["titulo"] ?? "",
            "endereco" => $row["endereco"] ?? "",
            "descricao" => $row["descricao"] ?? "",
            "preco" => $row["preco"] ?? "",
            "foto" => $row["foto"] ?? ""
        ];
    }
}

echo json_encode($imoveis, JSON_UNESCAPED_UNICODE);