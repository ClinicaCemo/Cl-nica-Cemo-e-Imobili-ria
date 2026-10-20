<?php

header("Content-Type: application/json");

include("conexao.php");

$sql = "
SELECT
id,
nome,
email,
nota,
comentario
FROM avaliacoes
ORDER BY id DESC
";

$resultado = $conn->query($sql);

$avaliacoes = [];

while($row = $resultado->fetch_assoc()){
    $avaliacoes[] = $row;
}

echo json_encode($avaliacoes);

?>