<?php

if (ob_get_length()) ob_clean();

include("conexao.php");

$titulo = $_POST['titulo'] ?? '';
$preco = $_POST['preco'] ?? '';
$endereco = $_POST['endereco'] ?? '';
$descricao = $_POST['descricao'] ?? '';

$fotoNome = "";

if (isset($_FILES['midia']) && $_FILES['midia']['error'] == 0) {

    $extensao = strtolower(
        pathinfo($_FILES['midia']['name'], PATHINFO_EXTENSION)
    );

    // Extensões permitidas
    $permitidos = [
        'jpg',
        'jpeg',
        'png',
        'webp',
        'mp4',
        'webm',
        'ogg',
        'mov'
    ];

    if (in_array($extensao, $permitidos)) {

        $fotoNome = uniqid() . "." . $extensao;

        $destino = "../uploads/" . $fotoNome;

        if (!move_uploaded_file(
            $_FILES['midia']['tmp_name'],
            $destino
        )) {

            die("Erro ao enviar arquivo para uploads.");
        }

    } else {

        die("Formato não permitido.");
    }

} else {

    die("Nenhum arquivo recebido ou erro no upload.");
}

$sql = "INSERT INTO imoveis
(
titulo,
preco,
endereco,
descricao,
foto
)
VALUES
(
'$titulo',
'$preco',
'$endereco',
'$descricao',
'$fotoNome'
)";

if ($conn->query($sql)) {

    echo "Imóvel cadastrado com sucesso";

} else {

    echo "Erro ao cadastrar: " . $conn->error;
}

exit;
?>