<?php

include("conexao.php");

$titulo = $_POST['titulo'];
$preco = $_POST['preco'];
$endereco = $_POST['endereco'];
$descricao = $_POST['descricao'];

$sql = "INSERT INTO imoveis
(titulo, preco, endereco, descricao)
VALUES
('$titulo', '$preco', '$endereco', '$descricao')";

if($conn->query($sql)){
    echo "Imóvel cadastrado com sucesso";
}else{
    echo "Erro ao cadastrar";
}

?>