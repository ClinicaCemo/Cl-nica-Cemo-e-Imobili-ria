<?php
if (ob_get_length()) ob_clean();

include("conexao.php");

$titulo = $_POST['titulo'];
$preco = $_POST['preco'];
$endereco = $_POST['endereco'];
$descricao = $_POST['descricao'];

$fotoNome = "";

if (isset($_FILES['midia']) && $_FILES['midia']['error'] == 0) {

    // Pega a extensão do arquivo
    $extensao = pathinfo($_FILES['midia']['name'], PATHINFO_EXTENSION);

    // Cria um nome único
    $fotoNome = uniqid() . "." . $extensao;

    // Caminho onde vai salvar
    $destino = "../uploads/" . $fotoNome;

    // Salva o arquivo
    move_uploaded_file($_FILES['midia']['tmp_name'], $destino);
}

$sql = "INSERT INTO imoveis 
(titulo, preco, endereco, descricao, foto)
VALUES 
('$titulo', '$preco', '$endereco', '$descricao', '$fotoNome')";

if ($conn->query($sql)) {
    echo "Imóvel cadastrado com sucesso";
} else {
    echo "Erro ao cadastrar: " . $conn->error;
}

exit;
?>